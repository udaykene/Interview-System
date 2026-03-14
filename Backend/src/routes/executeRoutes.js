import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { runCode, submitCode } from "../controllers/executeController.js";

const router = express.Router();

router.post("/run", protectRoutes, runCode);
router.post("/submit", protectRoutes, submitCode);

export default router;
