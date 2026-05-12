import { Router } from "express";
import { createReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createReport);

export default router;
