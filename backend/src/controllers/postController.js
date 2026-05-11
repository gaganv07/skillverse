import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createPost = catchAsync(async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, post });
});

export const getFeed = catchAsync(async (_req, res) => {
  const posts = await Post.find()
    .populate("author", "fullName avatar role schoolName")
    .sort({ createdAt: -1 })
    .limit(30);

  res.json({ success: true, posts });
});

export const likePost = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { "metrics.likes": 1 } },
    { new: true }
  );
  res.json({ success: true, post });
});

export const commentPost = catchAsync(async (req, res) => {
  const comment = await Comment.create({
    author: req.user._id,
    targetType: "post",
    targetId: req.params.id,
    content: req.body.content
  });

  await Post.findByIdAndUpdate(req.params.id, { $inc: { "metrics.comments": 1 } });
  res.status(201).json({ success: true, comment });
});
