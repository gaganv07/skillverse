import { Router } from "express";
import { debugLogin, forgotPassword, login, me, register, resetPassword, verifyEmail } from "../controllers/authController.js";
import { seedAdmin } from "../controllers/seedController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Only admins and teachers can register new students
router.post("/register", protect, authorize("admin", "teacher"), register);

router.post("/login", login);
router.get("/me", protect, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

// Debug endpoint — remove in production
router.post("/debug-login", debugLogin);

// Seed endpoint — only works if no admin exists
router.post("/seed-admin", seedAdmin);

export default router;
