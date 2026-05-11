import mongoose from "mongoose";

const talentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: [
        "singing",
        "dancing",
        "drawing",
        "public-speaking",
        "photography",
        "sports",
        "writing",
        "coding",
        "entrepreneurship",
        "leadership"
      ],
      required: true
    },
    videoUrl: String,
    reelUrl: String,
    thumbnail: String,
    metrics: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Talent = mongoose.model("Talent", talentSchema);
export default Talent;
