import { Router } from "express";
import {
  commentProject, createProject, deleteProject,
  getProjectById, getProjects, getMyProjects,
  likeProject, shareProject, updateProject,
  reviewProject, getPendingProjects
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

// Public list
router.get("/", getProjects);

// Student: get own projects (all statuses) — MUST be before /:id
router.get("/me/all", protect, getMyProjects);

// Teacher/Admin: pending review queue — MUST be before /:id
router.get("/review/pending", protect, authorize("admin", "teacher"), getPendingProjects);

// Public single project (must come after /me/all and /review/pending)
router.get("/:id", getProjectById);

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

export default router;
