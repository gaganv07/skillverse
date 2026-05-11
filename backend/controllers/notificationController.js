import Notification from "../models/Notification.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, notifications });
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  res.json({ success: true, notification });
});
