import { Loader2, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import { useSubmissionsForProblem } from "../hooks/useSubmissions";

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatusIcon(status) {
  if (status === "Accepted") return <CheckCircle2 size={14} />;
  if (status === "Wrong Answer") return <XCircle size={14} />;
  return <AlertTriangle size={14} />;
}

function getStatusColor(status) {
  if (status === "Accepted") return "var(--accent-green)";
  if (status === "Wrong Answer") return "var(--accent-red)";
  if (status === "Compilation Error") return "var(--accent-yellow)";
  return "var(--accent-yellow)";
}

function SubmissionsTab({ problemId }) {
  const { data, isLoading } = useSubmissionsForProblem(problemId);
  const submissions = data?.submissions || [];

  if (isLoading) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={22} className="animate-spin" color="var(--accent-violet)" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div style={{
        height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12, padding: 40,
      }}>
        <Clock size={32} color="var(--text-muted)" strokeWidth={1.5} />
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          color: "var(--text-muted)", letterSpacing: "0.04em", textAlign: "center",
        }}>
          NO SUBMISSIONS YET
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", maxWidth: 260 }}>
          Submit your solution to see your submission history here.
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "16px 20px" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
        color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: 14,
      }}>
        ALL SUBMISSIONS ({submissions.length})
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {submissions.map((sub) => (
          <div
            key={sub._id}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${sub.status === "Accepted" ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = sub.status === "Accepted" ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = sub.status === "Accepted" ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)";
            }}
          >
            {/* Top row: status + time ago */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                color: getStatusColor(sub.status),
                fontWeight: 600, fontSize: 13,
              }}>
                {getStatusIcon(sub.status)}
                {sub.status}
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: "var(--text-muted)", letterSpacing: "0.03em",
              }}>
                {formatTimeAgo(sub.createdAt)}
              </span>
            </div>

            {/* Bottom row: language, runtime, test results */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                padding: "2px 8px", borderRadius: 6,
                background: "rgba(139,92,246,0.1)", color: "rgba(139,92,246,0.8)",
                border: "1px solid rgba(139,92,246,0.15)", letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                {sub.language}
              </span>

              {sub.runtimeMs != null && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  color: "var(--text-muted)", letterSpacing: "0.03em",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Clock size={10} />
                  {sub.runtimeMs} ms
                </span>
              )}

              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: "var(--text-muted)", letterSpacing: "0.03em", marginLeft: "auto",
              }}>
                {sub.passedTests}/{sub.totalTests} passed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubmissionsTab;
