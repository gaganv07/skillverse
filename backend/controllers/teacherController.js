import TeacherProfile from "../models/TeacherProfile.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getTeachers = catchAsync(async (_req, res) => {
  const teachers = await User.find({ role: "teacher" }).select("-password");
  res.json({ success: true, teachers });
});

export const getTeacherProfile = catchAsync(async (req, res) => {
  const profile = await TeacherProfile.findOne({ user: req.params.userId }).populate("user");
  res.json({ success: true, profile });
});

export const updateTeacherProfile = catchAsync(async (req, res) => {
  const profile = await TeacherProfile.findOneAndUpdate({ user: req.params.userId }, req.body, {
    new: true,
    upsert: true,
    runValidators: true
  });
  res.json({ success: true, profile });
});

export const verifyStudent = catchAsync(async (req, res) => {
  const student = await User.findByIdAndUpdate(
    req.params.studentId,
    { isVerified: true },
    { new: true }
  ).select("-password");

  res.json({ success: true, student });
});
