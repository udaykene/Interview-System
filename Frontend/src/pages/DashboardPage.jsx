import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContextState";
import { useUserStats, useUserActivity, useUserHistory } from "../hooks/useStats";
import {
  CheckCircle2, Loader2, ChevronLeft, ChevronRight, Clock,
  Flame, Target, TrendingUp, BarChart3, Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
});

/* ─── Activity Heatmap (GitHub-style) ─────────────────── */
function ActivityHeatmap({ activityMap = {} }) {
  const weeks = useMemo(() => {
    const today = new Date();
    const result = [];
    // Go back 52 weeks (364 days)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 363);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentDate = new Date(startDate);
    let week = [];

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];
      week.push({
        date: dateStr,
        count: activityMap[dateStr] || 0,
        dayOfWeek: currentDate.getDay(),
      });

      if (currentDate.getDay() === 6) {
        result.push(week);
        week = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (week.length > 0) result.push(week);
    return result;
  }, [activityMap]);

  const getColor = (count) => {
    if (count === 0) return "rgba(255,255,255,0.04)";
    if (count <= 1) return "#0e4429";
    if (count <= 3) return "#006d32";
    if (count <= 5) return "#26a641";
    return "#39d353";
  };

  const totalSubmissions = Object.values(activityMap).reduce((s, c) => s + c, 0);
  const activeDays = Object.values(activityMap).filter((c) => c > 0).length;

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    weeks.forEach((week, weekIdx) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ weekIdx, label: months[month] });
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Calendar size={16} color="var(--accent-violet)" />
        <h3 style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
          Activity
        </h3>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "var(--text-muted)",
          marginLeft: "auto",
          letterSpacing: "0.03em",
        }}>
          {totalSubmissions} submissions in the last year
        </span>
      </div>

      {/* Month labels */}
      <div style={{ display: "flex", gap: 0, paddingLeft: 32, marginBottom: 4 }}>
        {monthLabels.map((m, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              left: m.weekIdx * 13.5,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "var(--text-muted)",
              position: "absolute",
              letterSpacing: "0.02em",
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 2.5, overflowX: "auto", paddingBottom: 8, marginTop: 20 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2.5, marginRight: 4, justifyContent: "flex-start" }}>
          {["", "Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
            <div key={i} style={{
              height: 11, width: 24, display: "flex", alignItems: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              color: "var(--text-muted)", letterSpacing: "0.02em",
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
              const day = week.find((d) => d.dayOfWeek === dayIdx);
              return (
                <div
                  key={dayIdx}
                  title={day ? `${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}` : ""}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    background: day ? getColor(day.count) : "transparent",
                    transition: "all 0.2s",
                    cursor: day ? "pointer" : "default",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginTop: 8,
        justifyContent: "flex-end",
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-muted)" }}>Less</span>
        {[0, 1, 3, 5, 7].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 2, background: getColor(c) }} />
        ))}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-muted)" }}>More</span>
      </div>

      {/* Active day stats */}
      <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Flame size={14} color="#f59e0b" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--text-secondary)" }}>
            {activeDays} active days
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stats Ring (Donut) ─────────────────── */
function StatsRing({ solved, total, easy, medium, hard }) {
  const size = 160;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const easyPct = total > 0 ? easy / total : 0;
  const mediumPct = total > 0 ? medium / total : 0;
  const hardPct = total > 0 ? hard / total : 0;

  const easyOffset = circumference * (1 - easyPct);
  const mediumLen = circumference * mediumPct;
  const hardLen = circumference * hardPct;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
          />
          {/* Easy arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--accent-green)" strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - easyPct)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          {/* Medium arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--accent-yellow)" strokeWidth={stroke}
            strokeDasharray={`${mediumLen} ${circumference - mediumLen}`}
            strokeDashoffset={-circumference * easyPct}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          {/* Hard arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--accent-red)" strokeWidth={stroke}
            strokeDasharray={`${hardLen} ${circumference - hardLen}`}
            strokeDashoffset={-circumference * (easyPct + mediumPct)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {solved}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: "var(--text-muted)", marginTop: 4,
            letterSpacing: "0.06em",
          }}>
            SOLVED
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {[
          { label: "Easy", value: easy, color: "var(--accent-green)", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
          { label: "Medium", value: medium, color: "var(--accent-yellow)", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
          { label: "Hard", value: hard, color: "var(--accent-red)", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
        ].map((d) => (
          <div key={d.label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px", borderRadius: 10,
            background: d.bg, border: `1px solid ${d.border}`,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, fontWeight: 600, color: d.color,
              letterSpacing: "0.03em",
            }}>
              {d.label}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14, fontWeight: 700, color: "white",
            }}>
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Category Breakdown ─────────────────── */
function CategoryBreakdown({ byCategory = {} }) {
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const max = categories.length > 0 ? categories[0][1] : 1;

  if (categories.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)", fontSize: 13 }}>
        Solve problems to see your category breakdown.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {categories.slice(0, 8).map(([cat, count]) => (
        <div key={cat}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{cat}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: "var(--text-muted)",
            }}>
              {count}
            </span>
          </div>
          <div style={{
            height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: "var(--gradient-brand)",
              width: `${(count / max) * 100}%`,
              transition: "width 1s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Practice History ─────────────────── */
function PracticeHistory() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUserHistory(page);

  const submissions = data?.submissions || [];
  const totalPages = data?.totalPages || 1;

  const getStatusStyle = (status) => {
    if (status === "Accepted") return { color: "var(--accent-green)", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" };
    if (status === "Wrong Answer") return { color: "var(--accent-red)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)" };
    return { color: "var(--accent-yellow)", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)" };
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Clock size={16} color="var(--accent-violet)" />
        <h3 style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>Practice History</h3>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Loader2 size={24} className="animate-spin" color="var(--accent-violet)" />
        </div>
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--text-muted)", fontSize: 13 }}>
          No submissions yet. Start solving problems!
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {submissions.map((sub, i) => {
              const ss = getStatusStyle(sub.status);
              const problem = sub.problemId;
              return (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  onClick={() => problem?.slug && navigate(`/problem/${problem.slug}`)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 16px", borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
                >
                  {sub.status === "Accepted" ? (
                    <CheckCircle2 size={16} color="var(--accent-green)" />
                  ) : (
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${ss.color}`, flexShrink: 0 }} />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
                      {problem?.title || "Unknown Problem"}
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, color: "var(--text-muted)", marginTop: 2,
                      letterSpacing: "0.02em",
                    }}>
                      {sub.createdAt && formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 600, padding: "4px 10px",
                    borderRadius: 8, background: ss.bg, color: ss.color,
                    border: `1px solid ${ss.border}`, letterSpacing: "0.02em",
                  }}>
                    {sub.status}
                  </span>

                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: "var(--text-muted)", minWidth: 36, textAlign: "right",
                  }}>
                    {sub.language?.slice(0, 2).toUpperCase()}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 20 }}>
              <button
                className="btn btn-sm btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, color: "var(--text-muted)",
              }}>
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-sm btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Main Dashboard Page ─────────────────── */
function DashboardPage() {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useUserStats();
  const { data: activityData, isLoading: activityLoading } = useUserActivity();

  const stats = statsData || {};

  if (statsLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050505" }}>
      <Navbar />

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="mesh-gradient" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0 40px" }}>
        <div className="page-container" style={{ padding: "0 clamp(20px, 4vw, 48px)" }}>
          <motion.div {...fadeUp(0)}>
            <span className="mono-label" style={{ marginBottom: 10, display: "block" }}>YOUR PROGRESS</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.03em", color: "white" }}>
              Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Track your coding progress, submissions, and problem-solving journey.
            </p>
          </motion.div>

          {/* Quick Stats Row */}
          <motion.div {...fadeUp(0.2)} style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
            {[
              { label: "TOTAL SOLVED", value: stats.totalSolved || 0, icon: <Target size={14} />, color: "#10b981" },
              { label: "SUBMISSIONS", value: stats.totalSubmissions || 0, icon: <BarChart3 size={14} />, color: "#818cf8" },
              { label: "ACCEPTANCE", value: `${stats.acceptanceRate || 0}%`, icon: <TrendingUp size={14} />, color: "#f59e0b" },
            ].map((stat, i) => (
              <div key={i} className="hover-glow" style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "14px 20px", transition: "all 0.25s",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${stat.color}12`, border: `1px solid ${stat.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center", color: stat.color,
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>{stat.value}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em",
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────── */}
      <div className="page-container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Activity Heatmap */}
            <motion.div {...fadeUp(0.25)} className="card" style={{ padding: 24 }}>
              {activityLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                  <Loader2 size={20} className="animate-spin" color="var(--accent-violet)" />
                </div>
              ) : (
                <ActivityHeatmap activityMap={activityData?.activity || {}} />
              )}
            </motion.div>

            {/* Practice History */}
            <motion.div {...fadeUp(0.35)} className="card" style={{ padding: 24 }}>
              <PracticeHistory />
            </motion.div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Solved Stats Ring */}
            <motion.div {...fadeUp(0.3)} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <CheckCircle2 size={16} color="var(--accent-violet)" />
                <h3 style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>Total Solved</h3>
              </div>
              <StatsRing
                solved={stats.totalSolved || 0}
                total={stats.totalProblems || 0}
                easy={stats.byDifficulty?.Easy || 0}
                medium={stats.byDifficulty?.Medium || 0}
                hard={stats.byDifficulty?.Hard || 0}
              />
            </motion.div>

            {/* Category Breakdown */}
            <motion.div {...fadeUp(0.4)} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <BarChart3 size={16} color="var(--accent-violet)" />
                <h3 style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>Categories</h3>
              </div>
              <CategoryBreakdown byCategory={stats.byCategory} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
