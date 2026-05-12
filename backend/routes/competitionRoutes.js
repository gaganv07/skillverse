import { Router } from "express";
import { createCompetition, getCompetitions, getCompetitionById } from "../controllers/competitionController.js";
import { authorize, protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCompetitions);
// We will assume optionalAuth exists or we use a separate route. Let's assume we create optionalAuth
router.get("/:id", optionalAuth, getCompetitionById);
router.post("/", protect, authorize("admin", "organizer", "teacher"), createCompetition);

export default router;

