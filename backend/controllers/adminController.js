import User from "../models/User.js";
import Project from "../models/Project.js";
import Talent from "../models/Talent.js";
import Competition from "../models/Competition.js";
import { catchAsync } from "../utils/catchAsync.js";
import { createBulkNotifications, createNotification } from "./notificationController.js";

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
    {
      status: "featured",
      visibility: "public",
      featuredAt: new Date(),
      featuredBy: req.user._id,
      statusChangedAt: new Date(),
      isVerified: true
    },
    { new: true }
  );
  if (project) {
    await createNotification({
      recipient: project.student,
      sender: req.user._id,
      type: "project_featured",
      category: "workflow",
      title: "Project featured",
      message: `Your project "${project.title}" has been featured on SkillVerse.`,
      actionUrl: `/projects/${project._id}`,
      actionLabel: "View featured project",
      relatedProject: project._id
    });
  }
  res.json({ success: true, project });
});

export const removeTalent = catchAsync(async (req, res) => {
  await Talent.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Talent removed" });
});

export const sendAnnouncement = catchAsync(async (req, res) => {
  const { title, message, actionUrl, roles = ["student", "teacher", "admin"], type = "admin_announcement" } = req.body;
  const recipients = await User.find({ role: { $in: roles }, isActive: true }).select("_id");
  const payload = recipients.map((user) => ({
    recipient: user._id,
    sender: req.user._id,
    type,
    category: type === "competition_announcement" ? "competition" : "announcement",
    title,
    message,
    actionUrl,
    actionLabel: "Open announcement",
    entityType: "announcement"
  }));

  await createBulkNotifications(payload);
  res.json({ success: true, count: payload.length });
});
