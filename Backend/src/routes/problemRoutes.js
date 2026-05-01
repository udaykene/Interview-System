import express from "express";
import {
  listProblems,
  getProblemBySlug,
  createProblem,
  bulkImportProblems,
  updateProblem,
  deleteProblem,
} from "../controllers/problemController.js";
import { protectRoutes, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listProblems);
router.get("/:slug", getProblemBySlug);

router.post("/", protectRoutes, requireAdmin, createProblem);
router.post("/bulk-import", protectRoutes, requireAdmin, bulkImportProblems);
router.put("/:slug", protectRoutes, requireAdmin, updateProblem);
router.delete("/:slug", protectRoutes, requireAdmin, deleteProblem);

export default router;
