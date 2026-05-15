import Notification from "../models/Notification.js";
import { catchAsync } from "../utils/catchAsync.js";

// Get all notifications for the logged-in user (paginated)
export const getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipient: req.user._id })
      .populate("sender", "fullName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Notification.countDocuments({ recipient: req.user._id }),
    Notification.countDocuments({ recipient: req.user._id, read: false })
  ]);

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) }
  });
});

// Get unread count only (lightweight for navbar polling)
export const getUnreadCount = catchAsync(async (req, res) => {
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
  res.json({ success: true, unreadCount });
});

// Mark a single notification as read
export const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }
  res.json({ success: true, notification });
});

// Mark all notifications as read
export const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );
  res.json({ success: true, message: "All notifications marked as read" });
});

// Delete a single notification
export const deleteNotification = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id
  });
  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }
  res.json({ success: true, message: "Notification deleted" });
});

// Helper: create a notification (used by other controllers)
export const createNotification = async ({ recipient, sender, type, title, message, actionUrl, relatedProject }) => {
  try {
    await Notification.create({ recipient, sender, type, title, message, actionUrl, relatedProject });
  } catch (err) {
    console.error("[NOTIFICATION] Failed to create:", err.message);
  }
};
