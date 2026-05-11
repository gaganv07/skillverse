import { Router } from "express";
import { getUserById, getUsers, toggleBookmark, toggleFollow, updateUser, deleteUser, verifyUser, toggleUserStatus } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", protect, updateUser);
router.post("/bookmark", protect, toggleBookmark);
router.post("/:id/follow", protect, toggleFollow);

// Admin and Teacher management routes
router.delete("/:id", protect, authorize("admin"), deleteUser);
router.patch("/:id/verify", protect, authorize("admin", "teacher"), verifyUser);
router.patch("/:id/status", protect, authorize("admin"), toggleUserStatus);

export default router;
