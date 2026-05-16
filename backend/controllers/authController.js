import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import TeacherProfile from "../models/TeacherProfile.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateToken } from "../utils/generateToken.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const respondWithAuth = (res, user) => {
  try {
    const token = generateToken(user._id || user.id);
    console.log("[AUTH] JWT generation succeeded for:", user.email, "| role:", user.role);
    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error("[AUTH] JWT generation failed for:", user.email, "| error:", error.message);
    res.status(500).json({
      success: false,
      errorCode: "JWT_GENERATION_FAILED",
      message: "Authentication failed"
    });
  }
};

export const register = catchAsync(async (req, res) => {
  const { fullName, email, password, role = "student", schoolName, district, state } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");
  const user = await User.create({
    fullName,
    email,
    password,
    role,
    schoolName,
    district,
    state,
    verificationToken
  });

  if (role === "student") {
    await StudentProfile.create({ user: user._id });
  }

  if (role === "teacher") {
    await TeacherProfile.create({ user: user._id });
  }

  res.status(201).json({
    success: true,
    message: "User account created successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  console.log("[AUTH] Login attempt received | email:", email, "| normalized:", normalizedEmail);

  if (!email || !password) {
    console.log("[AUTH] Missing email or password");
    return res.status(400).json({
      success: false,
      errorCode: "MISSING_CREDENTIALS",
      message: "Please provide both email and password"
    });
  }

  const user = await User.findOne({
    email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i")
  }).select("+password");

  if (!user) {
    console.log("[AUTH] User lookup result: NOT_FOUND | normalized email:", normalizedEmail);
    return res.status(401).json({
      success: false,
      errorCode: "USER_NOT_FOUND",
      message: "User not found"
    });
  }

  console.log("[AUTH] User lookup result: FOUND | email:", user.email, "| role:", user.role, "| hasPassword:", !!user.password);

  if (!user.password) {
    console.log("[AUTH] User has no password set | email:", user.email);
    return res.status(401).json({
      success: false,
      errorCode: "PASSWORD_NOT_CONFIGURED",
      message: "Authentication failed"
    });
  }

  const passwordLooksHashed = user.password.startsWith("$2");
  console.log("[AUTH] Password hash format valid:", passwordLooksHashed, "| email:", user.email);

  let isMatch = false;
  try {
    isMatch = await bcrypt.compare(password, user.password);
    console.log("[AUTH] bcrypt.compare result:", isMatch, "| email:", user.email);
  } catch (bcryptError) {
    console.error("[AUTH] bcrypt comparison error | email:", user.email, "| error:", bcryptError.message);
    return res.status(500).json({
      success: false,
      errorCode: "BCRYPT_COMPARE_FAILED",
      message: "Server error"
    });
  }

  if (!isMatch) {
    console.log("[AUTH] Password mismatch | email:", user.email, "| hashFormatValid:", passwordLooksHashed);
    return res.status(401).json({
      success: false,
      errorCode: passwordLooksHashed ? "INVALID_PASSWORD" : "INVALID_PASSWORD_HASH",
      message: passwordLooksHashed ? "Invalid password" : "Authentication failed"
    });
  }

  if (user.isActive === false) {
    console.log("[AUTH] Inactive account:", user.email);
    return res.status(403).json({
      success: false,
      errorCode: "ACCOUNT_INACTIVE",
      message: "Your account has been deactivated. Please contact an administrator."
    });
  }

  console.log("[AUTH] Login successful | email:", user.email, "| role:", user.role);

  respondWithAuth(res, {
    _id: user._id || user.id,
    id: user._id || user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    schoolName: user.schoolName,
    district: user.district,
    state: user.state
  });
});

export const me = catchAsync(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ success: false, message: "No account found with this email address" });
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  res.json({
    success: true,
    message: "Password reset token generated",
    resetToken: user.resetPasswordToken
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  }).select("+password");

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });
  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid verification token" });
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ success: true, message: "Email verified successfully" });
});

// Debug endpoint - remove in production
export const debugLogin = catchAsync(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!email) {
    return res.status(400).json({ success: false, errorCode: "EMAIL_REQUIRED", message: "Email required" });
  }

  const user = await User.findOne({
    email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i")
  }).select("+password");

  if (!user) {
    return res.json({
      success: false,
      debug: { userFound: false, email, normalizedEmail }
    });
  }

  const passwordHash = user.password;
  const isBcryptHash = passwordHash && passwordHash.startsWith("$2");

  return res.json({
    success: true,
    debug: {
      userFound: true,
      email: user.email,
      normalizedEmail,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      hasPassword: !!passwordHash,
      passwordIsBcryptHash: isBcryptHash,
      passwordHashPrefix: passwordHash ? passwordHash.substring(0, 7) : null,
      createdAt: user.createdAt
    }
  });
});
