import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition"
    },
    type: {
      type: String,
      enum: ["participation", "winner", "top-innovator", "featured-student"],
      required: true
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true
    },
    fileUrl: String,
    issuedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
