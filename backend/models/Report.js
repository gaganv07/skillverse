import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetType: {
      type: String,
      enum: ["project", "user", "comment", "competition"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    reason: {
      type: String,
      enum: ["fake", "inappropriate", "spam", "abuse", "plagiarism", "other"],
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending"
    },
    adminNotes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
