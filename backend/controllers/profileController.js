import StudentProfile from "../models/StudentProfile.js";
import School from "../models/School.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getStudentProfile = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password -resetPasswordToken -resetPasswordExpires");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const profile = await StudentProfile.findOne({ user: id });
  
  // Fetch projects uploaded by this student
  const projects = await Project.find({ student: id, status: { $in: ["approved", "featured"] } })
    .sort({ createdAt: -1 });

  res.json({ success: true, user, profile, projects });
});

export const updateStudentProfile = catchAsync(async (req, res) => {
  const userId = req.user._id;

  let profile = await StudentProfile.findOne({ user: userId });
  if (profile) {
    profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      req.body,
      { new: true, runValidators: true }
    );
  } else {
    profile = await StudentProfile.create({ ...req.body, user: userId });
  }

  res.json({ success: true, profile });
});

export const getSchoolProfile = catchAsync(async (req, res) => {
  const { id } = req.params;

  const school = await School.findById(id);
  if (!school) {
    return res.status(404).json({ success: false, message: "School not found" });
  }

  // Fetch projects from this school (using schoolName for simplicity as per existing logic, or ideally a school reference)
  // Current logic uses `schoolName` string in `Project` and `School` models.
  const projects = await Project.find({ schoolName: school.name, status: { $in: ["approved", "featured"] } })
    .populate("student", "fullName avatar")
    .sort({ createdAt: -1 });

  res.json({ success: true, school, projects });
});
