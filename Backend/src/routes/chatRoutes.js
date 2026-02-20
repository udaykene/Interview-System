import express from "express";
import { getStreamToken } from "../controllers/chatController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";
const router = express.Router();

// /api/chat/token
router.get("/token",protectRoutes,getStreamToken )

export default router;
