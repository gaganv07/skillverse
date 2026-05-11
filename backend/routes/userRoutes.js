import { Router } from "express";
import { getUserById, getUsers, toggleBookmark, toggleFollow, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", protect, updateUser);
router.post("/bookmark", protect, toggleBookmark);
router.post("/:id/follow", protect, toggleFollow);

export default router;
