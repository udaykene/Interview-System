import StudyPlan from "../models/StudyPlan.js";
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";

const normalizeSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

async function generateUniqueSlug(title) {
  let baseSlug = normalizeSlug(title) || "study-plan";
  let slug = baseSlug;
  let count = 1;
  while (await StudyPlan.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  return slug;
}

/**
 * GET /api/study-plans
 * Retrieve all study plans (grouped by official/featured vs user-defined)
 */
export async function listStudyPlans(req, res) {
  try {
    const plans = await StudyPlan.find({
      $or: [{ isOfficial: true }, { creator: req.user?._id }],
    }).populate("sections.problems", "title slug difficulty category tags acceptanceRate");

    // Get solved problems for the current user to compute progress
    let solvedProblemIds = [];
    if (req.user) {
      solvedProblemIds = await Submission.find({
        userId: req.user._id,
        status: "Accepted",
      }).distinct("problemId");
    }
    const solvedSet = new Set(solvedProblemIds.map((id) => id.toString()));

    const plansWithProgress = plans.map((plan) => {
      let totalCount = 0;
      let solvedCount = 0;

      const sectionsWithProgress = plan.sections.map((section) => {
        const sectionProblems = section.problems || [];
        const sectionSolved = sectionProblems.filter((p) => solvedSet.has(p._id.toString()));
        totalCount += sectionProblems.length;
        solvedCount += sectionSolved.length;

        return {
          _id: section._id,
          title: section.title,
          problems: sectionProblems.map((p) => ({
            _id: p._id,
            title: p.title,
            slug: p.slug,
            difficulty: p.difficulty,
            category: p.category,
            tags: p.tags,
            acceptanceRate: p.acceptanceRate,
            isSolved: solvedSet.has(p._id.toString()),
          })),
        };
      });

      return {
        _id: plan._id,
        title: plan.title,
        description: plan.description,
        creator: plan.creator,
        isOfficial: plan.isOfficial,
        color: plan.color,
        icon: plan.icon,
        slug: plan.slug,
        sections: sectionsWithProgress,
        progress: {
          solvedCount,
          totalCount,
          percentage: totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0,
        },
      };
    });

    const official = plansWithProgress.filter((p) => p.isOfficial);
    const custom = plansWithProgress.filter((p) => !p.isOfficial);

    res.status(200).json({ official, custom });
  } catch (error) {
    console.error("Error in listStudyPlans:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * GET /api/study-plans/:slug
 * Retrieve details of a specific study plan and check progress
 */
export async function getStudyPlanBySlug(req, res) {
  try {
    const { slug } = req.params;
    const plan = await StudyPlan.findOne({
      slug,
      $or: [{ isOfficial: true }, { creator: req.user?._id }],
    }).populate("sections.problems", "title slug difficulty category tags starterCode functionName");

    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    let solvedProblemIds = [];
    if (req.user) {
      solvedProblemIds = await Submission.find({
        userId: req.user._id,
        status: "Accepted",
      }).distinct("problemId");
    }
    const solvedSet = new Set(solvedProblemIds.map((id) => id.toString()));

    let totalCount = 0;
    let solvedCount = 0;

    const sectionsWithProgress = plan.sections.map((section) => {
      const sectionProblems = section.problems || [];
      const sectionSolved = sectionProblems.filter((p) => solvedSet.has(p._id.toString()));
      totalCount += sectionProblems.length;
      solvedCount += sectionSolved.length;

      return {
        _id: section._id,
        title: section.title,
        problems: sectionProblems.map((p) => ({
          _id: p._id,
          title: p.title,
          slug: p.slug,
          difficulty: p.difficulty,
          category: p.category,
          tags: p.tags,
          isSolved: solvedSet.has(p._id.toString()),
        })),
      };
    });

    const planData = {
      _id: plan._id,
      title: plan.title,
      description: plan.description,
      creator: plan.creator,
      isOfficial: plan.isOfficial,
      color: plan.color,
      icon: plan.icon,
      slug: plan.slug,
      sections: sectionsWithProgress,
      progress: {
        solvedCount,
        totalCount,
        percentage: totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0,
      },
    };

    res.status(200).json({ studyPlan: planData });
  } catch (error) {
    console.error("Error in getStudyPlanBySlug:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/study-plans
 * Create a new study plan
 */
export async function createStudyPlan(req, res) {
  try {
    const { title, description, color, icon, sections, problems } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const isOfficial = req.user.role === "admin" ? Boolean(req.body.isOfficial) : false;
    const slug = await generateUniqueSlug(title);

    let finalSections = [];
    if (sections && Array.isArray(sections)) {
      finalSections = sections.map((sec) => ({
        title: sec.title || "Section",
        problems: sec.problems || [],
      }));
    } else if (problems && Array.isArray(problems)) {
      finalSections = [
        {
          title: "All Problems",
          problems: problems,
        },
      ];
    }

    const plan = await StudyPlan.create({
      title: title.trim(),
      description: description?.trim() || "",
      color: color || "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      icon: icon || "BookOpen",
      isOfficial,
      creator: req.user._id,
      slug,
      sections: finalSections,
    });

    res.status(201).json({ studyPlan: plan });
  } catch (error) {
    console.error("Error in createStudyPlan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUT /api/study-plans/:id
 * Update a study plan
 */
export async function updateStudyPlan(req, res) {
  try {
    const { id } = req.params;
    const { title, description, color, icon, sections, problems } = req.body;

    const plan = await StudyPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    // Only the creator or an admin can update
    if (plan.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (title && title.trim() !== plan.title) {
      plan.title = title.trim();
      plan.slug = await generateUniqueSlug(title);
    }

    if (description !== undefined) {
      plan.description = description.trim();
    }

    if (color !== undefined) {
      plan.color = color;
    }

    if (icon !== undefined) {
      plan.icon = icon;
    }

    if (sections && Array.isArray(sections)) {
      plan.sections = sections.map((sec) => ({
        title: sec.title || "Section",
        problems: sec.problems || [],
      }));
    } else if (problems && Array.isArray(problems)) {
      plan.sections = [
        {
          title: "All Problems",
          problems: problems,
        },
      ];
    }

    if (req.user.role === "admin" && req.body.isOfficial !== undefined) {
      plan.isOfficial = Boolean(req.body.isOfficial);
    }

    await plan.save();
    res.status(200).json({ studyPlan: plan });
  } catch (error) {
    console.error("Error in updateStudyPlan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * DELETE /api/study-plans/:id
 * Delete a study plan
 */
export async function deleteStudyPlan(req, res) {
  try {
    const { id } = req.params;
    const plan = await StudyPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    // Only the creator or an admin can delete
    if (plan.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await StudyPlan.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error in deleteStudyPlan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
