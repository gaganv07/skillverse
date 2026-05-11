import { Router } from "express";
import { getStudentProfile, getStudents, updateStudentProfile } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getStudents);
router.get("/:userId", getStudentProfile);
router.put("/:userId", protect, updateStudentProfile);

export default router;
