import { Router } from "express";
import { getUserBookmarks, toggleBookmark } from "../controllers/bookmarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getUserBookmarks);
router.post("/toggle/:projectId", protect, toggleBookmark);

export default router;
