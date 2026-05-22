import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoutes = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }

    if (error?.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid access token",
        code: "INVALID_ACCESS_TOKEN",
      });
    }

    console.error("Unexpected error in protectRoutes middleware", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
