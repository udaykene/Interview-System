import { Link } from "react-router-dom";
import {
  ArrowRight, Code2, Sparkles, Users, Video,
  Zap, CheckCircle2, Terminal, Shield, Globe,
  ChevronRight
} from "lucide-react";

const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const normalizedApiUrl = (() => {
  if (!rawApiUrl) return "/api";
  const withoutTrailingSlash = rawApiUrl.replace(/\/+$/, "");
  return /\/api$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
})();
const authUrl = `${normalizedApiUrl}/auth`;

const features = [
  {
    icon: <Video size={22} />,
    color: "#6366f1",
    title: "HD Video Interviews",
    desc: "Crystal-clear video and audio powered by Stream for seamless face-to-face technical sessions.",
  },
  {
    icon: <Code2 size={22} />,
    color: "#8b5cf6",
    title: "Live Code Editor",
    desc: "Monaco-powered editor with real-time collaboration, syntax highlighting & 10+ languages.",
  },
  {
    icon: <Users size={22} />,
    color: "#06b6d4",
    title: "Session Rooms",
    desc: "Create or join rooms instantly with a 6-digit code. Public or private — your choice.",
  },
  {
    icon: <Terminal size={22} />,
    color: "#10b981",
    title: "Run & Execute",
    desc: "Execute code live, see output instantly, and iterate on solutions together in real-time.",
  },
  {
    icon: <Shield size={22} />,
    color: "#f59e0b",
    title: "Problem Library",
    desc: "Curated interview problems across Easy, Medium, and Hard — organized and ready to go.",
  },
  {
    icon: <Globe size={22} />,
    color: "#ef4444",
    title: "Multi-Language",
    desc: "Practice in JavaScript, Python, Go, Java, C++, and more — all in one unified platform.",
  },
];

const stats = [
  { value: "10K+", label: "Active Users", color: "#6366f1" },
  { value: "50K+", label: "Sessions Held", color: "#8b5cf6" },
  { value: "99.9%", label: "Platform Uptime", color: "#10b981" },
  { value: "15+", label: "Languages", color: "#06b6d4" },
];

const codeLines = [
  { indent: 0, color: "#8b5cf6", text: "function twoSum(nums, target) {" },
  { indent: 1, color: "#6366f1", text: "  const map = new Map();" },
  { indent: 1, color: "#e2e8f0", text: "  for (let i = 0; i < nums.length; i++) {" },
  { indent: 2, color: "#6366f1", text: "    const comp = target - nums[i];" },
  { indent: 2, color: "#10b981", text: "    if (map.has(comp)) {" },
  { indent: 3, color: "#f59e0b", text: "      return [map.get(comp), i];" },
  { indent: 2, color: "#10b981", text: "    }" },
  { indent: 2, color: "#6366f1", text: "    map.set(nums[i], i);" },
  { indent: 1, color: "#e2e8f0", text: "  }" },
  { indent: 0, color: "#8b5cf6", text: "}" },
];

const HomePage = () => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", overflowX: "hidden" }}>

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        height: "var(--navbar-height)",
        background: "rgba(13,15,26,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--bg-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 24
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, background: "var(--gradient-brand)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Code2 size={16} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
            CodeInterview
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Auth Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href={`${authUrl}/google`} className="btn btn-google" style={{ padding: "8px 18px", fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </a>
          <a href={`${authUrl}/github`} className="btn btn-github" style={{ padding: "8px 18px", fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "80px 24px 60px", overflow: "hidden" }}>
        {/* Glow blobs */}
        <div style={{
          position: "absolute", top: -120, left: "20%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: 0, right: "10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* LEFT — Copy */}
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Tag */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 99, padding: "6px 14px", width: "fit-content"
            }}>
              <Sparkles size={13} color="#6366f1" />
              <span style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 600 }}>Real-time Collaborative Platform</span>
            </div>

            {/* Headline */}
            <div>
              <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                <span className="gradient-text">Ace Technical</span>
                <br />
                <span style={{ color: "var(--text-primary)" }}>Interviews</span>
                <br />
                <span style={{ color: "var(--text-secondary)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 46px)" }}>Together.</span>
              </h1>
            </div>

            {/* Sub */}
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, maxWidth: 460 }}>
              The all-in-one platform for collaborative coding sessions — live video, Monaco editor, real-time execution, and curated problems. No setup required.
            </p>

            {/* Checks */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Live collaborative code editor", "HD video & voice — powered by Stream", "Run code in 15+ languages instantly"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={`${authUrl}/google`} className="btn btn-primary btn-lg" style={{ gap: 10 }}>
                Start for Free
                <ArrowRight size={17} />
              </a>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* RIGHT — Code Preview Panel */}
          <div className="animate-slide-up" style={{ position: "relative" }}>
            {/* Outer glow */}
            <div style={{
              position: "absolute", inset: -2,
              background: "var(--gradient-brand)",
              borderRadius: 20, opacity: 0.3, filter: "blur(12px)"
            }} />

            {/* Code Panel */}
            <div className="glass" style={{
              position: "relative", borderRadius: 18, overflow: "hidden",
              border: "1px solid rgba(99,102,241,0.25)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
            }}>
              {/* Title bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 16px", borderBottom: "1px solid var(--bg-border)",
                background: "rgba(13,15,26,0.6)"
              }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#10b981" }} />
                <div style={{ flex: 1 }} />
                <div style={{
                  background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 6, padding: "2px 10px", fontSize: 11, color: "#8b5cf6"
                }}>
                  twoSum.js
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 5, fontSize: 11,
                  color: "#10b981", background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, padding: "2px 8px"
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                  2 collaborators
                </div>
              </div>

              {/* Code body */}
              <div style={{ padding: "20px 20px 4px", background: "#0a0c15", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                {codeLines.map((line, i) => (
                  <div key={i} className="stagger-children" style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "3px 0", animationDelay: `${i * 0.06}s`
                  }}>
                    <span style={{ color: "#4a5568", fontSize: 11, width: 16, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ color: line.color }}>{line.text}</span>
                  </div>
                ))}

                {/* Typing cursor line */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "3px 0 20px" }}>
                  <span style={{ color: "#4a5568", fontSize: 11, width: 16, textAlign: "right" }}>{codeLines.length + 1}</span>
                  <span style={{
                    display: "inline-block", width: 2, height: 16, background: "#6366f1",
                    borderRadius: 1, animation: "pulse-glow 1s ease-in-out infinite"
                  }} />
                </div>
              </div>

              {/* Output bar */}
              <div style={{
                background: "#080a11", borderTop: "1px solid var(--bg-border)",
                padding: "10px 20px", display: "flex", alignItems: "center", gap: 10
              }}>
                <Terminal size={13} color="var(--text-muted)" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#10b981" }}>
                  ✓ Output: [0, 1]
                </span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>12ms</span>
              </div>
            </div>

            {/* Floating badge */}
            <div style={{
              position: "absolute", bottom: -18, left: -18,
              background: "var(--bg-card)", border: "1px solid var(--bg-border)",
              borderRadius: 12, padding: "10px 16px",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "var(--shadow-md)"
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={16} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Live Session Active</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>2 users coding now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS BAR ──────────────────────────────────────── */}
      <div style={{ padding: "48px 24px 0" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          background: "var(--bg-card)", border: "1px solid var(--bg-border)",
          borderRadius: 16, padding: "28px 40px",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center",
              borderRight: i < stats.length - 1 ? "1px solid var(--bg-border)" : "none",
              padding: "0 24px"
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color, letterSpacing: -1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ────────────────────────────────────────── */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 99, padding: "5px 14px", marginBottom: 16
            }}>
              <span style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 600 }}>Platform Features</span>
            </div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, margin: 0 }}>
              Everything you need to{" "}
              <span className="gradient-text">succeed</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 12, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
              A professional-grade interview environment, built for engineers by engineers.
            </p>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${f.color}18`, border: `1px solid ${f.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color, marginBottom: 16
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA SECTION ─────────────────────────────────────── */}
      <div style={{ padding: "0 24px 80px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
          border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20,
          padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60, width: 240, height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute", bottom: -60, left: -60, width: 240, height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />

          <div style={{ position: "relative" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 99, padding: "5px 14px", marginBottom: 20
            }}>
              <Sparkles size={13} color="#6366f1" />
              <span style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 600 }}>Free to Get Started</span>
            </div>

            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, marginBottom: 14, margin: 0 }}>
              Ready to land your <span className="gradient-text">dream role?</span>
            </h2>

            <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "12px auto 32px", maxWidth: 480 }}>
              Join thousands of engineers who practice, collaborate, and interview — all in one place.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <a href={`${authUrl}/google`} className="btn btn-google btn-lg" style={{ gap: 10, minWidth: 180 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </a>
              <a href={`${authUrl}/github`} className="btn btn-github btn-lg" style={{ gap: 10, minWidth: 180 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Continue with GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid var(--bg-border)",
        padding: "24px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}>
        <div style={{
          width: 22, height: 22, background: "var(--gradient-brand)",
          borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Code2 size={12} color="white" />
        </div>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          © 2025 CodeInterview · Built for engineers
        </span>
      </div>
    </div>
  );
};

export default HomePage;
