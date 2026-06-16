import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import {
  listStudyPlans,
  getStudyPlanBySlug,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
} from "../controllers/studyPlanController.js";

const router = express.Router();

router.get("/", protectRoutes, listStudyPlans);
router.get("/:slug", protectRoutes, getStudyPlanBySlug);
router.post("/", protectRoutes, createStudyPlan);
router.put("/:id", protectRoutes, updateStudyPlan);
router.delete("/:id", protectRoutes, deleteStudyPlan);

export default router;
