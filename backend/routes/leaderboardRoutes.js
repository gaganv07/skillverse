import { Router } from "express";
import { getLeaderboards } from "../controllers/leaderboardController.js";

const router = Router();

router.get("/", getLeaderboards);

export default router;
