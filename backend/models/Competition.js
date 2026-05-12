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
    status: {
      type: String,
      enum: ["upcoming", "registration-open", "ongoing", "completed"],
      default: "upcoming"
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Competition = mongoose.model("Competition", competitionSchema);
export default Competition;
