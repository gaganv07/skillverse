import { Router } from "express";
import { commentPost, createPost, getFeed, likePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getFeed);
router.post("/", protect, createPost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comments", protect, commentPost);

export default router;
