import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContextState";
import { 
  useBulkImportProblems, 
  useCreateProblem, 
  useDeleteProblem, 
  useProblems, 
  useUpdateProblem 
} from "../hooks/useProblems";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Database,
  Search,
  Edit,
  ChevronRight,
  Info,
  Code,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

const emptyProblem = {
  title: "", slug: "", difficulty: "Easy", category: "",
  descriptionText: "", notes: "", constraints: "", tags: "", functionName: "solution",
  exampleInput: "", exampleOutput: "", exampleExplanation: "",
  starterJs: "", starterPy: "", starterJava: "",
  solutionJs: "", solutionPy: "", solutionJava: "",
  visibleTests: "", hiddenTests: "",
};

const parseMultilineList = (value) =>
  (typeof value === "string" ? value : "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseTestCases = (value, isHidden) =>
  (typeof value === "string" ? value : "")
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
  (typeof value === "string" ? value : "")
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

function AdminDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading: loadingProblems } = useProblems();
  const createProblem = useCreateProblem();
  const updateProblem = useUpdateProblem();
  const bulkImportProblems = useBulkImportProblems();
  const deleteProblem = useDeleteProblem();

  const [activeTab, setActiveTab] = useState("overview");
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(emptyProblem);
  const [searchQuery, setSearchQuery] = useState("");
  const [importJson, setImportJson] = useState(bulkImportTemplate);
  const [importMode, setImportMode] = useState("skip");
  const [importSummary, setImportSummary] = useState(null);

  const problems = useMemo(() => data?.problems || [], [data]);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery]);

  if (user?.role !== "admin") {
    return (
      <div style={{ minHeight: '100vh', background: '#050505' }}>
        <Navbar />
        <div style={{ textAlign: 'center', paddingTop: 100, color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 20px', color: 'var(--accent-red)' }} />
          <h2>Access Denied</h2>
          <p>You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  const handleEdit = (problem) => {
    setEditingSlug(problem.slug);
    setForm({
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      category: problem.category,
      descriptionText: problem.description?.text || "",
      notes: (problem.description?.notes || []).join("\n"),
      constraints: (problem.constraints || []).join("\n"),
      tags: (problem.tags || []).join(", "),
      functionName: problem.functionName || "solution",
      exampleInput: problem.examples?.[0]?.input || "",
      exampleOutput: problem.examples?.[0]?.output || "",
      exampleExplanation: problem.examples?.[0]?.explanation || "",
      starterJs: problem.starterCode?.javascript || "",
      starterPy: problem.starterCode?.python || "",
      starterJava: problem.starterCode?.java || "",
      solutionJs: problem.solutionCode?.javascript || "",
      solutionPy: problem.solutionCode?.python || "",
      solutionJava: problem.solutionCode?.java || "",
      visibleTests: (problem.testCases || [])
        .filter(t => !t.isHidden)
        .map(t => `${t.input} => ${t.expectedOutput}`)
        .join("\n"),
      hiddenTests: (problem.testCases || [])
        .filter(t => t.isHidden)
        .map(t => `${t.input} => ${t.expectedOutput}`)
        .join("\n"),
    });
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setEditingSlug(null);
    setForm(emptyProblem);
    setActiveTab("problems");
  };

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

    if (editingSlug) {
      updateProblem.mutate({ slug: editingSlug, payload }, { 
        onSuccess: () => {
          setForm(emptyProblem);
          setEditingSlug(null);
          setActiveTab("problems");
        } 
      });
    } else {
      createProblem.mutate(payload, { 
        onSuccess: () => {
          setForm(emptyProblem);
          setActiveTab("problems");
        } 
      });
    }
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

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        if (id !== "add") setEditingSlug(null);
        setActiveTab(id);
      }}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 12,
        background: activeTab === id ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: 'none',
        color: activeTab === id ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        fontSize: 14,
        fontWeight: activeTab === id ? 600 : 400,
      }}
      onMouseEnter={e => ! (activeTab === id) && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => ! (activeTab === id) && (e.currentTarget.style.background = 'transparent')}
    >
      <Icon size={18} />
      {label}
      {activeTab === id && <motion.div layoutId="active-pill" style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-purple)' }} />}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', maxWidth: 1400, margin: '0 auto', width: '100%', padding: '32px clamp(16px, 4vw, 40px)', gap: 32 }}>
        
        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
            <span className="mono-label" style={{ fontSize: 10, opacity: 0.5 }}>ADMINISTRATION</span>
            <h1 style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Control Center</h1>
          </div>
          
          <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
          <SidebarItem id="problems" icon={Database} label="Manage Problems" />
          <SidebarItem id="add" icon={editingSlug ? Edit : Plus} label={editingSlug ? "Edit Problem" : "Add Problem"} />
          <SidebarItem id="bulk" icon={Upload} label="Bulk Import" />
          
          <div style={{ marginTop: 'auto', padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Logged in as</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gradient-brand)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.name[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32 }}>Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                  <StatCard label="Total Problems" value={problems.length} icon={Database} color="var(--accent-purple)" />
                  <StatCard label="Difficulties" value={`${problems.filter(p => p.difficulty === 'Easy').length} E / ${problems.filter(p => p.difficulty === 'Medium').length} M / ${problems.filter(p => p.difficulty === 'Hard').length} H`} icon={Info} color="var(--accent-blue)" />
                </div>
              </motion.div>
            )}

            {activeTab === "problems" && (
              <motion.div key="problems" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700 }}>Manage Problems</h2>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      style={{ padding: '10px 12px 10px 36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13, width: 300 }} 
                      placeholder="Search title, slug, or category..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                        <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>PROBLEM</th>
                        <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>CATEGORY</th>
                        <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>DIFFICULTY</th>
                        <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingProblems ? (
                        <tr><td colSpan="4" style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                      ) : filteredProblems.map(p => (
                        <tr key={p.slug} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover-row">
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.slug}</div>
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: 13 }}>{p.category}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                              background: p.difficulty === 'Easy' ? 'rgba(16,185,129,0.1)' : p.difficulty === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                              color: p.difficulty === 'Easy' ? '#10b981' : p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
                            }}>
                              {p.difficulty}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button className="btn btn-sm" onClick={() => handleEdit(p)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <Edit size={13} />
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => { if(confirm(`Delete ${p.title}?`)) deleteProblem.mutate(p.slug) }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!loadingProblems && filteredProblems.length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No problems found.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "add" && (
              <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700 }}>{editingSlug ? "Edit Problem" : "Add New Problem"}</h2>
                  {editingSlug && (
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                      <X size={14} /> Cancel Editing
                    </button>
                  )}
                </div>

                <div className="card" style={{ padding: 32 }}>
                  <SectionTitle icon={Info} label="General Information" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                    <FormGroup label="TITLE" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="e.g. Two Sum" />
                    <FormGroup label="SLUG" value={form.slug} onChange={v => setForm({ ...form, slug: v })} placeholder="e.g. two-sum" disabled={!!editingSlug} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={labelStyle}>DIFFICULTY</label>
                      <select style={inputStyle} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                        <option>Easy</option><option>Medium</option><option>Hard</option>
                      </select>
                    </div>
                    <FormGroup label="CATEGORY" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="e.g. Arrays" />
                    <FormGroup label="FUNCTION NAME" value={form.functionName} onChange={v => setForm({ ...form, functionName: v })} placeholder="e.g. twoSum" />
                    <FormGroup label="TAGS (COMMA SEPARATED)" value={form.tags} onChange={v => setForm({ ...form, tags: v })} placeholder="e.g. Array, Hash Map" />
                  </div>

                  <SectionTitle icon={FileText} label="Description & Constraints" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                    <FormGroup label="DESCRIPTION (TEXT)" type="textarea" value={form.descriptionText} onChange={v => setForm({ ...form, descriptionText: v })} height={120} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <FormGroup label="NOTES (ONE PER LINE)" type="textarea" value={form.notes} onChange={v => setForm({ ...form, notes: v })} height={100} />
                      <FormGroup label="CONSTRAINTS (ONE PER LINE)" type="textarea" value={form.constraints} onChange={v => setForm({ ...form, constraints: v })} height={100} />
                    </div>
                  </div>

                  <SectionTitle icon={CheckCircle} label="Example Case" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <FormGroup label="INPUT" value={form.exampleInput} onChange={v => setForm({ ...form, exampleInput: v })} />
                    <FormGroup label="OUTPUT" value={form.exampleOutput} onChange={v => setForm({ ...form, exampleOutput: v })} />
                  </div>
                  <FormGroup label="EXPLANATION" value={form.exampleExplanation} onChange={v => setForm({ ...form, exampleExplanation: v })} style={{ marginBottom: 32 }} />

                  <SectionTitle icon={Code} label="Code Templates" />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                    <FormGroup label="STARTER JS" type="textarea" value={form.starterJs} onChange={v => setForm({ ...form, starterJs: v })} mono height={180} />
                    <FormGroup label="STARTER PY" type="textarea" value={form.starterPy} onChange={v => setForm({ ...form, starterPy: v })} mono height={180} />
                    <FormGroup label="STARTER JAVA" type="textarea" value={form.starterJava} onChange={v => setForm({ ...form, starterJava: v })} mono height={180} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                    <FormGroup label="SOLUTION JS" type="textarea" value={form.solutionJs} onChange={v => setForm({ ...form, solutionJs: v })} mono height={180} />
                    <FormGroup label="SOLUTION PY" type="textarea" value={form.solutionPy} onChange={v => setForm({ ...form, solutionPy: v })} mono height={180} />
                    <FormGroup label="SOLUTION JAVA" type="textarea" value={form.solutionJava} onChange={v => setForm({ ...form, solutionJava: v })} mono height={180} />
                  </div>

                  <SectionTitle icon={AlertCircle} label="Test Cases" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
                    <FormGroup label="VISIBLE TESTS" type="textarea" value={form.visibleTests} onChange={v => setForm({ ...form, visibleTests: v })} height={160} placeholder="func(args) => expected" />
                    <FormGroup label="HIDDEN TESTS" type="textarea" value={form.hiddenTests} onChange={v => setForm({ ...form, hiddenTests: v })} height={160} placeholder="func(args) => expected" />
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={createProblem.isPending || updateProblem.isPending} style={{ flex: 1, padding: '16px' }}>
                      {(createProblem.isPending || updateProblem.isPending) ? <Loader2 className="animate-spin" /> : editingSlug ? <Edit size={18} /> : <Plus size={18} />}
                      {editingSlug ? "Save Changes" : "Create Problem"}
                    </button>
                    {editingSlug && (
                      <button className="btn btn-secondary" onClick={handleCancelEdit} style={{ padding: '0 24px' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "bulk" && (
              <motion.div key="bulk" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Bulk Import</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Import multiple problems at once using JSON format.</p>

                <div className="card" style={{ padding: 32 }}>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>IMPORT MODE</label>
                      <select style={inputStyle} value={importMode} onChange={e => setImportMode(e.target.value)}>
                        <option value="skip">Skip Existing Slugs</option>
                        <option value="update">Overwrite Existing Slugs</option>
                      </select>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setImportJson(bulkImportTemplate)}>Reset to Template</button>
                    <button className="btn btn-primary" onClick={handleBulkImport} disabled={bulkImportProblems.isPending}>
                      {bulkImportProblems.isPending ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                      Import JSON
                    </button>
                  </div>

                  <FormGroup label="JSON CONTENT" type="textarea" value={importJson} onChange={setImportJson} height={400} mono />

                  {importSummary && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 32, padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Import Results</h3>
                      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                        <SummaryStat label="Created" value={importSummary.summary?.created} color="var(--accent-green)" />
                        <SummaryStat label="Updated" value={importSummary.summary?.updated} color="var(--accent-blue)" />
                        <SummaryStat label="Skipped" value={importSummary.summary?.skipped} color="var(--accent-yellow)" />
                        <SummaryStat label="Invalid" value={importSummary.summary?.invalid} color="var(--accent-red)" />
                      </div>
                      <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {importSummary.results.map((r, i) => (
                          <div key={i} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                            <span><strong>{r.status.toUpperCase()}</strong>: {r.title || r.slug}</span>
                            {r.message && <span style={{ color: 'var(--text-muted)' }}>{r.message}</span>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${color}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value || 0}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, color: 'var(--text-muted)' }}>
      <Icon size={16} />
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function FormGroup({ label, value, onChange, type = "text", placeholder, height, mono, disabled, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <label style={labelStyle}>{label}</label>
      {type === "textarea" ? (
        <textarea
          style={{ ...textareaStyle, height: height || 100, fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit" }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          style={inputStyle}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}

const labelStyle = { 
  fontSize: 11, 
  fontWeight: 600, 
  color: 'var(--text-muted)', 
  fontFamily: "'JetBrains Mono', monospace", 
  letterSpacing: '0.06em',
  display: 'block' 
};

const inputStyle = {
  width: '100%', 
  padding: '12px 16px', 
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', 
  borderRadius: 10,
  color: 'var(--text-primary)', 
  fontSize: 14,
  outline: 'none', 
  transition: 'border-color 0.2s',
};

const textareaStyle = { 
  ...inputStyle, 
  resize: 'vertical', 
  fontSize: 13,
  lineHeight: 1.6
};

export default AdminDashboardPage;
