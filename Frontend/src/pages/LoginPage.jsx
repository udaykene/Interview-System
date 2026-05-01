import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContextState";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
// });

function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Please fill all fields");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/login", form);
      await refresh();
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (err.response?.data?.needsVerification) {
        toast.error("Please verify your email first. Check your inbox!");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mesh-gradient"
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        flexDirection: "column",
        color: "#e8eaed",
        fontFamily: "'Geist', sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(20px, 4vw, 48px)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--gradient-brand)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(124,91,240,0.2)",
            }}
          >
            <Code2 size={13} color="white" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            CodeArena
          </span>
        </Link>
      </nav>

      {/* Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          marginTop:12,
          padding: "0 20px",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            maxWidth: 420,
            // background: "rgba(255,255,255,0.03)",
            // border: "1px solid rgba(255,255,255,0.06)",
            // borderRadius: 20, padding: "40px 36px",
            // boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,91,240,0.04)"
          }}
        >
          <div style={{ marginBottom: 18 }}>
            {/* <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.025em" }}>Welcome back</h1> */}
            <h1 className="font-medium ml-10 text-xl text-(--text-strong)">
              Sign In to CodeArena
            </h1>
          </div>

          {/* Social Login */}
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <a
              href={`${BACKEND_URL}/api/auth/github`}
              className="btn btn-github"
              style={{
                padding: "11px",
                fontSize: 13,
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href={`${BACKEND_URL}/api/auth/google`}
              className="btn border  btn-google"
              style={{
                padding: "11px",
                fontSize: 13,
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </a>
          </motion.div>

          <div className="text-center text-xs" style={{ marginBottom: 12 }}>
            or
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <motion.div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                autoComplete="email"
              />
            </motion.div>
            <motion.div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  placeholder="correct horse battery staple"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="purple-btn-animation "
              style={{
                
                marginTop: 8,
                fontWeight: 400,
                padding: "12px",
                width: "20%",
              }}
            >
              <span>
              {loading ? (
                <div className="spinner" style={{ width: 16, height: 16 }} />
              ) : (
                <>Sign in</>
              )}
              </span>
            </motion.button>
          </form>

          <motion.div
            style={{
              marginTop: 22,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
              Need an account?{" "}
              <Link
                to="/signup"
                style={{ color: "#D1b8ff", textDecoration: "none" }}
              >
                Sign up
              </Link>
            </span>
            <Link
              to="/forgot-password"
              style={{
                fontSize: 10,
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Forgot your password?{" "}
              <span style={{ color: "#D1b8ff" }}>Reset it</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
