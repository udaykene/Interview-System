import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  accessCookieOptions,
  refreshCookieOptions,
} from "../lib/tokens.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/emailService.js";
import { upsertStreamUser } from "../lib/stream.js";

// Helper to generate a username from name/email
const generateUsername = async (base) => {
  const slug = base.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15) || "user";
  let username = slug;
  let counter = 0;
  while (await User.findOne({ username })) {
    counter++;
    username = `${slug}${Math.floor(1000 + Math.random() * 9000)}`;
    if (counter > 10) username = `user${Date.now().toString(36)}`;
  }
  return username;
};

export const issueTokens = async (res, user) => {
  const isProd = ENV.NODE_ENV === "production";
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  res.cookie("access_token", accessToken, accessCookieOptions(isProd));
  res.cookie("refresh_token", refreshToken, refreshCookieOptions(isProd));
};

// OAuth callback (Google / GitHub)
export const handleOAuthCallback = async (req, res) => {
  const user = req.user;
  await issueTokens(res, user);
  // Upsert to Stream after OAuth
  await upsertStreamUser({ id: user._id.toString(), name: user.name, image: user.profileImage });
  res.redirect(`${ENV.CLIENT_URL}/dashboard`);
};

// ─────────────────────────────────────────────
// Local Auth: Register
// ─────────────────────────────────────────────
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const username = await generateUsername(name);
    const adminEmailSet = new Set(
      ENV.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      username,
      provider: "local",
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      role: adminEmailSet.has(email.toLowerCase()) ? "admin" : "user",
    });

    await sendVerificationEmail(user, verificationToken);
    await upsertStreamUser({ id: user._id.toString(), name: user.name, image: user.profileImage });

    res.status(201).json({ message: "Account created! Please check your email to verify your account." });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────
// Local Auth: Login
// ─────────────────────────────────────────────
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.provider !== "local")
      return res.status(401).json({ message: "Invalid email or password" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in. Check your inbox.",
        needsVerification: true,
      });
    }

    await issueTokens(res, user);
    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        role: user.role,
        bio: user.bio,
        socialLinks: user.socialLinks,
        stats: user.stats,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────
// Verify Email
// ─────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired verification token" });

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────
// Forgot Password
// ─────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase(), provider: "local" });
    // Always return 200 to avoid user enumeration
    if (!user) return res.status(200).json({ message: "If an account exists, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(user, token);
    res.status(200).json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshTokenHash = null; // invalidate refresh tokens
    await user.save();

    res.status(200).json({ message: "Password reset successfully! You can now log in." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────
// Get Current User
// ─────────────────────────────────────────────
export const getMe = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username || "",
      profileImage: user.profileImage,
      role: user.role,
      bio: user.bio || "",
      socialLinks: user.socialLinks || {},
      stats: user.stats || {},
      emailVerified: user.emailVerified,
      provider: user.provider,
    },
  });
};

// ─────────────────────────────────────────────
// Update Profile
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  const { name, username, bio, profileImage, socialLinks } = req.body;
  const userId = req.user._id;

  try {
    if (username) {
      const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: userId } });
      if (existing) return res.status(409).json({ message: "Username already taken" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(username && { username: username.toLowerCase() }),
          ...(bio !== undefined && { bio }),
          ...(profileImage !== undefined && { profileImage }),
          ...(socialLinks && { socialLinks }),
        },
      },
      { new: true, runValidators: true }
    );

    // Sync name/image to Stream
    await upsertStreamUser({
      id: userId.toString(),
      name: updated.name,
      image: updated.profileImage,
    });

    res.status(200).json({
      user: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        username: updated.username || "",
        profileImage: updated.profileImage,
        role: updated.role,
        bio: updated.bio || "",
        socialLinks: updated.socialLinks || {},
        stats: updated.stats || {},
        emailVerified: updated.emailVerified,
        provider: updated.provider,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─────────────────────────────────────────────
// Refresh Tokens
// ─────────────────────────────────────────────
export const refreshTokens = async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await issueTokens(res, user);
    res.status(200).json({ ok: true });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────
export const logout = async (req, res) => {
  const isProd = ENV.NODE_ENV === "production";
  const token = req.cookies?.refresh_token;
  if (token) {
    try {
      const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
    } catch {
      // ignore
    }
  }
  res.clearCookie("access_token", accessCookieOptions(isProd));
  res.clearCookie("refresh_token", refreshCookieOptions(isProd));
  res.status(200).json({ ok: true });
};
