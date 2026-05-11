import User from "../models/User.js";
import Follower from "../models/Follower.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getUsers = catchAsync(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, users });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, user });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select("-password");

  res.json({ success: true, user });
});

export const toggleBookmark = catchAsync(async (req, res) => {
  const { itemType, itemId } = req.body;
  const user = await User.findById(req.user._id);
  const index = user.bookmarks.findIndex(
    (bookmark) => bookmark.itemType === itemType && String(bookmark.itemId) === itemId
  );

  if (index >= 0) {
    user.bookmarks.splice(index, 1);
  } else {
    user.bookmarks.push({ itemType, itemId });
  }

  await user.save();
  res.json({ success: true, bookmarks: user.bookmarks });
});

export const toggleFollow = catchAsync(async (req, res) => {
  const targetId = req.params.id;
  const existing = await Follower.findOne({
    follower: req.user._id,
    following: targetId
  });

  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, following: false });
  }

  await Follower.create({ follower: req.user._id, following: targetId });
  res.json({ success: true, following: true });
});
