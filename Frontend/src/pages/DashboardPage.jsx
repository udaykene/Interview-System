import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContextState";
import { useUserStats, useUserActivity, useUserHistory } from "../hooks/useStats";
import {
  CheckCircle2, Loader2, ChevronLeft, ChevronRight, Clock,
  Filter, BarChart3, TrendingUp, Target, Search, MoreVertical
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
});

/* ─── Topic Chart (Bubble-style) ─────────────────── */
function TopicChart({ byCategory = {} }) {
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px', color: '#4b5563', fontSize: 13 }}>
        Solve problems to see topics.
      </div>
    );
  }

  // Position bubbles in a visually appealing pattern
  const positions = [
    { x: 35, y: 35 }, { x: 65, y: 30 },
    { x: 45, y: 65 }, { x: 25, y: 55 }, { x: 70, y: 60 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1', padding: 8 }}>
      {/* Concentric circle guides */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.15,
      }}>
        <div style={{ width: '90%', height: '90%', borderRadius: '50%', border: '1px dashed #555', position: 'absolute' }} />
        <div style={{ width: '60%', height: '60%', borderRadius: '50%', border: '1px dashed #555', position: 'absolute' }} />
        <div style={{ width: '30%', height: '30%', borderRadius: '50%', border: '1px dashed #555', position: 'absolute' }} />
      </div>

      {/* Topic bubbles */}
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {categories.map(([cat, count], i) => {
          const pos = positions[i] || { x: 50, y: 50 };
          const r = 10 + Math.min(count * 2, 8);
          return (
            <g key={cat}>
              <circle cx={pos.x} cy={pos.y} r={r} fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />
              <text
                x={pos.x} y={pos.y}
                fontSize="3"
                fill="#10b981"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontWeight: 500 }}
              >
                {cat.length > 8 ? cat.substring(0, 7) + '..' : cat}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Search icon */}
      <div style={{
        position: 'absolute', top: 4, right: 4, padding: 4,
        cursor: 'pointer', color: '#6b7280',
      }}>
        <Search size={14} />
      </div>
    </div>
  );
}

/* ─── Activity Chart (Bar Chart) ─────────────────── */
function ActivityChart({ stats = {} }) {
  const easy = stats.byDifficulty?.Easy || 0;
  const medium = stats.byDifficulty?.Medium || 0;
  const hard = stats.byDifficulty?.Hard || 0;

  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const values = [2, 5, 1, 8, 4]; // placeholder data
  const max = Math.max(...values, 1);

  return (
    <div>
      {/* Toggle buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 4,
            background: 'rgba(255,255,255,0.1)', color: 'white',
            border: 'none', fontWeight: 600, cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>Solved</button>
          <button style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 4,
            background: 'none', color: '#6b7280', border: 'none',
            fontWeight: 500, cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>Submissions</button>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6b7280',
        }}>
          <span>D</span>
          <div style={{ width: 1, height: 12, background: '#374151' }} />
          <span>2026-5</span>
        </div>
      </div>

      {/* Bars */}
      <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 }}>
        {values.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: '100%', borderRadius: '3px 3px 0 0',
                background: 'rgba(16,185,129,0.7)',
                height: `${(v / max) * 100}%`,
                transition: 'height 0.6s ease',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#4b5563' }}>{months[i]}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
        {[
          { label: `Easy ${easy}`, color: '#10b981' },
          { label: `Med. ${medium}`, color: '#f59e0b' },
          { label: `Hard ${hard}`, color: '#ef4444' },
        ].map(l => (
          <div key={l.label} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: l.color,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Practice History Table ─────────────────── */
function PracticeHistoryTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserHistory(page);

  const submissions = data?.submissions || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" />
    </div>
  );

  if (submissions.length === 0) return (
    <div style={{ textAlign: 'center', padding: '48px 16px', color: '#4b5563', fontSize: 13 }}>
      No submissions yet. Start solving problems!
    </div>
  );

  const getDiffColor = (d) => {
    if (d === 'Easy') return '#10b981';
    if (d === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Last Submitted', 'Problem', 'Last Result', 'Submissions'].map(h => (
              <th key={h} style={{
                padding: '12px 16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 600, color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr
              key={sub._id}
              onClick={() => sub.problemId?.slug && navigate(`/problem/${sub.problemId.slug}`)}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{
                padding: '14px 16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, color: '#9ca3af',
              }}>
                {sub.createdAt && formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {sub.status === 'Accepted' && <CheckCircle2 size={14} color="#10b981" />}
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>
                      {sub.problemId?.title || "Untitled"}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: getDiffColor(sub.problemId?.difficulty),
                    textTransform: 'uppercase', marginTop: 2, display: 'inline-block',
                  }}>
                    {sub.problemId?.difficulty}
                  </span>
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: sub.status === 'Accepted' ? 'white' : '#f59e0b',
                }}>
                  {sub.status}
                </span>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, color: '#9ca3af',
                  }}>1</span>
                  <MoreVertical size={14} color="#374151" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '16px 0' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.3 : 1, color: 'white', display: 'flex',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, color: 'white', padding: '4px 10px',
            background: 'rgba(255,255,255,0.08)', borderRadius: 4,
          }}>{page}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={{
              padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.3 : 1, color: 'white', display: 'flex',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard Page ─────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useUserStats();
  const stats = statsData || {};

  if (statsLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f0f0f0' }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px clamp(16px, 4vw, 48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

          {/* ─── Left Column: Practice History ─── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>
                Practice History
              </h2>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 500, padding: '6px 12px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, color: '#9ca3af', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                <Filter size={13} /> Filter
              </button>
            </div>

            <motion.div {...fadeUp(0.1)} style={{
              background: '#111111', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}>
              <PracticeHistoryTable />
            </motion.div>
          </div>

          {/* ─── Right Column: Summary Sidebar ─── */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'white', marginBottom: 16 }}>
              Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Total Solved */}
              <motion.div {...fadeUp(0.15)} style={{
                background: '#111111', borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)', padding: 20,
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                  color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
                }}>Total Solved</div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8' }}>{stats.totalSolved || 0}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>Problems</span>
                  <div style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: 700, color: '#9ca3af',
                    background: 'rgba(255,255,255,0.04)', padding: '3px 8px',
                    borderRadius: 99, border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <TrendingUp size={10} color="#10b981" /> Beats 1%
                  </div>
                </div>

                {/* Difficulty badges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { label: 'Easy', val: stats.byDifficulty?.Easy || 0, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
                    { label: 'Med.', val: stats.byDifficulty?.Medium || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
                    { label: 'Hard', val: stats.byDifficulty?.Hard || 0, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
                  ].map(d => (
                    <div key={d.label} style={{
                      background: d.bg, border: `1px solid ${d.border}`,
                      borderRadius: 8, padding: '6px 0', textAlign: 'center',
                    }}>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9, fontWeight: 700, color: d.color, opacity: 0.8,
                        textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2,
                      }}>{d.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: d.color }}>{d.val}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Submissions & Acceptance row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <motion.div {...fadeUp(0.2)} style={{
                  background: '#111111', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.05)', padding: 20,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                    color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
                  }}>Submissions</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#818cf8' }}>{stats.totalSubmissions || 0}</div>
                </motion.div>

                <motion.div {...fadeUp(0.25)} style={{
                  background: '#111111', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.05)', padding: 20,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                    color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
                  }}>Acceptance</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>{stats.acceptanceRate || 0}%</div>
                </motion.div>
              </div>

              {/* Topics Chart */}
              <motion.div {...fadeUp(0.3)} style={{
                background: '#111111', borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)', padding: 16,
              }}>
                <TopicChart byCategory={stats.byCategory} />
              </motion.div>

              {/* Activity Bar Chart */}
              <motion.div {...fadeUp(0.35)} style={{
                background: '#111111', borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.05)', padding: 20,
              }}>
                <ActivityChart stats={stats} />
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
