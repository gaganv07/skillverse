import mongoose from "mongoose";

const reviewCommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    authorRole: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true
    },
    action: {
      type: String,
      enum: ["submitted", "approved", "rejected", "revision_requested", "featured", "removed", "resubmitted"],
      required: true
    },
    comment: {
      type: String,
      trim: true,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, index: true },
    description: { type: String, required: true, trim: true },
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
      enum: ["draft", "pending", "approved", "featured", "rejected", "revision", "disabled"],
      default: "pending",
      index: true
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
      index: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    lastResubmittedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewComment: {
      type: String,
      trim: true,
      default: ""
    },
    reviewComments: {
      type: [reviewCommentSchema],
      default: []
    },
    moderationHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ModerationAction"
      }
    ],
    reviewedAt: Date,
    statusChangedAt: {
      type: Date,
      default: Date.now
    },
    featuredAt: Date,
    featuredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    metrics: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    },
    tags: [String],
    isBookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

projectSchema.index({ student: 1, createdAt: -1 });
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ visibility: 1, status: 1, createdAt: -1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
