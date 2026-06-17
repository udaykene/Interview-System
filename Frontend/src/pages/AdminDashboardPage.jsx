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
  useStudyPlans, 
  useCreateStudyPlan, 
  useUpdateStudyPlan, 
  useDeleteStudyPlan 
} from "../hooks/useStudyPlans";
import { 
  useAdminQuests, 
  useCreateQuest, 
  useDeleteQuest, 
  useBadges, 
  useCreateBadge, 
  useDeleteBadge 
} from "../hooks/useQuests";
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
  X,
  BookOpen,
  Award,
  Flame,
  Trophy,
  Sparkles
} from "lucide-react";


const emptyProblem = {
  title: "", slug: "", difficulty: "Easy", category: "",
  descriptionText: "", notes: "", constraints: "", tags: "", functionName: "solution",
  exampleInput: "", exampleOutput: "", exampleExplanation: "",
  starterJs: "", starterPy: "", starterJava: "",
  solutionJs: "", solutionPy: "", solutionJava: "",
  visibleTests: "", hiddenTests: "",
};

const emptyPlan = {
  title: "",
  description: "",
  color: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
  icon: "BookOpen",
  isOfficial: true,
  sections: [{ title: "Section 1", problems: [] }]
};

const emptyQuest = {
  title: "",
  description: "",
  type: "custom",
  objective: "solve_problem",
  targetProblemId: "",
  targetCount: 1,
  targetDifficulty: "Easy",
  xpReward: 100,
  badgeReward: "",
  icon: "Flame",
  color: "#f59e0b"
};

const emptyBadge = {
  name: "",
  description: "",
  icon: "Award",
  color: "#f59e0b",
  triggerType: "manual",
  triggerValue: 0,
  xpReward: 0
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

const getTestSuiteStats = (visibleTests, hiddenTests) => {
  const visibleCount = parseTestCases(visibleTests, false).length;
  const hiddenCount = parseTestCases(hiddenTests, true).length;
  const totalCount = visibleCount + hiddenCount;

  return {
    visibleCount,
    hiddenCount,
    totalCount,
    isRecommendedRange: totalCount >= 12 && totalCount <= 14,
  };
};

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

  // Study plans queries & mutations
  const { data: officialPlansData, isLoading: officialPlansLoading } = useStudyPlans();
  const createPlan = useCreateStudyPlan();
  const updatePlan = useUpdateStudyPlan();
  const deletePlan = useDeleteStudyPlan();

  // Quests & Badges queries & mutations
  const { data: adminQuestsData, isLoading: adminQuestsLoading } = useAdminQuests();
  const createQuest = useCreateQuest();
  const deleteQuest = useDeleteQuest();
  const { data: badgesList, isLoading: badgesLoading } = useBadges();
  const createBadge = useCreateBadge();
  const deleteBadge = useDeleteBadge();

  const [activeTab, setActiveTab] = useState("overview");
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(emptyProblem);
  const [searchQuery, setSearchQuery] = useState("");
  const [importJson, setImportJson] = useState(bulkImportTemplate);
  const [importMode, setImportMode] = useState("skip");
  const [importSummary, setImportSummary] = useState(null);

  // Custom states for Study Plan and Quest editing
  const [planForm, setPlanForm] = useState(emptyPlan);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [questForm, setQuestForm] = useState(emptyQuest);
  const [badgeForm, setBadgeForm] = useState(emptyBadge);


  const problems = useMemo(() => data?.problems || [], [data]);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery]);

  const testSuiteStats = useMemo(
    () => getTestSuiteStats(form.visibleTests, form.hiddenTests),
    [form.visibleTests, form.hiddenTests]
  );

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
          <SidebarItem id="study-plans" icon={BookOpen} label="Study Plans" />
          <SidebarItem id="quests-badges" icon={Award} label="Quests & Badges" />
          
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
                        <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>TESTS</th>
                        <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingProblems ? (
                        <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /></td></tr>
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
                          <td style={{ padding: '16px 20px', fontSize: 13 }}>
                            <div style={{ fontWeight: 600 }}>{p.testCases?.length || 0}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {(p.testCases || []).filter(t => !t.isHidden).length} visible / {(p.testCases || []).filter(t => t.isHidden).length} hidden
                            </div>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 20 }}>
                    <TestCountCard label="Visible" value={testSuiteStats.visibleCount} tone="blue" />
                    <TestCountCard label="Hidden" value={testSuiteStats.hiddenCount} tone="gold" />
                    <TestCountCard label="Total" value={testSuiteStats.totalCount} tone={testSuiteStats.isRecommendedRange ? "green" : "neutral"} />
                  </div>
                  <div style={{
                    marginBottom: 20,
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: 'var(--text-muted)'
                  }}>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Run</strong> executes the first 4 visible test cases.</div>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Submit</strong> executes every visible and hidden test case.</div>
                    <div>
                      Recommended setup: 2-4 visible tests and enough hidden tests to reach 12-14 total.
                      {!testSuiteStats.isRecommendedRange && testSuiteStats.totalCount > 0 ? ` Current total: ${testSuiteStats.totalCount}.` : ""}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
                    <FormGroup label="VISIBLE TESTS" type="textarea" value={form.visibleTests} onChange={v => setForm({ ...form, visibleTests: v })} height={280} placeholder="func(args) => expected" />
                    <FormGroup label="HIDDEN TESTS" type="textarea" value={form.hiddenTests} onChange={v => setForm({ ...form, hiddenTests: v })} height={280} placeholder="func(args) => expected" />
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

            {activeTab === "study-plans" && (
              <motion.div key="study-plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700 }}>Curated Study Plans</h2>
                  {!isPlanFormOpen && (
                    <button className="btn btn-primary btn-sm" onClick={() => { setPlanForm(emptyPlan); setEditingPlanId(null); setIsPlanFormOpen(true); }}>
                      <Plus size={14} /> New Study Plan
                    </button>
                  )}
                </div>

                {isPlanFormOpen ? (
                  <div className="card" style={{ padding: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600 }}>{editingPlanId ? "Edit Study Plan" : "Create Official Study Plan"}</h3>
                      <button className="btn btn-secondary btn-sm" onClick={() => setIsPlanFormOpen(false)}><X size={14} /> Close</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                      <FormGroup label="TITLE" value={planForm.title} onChange={v => setPlanForm({ ...planForm, title: v })} placeholder="e.g. LeetCode 75" />
                      <FormGroup label="DESCRIPTION" value={planForm.description} onChange={v => setPlanForm({ ...planForm, description: v })} placeholder="e.g. Ace interviews..." />
                      <FormGroup label="COLOR GRADIENT" value={planForm.color} onChange={v => setPlanForm({ ...planForm, color: v })} placeholder="linear-gradient(...) or hex" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={labelStyle}>ICON</label>
                        <select style={inputStyle} value={planForm.icon} onChange={e => setPlanForm({ ...planForm, icon: e.target.value })}>
                          <option value="BookOpen">Book</option>
                          <option value="Award">Award</option>
                          <option value="Code">Code</option>
                          <option value="Database">Database</option>
                          <option value="Trophy">Trophy</option>
                        </select>
                      </div>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Sections & Problems</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                      {planForm.sections.map((section, sIdx) => (
                        <div key={sIdx} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                            <input 
                              style={{ ...inputStyle, flex: 1, padding: '8px 12px' }} 
                              placeholder="Section Name (e.g. Arrays & Strings)"
                              value={section.title}
                              onChange={e => {
                                const newSecs = [...planForm.sections];
                                newSecs[sIdx].title = e.target.value;
                                setPlanForm({ ...planForm, sections: newSecs });
                              }}
                            />
                            <button className="btn btn-danger btn-sm" onClick={() => {
                              const newSecs = planForm.sections.filter((_, i) => i !== sIdx);
                              setPlanForm({ ...planForm, sections: newSecs });
                            }}>
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Problems in this section:</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                            {section.problems.map(pId => {
                              const prob = problems.find(p => p._id === pId);
                              return (
                                <span key={pId} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: 12 }}>
                                  {prob?.title || pId}
                                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => {
                                    const newSecs = [...planForm.sections];
                                    newSecs[sIdx].problems = newSecs[sIdx].problems.filter(id => id !== pId);
                                    setPlanForm({ ...planForm, sections: newSecs });
                                  }} />
                                </span>
                              );
                            })}
                            {section.problems.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No problems added yet.</span>}
                          </div>

                          {/* Problem Selector Dropdown */}
                          <select 
                            style={{ ...inputStyle, padding: '6px 12px', fontSize: 13 }}
                            value=""
                            onChange={e => {
                              if (!e.target.value) return;
                              const newSecs = [...planForm.sections];
                              if (!newSecs[sIdx].problems.includes(e.target.value)) {
                                newSecs[sIdx].problems.push(e.target.value);
                              }
                              setPlanForm({ ...planForm, sections: newSecs });
                            }}
                          >
                            <option value="">+ Add problem to section...</option>
                            {problems.map(p => (
                              <option key={p._id} value={p._id}>{p.title} ({p.difficulty})</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      <button className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }} onClick={() => {
                        setPlanForm({ ...planForm, sections: [...planForm.sections, { title: `Section ${planForm.sections.length + 1}`, problems: [] }] });
                      }}>
                        + Add Section
                      </button>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
                      if (!planForm.title.trim()) return toast.error("Title is required");
                      if (editingPlanId) {
                        updatePlan.mutate({ id: editingPlanId, payload: planForm }, {
                          onSuccess: () => {
                            setIsPlanFormOpen(false);
                            setPlanForm(emptyPlan);
                          }
                        });
                      } else {
                        createPlan.mutate(planForm, {
                          onSuccess: () => {
                            setIsPlanFormOpen(false);
                            setPlanForm(emptyPlan);
                          }
                        });
                      }
                    }}>
                      {editingPlanId ? "Save Study Plan" : "Create Study Plan"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {officialPlansLoading ? (
                      <div style={{ padding: 40, gridColumn: '1/-1', textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /></div>
                    ) : (officialPlansData?.official || []).map(plan => {
                      const totalProblems = plan.sections?.reduce((acc, s) => acc + (s.problems?.length || 0), 0) || 0;
                      return (
                        <div key={plan._id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div>
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: plan.color || 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                              <BookOpen size={20} color="white" />
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{plan.title}</h3>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, height: 36, overflow: 'hidden', textOverflow: 'ellipsis' }}>{plan.description}</p>
                            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                              {plan.sections?.length || 0} Sections • {totalProblems} Problems
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                            <button className="btn btn-sm" style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={() => {
                              setEditingPlanId(plan._id);
                              setPlanForm({
                                title: plan.title,
                                description: plan.description || "",
                                color: plan.color,
                                icon: plan.icon || "BookOpen",
                                isOfficial: true,
                                sections: plan.sections.map(s => ({
                                  title: s.title,
                                  problems: s.problems.map(p => p._id)
                                }))
                              });
                              setIsPlanFormOpen(true);
                            }}>
                              <Edit size={12} /> Edit
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => {
                              if (confirm(`Delete official study plan: ${plan.title}?`)) {
                                deletePlan.mutate(plan._id);
                              }
                            }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "quests-badges" && (
              <motion.div key="quests-badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Quests & Badges</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
                  {/* QUESTS CONTAINER */}
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Flame size={18} color="var(--accent-orange)" /> Quests Administration
                    </h3>

                    {/* Create Quest Form */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Create Custom Quest</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <FormGroup label="QUEST TITLE" value={questForm.title} onChange={v => setQuestForm({ ...questForm, title: v })} placeholder="e.g. Master Binary Search" />
                        <FormGroup label="DESCRIPTION" value={questForm.description} onChange={v => setQuestForm({ ...questForm, description: v })} placeholder="e.g. Solve binary search problems" />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={labelStyle}>OBJECTIVE TYPE</label>
                            <select style={inputStyle} value={questForm.objective} onChange={e => setQuestForm({ ...questForm, objective: e.target.value })}>
                              <option value="solve_problem">Solve specific problem</option>
                              <option value="solve_n_problems">Solve N problems</option>
                              <option value="solve_difficulty">Solve N problems of difficulty</option>
                              <option value="earn_xp">Reach XP milestone</option>
                            </select>
                          </div>

                          {questForm.objective === "solve_problem" && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <label style={labelStyle}>TARGET PROBLEM</label>
                              <select style={inputStyle} value={questForm.targetProblemId} onChange={e => setQuestForm({ ...questForm, targetProblemId: e.target.value })}>
                                <option value="">Select a problem</option>
                                {problems.map(p => (
                                  <option key={p._id} value={p._id}>{p.title}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {questForm.objective === "solve_difficulty" && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <label style={labelStyle}>TARGET DIFFICULTY</label>
                              <select style={inputStyle} value={questForm.targetDifficulty} onChange={e => setQuestForm({ ...questForm, targetDifficulty: e.target.value })}>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                              </select>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          {questForm.objective !== "solve_problem" && (
                            <FormGroup label="TARGET COUNT/XP" type="number" value={questForm.targetCount} onChange={v => setQuestForm({ ...questForm, targetCount: Number(v) })} />
                          )}
                          <FormGroup label="XP REWARD" type="number" value={questForm.xpReward} onChange={v => setQuestForm({ ...questForm, xpReward: Number(v) })} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={labelStyle}>BADGE REWARD (OPTIONAL)</label>
                            <select style={inputStyle} value={questForm.badgeReward} onChange={e => setQuestForm({ ...questForm, badgeReward: e.target.value })}>
                              <option value="">No Badge Reward</option>
                              {badgesList?.badges?.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                              ))}
                            </select>
                          </div>
                          <FormGroup label="COLOR (HEX)" value={questForm.color} onChange={v => setQuestForm({ ...questForm, color: v })} placeholder="e.g. #f59e0b" />
                        </div>

                        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => {
                          if (!questForm.title.trim()) return toast.error("Title is required");
                          createQuest.mutate(questForm, {
                            onSuccess: () => setQuestForm(emptyQuest)
                          });
                        }}>
                          {createQuest.isPending ? <Loader2 className="animate-spin" /> : <Plus size={14} />} Create Quest
                        </button>
                      </div>
                    </div>

                    {/* Quests List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>ACTIVE QUESTS</h4>
                      {adminQuestsLoading ? (
                        <div style={{ textAlign: 'center', padding: 20 }}><Loader2 className="animate-spin" /></div>
                      ) : (adminQuestsData?.quests || []).map(q => (
                        <div key={q._id} style={{ padding: 14, background: 'rgba(255,255,255,0.01)', borderRadius: 10, border: `1px solid rgba(255,255,255,0.05)`, borderLeft: `3px solid ${q.color || "#8b5cf6"}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{q.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{q.description}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
                              Reward: +{q.xpReward} XP {q.badgeReward ? `• Badge: ${q.badgeReward.name}` : ""}
                            </div>
                          </div>
                          <button className="btn btn-sm btn-danger" onClick={() => {
                            if (confirm(`Delete quest: ${q.title}?`)) deleteQuest.mutate(q._id);
                          }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BADGES CONTAINER */}
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Award size={18} color="var(--accent-yellow)" /> Badges Administration
                    </h3>

                    {/* Create Badge Form */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Create New Badge</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <FormGroup label="BADGE NAME" value={badgeForm.name} onChange={v => setBadgeForm({ ...badgeForm, name: v })} placeholder="e.g. Dynamic Lord" />
                        <FormGroup label="DESCRIPTION" value={badgeForm.description} onChange={v => setBadgeForm({ ...badgeForm, description: v })} placeholder="e.g. Mastered DP" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={labelStyle}>TRIGGER TYPE</label>
                            <select style={inputStyle} value={badgeForm.triggerType} onChange={e => setBadgeForm({ ...badgeForm, triggerType: e.target.value })}>
                              <option value="manual">Manual / Quest Reward Only</option>
                              <option value="streak">Streak Achievement</option>
                              <option value="xp_milestone">XP Milestone</option>
                            </select>
                          </div>
                          <FormGroup label="TRIGGER VALUE" type="number" value={badgeForm.triggerValue} onChange={v => setBadgeForm({ ...badgeForm, triggerValue: Number(v) })} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={labelStyle}>ICON</label>
                            <select style={inputStyle} value={badgeForm.icon} onChange={e => setBadgeForm({ ...badgeForm, icon: e.target.value })}>
                              <option value="Award">Award</option>
                              <option value="Flame">Flame</option>
                              <option value="Trophy">Trophy</option>
                              <option value="Shield">Shield</option>
                              <option value="Star">Star</option>
                              <option value="Crown">Crown</option>
                              <option value="Gem">Gem</option>
                            </select>
                          </div>
                          <FormGroup label="COLOR" value={badgeForm.color} onChange={v => setBadgeForm({ ...badgeForm, color: v })} placeholder="e.g. #3b82f6" />
                        </div>

                        <FormGroup label="BONUS XP REWARD" type="number" value={badgeForm.xpReward} onChange={v => setBadgeForm({ ...badgeForm, xpReward: Number(v) })} />

                        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => {
                          if (!badgeForm.name.trim()) return toast.error("Name is required");
                          createBadge.mutate(badgeForm, {
                            onSuccess: () => setBadgeForm(emptyBadge)
                          });
                        }}>
                          {createBadge.isPending ? <Loader2 className="animate-spin" /> : <Plus size={14} />} Create Badge
                        </button>
                      </div>
                    </div>

                    {/* Badges List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>SEEDED BADGES</h4>
                      {badgesLoading ? (
                        <div style={{ textAlign: 'center', padding: 20 }}><Loader2 className="animate-spin" /></div>
                      ) : (badgesList?.badges || []).map(b => (
                        <div key={b._id} style={{ padding: "10px 14px", background: 'rgba(255,255,255,0.01)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 18, color: b.color || '#f59e0b' }}>🏆</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13, color: b.color || '#f59e0b' }}>{b.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.description}</div>
                              <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>
                                Trigger: {b.triggerType.toUpperCase()} ({b.triggerValue}) • Bonus: +{b.xpReward} XP
                              </div>
                            </div>
                          </div>
                          <button className="btn btn-sm btn-danger" onClick={() => {
                            if (confirm(`Delete badge: ${b.name}?`)) deleteBadge.mutate(b._id);
                          }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
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

function TestCountCard({ label, value, tone = "neutral" }) {
  const tones = {
    blue: { color: 'var(--accent-blue)', bg: 'rgba(59,130,246,0.1)' },
    gold: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    green: { color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)' },
    neutral: { color: 'var(--text-primary)', bg: 'rgba(255,255,255,0.04)' },
  };

  const activeTone = tones[tone] || tones.neutral;

  return (
    <div style={{ padding: 16, borderRadius: 12, background: activeTone.bg, border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: activeTone.color }}>{value}</div>
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
