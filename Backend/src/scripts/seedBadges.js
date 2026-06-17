import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Badge from "../models/Badge.js";

const DB_URL = process.env.DB_URL;

const defaultBadges = [
  {
    name: "First Spark",
    description: "Start your coding journey with a 1-day streak!",
    icon: "Flame",
    color: "#f97316",
    triggerType: "streak",
    triggerValue: 1,
    xpReward: 50,
  },
  {
    name: "Streak Master",
    description: "Keep the momentum going with a 7-day coding streak.",
    icon: "Activity",
    color: "#ef4444",
    triggerType: "streak",
    triggerValue: 7,
    xpReward: 150,
  },
  {
    name: "Consistency King",
    description: "Show ultimate dedication with a 30-day coding streak.",
    icon: "Trophy",
    color: "#8b5cf6",
    triggerType: "streak",
    triggerValue: 30,
    xpReward: 500,
  },
  {
    name: "Recursion Knight",
    description: "Reach the 500 XP milestone and establish your coding skills.",
    icon: "Shield",
    color: "#10b981",
    triggerType: "xp_milestone",
    triggerValue: 500,
    xpReward: 100,
  },
  {
    name: "Dynamic Legend",
    description: "Reach the 1500 XP milestone. Dynamic Programming has nothing on you!",
    icon: "Star",
    color: "#3b82f6",
    triggerType: "xp_milestone",
    triggerValue: 1500,
    xpReward: 200,
  },
  {
    name: "Algorithm Lord",
    description: "Reach the 3000 XP milestone. You have mastered complex problem solving.",
    icon: "Crown",
    color: "#a855f7",
    triggerType: "xp_milestone",
    triggerValue: 3000,
    xpReward: 300,
  },
  {
    name: "Grandmaster",
    description: "Reach the 5000 XP milestone. Elite status in the interview prep arena.",
    icon: "Gem",
    color: "#eab308",
    triggerType: "xp_milestone",
    triggerValue: 5000,
    xpReward: 500,
  },
];

async function seedBadges() {
  try {
    if (!DB_URL) {
      throw new Error("DB_URL is not set in environment variables");
    }

    console.log("Connecting to database...");
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB.");

    console.log("Clearing existing auto-trigger badges...");
    // We only delete badges that are auto-triggered to avoid removing custom admin ones if any
    await Badge.deleteMany({ triggerType: { $in: ["streak", "xp_milestone"] } });

    for (const badgeData of defaultBadges) {
      await Badge.create(badgeData);
      console.log(`Seeded badge: ${badgeData.name}`);
    }

    console.log("Seeding badges completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding badges failed:", error);
    process.exit(1);
  }
}

seedBadges();
