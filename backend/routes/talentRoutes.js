import { Router } from "express";
import { commentTalent, createTalent, getTalents, likeTalent } from "../controllers/talentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getTalents);
router.post("/", protect, authorize("student", "admin"), createTalent);
router.post("/:id/like", protect, likeTalent);
router.post("/:id/comments", protect, commentTalent);

export default router;
