import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    banner: String,
    headline: String,
    classLevel: String,
    interests: [String],
    achievements: [
      {
        title: String,
        issuer: String,
        year: String,
        description: String
      }
    ],
    portfolio: [
      {
        title: String,
        url: String,
        type: String
      }
    ],
    futureGoals: [String]
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;
