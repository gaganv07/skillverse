import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["user", "school", "project"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    documents: [String], // URLs to proof documents
    description: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    adminNotes: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
