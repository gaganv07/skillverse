import { Router } from "express";
import { forgotPassword, login, me, register, resetPassword, verifyEmail } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Only admins and teachers can register new students
router.post("/register", protect, authorize("admin", "teacher"), register);

router.post("/login", login);
router.get("/me", protect, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

export default router;
