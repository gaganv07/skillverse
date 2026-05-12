import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: String,
    district: String,
    state: String,
    principalName: String,
    contactEmail: String,
    website: String,
    logo: String,
    banner: String,
    description: String,
    stats: {
      students: { type: Number, default: 0 },
      verifiedStudents: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      awards: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);
export default School;
