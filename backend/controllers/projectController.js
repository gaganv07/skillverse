import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import ModerationAction from "../models/ModerationAction.js";
import ActivityLog from "../models/ActivityLog.js";
import { catchAsync } from "../utils/catchAsync.js";
import { paginate } from "../utils/apiFeatures.js";
import { createNotification } from "./notificationController.js";

const PROJECT_PUBLIC_STATUSES = ["approved", "featured"];
const REVIEWABLE_STATUSES = ["approved", "rejected", "featured", "revision", "disabled"];
const STUDENT_EDITABLE_STATUSES = ["pending", "approved", "featured", "rejected", "revision"];
const PROJECT_EDIT_FIELDS = [
  "title",
  "description",
  "category",
  "media",
  "tags",
  "skillsUsed",
  "teamMembers",
  "githubLink",
  "demoLink",
  "schoolName",
  "district",
  "state"
];

const statusNotificationMap = {
  approved: {
    type: "project_approved",
    title: "Project approved",
    category: "workflow",
    actionLabel: "View project"
  },
  rejected: {
    type: "project_rejected",
    title: "Project rejected",
    category: "workflow",
    actionLabel: "Review feedback"
  },
  featured: {
    type: "project_featured",
    title: "Project featured",
    category: "workflow",
    actionLabel: "View featured project"
  },
  revision: {
    type: "project_revision",
    title: "Revision requested",
    category: "feedback",
    actionLabel: "Update project"
  },
  disabled: {
    type: "admin_announcement",
    title: "Project removed from public view",
    category: "announcement",
    actionLabel: "Review moderation details"
  }
};

const populateProjectWorkflow = (query) =>
  query
    .populate("student", "fullName avatar schoolName district state")
    .populate("reviewedBy", "fullName role")
    .populate("featuredBy", "fullName role")
    .populate("reviewComments.author", "fullName role")
    .populate({
      path: "moderationHistory",
      populate: { path: "actor", select: "fullName role" },
      options: { sort: { createdAt: -1 } }
    });

const isOwner = (userId, project) => String(project.student?._id || project.student) === String(userId);
const isModerator = (user) => ["teacher", "admin"].includes(user?.role);
const isAdmin = (user) => user?.role === "admin";
const isTeacher = (user) => user?.role === "teacher";

const canTeacherModerateProject = (user, project) => {
  if (!isTeacher(user)) return false;
  if (!user.schoolName) return false;
  return (project.schoolName || project.student?.schoolName) === user.schoolName;
};

const canViewProject = (user, project) => {
  if (PROJECT_PUBLIC_STATUSES.includes(project.status)) return true;
  if (!user) return false;
  if (isOwner(user._id, project)) return true;
  if (isAdmin(user)) return true;
  if (canTeacherModerateProject(user, project)) return true;
  return false;
};

const buildProjectFilters = (query, user) => {
  const filters = {};
  const search = query.title || query.q;

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filters.$or = [{ title: regex }, { description: regex }, { schoolName: regex }];
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.student) {
    filters.student = query.student;
  }

  if (query.status) {
    filters.status = query.status;
  } else if (query.tab === "featured") {
    filters.status = "featured";
  } else if (!isModerator(user) || query.publicOnly === "true") {
    filters.status = { $in: PROJECT_PUBLIC_STATUSES };
  }

  if (query.visibility) {
    filters.visibility = query.visibility;
  } else if (filters.status?.$in || filters.status === "approved" || filters.status === "featured") {
    filters.visibility = "public";
  }

  return filters;
};

const createModerationAction = async ({
  project,
  actor,
  action,
  fromStatus = null,
  toStatus,
  comment = "",
  isOverride = false,
  metadata = {}
}) => {
  const moderationAction = await ModerationAction.create({
    project: project._id,
    student: project.student?._id || project.student,
    actor: actor._id,
    actorRole: actor.role,
    action,
    fromStatus,
    toStatus,
    comment,
    isOverride,
    metadata
  });

  project.moderationHistory.push(moderationAction._id);
  project.reviewComments.push({
    author: actor._id,
    authorRole: actor.role,
    action,
    comment
  });

  return moderationAction;
};

const createWorkflowNotification = async ({ project, actor, status, comment = "" }) => {
  const config = statusNotificationMap[status];
  if (!config) return;

  const messageMap = {
    approved: `Your project "${project.title}" has been approved and is now visible publicly.`,
    rejected: comment
      ? `Your project "${project.title}" was rejected. Feedback: ${comment}`
      : `Your project "${project.title}" was rejected. Please review the feedback and try again.`,
    featured: `Your project "${project.title}" has been featured on SkillVerse.`,
    revision: comment
      ? `Your project "${project.title}" needs revisions. Feedback: ${comment}`
      : `Your project "${project.title}" needs revisions before approval.`,
    disabled: comment
      ? `Your project "${project.title}" was removed from public view. Reason: ${comment}`
      : `Your project "${project.title}" was removed from public view by an administrator.`
  };

  await createNotification({
    recipient: project.student?._id || project.student,
    sender: actor._id,
    type: config.type,
    title: config.title,
    message: messageMap[status] || "",
    actionUrl: `/projects/${project._id}`,
    actionLabel: config.actionLabel,
    relatedProject: project._id,
    category: config.category,
    metadata: {
      status,
      comment
    }
  });
};

const sanitizeProjectUpdate = (payload) => {
  const allowed = {};
  for (const field of PROJECT_EDIT_FIELDS) {
    if (payload[field] !== undefined) {
      allowed[field] = payload[field];
    }
  }
  return allowed;
};

const shouldResubmitForReview = (project, updates, user) => {
  if (!isOwner(user._id, project) || user.role !== "student") return false;
  return Object.keys(updates).some((field) => PROJECT_EDIT_FIELDS.includes(field));
};

export const createProject = catchAsync(async (req, res) => {
  const existingProject = await Project.findOne({
    student: req.user._id,
    title: req.body.title?.trim()
  });

  if (existingProject) {
    return res.status(400).json({
      success: false,
      message: "You have already uploaded a project with this title"
    });
  }

  const userRecord = await User.findById(req.user._id).select("schoolName district state role");

  const project = await Project.create({
    ...sanitizeProjectUpdate(req.body),
    student: req.user._id,
    schoolName: req.body.schoolName || userRecord?.schoolName || "",
    district: req.body.district || userRecord?.district || "",
    state: req.body.state || userRecord?.state || "",
    status: "pending",
    visibility: "private",
    submittedAt: new Date(),
    statusChangedAt: new Date(),
    reviewComments: [
      {
        author: req.user._id,
        authorRole: req.user.role,
        action: "submitted",
        comment: "Project submitted for review."
      }
    ]
  });

  const moderationAction = await ModerationAction.create({
    project: project._id,
    student: req.user._id,
    actor: req.user._id,
    actorRole: req.user.role,
    action: "submitted",
    fromStatus: null,
    toStatus: "pending",
    comment: "Project submitted for review."
  });

  project.moderationHistory = [moderationAction._id];
  await project.save();

  await User.findByIdAndUpdate(req.user._id, {
    $inc: { "stats.projectsCount": 1 }
  });

  const hydratedProject = await populateProjectWorkflow(Project.findById(project._id));

  res.status(201).json({ success: true, project: hydratedProject });
});

export const getProjects = catchAsync(async (req, res) => {
  const filters = buildProjectFilters(req.query, req.user);
  const { limit, skip, page } = paginate(req.query);

  let sortObj = { createdAt: -1 };
  if (req.query.tab === "trending") {
    sortObj = { "metrics.views": -1, "metrics.likes": -1, createdAt: -1 };
  } else if (req.query.tab === "featured") {
    sortObj = { featuredAt: -1, createdAt: -1 };
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

export const getMyProjects = catchAsync(async (req, res) => {
  const projects = await populateProjectWorkflow(
    Project.find({ student: req.user._id }).sort({ updatedAt: -1 })
  );

  res.json({ success: true, projects });
});

export const getProjectById = catchAsync(async (req, res) => {
  const project = await populateProjectWorkflow(Project.findById(req.params.id));

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  if (!canViewProject(req.user, project)) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  await Project.findByIdAndUpdate(project._id, { $inc: { "metrics.views": 1 } });
  project.metrics.views += 1;

  const comments = await Comment.find({ targetType: "project", targetId: req.params.id })
    .populate("author", "fullName avatar role")
    .sort({ createdAt: -1 });

  res.json({ success: true, project, comments });
});

export const updateProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const owner = isOwner(req.user._id, project);
  if (!owner && !isAdmin(req.user)) {
    return res.status(403).json({ success: false, message: "You can only edit your own projects" });
  }

  if (owner && req.user.role === "student" && !STUDENT_EDITABLE_STATUSES.includes(project.status)) {
    return res.status(403).json({ success: false, message: "This project cannot be edited in its current state" });
  }

  const updates = sanitizeProjectUpdate(req.body);

  if (shouldResubmitForReview(project, updates, req.user)) {
    const previousStatus = project.status;
    project.status = "pending";
    project.visibility = "private";
    project.reviewComment = "";
    project.reviewedBy = undefined;
    project.reviewedAt = undefined;
    project.statusChangedAt = new Date();
    project.lastResubmittedAt = new Date();
    project.isVerified = false;

    await createModerationAction({
      project,
      actor: req.user,
      action: "resubmitted",
      fromStatus: previousStatus,
      toStatus: "pending",
      comment: "Project updated and resubmitted for review."
    });
  }

  Object.assign(project, updates);
  await project.save();

  const updated = await populateProjectWorkflow(Project.findById(project._id));
  res.json({
    success: true,
    message: owner && req.user.role === "student" ? "Project updated and submitted for review" : "Project updated successfully",
    project: updated
  });
});

export const deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  if (!isOwner(req.user._id, project) && !isAdmin(req.user)) {
    return res.status(403).json({ success: false, message: "You can only delete your own projects" });
  }

  await ModerationAction.deleteMany({ project: project._id });
  await Project.findByIdAndDelete(project._id);

  await User.findByIdAndUpdate(project.student, {
    $inc: { "stats.projectsCount": -1 }
  });

  res.json({ success: true, message: "Project deleted" });
});

const moderateProjectWorkflow = async ({ req, res, status, action, requireComment = false, allowTeacher = true }) => {
  if (!REVIEWABLE_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid moderation status" });
  }

  const comment = req.body.reviewComment?.trim() || req.body.comment?.trim() || "";
  if (requireComment && !comment) {
    return res.status(400).json({ success: false, message: "Review feedback is required for this action" });
  }

  const project = await Project.findById(req.params.id).populate("student", "fullName email schoolName");
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  if (isTeacher(req.user)) {
    if (!allowTeacher) {
      return res.status(403).json({ success: false, message: "Only admins can perform this action" });
    }
    if (!canTeacherModerateProject(req.user, project)) {
      return res.status(403).json({ success: false, message: "You can only moderate projects from your school" });
    }
  }

  const previousStatus = project.status;
  project.status = status;
  project.visibility = PROJECT_PUBLIC_STATUSES.includes(status) ? "public" : "private";
  project.reviewComment = comment;
  project.reviewedBy = req.user._id;
  project.reviewedAt = new Date();
  project.statusChangedAt = new Date();
  project.isVerified = PROJECT_PUBLIC_STATUSES.includes(status);
  if (status === "featured") {
    project.featuredAt = new Date();
    project.featuredBy = req.user._id;
  }

  await createModerationAction({
    project,
    actor: req.user,
    action,
    fromStatus: previousStatus,
    toStatus: status,
    comment,
    isOverride: isAdmin(req.user) && previousStatus !== "pending",
    metadata: {
      moderatedBy: req.user.email
    }
  });

  await project.save();

  await ActivityLog.create({
    admin: req.user._id,
    action: `project_${action}`,
    targetModel: "Project",
    targetId: project._id,
    details: `${req.user.role} changed ${project.title} from ${previousStatus || "unknown"} to ${status}`
  });

  await createWorkflowNotification({
    project,
    actor: req.user,
    status,
    comment
  });

  const updated = await populateProjectWorkflow(Project.findById(project._id));
  return res.json({
    success: true,
    message: `Project ${status} successfully`,
    project: updated
  });
};

export const reviewProject = catchAsync(async (req, res) => {
  const { status } = req.body;
  const actionMap = {
    approved: "approved",
    rejected: "rejected",
    featured: "featured",
    revision: "revision_requested",
    disabled: "removed"
  };

  if (!actionMap[status]) {
    return res.status(400).json({
      success: false,
      message: "Valid status required: approved, rejected, revision, featured, or disabled"
    });
  }

  const requireComment = ["rejected", "revision", "disabled"].includes(status);
  const allowTeacher = !["featured", "disabled"].includes(status);

  return moderateProjectWorkflow({
    req,
    res,
    status,
    action: actionMap[status],
    requireComment,
    allowTeacher
  });
});

export const approveProject = catchAsync(async (req, res) =>
  moderateProjectWorkflow({ req, res, status: "approved", action: "approved" }));

export const rejectProject = catchAsync(async (req, res) =>
  moderateProjectWorkflow({ req, res, status: "rejected", action: "rejected", requireComment: true }));

export const requestProjectRevision = catchAsync(async (req, res) =>
  moderateProjectWorkflow({ req, res, status: "revision", action: "revision_requested", requireComment: true }));

export const featureProject = catchAsync(async (req, res) =>
  moderateProjectWorkflow({ req, res, status: "featured", action: "featured", allowTeacher: false }));

export const disableProject = catchAsync(async (req, res) =>
  moderateProjectWorkflow({ req, res, status: "disabled", action: "removed", requireComment: true, allowTeacher: false }));

export const getPendingProjects = catchAsync(async (req, res) => {
  const filters = { status: "pending" };

  if (isTeacher(req.user)) {
    filters.schoolName = req.user.schoolName;
  }

  const projects = await populateProjectWorkflow(
    Project.find(filters).sort({ submittedAt: 1, createdAt: 1 })
  );

  res.json({ success: true, projects });
});

export const getModerationHistory = catchAsync(async (req, res) => {
  const { student, projectId, action, page = 1, limit = 30 } = req.query;
  const filters = {};

  if (student) filters.student = student;
  if (projectId) filters.project = projectId;
  if (action) filters.action = action;

  if (isTeacher(req.user)) {
    const schoolProjects = await Project.find({ schoolName: req.user.schoolName }).select("_id");
    const schoolProjectIds = schoolProjects.map((project) => String(project._id));
    if (projectId && !schoolProjectIds.includes(String(projectId))) {
      return res.status(403).json({ success: false, message: "You can only view moderation history for your school" });
    }
    filters.project = filters.project || { $in: schoolProjectIds };
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [actions, total] = await Promise.all([
    ModerationAction.find(filters)
      .populate("project", "title status schoolName")
      .populate("student", "fullName schoolName")
      .populate("actor", "fullName role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),
    ModerationAction.countDocuments(filters)
  ]);

  res.json({
    success: true,
    actions,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10))
    }
  });
});

export const likeProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  if (!PROJECT_PUBLIC_STATUSES.includes(project.status) && !isOwner(req.user._id, project) && !isModerator(req.user)) {
    return res.status(403).json({ success: false, message: "You cannot interact with this project yet" });
  }

  const isLiked = project.likedBy?.some((id) => String(id) === String(req.user._id));

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    isLiked
      ? {
          $pull: { likedBy: req.user._id },
          $inc: { "metrics.likes": -1 }
        }
      : {
          $addToSet: { likedBy: req.user._id },
          $inc: { "metrics.likes": 1 }
        },
    { new: true }
  );

  res.json({ success: true, project: updatedProject });
});

export const shareProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  if (!PROJECT_PUBLIC_STATUSES.includes(project.status) && !req.user) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    { $inc: { "metrics.shares": 1 } },
    { new: true }
  );
  res.json({ success: true, project: updatedProject });
});

export const commentProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  if (!PROJECT_PUBLIC_STATUSES.includes(project.status) && !canViewProject(req.user, project)) {
    return res.status(403).json({ success: false, message: "You cannot comment on this project" });
  }

  const comment = await Comment.create({
    author: req.user._id,
    targetType: "project",
    targetId: req.params.id,
    content: req.body.content
  });
  await Project.findByIdAndUpdate(req.params.id, { $inc: { "metrics.comments": 1 } });
  res.status(201).json({ success: true, comment });
});
