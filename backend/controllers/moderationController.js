import Project from "../models/Project.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import ActivityLog from "../models/ActivityLog.js";
import { catchAsync } from "../utils/catchAsync.js";

const logAction = async (adminId, action, targetModel, targetId, details) => {
  await ActivityLog.create({ admin: adminId, action, targetModel, targetId, details });
};

export const moderateProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., "approved", "rejected", "disabled"

  const project = await Project.findByIdAndUpdate(id, { status }, { new: true });
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  await logAction(req.user._id, `moderate_project_${status}`, "Project", id, `Status changed to ${status}`);
  res.json({ success: true, project });
});

export const moderateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  await logAction(req.user._id, `moderate_user_${isActive ? "activate" : "disable"}`, "User", id, `IsActive changed to ${isActive}`);
  res.json({ success: true, user });
});

export const getReports = catchAsync(async (req, res) => {
  const reports = await Report.find().populate("reportedBy", "fullName email").sort({ createdAt: -1 });
  res.json({ success: true, reports });
});

export const resolveReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const report = await Report.findByIdAndUpdate(
    id, 
    { status, adminNotes, resolvedBy: req.user._id }, 
    { new: true }
  );
  
  if (!report) return res.status(404).json({ success: false, message: "Report not found" });

  await logAction(req.user._id, `resolve_report_${status}`, "Report", id, adminNotes);
  res.json({ success: true, report });
});
