import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContextState";
import { useBulkImportProblems, useCreateProblem, useDeleteProblem, useProblems } from "../hooks/useProblems";
import { Plus, Trash2, Loader2 } from "lucide-react";

const emptyProblem = {
  title: "", slug: "", difficulty: "Easy", category: "",
  descriptionText: "", notes: "", constraints: "", tags: "", functionName: "solution",
  exampleInput: "", exampleOutput: "", exampleExplanation: "",
  starterJs: "", starterPy: "", starterJava: "",
  solutionJs: "", solutionPy: "", solutionJava: "",
  visibleTests: "", hiddenTests: "",
};

const parseMultilineList = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseTestCases = (value, isHidden) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("=>");
      if (separatorIndex === -1) return null;

      return {
        input: line.slice(0, separatorIndex).trim(),
        expectedOutput: line.slice(separatorIndex + 2).trim(),
        isHidden,
      };
    })
    .filter(Boolean);

const hasInvalidTestCaseLine = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .some((line) => !line.includes("=>"));

const bulkImportTemplate = `[
  {
    "title": "Sum Of Two Numbers",
    "slug": "sum-of-two-numbers",
    "difficulty": "Easy",
    "category": "Array",
    "description": {
      "text": "Given an array nums of exactly two integers, return the sum of the two numbers.",
      "notes": ["Return a single integer.", "Do not print the answer."]
    },
    "examples": [
      {
        "input": "nums = [2, 3]",
        "output": "5",
        "explanation": "nums[0] + nums[1] = 5"
      }
    ],
    "constraints": ["nums.length == 2", "-1000 <= nums[i] <= 1000"],
    "starterCode": {
      "javascript": "function sumTwo(nums) {\\n  // Write your solution here\\n}",
      "python": "def sumTwo(nums):\\n    # Write your solution here\\n    pass",
      "java": "class Solution {\\n    public int sumTwo(int[] nums) {\\n        return 0;\\n    }\\n}"
    },
    "solutionCode": {
      "javascript": "function sumTwo(nums) {\\n  return nums[0] + nums[1];\\n}",
      "python": "def sumTwo(nums):\\n    return nums[0] + nums[1]",
      "java": "class Solution {\\n    public int sumTwo(int[] nums) {\\n        return nums[0] + nums[1];\\n    }\\n}"
    },
    "functionName": "sumTwo",
    "tags": ["Array", "Math"],
    "testCases": [
      { "input": "sumTwo([2,3])", "expectedOutput": "5", "isHidden": false },
      { "input": "sumTwo([-1,4])", "expectedOutput": "3", "isHidden": false },
      { "input": "sumTwo([0,0])", "expectedOutput": "0", "isHidden": true }
    ]
  }
]`;

function AdminProblemsPage() {
  const { user } = useAuth();
  const { data } = useProblems();
  const createProblem = useCreateProblem();
  const bulkImportProblems = useBulkImportProblems();
  const deleteProblem = useDeleteProblem();
  const [form, setForm] = useState(emptyProblem);
  const [importJson, setImportJson] = useState(bulkImportTemplate);
  const [importMode, setImportMode] = useState("skip");
  const [importSummary, setImportSummary] = useState(null);

  if (user?.role !== "admin") {
    return (
      <div style={{ minHeight: '100vh', background: '#050505' }}>
        <Navbar />
        <div className="page-container" style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text-muted)' }}>Not authorized.</div>
      </div>
    );
  }

  const problems = data?.problems || [];

  const handleSubmit = () => {
    if (hasInvalidTestCaseLine(form.visibleTests) || hasInvalidTestCaseLine(form.hiddenTests)) {
      toast.error("Each test case line must use the format: functionCall => expectedOutput");
      return;
    }

    const visibleTestCases = parseTestCases(form.visibleTests, false);
    const hiddenTestCases = parseTestCases(form.hiddenTests, true);
    const payload = {
      title: form.title, slug: form.slug, difficulty: form.difficulty, category: form.category,
      description: { text: form.descriptionText, notes: parseMultilineList(form.notes) },
      examples: [{ input: form.exampleInput, output: form.exampleOutput, explanation: form.exampleExplanation }],
      constraints: parseMultilineList(form.constraints),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      functionName: form.functionName.trim() || "solution",
      starterCode: { javascript: form.starterJs, python: form.starterPy, java: form.starterJava },
      solutionCode: { javascript: form.solutionJs, python: form.solutionPy, java: form.solutionJava },
      testCases: [...visibleTestCases, ...hiddenTestCases],
    };
    createProblem.mutate(payload, { onSuccess: () => setForm(emptyProblem) });
  };

  const handleBulkImport = () => {
    let parsed;

    try {
      parsed = JSON.parse(importJson);
    } catch {
      toast.error("Import JSON is not valid");
      return;
    }

    if (!Array.isArray(parsed)) {
      toast.error("Import JSON must be an array of problems");
      return;
    }

    bulkImportProblems.mutate(
      { mode: importMode, problems: parsed },
      {
        onSuccess: (data) => {
          setImportSummary(data);
        },
      },
    );
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
    color: 'var(--text-primary)', fontFamily: "'Geist', sans-serif", fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s',
  };
  const textareaStyle = { ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: 6, display: 'block' };

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px clamp(20px, 4vw, 48px)' }}>
        
        {/* Add Problem */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card" style={{ marginBottom: 32, padding: 32 }}>
          <span className="mono-label" style={{ marginBottom: 8, display: 'block' }}>ADMIN</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, letterSpacing: '-0.02em' }}>Add Problem</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div><label style={labelStyle}>TITLE</label><input style={inputStyle} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label style={labelStyle}>SLUG</label><input style={inputStyle} placeholder="Slug (optional)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
            <div><label style={labelStyle}>DIFFICULTY</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
            <div><label style={labelStyle}>CATEGORY</label><input style={inputStyle} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
            <div><label style={labelStyle}>FUNCTION NAME</label><input style={inputStyle} placeholder="twoSum / solve / maxProfit" value={form.functionName} onChange={e => setForm({ ...form, functionName: e.target.value })} /></div>
            <div><label style={labelStyle}>TAGS</label><input style={inputStyle} placeholder="Array, Hash Map, Two Pointers" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <div><label style={labelStyle}>DESCRIPTION</label><textarea style={textareaStyle} placeholder="Description" value={form.descriptionText} onChange={e => setForm({ ...form, descriptionText: e.target.value })} /></div>
            <div><label style={labelStyle}>NOTES (ONE PER LINE)</label><textarea style={{ ...textareaStyle, minHeight: 80 }} placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <div><label style={labelStyle}>CONSTRAINTS (ONE PER LINE)</label><textarea style={{ ...textareaStyle, minHeight: 80 }} placeholder="Constraints" value={form.constraints} onChange={e => setForm({ ...form, constraints: e.target.value })} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div><label style={labelStyle}>EXAMPLE INPUT</label><input style={inputStyle} placeholder="Example Input" value={form.exampleInput} onChange={e => setForm({ ...form, exampleInput: e.target.value })} /></div>
            <div><label style={labelStyle}>EXAMPLE OUTPUT</label><input style={inputStyle} placeholder="Example Output" value={form.exampleOutput} onChange={e => setForm({ ...form, exampleOutput: e.target.value })} /></div>
          </div>
          <div style={{ marginBottom: 20 }}><label style={labelStyle}>EXAMPLE EXPLANATION</label><input style={inputStyle} placeholder="Explanation" value={form.exampleExplanation} onChange={e => setForm({ ...form, exampleExplanation: e.target.value })} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div><label style={labelStyle}>STARTER JS</label><textarea style={textareaStyle} value={form.starterJs} onChange={e => setForm({ ...form, starterJs: e.target.value })} /></div>
            <div><label style={labelStyle}>STARTER PY</label><textarea style={textareaStyle} value={form.starterPy} onChange={e => setForm({ ...form, starterPy: e.target.value })} /></div>
            <div><label style={labelStyle}>STARTER JAVA</label><textarea style={textareaStyle} value={form.starterJava} onChange={e => setForm({ ...form, starterJava: e.target.value })} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div><label style={labelStyle}>SOLUTION JS</label><textarea style={textareaStyle} value={form.solutionJs} onChange={e => setForm({ ...form, solutionJs: e.target.value })} /></div>
            <div><label style={labelStyle}>SOLUTION PY</label><textarea style={textareaStyle} value={form.solutionPy} onChange={e => setForm({ ...form, solutionPy: e.target.value })} /></div>
            <div><label style={labelStyle}>SOLUTION JAVA</label><textarea style={textareaStyle} value={form.solutionJava} onChange={e => setForm({ ...form, solutionJava: e.target.value })} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={labelStyle}>VISIBLE TEST CASES</label>
              <textarea
                style={{ ...textareaStyle, minHeight: 140 }}
                placeholder={'one per line\nexample:\ntwoSum([2,7,11,15], 9) => [0,1]'}
                value={form.visibleTests}
                onChange={e => setForm({ ...form, visibleTests: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>HIDDEN TEST CASES</label>
              <textarea
                style={{ ...textareaStyle, minHeight: 140 }}
                placeholder={'one per line\nexample:\ntwoSum([3,3], 6) => [0,1]'}
                value={form.hiddenTests}
                onChange={e => setForm({ ...form, hiddenTests: e.target.value })}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={createProblem.isPending}>
            {createProblem.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {createProblem.isPending ? "Creating..." : "Create Problem"}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="card" style={{ marginBottom: 32, padding: 32 }}>
          <span className="mono-label" style={{ marginBottom: 8, display: 'block' }}>BULK IMPORT</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>Import Problems In JSON</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
            Paste a JSON array of problems. Use <code>skip</code> to ignore duplicate slugs or <code>update</code> to overwrite existing ones.
          </p>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>IMPORT MODE</label>
              <select style={{ ...inputStyle, cursor: 'pointer', minWidth: 180 }} value={importMode} onChange={e => setImportMode(e.target.value)}>
                <option value="skip">Skip existing slugs</option>
                <option value="update">Update existing slugs</option>
              </select>
            </div>
            <button className="btn btn-secondary" onClick={() => setImportJson(bulkImportTemplate)} disabled={bulkImportProblems.isPending}>
              Load Template
            </button>
            <button className="btn btn-primary" onClick={handleBulkImport} disabled={bulkImportProblems.isPending}>
              {bulkImportProblems.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {bulkImportProblems.isPending ? "Importing..." : "Import Problems"}
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>PROBLEMS JSON ARRAY</label>
            <textarea
              style={{ ...textareaStyle, minHeight: 320 }}
              value={importJson}
              onChange={e => setImportJson(e.target.value)}
            />
          </div>

          {importSummary && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ fontSize: 13 }}><strong>Created:</strong> {importSummary.summary?.created || 0}</div>
                <div style={{ fontSize: 13 }}><strong>Updated:</strong> {importSummary.summary?.updated || 0}</div>
                <div style={{ fontSize: 13 }}><strong>Skipped:</strong> {importSummary.summary?.skipped || 0}</div>
                <div style={{ fontSize: 13 }}><strong>Invalid:</strong> {importSummary.summary?.invalid || 0}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                {(importSummary.results || []).map((item, index) => (
                  <div key={`${item.slug || item.title || "problem"}-${index}`} style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 13,
                  }}>
                    <strong>{item.status?.toUpperCase()}</strong> {item.slug || item.title || "Unknown problem"}
                    {item.message ? ` - ${item.message}` : ""}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Existing Problems */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="card" style={{ padding: 32 }}>
          <span className="mono-label" style={{ marginBottom: 8, display: 'block' }}>DATABASE</span>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' }}>Existing Problems</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {problems.map(p => (
              <div key={p.slug} className="hover-glow" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.2s'
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginLeft: 12, letterSpacing: '0.03em' }}>{p.slug}</span>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => deleteProblem.mutate(p.slug)}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            ))}
            {problems.length === 0 && <div style={{ color: 'var(--text-muted)', padding: 20, textAlign: 'center' }}>No problems yet.</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminProblemsPage;
