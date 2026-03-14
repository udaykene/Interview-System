import Problem from "../models/Problem.js";

const normalizeSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const pickProblemFields = (body) => {
  const slug = normalizeSlug(body.slug || body.title);
  return {
    slug,
    title: body.title?.trim(),
    difficulty: body.difficulty,
    category: body.category || "",
    description: {
      text: body.description?.text || "",
      notes: Array.isArray(body.description?.notes) ? body.description.notes : [],
    },
    examples: Array.isArray(body.examples) ? body.examples : [],
    constraints: Array.isArray(body.constraints) ? body.constraints : [],
    starterCode: body.starterCode || {},
    expectedOutput: body.expectedOutput || {},
    tags: Array.isArray(body.tags) ? body.tags : [],
  };
};

export async function listProblems(req, res) {
  try {
    const { difficulty, search } = req.query;
    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
        { tags: new RegExp(search, "i") },
      ];
    }

    const problems = await Problem.find(query).sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (error) {
    console.error("Error in listProblems:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemBySlug(req, res) {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemBySlug:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createProblem(req, res) {
  try {
    const data = pickProblemFields(req.body);
    if (!data.slug || !data.title || !data.difficulty) {
      return res.status(400).json({ message: "slug/title/difficulty are required" });
    }
    const exists = await Problem.findOne({ slug: data.slug });
    if (exists) return res.status(409).json({ message: "Slug already exists" });

    const problem = await Problem.create(data);
    res.status(201).json({ problem });
  } catch (error) {
    console.error("Error in createProblem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProblem(req, res) {
  try {
    const { slug } = req.params;
    const data = pickProblemFields(req.body);
    delete data.slug;

    const updated = await Problem.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ problem: updated });
  } catch (error) {
    console.error("Error in updateProblem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProblem(req, res) {
  try {
    const { slug } = req.params;
    const deleted = await Problem.findOneAndDelete({ slug });
    if (!deleted) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error in deleteProblem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
