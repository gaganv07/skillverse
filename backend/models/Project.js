import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    slug: { type: String, index: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "science",
        "technology",
        "agriculture",
        "robotics",
        "environment",
        "engineering",
        "ai-coding",
        "research",
        "sustainability",
        "innovation"
      ],
      required: true
    },
    media: {
      images: [String],
      videoUrl: String,
      documentUrl: String
    },
    skillsUsed: [String],
    teamMembers: [String],
    schoolName: String,
    district: String,
    state: String,
    githubLink: String,
    demoLink: String,
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "featured", "rejected"],
      default: "pending"
    },
    metrics: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    },
    tags: [String],
    isBookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
