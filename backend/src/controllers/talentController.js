import Talent from "../models/Talent.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { buildQuery, paginate } from "../utils/apiFeatures.js";

export const createTalent = catchAsync(async (req, res) => {
  const talent = await Talent.create({
    ...req.body,
    student: req.user._id
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { "stats.talentsCount": 1 } });
  res.status(201).json({ success: true, talent });
});

export const getTalents = catchAsync(async (req, res) => {
  const filters = buildQuery(req.query, ["title", "description", "category"]);
  const { limit, skip } = paginate(req.query);
  const talents = await Talent.find(filters)
    .populate("student", "fullName avatar schoolName district state")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ success: true, talents });
});

export const likeTalent = catchAsync(async (req, res) => {
  const talent = await Talent.findByIdAndUpdate(
    req.params.id,
    { $inc: { "metrics.likes": 1 } },
    { new: true }
  );
  res.json({ success: true, talent });
});

export const commentTalent = catchAsync(async (req, res) => {
  const comment = await Comment.create({
    author: req.user._id,
    targetType: "talent",
    targetId: req.params.id,
    content: req.body.content
  });
  await Talent.findByIdAndUpdate(req.params.id, { $inc: { "metrics.comments": 1 } });
  res.status(201).json({ success: true, comment });
});
