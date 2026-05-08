import express from "express";
import { globalSearch } from "../controllers/searchController.js";
import { protectRoutes } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protectRoutes, globalSearch);

export default router;
