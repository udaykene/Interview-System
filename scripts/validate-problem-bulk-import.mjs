import fs from "fs/promises";
import path from "path";

const DEFAULT_INPUT = path.resolve("scripts/problem-bulk-import.json");

function countVisible(testCases) {
  return testCases.filter((testCase) => !testCase?.isHidden).length;
}

function countHidden(testCases) {
  return testCases.filter((testCase) => Boolean(testCase?.isHidden)).length;
}

async function main() {
  const inputPath = path.resolve(process.argv[2] || DEFAULT_INPUT);
  const raw = await fs.readFile(inputPath, "utf8");
  const problems = JSON.parse(raw);

  if (!Array.isArray(problems)) {
    throw new Error("Bulk import file must contain a JSON array.");
  }

  const issues = [];

  for (const problem of problems) {
    const testCases = Array.isArray(problem?.testCases) ? problem.testCases : [];
    const visibleCount = countVisible(testCases);
    const hiddenCount = countHidden(testCases);
    const totalCount = testCases.length;

    if (totalCount < 12 || totalCount > 14) {
      issues.push(`${problem?.slug || problem?.title || "unknown"}: total test cases = ${totalCount} (expected 12-14)`);
    }

    if (visibleCount < 2 || visibleCount > 4) {
      issues.push(`${problem?.slug || problem?.title || "unknown"}: visible test cases = ${visibleCount} (recommended 2-4)`);
    }

    const invalidCaseIndex = testCases.findIndex(
      (testCase) =>
        !String(testCase?.input || "").trim() ||
        !String(testCase?.expectedOutput || "").trim()
    );

    if (invalidCaseIndex !== -1) {
      issues.push(
        `${problem?.slug || problem?.title || "unknown"}: test case ${invalidCaseIndex + 1} is missing input or expectedOutput`
      );
    }
  }

  if (issues.length > 0) {
    console.error("Validation failed:");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(`Validation passed for ${problems.length} problems in ${inputPath}`);
}

main().catch((error) => {
  console.error("Failed to validate bulk import file:", error.message);
  process.exit(1);
});
