import express from "express";
import {
  listProblems,
  getProblemBySlug,
  createProblem,
  bulkImportProblems,
  updateProblem,
  deleteProblem,
  toggleFavorite,
  getFavorites,
} from "../controllers/problemController.js";
import { protectRoutes, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listProblems);
router.get("/favorites", protectRoutes, getFavorites);
router.get("/:slug", getProblemBySlug);

router.post("/", protectRoutes, requireAdmin, createProblem);
router.post("/bulk-import", protectRoutes, requireAdmin, bulkImportProblems);
router.post("/:id/favorite", protectRoutes, toggleFavorite);
router.put("/:slug", protectRoutes, requireAdmin, updateProblem);
router.delete("/:slug", protectRoutes, requireAdmin, deleteProblem);

export default router;
