import User from "../models/User.js";
import Project from "../models/Project.js";
import Talent from "../models/Talent.js";
import Competition from "../models/Competition.js";
import Notification from "../models/Notification.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getDashboardStats = catchAsync(async (_req, res) => {
  const [users, projects, talents, competitions] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Talent.countDocuments(),
    Competition.countDocuments()
  ]);

  res.json({
    success: true,
    stats: { users, projects, talents, competitions }
  });
});

export const featureProject = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status: "featured" },
    { new: true }
  );
  res.json({ success: true, project });
});

export const removeTalent = catchAsync(async (req, res) => {
  await Talent.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Talent removed" });
});

export const sendAnnouncement = catchAsync(async (req, res) => {
  const students = await User.find({ role: "student" }).select("_id");
  const payload = students.map((student) => ({
    recipient: student._id,
    type: "system",
    title: req.body.title,
    message: req.body.message,
    actionUrl: req.body.actionUrl
  }));

  await Notification.insertMany(payload);
  res.json({ success: true, count: payload.length });
});
