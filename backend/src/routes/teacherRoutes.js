import { Router } from "express";
import { getTeacherProfile, getTeachers, updateTeacherProfile, verifyStudent } from "../controllers/teacherController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getTeachers);
router.get("/:userId", getTeacherProfile);
router.put("/:userId", protect, authorize("teacher", "admin"), updateTeacherProfile);
router.patch("/verify/:studentId", protect, authorize("teacher", "admin"), verifyStudent);

export default router;
