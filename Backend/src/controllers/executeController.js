import axios from "axios";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

const PISTON_API = ENV.PISTON_API || "https://emkc.org/api/v2/piston";

const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

function splitTopLevel(value, delimiter = ",") {
  const parts = [];
  let current = "";
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (const char of value) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if ((inSingle || inDouble) && char === "\\") {
      current += char;
      escaped = true;
      continue;
    }

    if (!inDouble && char === "'") {
      inSingle = !inSingle;
      current += char;
      continue;
    }

    if (!inSingle && char === '"') {
      inDouble = !inDouble;
      current += char;
      continue;
    }

    if (!inSingle && !inDouble) {
      if (char === "(") depthParen++;
      if (char === ")") depthParen--;
      if (char === "[") depthBracket++;
      if (char === "]") depthBracket--;
      if (char === "{") depthBrace++;
      if (char === "}") depthBrace--;

      if (
        char === delimiter &&
        depthParen === 0 &&
        depthBracket === 0 &&
        depthBrace === 0
      ) {
        parts.push(current.trim());
        current = "";
        continue;
      }
    }

    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function extractCallArguments(functionCall, functionName) {
  const callRegex = new RegExp(`(?:^|\\s)${functionName}\\s*\\((.*)\\)\\s*$`);
  const match = functionCall.match(callRegex);
  if (!match) {
    throw new Error(`Test case must call ${functionName}(...) for Java judging`);
  }

  const argsSource = match[1].trim();
  if (!argsSource) return [];
  return splitTopLevel(argsSource);
}

function extractJavaSignature(code, functionName) {
  const signatureRegex = new RegExp(
    `(?:public|private|protected)?\\s*(?:static\\s+)?([\\w<>,\\[\\]\\s]+?)\\s+${functionName}\\s*\\(([^)]*)\\)`,
    "m"
  );
  const match = code.match(signatureRegex);

  if (!match) {
    throw new Error(`Could not find Java method '${functionName}' in submitted code`);
  }

  const returnType = match[1].trim().replace(/\s+/g, " ");
  const rawParams = match[2].trim();
  const params = rawParams
    ? splitTopLevel(rawParams).map((param) => {
        const cleaned = param.trim().replace(/\s+/g, " ");
        const lastSpace = cleaned.lastIndexOf(" ");
        if (lastSpace === -1) {
          throw new Error(`Unable to parse Java parameter: ${param}`);
        }

        return {
          type: cleaned.slice(0, lastSpace).trim(),
          name: cleaned.slice(lastSpace + 1).trim(),
        };
      })
    : [];

  return { returnType, params };
}

function normalizeJavaExpected(value) {
  const source = String(value ?? "").trim().replace(/'/g, '"');
  let result = "";
  let inDouble = false;
  let escaped = false;

  for (const char of source) {
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      inDouble = !inDouble;
      result += char;
      continue;
    }

    if (!inDouble && /\s/.test(char)) {
      continue;
    }

    result += char;
  }

  return result;
}

function javaTypeDimensions(type) {
  return (type.match(/\[\]/g) || []).length;
}

function javaBaseType(type) {
  return type.replace(/\[\]/g, "").trim();
}

function convertJavaPrimitiveLiteral(literal, baseType) {
  const trimmed = literal.trim();
  if (trimmed === "null") return "null";

  if (baseType === "String") return trimmed;

  if (baseType === "char") {
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      const inner = trimmed.slice(1, -1);
      if (inner.length !== 1) {
        throw new Error(`Cannot convert ${trimmed} to char`);
      }
      return `'${inner.replace(/'/g, "\\'")}'`;
    }
    return trimmed;
  }

  if (baseType === "long" && !/[lL]$/.test(trimmed) && /^-?\d+$/.test(trimmed)) {
    return `${trimmed}L`;
  }

  if (baseType === "float" && !/[fF]$/.test(trimmed) && /^-?\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}f`;
  }

  return trimmed;
}

function convertJavaArrayLiteral(literal, baseType, dimensions) {
  const trimmed = literal.trim();
  if (trimmed === "null") return "null";
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    throw new Error(`Expected array literal for Java test input: ${trimmed}`);
  }

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return `new ${baseType}${"[]".repeat(dimensions)}{}`;

  const parts = splitTopLevel(inner);
  const converted = parts.map((part) =>
    dimensions === 1
      ? convertJavaPrimitiveLiteral(part, baseType)
      : convertJavaArrayLiteral(part, baseType, dimensions - 1).replace(
          new RegExp(`^new ${baseType}(?:\\[\\]){${dimensions - 1}}`),
          ""
        )
  );

  return `new ${baseType}${"[]".repeat(dimensions)}{${converted.join(",")}}`;
}

function convertJavaArgument(literal, type) {
  const normalizedType = type.replace(/\s+/g, " ").trim();
  const unsupportedTypes = ["ListNode", "TreeNode", "Node"];
  if (unsupportedTypes.some((token) => normalizedType.includes(token))) {
    throw new Error(
      `Java judging does not yet support ${normalizedType}. Use primitive/array-based problems or add a custom serializer.`
    );
  }

  const dimensions = javaTypeDimensions(normalizedType);
  const baseType = javaBaseType(normalizedType);

  if (dimensions > 0) {
    return convertJavaArrayLiteral(literal, baseType, dimensions);
  }

  return convertJavaPrimitiveLiteral(literal, baseType);
}

function sanitizeJavaSubmission(functionCode) {
  return functionCode
    .replace(/^\s*package\s+[\w.]+\s*;\s*/gm, "")
    .replace(/\bpublic\s+(?=class\s+Solution\b)/g, "");
}

function collectPistonOutput(section) {
  if (!section) return "";
  return [section.stdout, section.stderr, section.output].filter(Boolean).join("\n").trim();
}

function buildJavaTestRunner(functionCode, testCases, functionName) {
  const sanitizedCode = sanitizeJavaSubmission(functionCode);
  const signature = extractJavaSignature(sanitizedCode, functionName);

  const testsCode = testCases
    .map((tc, i) => {
      const rawArgs = extractCallArguments(tc.functionCall, functionName);
      if (rawArgs.length !== signature.params.length) {
        throw new Error(
          `Java test case ${i + 1} argument count mismatch for ${functionName}: expected ${signature.params.length}, got ${rawArgs.length}`
        );
      }

      const argDeclarations = rawArgs
        .map((arg, index) => {
          const param = signature.params[index];
          const convertedArg = convertJavaArgument(arg, param.type);
          return `      ${param.type} __arg${i}_${index} = ${convertedArg};`;
        })
        .join("\n");

      const invocationArgs = rawArgs.map((_, index) => `__arg${i}_${index}`).join(", ");
      const expected = normalizeJavaExpected(tc.expectedOutput);

      const actualExpression =
        signature.returnType === "void"
          ? rawArgs.length > 0
            ? `normalize(__arg${i}_0)`
            : '"null"'
          : `normalize(__solution.${functionName}(${invocationArgs}))`;

      const invocationLine =
        signature.returnType === "void"
          ? `      __solution.${functionName}(${invocationArgs});`
          : "";

      return `
    try {
${argDeclarations}
${invocationLine}
      String __actual${i} = ${actualExpression};
      String __expected${i} = ${JSON.stringify(expected)};
      if (__actual${i}.equals(__expected${i})) {
        System.out.println("TEST_${i}:PASS:" + __actual${i});
      } else {
        System.out.println("TEST_${i}:FAIL:" + __actual${i} + ":EXPECTED:" + __expected${i});
      }
    } catch (Exception e) {
      System.out.println("TEST_${i}:ERROR:" + e.getClass().getSimpleName() + ": " + e.getMessage());
    }`;
    })
    .join("\n");

  const importRegex = /^\s*import\s+[\w.*]+\s*;\s*/gm;
  const userImports = [];
  let match;
  while ((match = importRegex.exec(sanitizedCode)) !== null) {
    userImports.push(match[0].trim());
  }
  const codeWithoutImports = sanitizedCode.replace(importRegex, "");

  const allImports = [
    "import java.util.*;",
    "import java.lang.reflect.*;",
    ...userImports
  ].join("\n");

  return `${allImports}

public class Main {
  private static String normalize(Object value) {
    if (value == null) return "null";

    Class<?> cls = value.getClass();
    if (cls.isArray()) {
      return normalizeArray(value);
    }

    if (value instanceof String) {
      return "\\"" + value + "\\"";
    }

    if (value instanceof Character) {
      return "\\"" + value + "\\"";
    }

    if (value instanceof java.util.Collection<?>) {
      java.util.Collection<?> collection = (java.util.Collection<?>) value;
      StringBuilder sb = new StringBuilder("[");
      boolean first = true;
      for (Object item : collection) {
        if (!first) sb.append(",");
        sb.append(normalize(item));
        first = false;
      }
      sb.append("]");
      return sb.toString();
    }

    return String.valueOf(value).replace(" ", "");
  }

  private static String normalizeArray(Object array) {
    int length = java.lang.reflect.Array.getLength(array);
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < length; i++) {
      if (i > 0) sb.append(",");
      Object item = java.lang.reflect.Array.get(array, i);
      sb.append(normalize(item));
    }
    sb.append("]");
    return sb.toString();
  }

  public static void main(String[] args) {
    Solution __solution = new Solution();
${testsCode}
  }
}

${codeWithoutImports}
`;
}

// Wrapper templates for running test cases
export const buildTestRunner = (language, functionCode, testCases, functionName) => {
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
    return `${functionCode}\n\n# Map JSON literals to Python equivalents for test cases\ntrue = True\nfalse = False\nnull = None\n\n${testsCode}`;
  }

  return buildJavaTestRunner(functionCode, testCases, functionName);
};

async function executePiston(language, code, stdin = "") {
  const lang = LANGUAGE_MAP[language];
  if (!lang) throw new Error(`Unsupported language: ${language}`);

  let filename = `solution.${language === "javascript" ? "js" : language === "python" ? "py" : "java"}`;
  if (language === "java") {
    if (code.includes("public class Main") || code.includes("class Main")) {
      filename = "Main.java";
    } else if (code.includes("class Solution")) {
      filename = "Solution.java";
    } else {
      const match = code.match(/class\s+([A-Za-z0-9_]+)/);
      filename = match ? `${match[1]}.java` : "Main.java";
    }
  }

  try {
    const headers = {};
    if (ENV.PISTON_API_KEY) headers["Authorization"] = `Bearer ${ENV.PISTON_API_KEY}`;

    const { data } = await axios.post(
      `${PISTON_API}/execute`,
      {
        language: lang.language,
        version: lang.version,
        files: [{ name: filename, content: code }],
        stdin: stdin,
      },
      { timeout: 15000, headers }
    );

    if (data?.message && !data?.run && !data?.compile) {
      throw new Error(data.message);
    }

    if (!data?.run && !data?.compile) {
      throw new Error("Piston returned an unexpected response with no compile/run result");
    }

    return data;
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(`Piston API error${status ? ` (${status})` : ""}: ${detail}`);
  }
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
  const { language, code, problemId, problemSlug } = req.body;
  if (!language || !code || (!problemId && !problemSlug))
    return res.status(400).json({ message: "language, code and problem identifier are required" });

  try {
    const { problemId, problemSlug } = req.body;
    const query = problemId ? { _id: problemId } : { slug: problemSlug };
    const problem = await Problem.findOne(query);
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

    const testRunner = buildTestRunner(language, code, testInputs, problem.functionName || "solution");
    const result = await executePiston(language, testRunner);
    const rawOutput = result.run?.stdout || result.run?.output || "";
    const compileOutput = collectPistonOutput(result.compile);
    const runErrorOutput = [result.run?.stderr, result.run?.output && !result.run?.stdout ? result.run.output : ""]
      .filter(Boolean)
      .join("\n")
      .trim();
    const rawError = [compileOutput, runErrorOutput].filter(Boolean).join("\n").trim();

    if (result.compile?.code) {
      return res.status(200).json({
        status: "Compilation Error",
        passedTests: 0,
        totalTests: testCases.length,
        results: testCases.map((tc, i) => ({
          index: i,
          status: "error",
          passed: false,
          error: "Compilation failed before tests could run",
          actualOutput: "",
          expectedOutput: tc.expectedOutput,
          input: tc.isHidden ? "Hidden" : tc.input,
          isHidden: tc.isHidden,
        })),
        stderr: rawError,
      });
    }

    // Parse test results
    const lines = rawOutput.split("\n");
    const testResults = testCases.map((tc, i) => {
      const line = lines.find((l) => l.startsWith(`TEST_${i}:`));
      if (!line) {
        return {
          index: i,
          status: "error",
          passed: false,
          error: rawError || rawOutput || "No structured test result was produced",
          actualOutput: "",
          expectedOutput: tc.expectedOutput,
          input: tc.isHidden ? "Hidden" : tc.input,
          isHidden: tc.isHidden,
        };
      }

      const parts = line.split(":");
      const status = parts[1];

      let actual = "";
      if (status === "PASS") {
        actual = line.substring(`TEST_${i}:PASS:`.length);
      } else if (status === "FAIL") {
        const failPrefix = `TEST_${i}:FAIL:`;
        const expectedSuffixIndex = line.lastIndexOf(":EXPECTED:");
        if (expectedSuffixIndex !== -1) {
          actual = line.substring(failPrefix.length, expectedSuffixIndex);
        } else {
          actual = line.substring(failPrefix.length);
        }
      }

      return {
        index: i,
        status: status === "PASS" ? "pass" : status === "FAIL" ? "fail" : "error",
        passed: status === "PASS",
        error: status !== "PASS" && status !== "FAIL" ? line.substring(`TEST_${i}:ERROR:`.length) : null,
        actualOutput: actual,
        expectedOutput: tc.expectedOutput,
        input: tc.isHidden ? "Hidden" : tc.input,
        isHidden: tc.isHidden,
      };
    });

    const passed = testResults.filter((r) => r.status === "pass").length;
    const total = testResults.length;
    const allPassed = passed === total;
    const hasErrors = testResults.some((r) => r.status === "error");

    // Update problem stats
    problem.totalSubmissions = (problem.totalSubmissions || 0) + 1;
    if (allPassed) problem.successfulSubmissions = (problem.successfulSubmissions || 0) + 1;
    problem.acceptanceRate = Math.round((problem.successfulSubmissions / problem.totalSubmissions) * 100);
    await problem.save();

    const finalStatus = allPassed
      ? "Accepted"
      : hasErrors
        ? "Execution Error"
        : "Wrong Answer";

    res.status(200).json({
      status: finalStatus,
      passedTests: passed,
      totalTests: total,
      results: testResults,
      stderr: rawError,
    });

    // Save submission record asynchronously (non-blocking)
    try {
      await Submission.create({
        userId: req.user._id,
        problemId: problem._id,
        language,
        code,
        status: finalStatus,
        passedTests: passed,
        totalTests: total,
      });

      // Update user stats if all tests passed
      if (allPassed) {
        // Only increment problemsSolved if this is the first time solving this problem
        const previousAccepted = await Submission.countDocuments({
          userId: req.user._id,
          problemId: problem._id,
          status: "Accepted",
        });
        // previousAccepted is now >= 1 (includes the one we just created)
        if (previousAccepted === 1) {
          await User.findByIdAndUpdate(req.user._id, {
            $inc: { "stats.problemsSolved": 1 },
          });
        }
      }
    } catch (saveErr) {
      console.error("Error saving submission record:", saveErr.message);
    }
  } catch (error) {
    console.error("Error in submitCode:", error.message);
    res.status(500).json({ message: "Code execution failed: " + error.message });
  }
}
