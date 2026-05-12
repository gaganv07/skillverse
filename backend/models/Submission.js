import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
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
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    status: {
      type: String,
      enum: ["submitted", "under_review", "graded"],
      default: "submitted"
    },
    awardedRank: {
      type: String,
      enum: ["none", "participation", "finalist", "winner"],
      default: "none"
    },
    feedback: String
  },
  { timestamps: true }
);

// Prevent duplicate submissions of the same project to the same competition
submissionSchema.index({ project: 1, competition: 1 }, { unique: true });
// Optionally, prevent a student from submitting multiple projects to one competition
submissionSchema.index({ student: 1, competition: 1 }, { unique: true });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
