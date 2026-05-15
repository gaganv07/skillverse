import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { buildQuery, paginate } from "../utils/apiFeatures.js";
import { createNotification } from "./notificationController.js";

export const createProject = catchAsync(async (req, res) => {
  const existingProject = await Project.findOne({
    student: req.user._id,
    title: req.body.title
  });

  if (existingProject) {
    return res.status(400).json({
      success: false,
      message: "You have already uploaded a project with this title"
    });
  }

  const project = await Project.create({
    ...req.body,
    student: req.user._id,
    status: "pending" // Always start as pending
  });

  await User.findByIdAndUpdate(req.user._id, {
    $inc: { "stats.projectsCount": 1 }
  });

  res.status(201).json({ success: true, project });
});

export const getProjects = catchAsync(async (req, res) => {
  const filters = buildQuery(req.query, ["title", "description", "schoolName", "category"]);
  const { limit, skip, page } = paginate(req.query);

  if (req.query.status) {
    filters.status = req.query.status;
  } else {
    // Public feed: only approved or featured
    filters.status = { $in: ["approved", "featured"] };
  }

  // Filter by student ID if provided
  if (req.query.student) {
    filters.student = req.query.student;
  }

  let sortObj = { createdAt: -1 };
  if (req.query.tab === "trending") {
    sortObj = { "metrics.views": -1, "metrics.likes": -1 };
  } else if (req.query.tab === "featured") {
    filters.status = "featured";
  } else if (req.query.sort) {
    sortObj = { [req.query.sort]: -1 };
  }

  const projects = await Project.find(filters)
    .populate("student", "fullName avatar schoolName district state")
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  res.json({ success: true, page, projects });
});

// Get all projects for a student (including pending/rejected) — used on MyProjectsPage
export const getMyProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ student: req.user._id })
    .populate("reviewedBy", "fullName role")
    .sort({ createdAt: -1 });

  res.json({ success: true, projects });
});

export const getProjectById = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $inc: { "metrics.views": 1 } },
    { new: true }
  )
    .populate("student", "fullName avatar schoolName district state")
    .populate("reviewedBy", "fullName role");

  const comments = await Comment.find({ targetType: "project", targetId: req.params.id }).populate(
    "author",
    "fullName avatar role"
  ).sort({ createdAt: -1 });

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  res.json({ success: true, project, comments });
});

export const updateProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  // If student is resubmitting a rejected/revision project, reset to pending
  if (
    req.user.role === "student" &&
    String(project.student) === String(req.user._id) &&
    ["rejected", "revision"].includes(project.status)
  ) {
    req.body.status = "pending";
    req.body.reviewComment = "";
    req.body.reviewedBy = null;
    req.body.reviewedAt = null;
  }

  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json({ success: true, project: updated });
});

export const deleteProject = catchAsync(async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Project deleted" });
});

// ────────────────────────────────────────────────────
// Project Review / Approval Workflow
// ────────────────────────────────────────────────────

export const reviewProject = catchAsync(async (req, res) => {
  const { status, reviewComment } = req.body;
  const validStatuses = ["approved", "rejected", "featured", "revision"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Valid status required: approved, rejected, featured, or revision"
    });
  }

  const project = await Project.findById(req.params.id).populate("student", "fullName email");
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  project.status = status;
  project.reviewComment = reviewComment || "";
  project.reviewedBy = req.user._id;
  project.reviewedAt = new Date();
  if (status === "approved" || status === "featured") {
    project.isVerified = true;
  }
  await project.save();

  // Send notification to the student
  const notifMap = {
    approved: { type: "project_approved", title: "Project Approved!", message: `Your project "${project.title}" has been approved and is now visible publicly.` },
    rejected: { type: "project_rejected", title: "Project Needs Changes", message: `Your project "${project.title}" was not approved. ${reviewComment ? `Feedback: ${reviewComment}` : "Please review and resubmit."}` },
    featured: { type: "project_featured", title: "Project Featured! ⭐", message: `Congratulations! Your project "${project.title}" has been featured on SkillVerse.` },
    revision: { type: "project_revision", title: "Revision Requested", message: `Your project "${project.title}" needs revisions. ${reviewComment ? `Feedback: ${reviewComment}` : "Please update and resubmit."}` }
  };

  const notif = notifMap[status];
  await createNotification({
    recipient: project.student._id || project.student,
    sender: req.user._id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    actionUrl: `/projects/${project._id}`,
    relatedProject: project._id
  });

  const updated = await Project.findById(project._id)
    .populate("student", "fullName avatar schoolName district state")
    .populate("reviewedBy", "fullName role");

  res.json({ success: true, message: `Project ${status} successfully`, project: updated });
});

// Get pending projects for teacher/admin review
export const getPendingProjects = catchAsync(async (req, res) => {
  const { school } = req.query;
  const filters = { status: "pending" };

  // Teachers see projects from their school; admins see all
  if (req.user.role === "teacher" && school) {
    filters.$or = [
      { schoolName: school },
      { "student.schoolName": school }
    ];
  }

  const projects = await Project.find(filters)
    .populate("student", "fullName avatar schoolName district state")
    .sort({ createdAt: -1 });

  res.json({ success: true, projects });
});

// ────────────────────────────────────────────────────
// Engagement endpoints (unchanged)
// ────────────────────────────────────────────────────

export const likeProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const isLiked = project.likedBy && project.likedBy.includes(req.user._id);

  let updatedProject;
  if (isLiked) {
    updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likedBy: req.user._id },
        $inc: { "metrics.likes": -1 }
      },
      { new: true }
    );
  } else {
    updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likedBy: req.user._id },
        $inc: { "metrics.likes": 1 }
      },
      { new: true }
    );
  }

  res.json({ success: true, project: updatedProject });
});

export const shareProject = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $inc: { "metrics.shares": 1 } },
    { new: true }
  );
  res.json({ success: true, project });
});

export const commentProject = catchAsync(async (req, res) => {
  const comment = await Comment.create({
    author: req.user._id,
    targetType: "project",
    targetId: req.params.id,
    content: req.body.content
  });
  await Project.findByIdAndUpdate(req.params.id, { $inc: { "metrics.comments": 1 } });
  res.status(201).json({ success: true, comment });
});
