import { Router } from "express";
import { featureProject, removeTalent, sendAnnouncement } from "../controllers/adminController.js";
import { getDashboardAnalytics } from "../controllers/analyticsController.js";
import { getReports, moderateProject, moderateUser, resolveReport } from "../controllers/moderationController.js";
import { getVerificationRequests, processVerification } from "../controllers/verificationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import ActivityLog from "../models/ActivityLog.js";

const router = Router();

router.use(protect, authorize("admin"));

// Analytics
router.get("/analytics", getDashboardAnalytics);

// Legacy admin actions (if keeping them)
router.patch("/projects/:id/feature", featureProject);
router.delete("/talents/:id", removeTalent);
router.post("/announcements", sendAnnouncement);

// Moderation
router.patch("/projects/:id/moderate", moderateProject);
router.patch("/users/:id/moderate", moderateUser);
router.get("/reports", getReports);
router.patch("/reports/:id/resolve", resolveReport);

// Verification
router.get("/verifications", getVerificationRequests);
router.patch("/verifications/:id/process", processVerification);

// Logs
router.get("/logs", async (req, res) => {
  const logs = await ActivityLog.find().populate("admin", "fullName").sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, logs });
});

export default router;

