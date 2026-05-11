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
  const projects = await Project.find(filters)
    .populate("student", "fullName avatar schoolName district state")
    .sort(req.query.sort ? { [req.query.sort]: -1 } : { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ success: true, page, projects });
});

export const getProjectById = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "student",
    "fullName avatar schoolName district state"
  );
  const comments = await Comment.find({ targetType: "project", targetId: req.params.id }).populate(
    "author",
    "fullName avatar role"
  );

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
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $inc: { "metrics.likes": 1 } },
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
