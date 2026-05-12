import { Router } from "express";
import { getCompetitionSubmissions, gradeSubmission, submitProject } from "../controllers/submissionController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/competition/:id", protect, authorize("student"), submitProject);
router.get("/competition/:id", protect, authorize("admin", "teacher", "organizer"), getCompetitionSubmissions);
router.patch("/:id/grade", protect, authorize("admin", "teacher", "organizer"), gradeSubmission);

export default router;
