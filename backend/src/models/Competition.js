import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["science-fair", "innovation", "hackathon", "talent", "online-event"],
      required: true
    },
    banner: String,
    startDate: Date,
    endDate: Date,
    registrationDeadline: Date,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    eligibility: [String],
    prizes: [String],
    rules: [String],
    registrations: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        submittedAt: Date,
        status: {
          type: String,
          enum: ["registered", "shortlisted", "winner", "rejected"],
          default: "registered"
        }
      }
    ],
    winners: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rank: String,
        title: String
      }
    ],
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Competition = mongoose.model("Competition", competitionSchema);
export default Competition;
