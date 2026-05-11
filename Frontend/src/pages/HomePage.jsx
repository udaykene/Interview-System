import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContextState";
import { motion } from "framer-motion";
import { Terminal, Zap, Users, Code2, Shield } from "lucide-react";

const codeSnippet = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
}`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const features = [
  {
    icon: <Terminal size={20} />,
    title: "Real-time Code Editor",
    desc: "Monaco-powered editor with syntax highlighting, autocomplete, and multi-language support.",
    mono: "MONACO",
  },
  {
    icon: <Users size={20} />,
    title: "Live Collaboration",
    desc: "Pair-program in real-time with video, audio, and synchronized code editing.",
    mono: "P2P",
  },
  {
    icon: <Zap size={20} />,
    title: "Instant Execution",
    desc: "Run code against test cases instantly. Get immediate feedback on correctness and performance.",
    mono: "PISTON",
  },
  {
    icon: <Shield size={20} />,
    title: "Curated Problems",
    desc: "Hand-picked interview problems organized by difficulty, topic, and company tags.",
    mono: "DSA",
  },
];

const workflow = [
  {
    step: "01",
    title: "Choose the right problem set",
    desc: "Practice by topic, difficulty, or session goal instead of solving random questions.",
  },
  {
    step: "02",
    title: "Open a live room and solve together",
    desc: "Bring in a partner, explain your thinking out loud, and code in a shared interview setup.",
  },
  {
    step: "03",
    title: "Run, review, and improve the answer",
    desc: "Use fast execution feedback to refine correctness, edge cases, and communication.",
  },
];

const HomePage = () => {
  const { isSignedIn } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        overflowX: "hidden",
        color: "#e8eaed",
        fontFamily: "'Geist', sans-serif",
      }}
    >
      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav
        style={{
          height: 72,
          background: "#0d0d0d",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid #e3e3e3",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          padding: "0 0 0 2vw",
          // padding: "0 clamp(0px, 4vw, 48px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              // background:"black",
              // background: "var(--gradient-brand)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // boxShadow: "0 0 16px rgba(124,91,240,0.25)",
            }}
          >
            <Code2 size={22} fontWeight={200} color="white" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            CodeArena
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Link
            to={isSignedIn ? "/dashboard" : "/login"}
            className="purple-btn-animation"
            style={{
              height: "100%",
              padding: "0px 30px",
              fontSize: 16,
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              borderLeft: "1px solid #333",
              textDecoration: "none", // Ensures no underline
            }}
          >
            <span style={{ position: "relative", zIndex: 2 }}>Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <div
        className="mesh-gradient render-hero-surface"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div className="render-hero-accent" />
        <div
          style={{
            padding:
              "clamp(56px, 7vw, 116px) clamp(20px, 4vw, 48px) clamp(60px, 8vw, 100px)",
            maxWidth: 1300,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* LEFT — Copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#c995ff",
                  letterSpacing: "0.08em",
                  background: "rgba(138,5,255,0.08)",
                  border: "1px solid rgba(138,5,255,0.18)",
                  borderRadius: 99,
                  padding: "5px 14px",
                }}
              >
                NOW IN BETA
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="heading-xl"
              style={{
                fontSize: "clamp(2.65rem, 5vw, 4.2rem)",
                lineHeight: 0.96,
                fontWeight: 400,
                letterSpacing: "-0.05em",
                maxWidth: 620,
              }}
            >
              <span style={{ color: "#ffffff" }}>Your fastest path to</span>
              <br />
              <span style={{ color: "#ffffff" }}>production for</span>
              <br />
              <span className="render-gradient-text" style={{ fontWeight: 400 }}>
                coding interviews.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              style={{
                fontSize: 16,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: 520,
                fontWeight: 400,
              }}
            >
              Intuitive interview infrastructure to scale every practice round
              from your first mock session to your best performance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              style={{ display: "flex", gap: 14, marginTop: 8 }}
            >
              <Link
                to={isSignedIn ? "/dashboard" : "/signup"}
                className=" purple-btn-animation btn-lg"
                style={{
                  borderRadius:0,
                  // height: "100%",
                  padding: "0px 30px",
                  fontSize: 16,
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  borderLeft: "1px solid #333",
                  textDecoration: "none", // Ensures no underline
                }}
              >
                <span style={{ display:'flex', alignItems:"center", gap:8, position: "relative", zIndex: 2 }}>Start for free <svg  xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 20" fill="none"><rect x="8" y="8" width="4" height="4" fill="currentColor"></rect><rect x="4" y="4" width="4" height="4" fill="currentColor"></rect><rect width="4" height="4" fill="currentColor"></rect><rect x="4" y="12" width="4" height="4" fill="currentColor"></rect><rect y="16" width="4" height="4" fill="currentColor"></rect></svg></span>
              </Link>
              <Link
                to={isSignedIn ? "/problems" : "/login"}
                className="btn-lg white-btn-animation"
                style={{
                  borderRadius:0,
                  border: "1px solid white",
                  
                }}
              >
                <span style={{ display:'flex', alignItems:"center", gap:4, position: "relative", zIndex: 2 }}>Explore Problems</span>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              style={{ display: "flex", gap: 32, marginTop: 16 }}
            >
              {[
                { value: "500+", label: "Problems" },
                { value: "10k+", label: "Sessions" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "white",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.04em",
                      marginTop: 2,
                    }}
                  >
                    {stat.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Terminal */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: 540,
            }}
          >
            <div className="render-grid-overlay" />
            {/* <div className="render-command-chip">$ git push</div> */}
            <div className="render-connector-line" />
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 0,
                padding: 0,
                position: "absolute",
                right: 0,
                bottom: 34,
                width: "min(100%, 640px)",
                overflow: "hidden",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(138,5,255,0.04)",
              }}
            >
            {/* Terminal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#febc2e",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
              <span
                style={{
                  marginLeft: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                production
              </span>
            </div>

            {/* Code content */}
            <div style={{ padding: "20px 24px 28px" }}>
              <pre
                style={{
                  margin: 0,
                  color: "#d4d4d4",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  lineHeight: 1.65,
                  overflowX: "auto",
                }}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: codeSnippet
                      .replace(
                        /function|const|let|for|if|return/g,
                        '<span style="color: #c995ff">$&</span>',
                      )
                      .replace(
                        /twoSum|Map|set|has|get/g,
                        '<span style="color: #82aaff">$&</span>',
                      )
                      .replace(
                        /\/\/.*/g,
                        '<span style="color: #546e7a">$&</span>',
                      ),
                  }}
                />
              </pre>
            </div>

            {/* Result badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              style={{
                position: "absolute",
                bottom: -16,
                right: 28,
                background: "#0d0d0d",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: 10,
                padding: "10px 18px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(16,185,129,0.08)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#10b981",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                ALL TESTS PASSED
              </span>
            </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── FEATURES BENTO GRID ──────────────────────────────── */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 120px) clamp(20px, 4vw, 48px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            marginBottom: "clamp(40px, 6vw, 72px)",
          }}
        >
            <span
              className="mono-label"
              style={{ marginBottom: 16, display: "block" }}
            >
              FEATURES
          </span>
          <h2
            className="heading-lg"
            style={{ color: "white", marginBottom: 16 }}
          >
            Everything you need to{" "}
            <span className="gradient-text">ace the interview</span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            A complete platform built for developers who want to master coding
            interviews with real-time collaboration.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card-glow"
              style={{ padding: 32, cursor: "default" }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(138,5,255,0.08)",
                  border: "1px solid rgba(138,5,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c995ff",
                  marginBottom: 20,
                }}
              >
                {f.icon}
              </div>
              <span
                className="mono-label"
                style={{ marginBottom: 8, display: "block" }}
              >
                {f.mono}
              </span>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "white",
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px) clamp(70px, 8vw, 110px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="render-workflow-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
            gap: 24,
          }}
        >
          <div
            className="card-glow render-workflow-intro"
            style={{
              padding: "clamp(26px, 4vw, 36px)",
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(138,5,255,0.1)",
            }}
          >
            <span className="mono-label" style={{ marginBottom: 14, display: "block" }}>
              WORKFLOW
            </span>
            <h2 className="heading-lg" style={{ color: "white", marginBottom: 14 }}>
              Practice in the same flow you want on interview day.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                maxWidth: 480,
              }}
            >
              CodeArena keeps problems, live collaboration, code execution, and
              review close together so each practice round feels focused.
            </p>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {workflow.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="card-glow render-workflow-card"
                style={{
                  padding: "22px 24px",
                  display: "grid",
                  gridTemplateColumns: "56px 1fr",
                  gap: 18,
                  alignItems: "start",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 18,
                    color: "#c995ff",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "white",
                      marginBottom: 8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── CTA SECTION ──────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 48px) clamp(80px, 10vw, 140px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-glow"
          style={{
            padding: "clamp(40px, 6vw, 72px)",
            textAlign: "center",
            background: "rgba(138,5,255,0.03)",
            borderColor: "rgba(138,5,255,0.12)",
          }}
        >
          <span
            className="mono-label"
            style={{ marginBottom: 20, display: "block" }}
          >
            GET STARTED
          </span>
          <h2
            className="heading-lg"
            style={{ color: "white", marginBottom: 16 }}
          >
            Ready to level up your interview game?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              maxWidth: 480,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            Join thousands of developers preparing for technical interviews with
            real-time collaboration.
          </p>
          <Link
            to={isSignedIn ? "/dashboard" : "/signup"}
            className="purple-btn-animation "
            style={{
              padding: "14px 30px",
              fontSize: 16,
              fontWeight: 400,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid #333",
              textDecoration: "none", // Ensures no underline
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                position: "relative",
                zIndex: 2,
                width: "auto",
              }}
            >
              Start Practicing Now
              <svg  xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 20" fill="none"><rect x="8" y="8" width="4" height="4" fill="currentColor"></rect><rect x="4" y="4" width="4" height="4" fill="currentColor"></rect><rect width="4" height="4" fill="currentColor"></rect><rect x="4" y="12" width="4" height="4" fill="currentColor"></rect><rect y="16" width="4" height="4" fill="currentColor"></rect></svg>
            </span>
          </Link>
        </motion.div>
      </div>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px clamp(20px, 4vw, 48px)",
          maxWidth: 1300,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            © 2025 CODEARENA
          </span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Terms", "Privacy", "Security"].map((l) => (
            <span
              key={l}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "var(--text-muted)",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
