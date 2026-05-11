import mongoose from "mongoose";

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    designation: String,
    subjects: [String],
    experienceYears: Number,
    verifiedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    recommendations: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
        rating: { type: Number, min: 1, max: 5 }
      }
    ]
  },
  { timestamps: true }
);

const TeacherProfile = mongoose.model("TeacherProfile", teacherProfileSchema);
export default TeacherProfile;
