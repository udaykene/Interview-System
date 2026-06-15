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
import { getEmailConfigError, sendVerificationEmail, sendPasswordResetEmail } from "../lib/emailService.js";
import { upsertStreamUser } from "../lib/stream.js";
import { generateUsername, resolveDisplayName, normalizeDisplayName } from "../lib/userIdentity.js";
import { resolveProfileImageUpdate } from "../lib/cloudinary.js";

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
  await upsertStreamUser({ id: user._id.toString(), name: user.name, image: user.profileImage });
  res.redirect(`${ENV.CLIENT_URL}/problems`);
};

// Local Auth: Register
export const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const emailConfigError = getEmailConfigError();
  if (emailConfigError) {
    return res.status(503).json({ message: emailConfigError });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const name = resolveDisplayName({ email: normalizedEmail });
    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const username = await generateUsername(name);
    const adminEmailSet = new Set(
      ENV.ADMIN_EMAILS.split(",").map((entry) => entry.trim().toLowerCase()).filter(Boolean)
    );

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: passwordHash,
      username,
      provider: "local",
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      role: adminEmailSet.has(normalizedEmail) ? "admin" : "user",
    });

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      console.error("Verification email failed during registration:", emailError.message);
      return res.status(503).json({
        message: emailError.message || "We could not send the verification email. Please check the mail settings and try again.",
      });
    }

    res.status(201).json({ message: "Account created! Please check your email to verify your account." });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Local Auth: Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.provider !== "local") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in. Check your inbox.",
        needsVerification: true,
      });
    }

    await issueTokens( res, user);
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

// Verify Email
export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    upsertStreamUser({ id: user._id.toString(), name: user.name, image: user.profileImage }).catch((err) => {
      console.error("Background Stream user sync error:", err);
    });

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase(), provider: "local" });
    if (!user) {
      return res.status(200).json({ message: "If an account exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    sendPasswordResetEmail(user, token).catch((err) => {
      console.error("Background password reset email error:", err);
    });

    res.status(200).json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshTokenHash = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully! You can now log in." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Current User
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

// Update Profile
export const updateProfile = async (req, res) => {
  const { name, username, bio, profileImage, socialLinks } = req.body;
  const userId = req.user._id;

  try {
    const normalizedName = name === undefined ? undefined : normalizeDisplayName(name);

    if (username) {
      const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: userId } });
      if (existing) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    if (name !== undefined && !normalizedName) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const profileImageUpdate = await resolveProfileImageUpdate({
      incomingImage: profileImage,
      existingImage: req.user.profileImage,
      existingPublicId: req.user.profileImagePublicId,
      userId: userId.toString(),
    });

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(normalizedName !== undefined && { name: normalizedName }),
          ...(username && { username: username.toLowerCase() }),
          ...(bio !== undefined && { bio }),
          ...(profileImageUpdate || {}),
          ...(socialLinks && { socialLinks }),
        },
      },
      { new: true, runValidators: true }
    );

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

// Refresh Tokens
export const refreshTokens = async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await issueTokens(res, user);
    res.status(200).json({ ok: true });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Logout
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

// Public User Profile & Follow
export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username.toLowerCase() })
      .select("name username email profileImage bio stats socialLinks role createdAt followers following")
      .populate("favorites", "title slug difficulty acceptanceRate");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        stats: user.stats,
        socialLinks: user.socialLinks,
        role: user.role,
        createdAt: user.createdAt,
        favorites: user.favorites,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing: req.user ? user.followers.includes(req.user._id) : false,
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleFollow = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;

  if (userId === myId.toString()) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(myId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id) => id.toString() !== userId);
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== myId.toString());
    } else {
      currentUser.following.push(userId);
      targetUser.followers.push(myId);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowers = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username.toLowerCase() })
      .populate("followers", "id name username profileImage");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followers = user.followers.map((follower) => ({
      id: follower._id.toString(),
      name: follower.name,
      username: follower.username,
      profileImage: follower.profileImage,
      isFollowing: req.user
        ? req.user.following.some((id) => id.toString() === follower._id.toString())
        : false,
    }));

    res.status(200).json({ followers });
  } catch (error) {
    console.error("Error in getFollowers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowing = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username.toLowerCase() })
      .populate("following", "id name username profileImage");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following.map((followedUser) => ({
      id: followedUser._id.toString(),
      name: followedUser.name,
      username: followedUser.username,
      profileImage: followedUser.profileImage,
      isFollowing: true,
    }));

    res.status(200).json({ following });
  } catch (error) {
    console.error("Error in getFollowing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
