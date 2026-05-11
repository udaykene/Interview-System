import express from "express";
import passport from "../lib/passport.js";
import { protectRoutes } from "../middleware/auth.js";
import {
  handleOAuthCallback,
  getMe,
  refreshTokens,
  logout,
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
  getUserProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
} from "../controllers/authController.js";

const router = express.Router();
// ... (omitting OAuth routes for brevity in instruction, but keeping them in replacement)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/failure" }),
  handleOAuthCallback
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/api/auth/failure" }),
  handleOAuthCallback
);

// ─── Local Auth ───────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ─── Authenticated Routes ─────────────────────
router.get("/me", protectRoutes, getMe);
router.put("/me", protectRoutes, updateProfile);
router.post("/refresh", refreshTokens);
router.post("/logout", logout);
router.get("/user/:username", protectRoutes, getUserProfile);
router.post("/user/:userId/follow", protectRoutes, toggleFollow);
router.get("/user/:username/followers", protectRoutes, getFollowers);
router.get("/user/:username/following", protectRoutes, getFollowing);
router.get("/failure", (_req, res) => res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`));

export default router;
