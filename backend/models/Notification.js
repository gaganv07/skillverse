import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: {
      type: String,
      enum: ["project_approved", "project_rejected", "project_featured", "project_revision", "comment", "competition", "announcement", "system"],
      required: true
    },
    title: { type: String, required: true },
    message: String,
    actionUrl: String,
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
