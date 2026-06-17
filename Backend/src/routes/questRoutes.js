import express from "express";
import { protectRoutes, requireAdmin } from "../middleware/auth.js";
import {
  getQuests,
  claimDailyQuest,
  claimWeeklyBounty,
  claimAdminQuest,
  createQuest,
  listAdminQuests,
  updateQuest,
  deleteQuest,
  listBadges,
  createBadge,
  deleteBadge,
} from "../controllers/questController.js";

const router = express.Router();

// ─── User endpoints ──────────────────────
router.get("/", protectRoutes, getQuests);
router.post("/claim-daily", protectRoutes, claimDailyQuest);
router.post("/claim-weekly/:bountyId", protectRoutes, claimWeeklyBounty);
router.post("/claim-quest/:questId", protectRoutes, claimAdminQuest);

// ─── Badge endpoints ─────────────────────
router.get("/badges", protectRoutes, listBadges);
router.post("/badges", protectRoutes, requireAdmin, createBadge);
router.delete("/badges/:id", protectRoutes, requireAdmin, deleteBadge);

// ─── Admin quest management ──────────────
router.get("/admin", protectRoutes, requireAdmin, listAdminQuests);
router.post("/admin", protectRoutes, requireAdmin, createQuest);
router.put("/admin/:id", protectRoutes, requireAdmin, updateQuest);
router.delete("/admin/:id", protectRoutes, requireAdmin, deleteQuest);

export default router;
