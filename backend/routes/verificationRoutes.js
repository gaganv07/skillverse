import { Router } from "express";
import { submitVerificationRequest } from "../controllers/verificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, submitVerificationRequest);

export default router;
