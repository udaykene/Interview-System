import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { ENV } from "./env.js";
import User from "../models/User.js";
import { generateUsername, resolveDisplayName } from "./userIdentity.js";
import { resolveProfileImageUpdate } from "./cloudinary.js";

const adminEmailSet = new Set(
  ENV.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
);

const syncOAuthProfileImage = async (user, profileImage) => {
  if (!profileImage) return user;

  const imageUpdate = await resolveProfileImageUpdate({
    incomingImage: profileImage,
    existingImage: user.profileImage,
    existingPublicId: user.profileImagePublicId,
    userId: user._id.toString(),
  });

  if (!imageUpdate) return user;

  user.profileImage = imageUpdate.profileImage;
  user.profileImagePublicId = imageUpdate.profileImagePublicId;
  await user.save();
  return user;
};

const upsertOAuthUser = async ({ provider, providerId, email, name, username, profileImage }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ provider, providerId });
  if (existing) {
    if (provider === "google") {
      return syncOAuthProfileImage(existing, profileImage);
    }
    return existing;
  }

  const existingByEmail = await User.findOne({ email: normalizedEmail });
  if (existingByEmail) {
    const needsUpdate =
      existingByEmail.name !== resolveDisplayName({ name: existingByEmail.name, username: existingByEmail.username, email: normalizedEmail }) ||
      !existingByEmail.username ||
      !existingByEmail.providerId;

    if (needsUpdate) {
      existingByEmail.name = resolveDisplayName({
        name: existingByEmail.name || name,
        username: existingByEmail.username || username,
        email: normalizedEmail,
      });

      if (!existingByEmail.username) {
        existingByEmail.username = await generateUsername(username || existingByEmail.name || normalizedEmail);
      }

      if (!existingByEmail.providerId && existingByEmail.provider === provider) {
        existingByEmail.providerId = providerId;
      }

      if (!existingByEmail.profileImage && profileImage) {
        existingByEmail.profileImage = profileImage;
      }

      await existingByEmail.save();
    }

    if (provider === "google") {
      return syncOAuthProfileImage(existingByEmail, profileImage);
    }

    return existingByEmail;
  }

  const role = adminEmailSet.has(normalizedEmail) ? "admin" : "user";
  const resolvedName = resolveDisplayName({ name, username, email: normalizedEmail });
  const generatedUsername = await generateUsername(username || resolvedName || normalizedEmail);

  const user = await User.create({
    provider,
    providerId,
    email: normalizedEmail,
    name: resolvedName,
    username: generatedUsername,
    role,
    emailVerified: true,
  });

  if (provider === "google") {
    return syncOAuthProfileImage(user, profileImage);
  }

  return user;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: `${ENV.SERVER_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.id}@google.local`;
        const name = profile.displayName || "";
        const username = profile.name?.givenName || "";
        const profileImage = profile.photos?.[0]?.value || "";
        const user = await upsertOAuthUser({
          provider: "google",
          providerId: profile.id,
          email,
          name,
          username,
          profileImage,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
      callbackURL: `${ENV.SERVER_URL}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.find((e) => e.verified)?.value ||
          profile.emails?.[0]?.value ||
          `${profile.id}@github.local`;
        const name = profile.displayName || "";
        const username = profile.username || "";
        const profileImage = profile.photos?.[0]?.value || "";
        const user = await upsertOAuthUser({
          provider: "github",
          providerId: profile.id,
          email,
          name,
          username,
          profileImage,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

export default passport;
