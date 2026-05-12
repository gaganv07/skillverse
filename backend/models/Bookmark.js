import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks for the same project by the same user
bookmarkSchema.index({ user: 1, project: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
