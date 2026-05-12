import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String, // e.g., "approved_project", "disabled_user", "resolved_report"
      required: true
    },
    targetModel: {
      type: String,
      enum: ["Project", "User", "Report", "Verification", "Competition"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    details: String
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
