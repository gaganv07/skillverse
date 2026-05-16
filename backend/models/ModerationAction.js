import mongoose from "mongoose";

const moderationActionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    actorRole: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true
    },
    action: {
      type: String,
      enum: ["submitted", "approved", "rejected", "revision_requested", "featured", "removed", "resubmitted"],
      required: true,
      index: true
    },
    fromStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "featured", "rejected", "revision", "disabled", null],
      default: null
    },
    toStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "featured", "rejected", "revision", "disabled"],
      required: true
    },
    comment: {
      type: String,
      trim: true,
      default: ""
    },
    isOverride: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

moderationActionSchema.index({ project: 1, createdAt: -1 });
moderationActionSchema.index({ student: 1, createdAt: -1 });

const ModerationAction = mongoose.model("ModerationAction", moderationActionSchema);
export default ModerationAction;
