import Bookmark from "../models/Bookmark.js";
import { catchAsync } from "../utils/catchAsync.js";

export const toggleBookmark = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const existingBookmark = await Bookmark.findOne({ user: userId, project: projectId });

  if (existingBookmark) {
    // Remove bookmark
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    return res.json({ success: true, message: "Bookmark removed", isBookmarked: false });
  } else {
    // Add bookmark
    const bookmark = await Bookmark.create({ user: userId, project: projectId });
    return res.status(201).json({ success: true, message: "Bookmark added", bookmark, isBookmarked: true });
  }
});

export const getUserBookmarks = catchAsync(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id })
    .populate({
      path: "project",
      populate: {
        path: "student",
        select: "fullName avatar schoolName district state"
      }
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, bookmarks });
});
