import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  joinSessionByCode,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoutes, createSession);
router.get("/active", protectRoutes, getActiveSessions);
router.get("/my-recent", protectRoutes, getMyRecentSessions);

router.get("/:id", protectRoutes, getSessionById);
router.post("/:id/join", protectRoutes, joinSession);
router.post("/join-by-code", protectRoutes, joinSessionByCode);
router.post("/:id/end", protectRoutes, endSession);

export default router;
