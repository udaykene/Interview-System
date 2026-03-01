import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoutes = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const auth = typeof req.auth === "function" ? req.auth() : req.auth;
      const clerkId = auth?.userId;
      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // find user by clerkId
      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // attach user to req object
      req.user = user;

      next();
    } catch (error) {
      console.error("❌Error in protectRoutes middleware", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
