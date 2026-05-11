import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: { type: String, required: true },
    image: String,
    tags: [String],
    type: {
      type: String,
      enum: ["idea", "question", "update", "announcement"],
      default: "idea"
    },
    metrics: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
