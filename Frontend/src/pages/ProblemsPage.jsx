import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useProblems } from "../hooks/useProblems";
import { Search, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContextState";

function ProblemsPage() {
  const { data, isLoading } = useProblems();
  const { user } = useAuth();
  const problems = data?.problems || [];

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("all");

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = diffFilter === "all" || p.difficulty.toLowerCase() === diffFilter;
    return matchSearch && matchDiff;
  });

  const getDifficultyColor = (diff) => {
    const d = diff?.toLowerCase();
    if (d === 'easy') return 'var(--accent-green)';
    if (d === 'medium') return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  const isSolved = (problemId) => user?.stats?.solvedProblems?.includes(problemId);

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />

      {/* Header */}
      <div className="mesh-gradient" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 0' }}>
        <div className="page-container-sm" style={{ padding: '0 clamp(20px, 4vw, 48px)' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <span className="mono-label" style={{ marginBottom: 12, display: 'block' }}>PRACTICE</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14, letterSpacing: '-0.03em' }}>Problem Set</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>
              Master algorithms and data structures. Practice these curated coding problems to prepare for your next technical interview.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="page-container-sm">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input className="input" placeholder="Search problems or tags..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42, borderRadius: 14 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'easy', 'medium', 'hard'].map(d => (
              <button key={d} onClick={() => setDiffFilter(d)} style={{
                padding: '9px 18px', borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
                border: `1px solid ${diffFilter === d ? 'rgba(124,91,240,0.3)' : 'rgba(255,255,255,0.06)'}`,
                background: diffFilter === d ? 'rgba(124,91,240,0.08)' : 'rgba(255,255,255,0.03)',
                color: diffFilter === d ? '#9b7bff' : 'var(--text-secondary)',
                textTransform: 'uppercase', transition: 'all 0.25s'
              }}>
                {d}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}>
              <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No problems found matching your criteria.
            </div>
          ) : (
            <table className="problem-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>Status</th>
                  <th>Title</th>
                  <th style={{ width: 120 }}>Difficulty</th>
                  <th style={{ width: 120 }}>Acceptance</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((problem, i) => (
                  <tr key={problem.slug} className="problem-row"
                    onClick={() => window.location.href = `/problem/${problem.slug}`}>
                    <td style={{ textAlign: 'center' }}>
                      {isSolved(problem._id) ? (
                        <CheckCircle2 size={16} color="var(--accent-green)" />
                      ) : (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 auto' }} />
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em' }}>
                        {i + 1}. {problem.title}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {problem.tags?.slice(0, 3).map(tag => (
                          <span key={tag} style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10, padding: '3px 10px', borderRadius: 99,
                            background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)',
                            border: '1px solid rgba(255,255,255,0.04)', letterSpacing: '0.03em'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        color: getDifficultyColor(problem.difficulty),
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12, fontWeight: 600, letterSpacing: '0.03em'
                      }}>
                        {problem.difficulty?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)' }}>
                        {problem.acceptanceRate?.toFixed(1) || '0.0'}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: 20 }}>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ProblemsPage;
