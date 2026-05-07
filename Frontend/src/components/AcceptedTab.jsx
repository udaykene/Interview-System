import { CheckCircle2, Zap, TrendingUp } from "lucide-react";

function AcceptedTab({ result }) {
  if (!result) {
    return null;
  }

  const { runtimeMs, beatsPercent, passedTests, totalTests, status } = result;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "24px 20px" }}>
      {/* Accepted header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 28, paddingBottom: 20,
        borderBottom: "1px solid rgba(34,197,94,0.12)",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CheckCircle2 size={22} color="var(--accent-green)" />
        </div>
        <div>
          <div style={{
            fontSize: 20, fontWeight: 700,
            color: "var(--accent-green)", letterSpacing: "-0.02em",
          }}>
            {status || "Accepted"}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: "var(--text-muted)", letterSpacing: "0.04em", marginTop: 2,
          }}>
            {passedTests} / {totalTests} TESTCASES PASSED
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {/* Runtime card */}
        <div style={{
          flex: 1, padding: "18px 20px", borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, var(--accent-violet), rgba(139,92,246,0.3))",
          }} />
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
          }}>
            <Zap size={13} color="var(--accent-violet)" />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em",
            }}>
              RUNTIME
            </span>
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: "white",
            letterSpacing: "-0.03em", lineHeight: 1,
          }}>
            {runtimeMs != null ? runtimeMs : "—"}
            <span style={{
              fontSize: 14, fontWeight: 500,
              color: "var(--text-muted)", marginLeft: 4,
            }}>
              ms
            </span>
          </div>
        </div>

        {/* Beats card — only shown when beatsPercent is available */}
        {beatsPercent != null && (
          <div style={{
            flex: 1, padding: "18px 20px", borderRadius: 14,
            background: "rgba(34,197,94,0.03)",
            border: "1px solid rgba(34,197,94,0.1)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, var(--accent-green), rgba(34,197,94,0.3))",
            }} />
            <div style={{
              display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
            }}>
              <TrendingUp size={13} color="var(--accent-green)" />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em",
              }}>
                BEATS
              </span>
            </div>
            <div style={{
              fontSize: 28, fontWeight: 800, color: "var(--accent-green)",
              letterSpacing: "-0.03em", lineHeight: 1,
            }}>
              {beatsPercent}
              <span style={{
                fontSize: 14, fontWeight: 500,
                color: "rgba(34,197,94,0.6)", marginLeft: 2,
              }}>
                %
              </span>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: "var(--text-muted)", marginTop: 6, letterSpacing: "0.03em",
            }}>
              of submissions
            </div>
          </div>
        )}
      </div>

      {/* Runtime bar visualization */}
      {runtimeMs != null && (
        <div style={{
          padding: "16px 20px", borderRadius: 12,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em",
            marginBottom: 12,
          }}>
            RUNTIME DISTRIBUTION
          </div>
          <div style={{
            height: 8, borderRadius: 99,
            background: "rgba(255,255,255,0.04)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: beatsPercent != null ? `${Math.max(5, beatsPercent)}%` : "50%",
              background: "linear-gradient(90deg, var(--accent-green), var(--accent-violet))",
              transition: "width 1s ease-out",
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 8,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            color: "var(--text-muted)", letterSpacing: "0.04em",
          }}>
            <span>FASTER</span>
            <span>SLOWER</span>
          </div>
        </div>
      )}

      {/* Note when percentile is unavailable */}
      {beatsPercent == null && runtimeMs != null && (
        <div style={{
          marginTop: 16, padding: "12px 16px", borderRadius: 10,
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.1)",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          color: "var(--text-muted)", letterSpacing: "0.03em", lineHeight: 1.6,
        }}>
          📊 Percentile comparison will appear once there are enough accepted submissions for this problem.
        </div>
      )}
    </div>
  );
}

export default AcceptedTab;
