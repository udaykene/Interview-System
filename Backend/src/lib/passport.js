import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { ENV } from "./env.js";
import User from "../models/User.js";

const adminEmailSet = new Set(
  ENV.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
);

const upsertOAuthUser = async ({ provider, providerId, email, name, profileImage }) => {
  const existing = await User.findOne({ provider, providerId });
  if (existing) return existing;

  const existingByEmail = await User.findOne({ email });
  if (existingByEmail) return existingByEmail;

  const role = adminEmailSet.has(email.toLowerCase()) ? "admin" : "user";

  const user = await User.create({
    provider,
    providerId,
    email,
    name,
    profileImage,
    role,
  });

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
        const name = profile.displayName || "User";
        const profileImage = profile.photos?.[0]?.value || "";
        const user = await upsertOAuthUser({
          provider: "google",
          providerId: profile.id,
          email,
          name,
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
        const name = profile.displayName || profile.username || "User";
        const profileImage = profile.photos?.[0]?.value || "";
        const user = await upsertOAuthUser({
          provider: "github",
          providerId: profile.id,
          email,
          name,
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
