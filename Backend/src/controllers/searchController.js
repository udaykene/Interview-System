import Problem from "../models/Problem.js";
import User from "../models/User.js";

export async function globalSearch(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ problems: [], users: [] });
    }

    const regex = new RegExp(q, "i");

    const problems = await Problem.find({
      $or: [
        { title: regex },
        { tags: regex },
        { category: regex }
      ]
    })
    .select("title slug difficulty category tags acceptanceRate")
    .limit(10);

    const usersRaw = await User.find({
      $or: [
        { name: regex },
        { username: regex }
      ]
    })
    .select("name username profileImage stats bio followers")
    .limit(10);

    const users = usersRaw.map(u => ({
      _id: u._id,
      name: u.name,
      username: u.username,
      profileImage: u.profileImage,
      stats: u.stats,
      bio: u.bio,
      isFollowing: req.user ? u.followers.includes(req.user._id) : false
    }));

    res.status(200).json({ problems, users });
  } catch (error) {
    console.error("Error in globalSearch:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
