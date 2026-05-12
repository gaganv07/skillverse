import { Router } from "express";
import { getCompetitionRegistrations, registerForCompetition } from "../controllers/registrationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/:id", protect, authorize("student"), registerForCompetition);
router.get("/:id", protect, authorize("admin", "teacher", "organizer"), getCompetitionRegistrations);

export default router;
