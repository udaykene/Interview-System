import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "./env.js";

export const createAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    ENV.JWT_ACCESS_SECRET,
    { expiresIn: ENV.JWT_ACCESS_EXPIRES_IN },
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), type: "refresh" },
    ENV.JWT_REFRESH_SECRET,
    { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN },
  );
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const accessCookieOptions = (isProd) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProd,
  maxAge: 1000 * 60 * 60,
});

export const refreshCookieOptions = (isProd) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProd,
  maxAge: 1000 * 60 * 60 * 24 * 7,
});
