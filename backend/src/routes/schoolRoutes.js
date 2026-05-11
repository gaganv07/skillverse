import { Router } from "express";
import { createSchool, getSchools } from "../controllers/schoolController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getSchools);
router.post("/", protect, authorize("admin"), createSchool);

export default router;
