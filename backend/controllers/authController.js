import crypto from "crypto";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import TeacherProfile from "../models/TeacherProfile.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateToken } from "../utils/generateToken.js";

const respondWithAuth = (res, user) => {
  const token = generateToken(user._id);
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
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

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
    return res.status(404).json({ success: false, message: "User not found" });
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
