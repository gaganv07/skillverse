import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { buildQuery, paginate } from "../utils/apiFeatures.js";

export const createProject = catchAsync(async (req, res) => {
  // Prevent duplicate projects with the same title from the same student
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
    student: req.user._id
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
    // Only fetch approved or featured projects for the feed by default
    filters.status = { $in: ["approved", "featured"] };
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

export const getProjectById = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $inc: { "metrics.views": 1 } },
    { new: true }
  ).populate("student", "fullName avatar schoolName district state");

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
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json({ success: true, project });
});

export const deleteProject = catchAsync(async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Project deleted" });
});

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

export const verifyProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  project.status = req.body.status || "approved";
  await project.save();

  res.json({ success: true, project });
});
