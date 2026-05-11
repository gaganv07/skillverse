import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getStudents = catchAsync(async (req, res) => {
  const students = await User.find({ role: "student", ...("state" in req.query ? { state: req.query.state } : {}) })
    .select("-password")
    .sort({ createdAt: -1 });
  res.json({ success: true, students });
});

export const getStudentProfile = catchAsync(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.params.userId }).populate("user");
  if (!profile) {
    return res.status(404).json({ success: false, message: "Student profile not found" });
  }

  res.json({ success: true, profile });
});

export const updateStudentProfile = catchAsync(async (req, res) => {
  const profile = await StudentProfile.findOneAndUpdate({ user: req.params.userId }, req.body, {
    new: true,
    upsert: true,
    runValidators: true
  });

  res.json({ success: true, profile });
});
