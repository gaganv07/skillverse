import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true
    },
    status: {
      type: String,
      enum: ["registered", "waitlisted", "rejected"],
      default: "registered"
    }
  },
  { timestamps: true }
);

// Prevent duplicate registrations
registrationSchema.index({ student: 1, competition: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
