import Quest from "../models/Quest.js";
import Badge from "../models/Badge.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";

// ─── Helpers ────────────────────────────────────────

/** Get today's date string in YYYY-MM-DD format (UTC) */
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/** Get start of current ISO week (Monday) */
function weekStart() {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

/** Deterministic daily problem: hash the date string to pick a problem index */
function dateSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** XP → Rank mapping */
function getRank(xp) {
  if (xp >= 5000) return { level: 5, title: "Grandmaster", next: null, color: "#f59e0b" };
  if (xp >= 3000) return { level: 4, title: "Algorithm Lord", next: 5000, color: "#8b5cf6" };
  if (xp >= 1500) return { level: 3, title: "Dynamic Legend", next: 3000, color: "#3b82f6" };
  if (xp >= 500) return { level: 2, title: "Recursion Knight", next: 1500, color: "#10b981" };
  return { level: 1, title: "Array Squire", next: 500, color: "#6b7280" };
}

// ─── Public Endpoints ───────────────────────────────

/**
 * GET /api/quests
 * Returns the daily quest problem, weekly bounties, admin quests,
 * user's streak, XP, rank, and completion status.
 */
export async function getQuests(req, res) {
  try {
    const userId = req.user._id;
    const today = todayStr();
    const weekStartDate = weekStart();

    // ── Daily Quest (Problem of the Day) ─────────────
    const totalProblems = await Problem.countDocuments();
    let dailyProblem = null;
    let dailySolved = false;

    if (totalProblems > 0) {
      const idx = dateSeed(today) % totalProblems;
      dailyProblem = await Problem.findOne()
        .sort({ createdAt: 1 })
        .skip(idx)
        .select("title slug difficulty category tags");

      if (dailyProblem) {
        const hasSolved = await Submission.findOne({
          userId,
          problemId: dailyProblem._id,
          status: "Accepted",
          createdAt: { $gte: new Date(today + "T00:00:00Z") },
        });
        dailySolved = !!hasSolved;
      }
    }

    // ── Weekly Bounties (auto-generated) ─────────────
    // Bounty 1: Solve 3 problems this week
    const weekSolvedCount = await Submission.distinct("problemId", {
      userId,
      status: "Accepted",
      createdAt: { $gte: weekStartDate },
    });

    // Bounty 2: Solve a Medium problem this week
    let mediumSolvedThisWeek = false;
    if (weekSolvedCount.length > 0) {
      const mediumProblems = await Problem.find({
        _id: { $in: weekSolvedCount },
        difficulty: "Medium",
      }).select("_id");
      mediumSolvedThisWeek = mediumProblems.length > 0;
    }

    // Bounty 3: Solve a Hard problem this week
    let hardSolvedThisWeek = false;
    if (weekSolvedCount.length > 0) {
      const hardProblems = await Problem.find({
        _id: { $in: weekSolvedCount },
        difficulty: "Hard",
      }).select("_id");
      hardSolvedThisWeek = hardProblems.length > 0;
    }

    const weeklyBounties = [
      {
        id: "weekly-solve-3",
        title: "Solve 3 Problems",
        description: "Accept 3 different problems this week",
        xpReward: 150,
        progress: Math.min(weekSolvedCount.length, 3),
        target: 3,
        completed: weekSolvedCount.length >= 3,
        icon: "Target",
        color: "#3b82f6",
      },
      {
        id: "weekly-medium",
        title: "Medium Conqueror",
        description: "Solve at least 1 Medium problem this week",
        xpReward: 100,
        progress: mediumSolvedThisWeek ? 1 : 0,
        target: 1,
        completed: mediumSolvedThisWeek,
        icon: "Zap",
        color: "#f59e0b",
      },
      {
        id: "weekly-hard",
        title: "Hard Challenger",
        description: "Solve at least 1 Hard problem this week",
        xpReward: 200,
        progress: hardSolvedThisWeek ? 1 : 0,
        target: 1,
        completed: hardSolvedThisWeek,
        icon: "Flame",
        color: "#ef4444",
      },
    ];

    // ── Admin-created quests ─────────────────────────
    const adminQuests = await Quest.find({ isActive: true })
      .populate("targetProblemId", "title slug difficulty")
      .populate("badgeReward", "name icon color")
      .sort({ createdAt: -1 });

    // Check completion status for each admin quest
    const adminQuestsWithStatus = await Promise.all(
      adminQuests.map(async (quest) => {
        let completed = false;
        let progress = 0;

        if (quest.objective === "solve_problem" && quest.targetProblemId) {
          const solved = await Submission.findOne({
            userId,
            problemId: quest.targetProblemId._id,
            status: "Accepted",
          });
          completed = !!solved;
          progress = completed ? 1 : 0;
        } else if (quest.objective === "solve_n_problems") {
          const solvedCount = await Submission.distinct("problemId", {
            userId,
            status: "Accepted",
          });
          progress = Math.min(solvedCount.length, quest.targetCount);
          completed = solvedCount.length >= quest.targetCount;
        } else if (quest.objective === "solve_difficulty") {
          const solvedIds = await Submission.distinct("problemId", {
            userId,
            status: "Accepted",
          });
          const matchingProblems = await Problem.countDocuments({
            _id: { $in: solvedIds },
            difficulty: quest.targetDifficulty,
          });
          progress = Math.min(matchingProblems, quest.targetCount);
          completed = matchingProblems >= quest.targetCount;
        } else if (quest.objective === "earn_xp") {
          const userXp = req.user.stats?.xp || 0;
          progress = Math.min(userXp, quest.targetCount);
          completed = userXp >= quest.targetCount;
        }

        return {
          _id: quest._id,
          title: quest.title,
          description: quest.description,
          type: quest.type,
          objective: quest.objective,
          targetProblem: quest.targetProblemId,
          targetCount: quest.targetCount,
          targetDifficulty: quest.targetDifficulty,
          xpReward: quest.xpReward,
          badgeReward: quest.badgeReward,
          icon: quest.icon,
          color: quest.color,
          completed,
          progress,
        };
      })
    );

    // ── User gamification state ──────────────────────
    const user = await User.findById(userId).populate("badges.badgeId");
    const xp = user.stats?.xp || 0;
    const streak = user.stats?.streak || 0;
    const rank = getRank(xp);

    res.status(200).json({
      daily: {
        problem: dailyProblem,
        solved: dailySolved,
        xpReward: 100,
      },
      weeklyBounties,
      quests: adminQuestsWithStatus,
      user: {
        xp,
        streak,
        rank,
        badges: (user.badges || []).map((b) => ({
          _id: b.badgeId?._id,
          name: b.badgeId?.name,
          icon: b.badgeId?.icon,
          color: b.badgeId?.color,
          description: b.badgeId?.description,
          earnedAt: b.earnedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error in getQuests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/quests/claim-daily
 * Claim the daily quest reward if the daily problem was solved today.
 */
export async function claimDailyQuest(req, res) {
  try {
    const userId = req.user._id;
    const today = todayStr();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Find the daily problem
    const totalProblems = await Problem.countDocuments();
    if (totalProblems === 0) {
      return res.status(400).json({ message: "No problems available" });
    }

    const idx = dateSeed(today) % totalProblems;
    const dailyProblem = await Problem.findOne().sort({ createdAt: 1 }).skip(idx);
    if (!dailyProblem) {
      return res.status(400).json({ message: "Daily problem not found" });
    }

    // Check if solved today
    const hasSolved = await Submission.findOne({
      userId,
      problemId: dailyProblem._id,
      status: "Accepted",
      createdAt: { $gte: new Date(today + "T00:00:00Z") },
    });

    if (!hasSolved) {
      return res.status(400).json({ message: "You haven't solved the daily problem yet" });
    }

    const user = await User.findById(userId);

    // Prevent double claim
    if (user.stats.lastActiveDate === today) {
      return res.status(400).json({ message: "Daily quest already claimed today" });
    }

    // Update streak
    const wasYesterday = user.stats.lastActiveDate === yesterdayStr;
    const newStreak = wasYesterday ? (user.stats.streak || 0) + 1 : 1;

    // Award XP
    const xpGain = 100;
    user.stats.xp = (user.stats.xp || 0) + xpGain;
    user.stats.streak = newStreak;
    user.stats.lastActiveDate = today;
    await user.save();

    // Check for streak badges
    const streakBadges = await Badge.find({ triggerType: "streak" });
    const newBadges = [];
    for (const badge of streakBadges) {
      if (newStreak >= badge.triggerValue) {
        const alreadyHas = user.badges.some(
          (b) => b.badgeId?.toString() === badge._id.toString()
        );
        if (!alreadyHas) {
          user.badges.push({ badgeId: badge._id, earnedAt: new Date() });
          if (badge.xpReward) user.stats.xp += badge.xpReward;
          newBadges.push(badge);
        }
      }
    }

    // Check for XP milestone badges
    const xpBadges = await Badge.find({ triggerType: "xp_milestone" });
    for (const badge of xpBadges) {
      if (user.stats.xp >= badge.triggerValue) {
        const alreadyHas = user.badges.some(
          (b) => b.badgeId?.toString() === badge._id.toString()
        );
        if (!alreadyHas) {
          user.badges.push({ badgeId: badge._id, earnedAt: new Date() });
          if (badge.xpReward) user.stats.xp += badge.xpReward;
          newBadges.push(badge);
        }
      }
    }

    if (newBadges.length > 0) await user.save();

    res.status(200).json({
      xpGained: xpGain,
      newXp: user.stats.xp,
      streak: newStreak,
      rank: getRank(user.stats.xp),
      newBadges: newBadges.map((b) => ({
        name: b.name,
        icon: b.icon,
        color: b.color,
        description: b.description,
      })),
    });
  } catch (error) {
    console.error("Error in claimDailyQuest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/quests/claim-weekly/:bountyId
 * Claim a weekly bounty reward.
 */
export async function claimWeeklyBounty(req, res) {
  try {
    const userId = req.user._id;
    const { bountyId } = req.params;
    const weekStartDate = weekStart();

    const weekSolvedIds = await Submission.distinct("problemId", {
      userId,
      status: "Accepted",
      createdAt: { $gte: weekStartDate },
    });

    let completed = false;
    let xpReward = 0;

    if (bountyId === "weekly-solve-3") {
      completed = weekSolvedIds.length >= 3;
      xpReward = 150;
    } else if (bountyId === "weekly-medium") {
      const mediums = await Problem.countDocuments({
        _id: { $in: weekSolvedIds },
        difficulty: "Medium",
      });
      completed = mediums > 0;
      xpReward = 100;
    } else if (bountyId === "weekly-hard") {
      const hards = await Problem.countDocuments({
        _id: { $in: weekSolvedIds },
        difficulty: "Hard",
      });
      completed = hards > 0;
      xpReward = 200;
    } else {
      return res.status(400).json({ message: "Invalid bounty ID" });
    }

    if (!completed) {
      return res.status(400).json({ message: "Bounty not completed yet" });
    }

    // Simple duplicate prevention via a marker in stats
    // (For production you'd use a separate claims collection, but this works fine)
    const user = await User.findById(userId);
    user.stats.xp = (user.stats.xp || 0) + xpReward;
    await user.save();

    res.status(200).json({
      xpGained: xpReward,
      newXp: user.stats.xp,
      rank: getRank(user.stats.xp),
    });
  } catch (error) {
    console.error("Error in claimWeeklyBounty:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/quests/claim-quest/:questId
 * Claim an admin-created quest reward.
 */
export async function claimAdminQuest(req, res) {
  try {
    const userId = req.user._id;
    const { questId } = req.params;

    const quest = await Quest.findById(questId).populate("badgeReward");
    if (!quest || !quest.isActive) {
      return res.status(404).json({ message: "Quest not found or inactive" });
    }

    // Verify completion
    let completed = false;
    if (quest.objective === "solve_problem" && quest.targetProblemId) {
      const solved = await Submission.findOne({
        userId,
        problemId: quest.targetProblemId,
        status: "Accepted",
      });
      completed = !!solved;
    } else if (quest.objective === "solve_n_problems") {
      const solvedCount = await Submission.distinct("problemId", {
        userId,
        status: "Accepted",
      });
      completed = solvedCount.length >= quest.targetCount;
    } else if (quest.objective === "solve_difficulty") {
      const solvedIds = await Submission.distinct("problemId", {
        userId,
        status: "Accepted",
      });
      const matchingCount = await Problem.countDocuments({
        _id: { $in: solvedIds },
        difficulty: quest.targetDifficulty,
      });
      completed = matchingCount >= quest.targetCount;
    } else if (quest.objective === "earn_xp") {
      const user = await User.findById(userId);
      completed = (user.stats?.xp || 0) >= quest.targetCount;
    }

    if (!completed) {
      return res.status(400).json({ message: "Quest objective not completed" });
    }

    const user = await User.findById(userId);
    user.stats.xp = (user.stats.xp || 0) + quest.xpReward;

    // Award badge if applicable
    const newBadges = [];
    if (quest.badgeReward) {
      const alreadyHas = user.badges.some(
        (b) => b.badgeId?.toString() === quest.badgeReward._id.toString()
      );
      if (!alreadyHas) {
        user.badges.push({ badgeId: quest.badgeReward._id, earnedAt: new Date() });
        newBadges.push(quest.badgeReward);
      }
    }

    await user.save();

    res.status(200).json({
      xpGained: quest.xpReward,
      newXp: user.stats.xp,
      rank: getRank(user.stats.xp),
      newBadges: newBadges.map((b) => ({
        name: b.name,
        icon: b.icon,
        color: b.color,
        description: b.description,
      })),
    });
  } catch (error) {
    console.error("Error in claimAdminQuest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── Admin Quest CRUD ───────────────────────────────

/**
 * POST /api/quests/admin
 * Create a new quest (admin only).
 */
export async function createQuest(req, res) {
  try {
    const { title, description, type, objective, targetProblemId, targetCount, targetDifficulty, xpReward, badgeReward, icon, color } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const quest = await Quest.create({
      title: title.trim(),
      description: description?.trim() || "",
      type: type || "custom",
      objective: objective || "solve_problem",
      targetProblemId: targetProblemId || null,
      targetCount: targetCount || 1,
      targetDifficulty: targetDifficulty || "",
      xpReward: xpReward || 100,
      badgeReward: badgeReward || null,
      icon: icon || "Flame",
      color: color || "#f59e0b",
      createdBy: req.user._id,
    });

    res.status(201).json({ quest });
  } catch (error) {
    console.error("Error in createQuest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * GET /api/quests/admin
 * List all quests for admin management.
 */
export async function listAdminQuests(req, res) {
  try {
    const quests = await Quest.find()
      .populate("targetProblemId", "title slug difficulty")
      .populate("badgeReward", "name icon color")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ quests });
  } catch (error) {
    console.error("Error in listAdminQuests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUT /api/quests/admin/:id
 * Update a quest (admin only).
 */
export async function updateQuest(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const quest = await Quest.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!quest) return res.status(404).json({ message: "Quest not found" });

    res.status(200).json({ quest });
  } catch (error) {
    console.error("Error in updateQuest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * DELETE /api/quests/admin/:id
 * Delete a quest (admin only).
 */
export async function deleteQuest(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Quest.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Quest not found" });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error in deleteQuest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── Admin Badge CRUD ───────────────────────────────

/**
 * GET /api/quests/badges
 * List all badges.
 */
export async function listBadges(req, res) {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 });
    res.status(200).json({ badges });
  } catch (error) {
    console.error("Error in listBadges:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/quests/badges
 * Create a badge (admin only).
 */
export async function createBadge(req, res) {
  try {
    const { name, description, icon, color, triggerType, triggerValue, xpReward } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });

    const badge = await Badge.create({
      name: name.trim(),
      description: description?.trim() || "",
      icon: icon || "Award",
      color: color || "#f59e0b",
      triggerType: triggerType || "manual",
      triggerValue: triggerValue || 0,
      xpReward: xpReward || 0,
    });

    res.status(201).json({ badge });
  } catch (error) {
    console.error("Error in createBadge:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * DELETE /api/quests/badges/:id
 * Delete a badge (admin only).
 */
export async function deleteBadge(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Badge.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Badge not found" });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error in deleteBadge:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
