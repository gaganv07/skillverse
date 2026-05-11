import { Router } from "express";
import { announceWinner, createCompetition, getCompetitions, registerForCompetition } from "../controllers/competitionController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCompetitions);
router.post("/", protect, authorize("admin", "organizer"), createCompetition);
router.post("/:id/register", protect, authorize("student"), registerForCompetition);
router.post("/:id/winners", protect, authorize("admin", "organizer"), announceWinner);

export default router;
