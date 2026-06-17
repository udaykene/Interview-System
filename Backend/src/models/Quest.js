import mongoose from "mongoose";

const QuestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    // "daily" | "weekly" | "custom"
    type: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "custom",
    },
    // What must be done: "solve_problem", "solve_n_problems", "solve_difficulty", "earn_xp"
    objective: {
      type: String,
      enum: ["solve_problem", "solve_n_problems", "solve_difficulty", "earn_xp"],
      default: "solve_problem",
    },
    // For "solve_problem": specific problem ID. For others: count/difficulty target
    targetProblemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      default: null,
    },
    targetCount: {
      type: Number,
      default: 1,
    },
    targetDifficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", ""],
      default: "",
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    // Optional badge reward
    badgeReward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      default: null,
    },
    // Is this quest currently active?
    isActive: {
      type: Boolean,
      default: true,
    },
    // Created by admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
      default: "Flame",
    },
    color: {
      type: String,
      default: "#f59e0b",
    },
  },
  { timestamps: true }
);

const Quest = mongoose.model("Quest", QuestSchema);

export default Quest;
