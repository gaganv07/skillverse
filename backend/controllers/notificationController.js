import Notification from "../models/Notification.js";
import { catchAsync } from "../utils/catchAsync.js";

const categoryMap = {
  project_approved: "workflow",
  project_rejected: "workflow",
  project_featured: "workflow",
  project_revision: "feedback",
  teacher_feedback: "feedback",
  competition_announcement: "competition",
  admin_announcement: "announcement",
  competition: "competition",
  announcement: "announcement",
  comment: "feedback",
  system: "system"
};

export const getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 30, category = "all", unreadOnly = "false" } = req.query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const filters = { recipient: req.user._id };
  if (category !== "all") {
    filters.category = category;
  }
  if (unreadOnly === "true") {
    filters.read = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filters)
      .populate("sender", "fullName avatar role")
      .populate("relatedProject", "title status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),
    Notification.countDocuments(filters),
    Notification.countDocuments({ recipient: req.user._id, read: false })
  ]);

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10))
    }
  });
});

export const getUnreadCount = catchAsync(async (req, res) => {
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
  res.json({ success: true, unreadCount });
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  res.json({ success: true, notification });
});

export const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true, readAt: new Date() }
  );
  res.json({ success: true, message: "All notifications marked as read" });
});

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

export const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message = "",
  actionUrl,
  actionLabel = "View",
  relatedProject,
  entityType,
  entityId,
  category,
  metadata = {}
}) => {
  try {
    await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      actionUrl,
      actionLabel,
      relatedProject,
      entityType: entityType || (relatedProject ? "project" : "system"),
      entityId: entityId || relatedProject,
      category: category || categoryMap[type] || "system",
      metadata
    });
  } catch (err) {
    console.error("[NOTIFICATION] Failed to create:", err.message);
  }
};

export const createBulkNotifications = async (notifications) => {
  if (!notifications?.length) return;

  try {
    const payload = notifications.map((notification) => ({
      ...notification,
      actionLabel: notification.actionLabel || "View",
      category: notification.category || categoryMap[notification.type] || "system",
      entityType: notification.entityType || (notification.relatedProject ? "project" : "system"),
      entityId: notification.entityId || notification.relatedProject || undefined,
      metadata: notification.metadata || {}
    }));

    await Notification.insertMany(payload);
  } catch (err) {
    console.error("[NOTIFICATION] Failed to create bulk notifications:", err.message);
  }
};
