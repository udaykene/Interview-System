import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";

/**
 * GET /api/stats
 * Returns aggregated user stats: total solved by difficulty,
 * acceptance rate, and category breakdown.
 */
export async function getUserStats(req, res) {
  try {
    let userId = req.user._id;
    const { username } = req.query;

    if (username) {
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) return res.status(404).json({ message: "User not found" });
      userId = user._id;
    }

    // Get all accepted submission problem IDs (unique)
    const acceptedSubmissions = await Submission.aggregate([
      { $match: { userId, status: "Accepted" } },
      { $group: { _id: "$problemId" } },
    ]);

    const solvedProblemIds = acceptedSubmissions.map((s) => s._id);

    // Get the problems to classify by difficulty and category
    const solvedProblems = await Problem.find(
      { _id: { $in: solvedProblemIds } },
      "difficulty category tags"
    );

    const totalProblems = await Problem.countDocuments();
    const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
    const byCategory = {};

    for (const p of solvedProblems) {
      if (byDifficulty[p.difficulty] !== undefined) {
        byDifficulty[p.difficulty]++;
      }
      const cat = p.category || "Uncategorized";
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }

    // Acceptance rate
    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedCount = await Submission.countDocuments({ userId, status: "Accepted" });
    const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100 * 10) / 10 : 0;

    // Get total counts for each difficulty
    const [totalEasy, totalMedium, totalHard] = await Promise.all([
      Problem.countDocuments({ difficulty: "Easy" }),
      Problem.countDocuments({ difficulty: "Medium" }),
      Problem.countDocuments({ difficulty: "Hard" }),
    ]);

    res.status(200).json({
      totalSolved: solvedProblems.length,
      totalProblems,
      byDifficulty,
      totalByDifficulty: {
        Easy: totalEasy,
        Medium: totalMedium,
        Hard: totalHard,
      },
      byCategory,
      totalSubmissions,
      acceptanceRate,
    });
  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * GET /api/stats/activity
 * Returns daily submission counts for the past year for the GitHub-style heatmap.
 */
export async function getUserActivity(req, res) {
  try {
    let userId = req.user._id;
    const { username } = req.query;

    if (username) {
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) return res.status(404).json({ message: "User not found" });
      userId = user._id;
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const activity = await Submission.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Convert to a map: { "2026-01-15": 3, "2026-01-16": 1 }
    const activityMap = {};
    for (const day of activity) {
      activityMap[day._id] = day.count;
    }

    res.status(200).json({ activity: activityMap });
  } catch (error) {
    console.error("Error in getUserActivity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * GET /api/stats/history?page=1&limit=20
 * Returns paginated recent submissions (practice history).
 */
export async function getUserHistory(req, res) {
  try {
    let userId = req.user._id;
    const { username } = req.query;

    if (username) {
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) return res.status(404).json({ message: "User not found" });
      userId = user._id;
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      Submission.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("problemId", "title slug difficulty category tags"),
      Submission.countDocuments({ userId }),
    ]);

    res.status(200).json({
      submissions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in getUserHistory:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
