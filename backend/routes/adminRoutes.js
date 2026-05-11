import { Router } from "express";
import { featureProject, getDashboardStats, removeTalent, sendAnnouncement } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/stats", getDashboardStats);
router.patch("/projects/:id/feature", featureProject);
router.delete("/talents/:id", removeTalent);
router.post("/announcements", sendAnnouncement);

export default router;
