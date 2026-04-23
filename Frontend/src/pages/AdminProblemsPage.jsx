import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContextState";
import { useCreateProblem, useDeleteProblem, useProblems } from "../hooks/useProblems";
import { Plus, Trash2, Loader2 } from "lucide-react";

const emptyProblem = {
  title: "", slug: "", difficulty: "Easy", category: "",
  descriptionText: "", notes: "", constraints: "",
  exampleInput: "", exampleOutput: "", exampleExplanation: "",
  starterJs: "", starterPy: "", starterJava: "",
  expectedJs: "", expectedPy: "", expectedJava: "",
};

function AdminProblemsPage() {
  const { user } = useAuth();
  const { data } = useProblems();
  const createProblem = useCreateProblem();
  const deleteProblem = useDeleteProblem();
  const [form, setForm] = useState(emptyProblem);

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
    const payload = {
      title: form.title, slug: form.slug, difficulty: form.difficulty, category: form.category,
      description: { text: form.descriptionText, notes: form.notes.split("\n").map(l => l.trim()).filter(Boolean) },
      examples: [{ input: form.exampleInput, output: form.exampleOutput, explanation: form.exampleExplanation }],
      constraints: form.constraints.split("\n").map(l => l.trim()).filter(Boolean),
      starterCode: { javascript: form.starterJs, python: form.starterPy, java: form.starterJava },
      expectedOutput: { javascript: form.expectedJs, python: form.expectedPy, java: form.expectedJava },
    };
    createProblem.mutate(payload, { onSuccess: () => setForm(emptyProblem) });
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
            <div><label style={labelStyle}>EXPECTED JS</label><textarea style={textareaStyle} value={form.expectedJs} onChange={e => setForm({ ...form, expectedJs: e.target.value })} /></div>
            <div><label style={labelStyle}>EXPECTED PY</label><textarea style={textareaStyle} value={form.expectedPy} onChange={e => setForm({ ...form, expectedPy: e.target.value })} /></div>
            <div><label style={labelStyle}>EXPECTED JAVA</label><textarea style={textareaStyle} value={form.expectedJava} onChange={e => setForm({ ...form, expectedJava: e.target.value })} /></div>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={createProblem.isPending}>
            {createProblem.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {createProblem.isPending ? "Creating..." : "Create Problem"}
          </button>
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
