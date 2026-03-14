import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useProblems } from "../hooks/useProblems";
import { Search, Filter, Code2, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
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

  const isSolved = (problemId) => {
    // Ideally user.stats.solvedProblems array would exist. For now mock it or check if it's there
    return user?.stats?.solvedProblems?.includes(problemId);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1225 0%, #0d0f1a 100%)',
        borderBottom: '1px solid var(--bg-border)',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Problem Set</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600 }}>
            Master algorithms and data structures. Practice these curated coding problems to prepare for your next technical interview.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              className="input" 
              placeholder="Search problems or tags..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 40, borderRadius: 10 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'easy', 'medium', 'hard'].map(d => (
              <button 
                key={d}
                onClick={() => setDiffFilter(d)}
                style={{
                  padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${diffFilter === d ? 'var(--accent-indigo)' : 'var(--bg-border)'}`,
                  background: diffFilter === d ? 'rgba(99,102,241,0.1)' : 'var(--bg-secondary)',
                  color: diffFilter === d ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                  textTransform: 'capitalize', transition: 'all 0.2s'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Problems Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
              <Loader2 size={32} className="animate-spin" color="var(--accent-indigo)" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              No problems found matching your criteria.
            </div>
          ) : (
            <table className="problem-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>Status</th>
                  <th>Title</th>
                  <th style={{ width: 120 }}>Difficulty</th>
                  <th style={{ width: 120 }}>Acceptance</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((problem, i) => (
                  <tr key={problem.slug} className="problem-row" onClick={() => window.location.href = `/problem/${problem.slug}`}>
                    <td style={{ textAlign: 'center' }}>
                      {isSolved(problem._id) ? (
                        <CheckCircle2 size={18} color="var(--accent-green)" />
                      ) : (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg-border)', margin: '0 auto' }} />
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {i + 1}. {problem.title}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {problem.tags?.slice(0, 3).map(tag => (
                          <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: getDifficultyColor(problem.difficulty), fontSize: 13, fontWeight: 500 }}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {problem.acceptanceRate?.toFixed(1) || '0.0'}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: 20 }}>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemsPage;
