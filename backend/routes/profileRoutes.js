import { Router } from "express";
import { getSchoolProfile, getStudentProfile, updateStudentProfile } from "../controllers/profileController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Student profiles
router.get("/student/:id", getStudentProfile);
router.put("/student", protect, authorize("student", "admin"), updateStudentProfile);

// School profiles
router.get("/school/:id", getSchoolProfile);

export default router;
