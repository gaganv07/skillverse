import { Router } from "express";
import { createCertificate, getCertificates } from "../controllers/certificateController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:studentId", protect, getCertificates);
router.post("/", protect, authorize("admin", "teacher", "organizer"), createCertificate);

export default router;
