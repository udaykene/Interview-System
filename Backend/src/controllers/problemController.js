import Problem from "../models/Problem.js";

const normalizeSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const pickString = (value, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

const pickCodeMap = (value) => ({
  javascript: pickString(value?.javascript),
  python: pickString(value?.python),
  java: pickString(value?.java),
});

const pickExamples = (value) =>
  Array.isArray(value)
    ? value
        .map((example) => ({
          input: pickString(example?.input),
          output: pickString(example?.output),
          explanation: pickString(example?.explanation),
        }))
        .filter((example) => example.input || example.output || example.explanation)
    : [];

const pickTestCases = (value) =>
  Array.isArray(value)
    ? value
        .map((testCase) => ({
          input: pickString(testCase?.input),
          expectedOutput: pickString(testCase?.expectedOutput),
          isHidden: Boolean(testCase?.isHidden),
        }))
        .filter((testCase) => testCase.input && testCase.expectedOutput)
    : [];

const pickProblemFields = (body) => {
  const slug = normalizeSlug(body.slug || body.title);
  return {
    slug,
    title: pickString(body.title),
    difficulty: body.difficulty,
    category: pickString(body.category),
    description: {
      text: pickString(body.description?.text),
      notes: Array.isArray(body.description?.notes)
        ? body.description.notes.map((note) => pickString(note)).filter(Boolean)
        : [],
    },
    examples: pickExamples(body.examples),
    constraints: Array.isArray(body.constraints)
      ? body.constraints.map((constraint) => pickString(constraint)).filter(Boolean)
      : [],
    starterCode: pickCodeMap(body.starterCode),
    solutionCode: pickCodeMap(body.solutionCode),
    testCases: pickTestCases(body.testCases),
    functionName: pickString(body.functionName, "solution") || "solution",
    tags: Array.isArray(body.tags) ? body.tags.map((tag) => pickString(tag)).filter(Boolean) : [],
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

export async function bulkImportProblems(req, res) {
  try {
    const { problems, mode = "skip" } = req.body || {};

    if (!Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({ message: "problems must be a non-empty array" });
    }

    if (!["skip", "update"].includes(mode)) {
      return res.status(400).json({ message: "mode must be either 'skip' or 'update'" });
    }

    const results = [];

    for (const rawProblem of problems) {
      const data = pickProblemFields(rawProblem || {});

      if (!data.slug || !data.title || !data.difficulty) {
        results.push({
          slug: data.slug || null,
          title: data.title || null,
          status: "invalid",
          message: "slug/title/difficulty are required",
        });
        continue;
      }

      const existing = await Problem.findOne({ slug: data.slug });
      if (!existing) {
        const created = await Problem.create(data);
        results.push({
          slug: created.slug,
          title: created.title,
          status: "created",
        });
        continue;
      }

      if (mode === "skip") {
        results.push({
          slug: existing.slug,
          title: existing.title,
          status: "skipped",
          message: "Slug already exists",
        });
        continue;
      }

      const updated = await Problem.findOneAndUpdate(
        { slug: data.slug },
        { $set: data },
        { new: true },
      );

      results.push({
        slug: updated.slug,
        title: updated.title,
        status: "updated",
      });
    }

    const summary = results.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { created: 0, updated: 0, skipped: 0, invalid: 0 },
    );

    res.status(200).json({ summary, results });
  } catch (error) {
    console.error("Error in bulkImportProblems:", error);
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
