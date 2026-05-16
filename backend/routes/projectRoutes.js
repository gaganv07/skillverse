import { Router } from "express";
import {
  commentProject, createProject, deleteProject,
  getProjectById, getProjects, getMyProjects,
  likeProject, shareProject, updateProject,
  reviewProject, getPendingProjects,
  approveProject, rejectProject, requestProjectRevision,
  featureProject, disableProject, getModerationHistory
} from "../controllers/projectController.js";
import { authorize, optionalAuth, protect } from "../middleware/authMiddleware.js";

const router = Router();

// Public list
router.get("/", getProjects);

// Student: get own projects (all statuses) — MUST be before /:id
router.get("/me/all", protect, getMyProjects);

// Teacher/Admin: pending review queue — MUST be before /:id
router.get("/review/pending", protect, authorize("admin", "teacher"), getPendingProjects);
router.get("/review/history", protect, authorize("admin", "teacher"), getModerationHistory);

// Public single project (must come after /me/all and /review/pending)
router.get("/:id", optionalAuth, getProjectById);

// Authenticated CRUD
router.post("/", protect, authorize("student", "admin"), createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// Engagement
router.post("/:id/like", protect, likeProject);
router.post("/:id/share", shareProject);
router.post("/:id/comments", protect, commentProject);

// Teacher/Admin: review action
router.patch("/:id/review", protect, authorize("admin", "teacher"), reviewProject);
router.patch("/:id/approve", protect, authorize("admin", "teacher"), approveProject);
router.patch("/:id/reject", protect, authorize("admin", "teacher"), rejectProject);
router.patch("/:id/request-revision", protect, authorize("admin", "teacher"), requestProjectRevision);
router.patch("/:id/feature", protect, authorize("admin"), featureProject);
router.patch("/:id/remove", protect, authorize("admin"), disableProject);

export default router;
