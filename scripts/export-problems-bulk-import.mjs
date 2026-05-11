import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";

import Problem from "../Backend/src/models/Problem.js";
import { ENV } from "../Backend/src/lib/env.js";

const DEFAULT_OUTPUT = path.resolve("scripts/problem-bulk-import.json");
const require = createRequire(new URL("../Backend/package.json", import.meta.url));
const mongoose = require("mongoose");

function toSerializableProblem(problem) {
  return {
    title: problem.title || "",
    slug: problem.slug || "",
    difficulty: problem.difficulty || "Easy",
    category: problem.category || "",
    description: {
      text: problem.description?.text || "",
      notes: Array.isArray(problem.description?.notes) ? problem.description.notes : [],
    },
    examples: Array.isArray(problem.examples)
      ? problem.examples.map((example) => ({
          input: example?.input || "",
          output: example?.output || "",
          explanation: example?.explanation || "",
        }))
      : [],
    constraints: Array.isArray(problem.constraints) ? problem.constraints : [],
    starterCode: {
      javascript: problem.starterCode?.javascript || "",
      python: problem.starterCode?.python || "",
      java: problem.starterCode?.java || "",
    },
    solutionCode: {
      javascript: problem.solutionCode?.javascript || "",
      python: problem.solutionCode?.python || "",
      java: problem.solutionCode?.java || "",
    },
    functionName: problem.functionName || "solution",
    tags: Array.isArray(problem.tags) ? problem.tags : [],
    testCases: Array.isArray(problem.testCases)
      ? problem.testCases.map((testCase) => ({
          input: testCase?.input || "",
          expectedOutput: testCase?.expectedOutput || "",
          isHidden: Boolean(testCase?.isHidden),
        }))
      : [],
  };
}

async function main() {
  const outputPath = path.resolve(process.argv[2] || DEFAULT_OUTPUT);

  if (!ENV.DB_URL) {
    throw new Error("DB_URL is missing. Set it in Backend/.env before running this script.");
  }

  await mongoose.connect(ENV.DB_URL);

  try {
    const problems = await Problem.find({})
      .sort({ slug: 1 })
      .lean();

    const exportPayload = problems.map(toSerializableProblem);
    await fs.writeFile(outputPath, `${JSON.stringify(exportPayload, null, 2)}\n`, "utf8");

    console.log(`Exported ${exportPayload.length} problems to ${outputPath}`);
    console.log("Edit the testCases arrays, then bulk import with mode=update from the admin page.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Failed to export problems:", error.message);
  process.exit(1);
});
