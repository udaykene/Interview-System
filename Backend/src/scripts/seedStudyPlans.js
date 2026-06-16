import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import StudyPlan from "../models/StudyPlan.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";

const DB_URL = process.env.DB_URL;

const plansData = [
  {
    title: "LeetCode 75",
    description: "Ace Coding Interviews with 75 Essential Questions.",
    color: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    icon: "BookOpen",
    isOfficial: true,
    sections: [
      {
        title: "Arrays & Strings",
        problemSlugs: ["two-sum", "product-of-array-except-self", "longest-common-prefix"],
      },
      {
        title: "Two Pointers",
        problemSlugs: ["3sum", "move-zeroes", "remove-duplicates-from-sorted-array"],
      },
      {
        title: "Sliding Window",
        problemSlugs: ["longest-substring-without-repeating", "maximum-average-subarray-i"],
      },
    ],
  },
  {
    title: "Top Interview 150",
    description: "Must-do study plan for major tech company prep.",
    color: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    icon: "Award",
    isOfficial: true,
    sections: [
      {
        title: "Arrays",
        problemSlugs: ["best-time-to-buy-and-sell-stock", "majority-element", "contains-duplicate"],
      },
      {
        title: "Two Pointers & Sliding Window",
        problemSlugs: ["squares-of-a-sorted-array", "minimum-size-subarray-sum"],
      },
      {
        title: "Math & Bit Manipulation",
        problemSlugs: ["palindrome-number", "roman-to-integer", "happy-number", "single-number"],
      },
    ],
  },
  {
    title: "Binary Search Patterns",
    description: "Master binary search patterns in 3 core steps.",
    color: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    icon: "Code",
    isOfficial: true,
    sections: [
      {
        title: "Warmup",
        problemSlugs: ["binary-search", "search-insert-position"],
      },
      {
        title: "Advanced BS",
        problemSlugs: ["find-minimum-in-rotated-sorted-array"],
      },
    ],
  },
  {
    title: "SQL 50 Prep",
    description: "Crack relational database interviews in 50 Qs.",
    color: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    icon: "Database",
    isOfficial: true,
    sections: [
      {
        title: "Basic Queries & Selects",
        problemSlugs: ["two-sum"], // placeholder or fallback
      },
    ],
  },
];

async function seed() {
  try {
    if (!DB_URL) {
      throw new Error("DB_URL is not set in environment variables");
    }

    console.log("Connecting to database...");
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB.");

    // Find or create a user to act as creator
    let creator = await User.findOne({ role: "admin" });
    if (!creator) {
      creator = await User.findOne();
    }
    if (!creator) {
      // Create a dummy admin/system user
      creator = await User.create({
        name: "System Admin",
        email: "admin@system.com",
        username: "system_admin",
        provider: "local",
        role: "admin",
      });
      console.log("Created System Admin user.");
    }

    console.log("Clearing existing official study plans...");
    await StudyPlan.deleteMany({ isOfficial: true });

    for (const plan of plansData) {
      const slug = plan.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const sections = [];

      for (const sec of plan.sections) {
        const problems = await Problem.find({ slug: { $in: sec.problemSlugs } });
        sections.push({
          title: sec.title,
          problems: problems.map((p) => p._id),
        });
      }

      await StudyPlan.create({
        title: plan.title,
        description: plan.description,
        color: plan.color,
        icon: plan.icon,
        isOfficial: plan.isOfficial,
        creator: creator._id,
        slug,
        sections,
      });

      console.log(`Seeded plan: ${plan.title} (slug: ${slug})`);
    }

    console.log("Seeding study plans completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
