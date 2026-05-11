import { Router } from "express";
import { commentProject, createProject, deleteProject, getProjectById, getProjects, likeProject, updateProject, verifyProject } from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", protect, authorize("student", "admin"), createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.post("/:id/like", protect, likeProject);
router.post("/:id/comments", protect, commentProject);

// Teacher/Admin verification route
router.patch("/:id/verify", protect, authorize("admin", "teacher"), verifyProject);

export default router;
