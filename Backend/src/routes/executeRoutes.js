import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import { runCode, submitCode, getSubmissionsForProblem } from "../controllers/executeController.js";

const router = express.Router();

router.post("/run", protectRoutes, runCode);
router.post("/submit", protectRoutes, submitCode);
router.get("/submissions/:problemId", protectRoutes, getSubmissionsForProblem);

export default router;
