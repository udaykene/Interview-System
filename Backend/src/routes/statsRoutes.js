import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { getUserStats, getUserActivity, getUserHistory } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", protectRoutes, getUserStats);
router.get("/activity", protectRoutes, getUserActivity);
router.get("/history", protectRoutes, getUserHistory);

export default router;
