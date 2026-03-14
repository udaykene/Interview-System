import Problem from "../models/Problem.js";

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

// Wrapper templates for running test cases
const buildTestRunner = (language, functionCode, testCases) => {
  if (language === "javascript") {
    const testsCode = testCases.map((tc, i) => {
      return `
try {
  const __result${i} = JSON.stringify(${tc.functionCall});
  const __expected${i} = JSON.stringify(${tc.expectedOutput});
  if (__result${i} === __expected${i}) {
    console.log("TEST_${i}:PASS:" + __result${i});
  } else {
    console.log("TEST_${i}:FAIL:" + __result${i} + ":EXPECTED:" + __expected${i});
  }
} catch(e) {
  console.log("TEST_${i}:ERROR:" + e.message);
}`;
    }).join("\n");
    return `${functionCode}\n${testsCode}`;
  }

  if (language === "python") {
    const testsCode = testCases.map((tc, i) => {
      return `
try:
    __result_${i} = ${tc.functionCall}
    __expected_${i} = ${tc.expectedOutput}
    if __result_${i} == __expected_${i}:
        print(f"TEST_${i}:PASS:{__result_${i}}")
    else:
        print(f"TEST_${i}:FAIL:{__result_${i}}:EXPECTED:{__expected_${i}}")
except Exception as e:
    print(f"TEST_${i}:ERROR:{e}")`;
    }).join("\n");
    return `${functionCode}\n${testsCode}`;
  }

  // Java - just run straight (complex to inject)
  return functionCode;
};

async function executePiston(language, code, stdin = "") {
  const lang = LANGUAGE_MAP[language];
  if (!lang) throw new Error(`Unsupported language: ${language}`);

  const filename = language === "java" ? "Main.java" : `solution.${language === "javascript" ? "js" : language === "python" ? "py" : "java"}`;

  const response = await fetch(`${PISTON_API}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: lang.language,
      version: lang.version,
      files: [{ name: filename, content: code }],
      stdin: stdin,
    }),
  });

  if (!response.ok) throw new Error("Piston API error");
  return response.json();
}

// ─────────────────────────────────────────────
// Run Code (no test cases, just execute)
// ─────────────────────────────────────────────
export async function runCode(req, res) {
  const { language, code, stdin } = req.body;
  if (!language || !code) return res.status(400).json({ message: "language and code are required" });

  try {
    const result = await executePiston(language, code, stdin || "");
    const run = result.run;
    res.status(200).json({
      stdout: run.stdout || "",
      stderr: run.stderr || "",
      exitCode: run.code,
    });
  } catch (error) {
    console.error("Error in runCode:", error.message);
    res.status(500).json({ message: "Code execution failed: " + error.message });
  }
}

// ─────────────────────────────────────────────
// Submit Code (run against test cases)
// ─────────────────────────────────────────────
export async function submitCode(req, res) {
  const { language, code, problemSlug } = req.body;
  if (!language || !code || !problemSlug)
    return res.status(400).json({ message: "language, code and problemSlug are required" });

  try {
    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const testCases = problem.testCases || [];
    if (testCases.length === 0) {
      // No test cases – just run as normal
      const result = await executePiston(language, code);
      return res.status(200).json({
        status: "no_tests",
        results: [],
        stdout: result.run.stdout,
        message: "Code ran successfully (no test cases configured)",
      });
    }

    // Build function calls for each test case
    const testInputs = testCases.map((tc) => ({
      functionCall: tc.input,
      expectedOutput: tc.expectedOutput,
    }));

    const testRunner = buildTestRunner(language, code, testInputs);
    const result = await executePiston(language, testRunner);
    const rawOutput = result.run.stdout || "";
    const rawError = result.run.stderr || "";

    // Parse test results
    const lines = rawOutput.split("\n");
    const testResults = testCases.map((tc, i) => {
      const line = lines.find((l) => l.startsWith(`TEST_${i}:`));
      if (!line) return { index: i, status: "error", actual: "", expected: tc.expectedOutput, isHidden: tc.isHidden };

      const parts = line.split(":");
      const status = parts[1];
      const actual = parts[2] || "";
      return {
        index: i,
        status: status === "PASS" ? "pass" : status === "FAIL" ? "fail" : "error",
        actual,
        expected: tc.expectedOutput,
        input: tc.isHidden ? "Hidden" : tc.input,
        isHidden: tc.isHidden,
      };
    });

    const passed = testResults.filter((r) => r.status === "pass").length;
    const total = testResults.length;
    const allPassed = passed === total;

    // Update problem stats
    problem.totalSubmissions = (problem.totalSubmissions || 0) + 1;
    if (allPassed) problem.successfulSubmissions = (problem.successfulSubmissions || 0) + 1;
    problem.acceptanceRate = Math.round((problem.successfulSubmissions / problem.totalSubmissions) * 100);
    await problem.save();

    res.status(200).json({
      status: allPassed ? "accepted" : "wrong_answer",
      passed,
      total,
      results: testResults,
      stderr: rawError,
    });
  } catch (error) {
    console.error("Error in submitCode:", error.message);
    res.status(500).json({ message: "Code execution failed: " + error.message });
  }
}
