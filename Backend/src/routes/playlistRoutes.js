import express from "express";
import { protectRoutes } from "../middleware/auth.js";
import {
  listPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addProblemToPlaylist,
  removeProblemFromPlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

router.get("/", protectRoutes, listPlaylists);
router.get("/:id", protectRoutes, getPlaylist);
router.post("/", protectRoutes, createPlaylist);
router.put("/:id", protectRoutes, updatePlaylist);
router.delete("/:id", protectRoutes, deletePlaylist);
router.post("/:id/problems", protectRoutes, addProblemToPlaylist);
router.delete("/:id/problems/:problemId", protectRoutes, removeProblemFromPlaylist);

export default router;
