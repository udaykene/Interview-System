import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "Award",
    },
    color: {
      type: String,
      default: "#f59e0b",
    },
    // "quest_complete" | "streak" | "xp_milestone" | "manual"
    triggerType: {
      type: String,
      enum: ["quest_complete", "streak", "xp_milestone", "manual"],
      default: "manual",
    },
    // The value that triggers the badge (e.g., streak of 7, xp of 1000)
    triggerValue: {
      type: Number,
      default: 0,
    },
    xpReward: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Badge = mongoose.model("Badge", BadgeSchema);

export default Badge;
