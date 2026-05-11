import Message from "../models\Message.js";
import { catchAsync } from "../utils/catchAsync.js";

export const sendMessage = catchAsync(async (req, res) => {
  const message = await Message.create({
    sender: req.user._id,
    receiver: req.body.receiver,
    content: req.body.content
  });
  res.status(201).json({ success: true, message });
});

export const getConversation = catchAsync(async (req, res) => {
  const partnerId = req.params.userId;
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: partnerId },
      { sender: partnerId, receiver: req.user._id }
    ]
  }).sort({ createdAt: 1 });

  res.json({ success: true, messages });
});
