import { Router } from "express";
import { uploadAsset } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/", protect, upload.single("file"), uploadAsset);

export default router;
