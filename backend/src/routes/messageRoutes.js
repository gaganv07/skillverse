import { Router } from "express";
import { getConversation, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getConversation);

export default router;
