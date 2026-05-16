import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: {
      type: String,
      enum: [
        "project_approved",
        "project_rejected",
        "project_featured",
        "project_revision",
        "teacher_feedback",
        "competition_announcement",
        "admin_announcement",
        "comment",
        "competition",
        "announcement",
        "system"
      ],
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ["workflow", "feedback", "competition", "announcement", "system"],
      default: "system",
      index: true
    },
    title: { type: String, required: true, trim: true },
    message: {
      type: String,
      trim: true,
      default: ""
    },
    actionUrl: String,
    actionLabel: {
      type: String,
      default: "View"
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    entityType: {
      type: String,
      enum: ["project", "competition", "announcement", "system"],
      default: "system"
    },
    entityId: mongoose.Schema.Types.ObjectId,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: Date
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, category: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
