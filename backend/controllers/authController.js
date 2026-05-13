import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import TeacherProfile from "../models/TeacherProfile.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateToken } from "../utils/generateToken.js";

const respondWithAuth = (res, user) => {
  const token = generateToken(user._id || user.id);
  console.log("[AUTH] Token generated for user:", user.email, "role:", user.role);
  res.status(200).json({
    success: true,
    token,
    user
  });
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

  console.log("[AUTH] Login attempt for email:", email);

  // Validate input
  if (!email || !password) {
    console.log("[AUTH] Missing email or password");
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password"
    });
  }

  // Find user with password field included
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!user) {
    console.log("[AUTH] No user found with email:", email);
    return res.status(401).json({
      success: false,
      message: "No account found with this email address"
    });
  }

  console.log("[AUTH] User found:", user.email, "| role:", user.role, "| hasPassword:", !!user.password);

  // Verify password exists on the user document
  if (!user.password) {
    console.log("[AUTH] User has no password set");
    return res.status(401).json({
      success: false,
      message: "Account password is not configured. Please reset your password."
    });
  }

  // Compare password using bcrypt
  let isMatch = false;
  try {
    isMatch = await bcrypt.compare(password, user.password);
    console.log("[AUTH] bcrypt.compare result:", isMatch);
  } catch (bcryptError) {
    console.error("[AUTH] bcrypt comparison error:", bcryptError.message);
    return res.status(500).json({
      success: false,
      message: "Password verification failed. Please try again."
    });
  }

  if (!isMatch) {
    console.log("[AUTH] Password mismatch for user:", email);
    return res.status(401).json({
      success: false,
      message: "Incorrect password. Please try again."
    });
  }

  // Check if user account is active
  if (user.isActive === false) {
    console.log("[AUTH] Inactive account:", email);
    return res.status(403).json({
      success: false,
      message: "Your account has been deactivated. Please contact an administrator."
    });
  }

  console.log("[AUTH] Login successful for:", email, "| role:", user.role);

  respondWithAuth(res, {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified
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

// Debug endpoint — remove in production
export const debugLogin = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!user) {
    return res.json({
      success: false,
      debug: { userFound: false, email }
    });
  }

  const passwordHash = user.password;
  const isBcryptHash = passwordHash && passwordHash.startsWith("$2");

  return res.json({
    success: true,
    debug: {
      userFound: true,
      email: user.email,
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
