import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error("Please fill all required fields");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="mesh-gradient" style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8eaed", fontFamily: "'Geist', sans-serif" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 420, width: "100%", padding: 48, textAlign: "center",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          background: 'rgba(16,185,129,0.06)'
        }}>
          <Check size={24} color="#10b981" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.025em' }}>Check your email!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
          We sent a verification link to <strong style={{ color: 'white' }}>{form.email}</strong>.
          Click the link to activate your account.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ borderRadius: 12 }}>
          Go to Login <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="mesh-gradient" style={{ minHeight: "100vh", background: "#050505", display: "flex", flexDirection: "column", color: "#e8eaed", fontFamily: "'Geist', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ height: 64, display: "flex", alignItems: "center", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, background: 'var(--gradient-brand)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(124,91,240,0.2)' }}>
            <Code2 size={13} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "white", letterSpacing: "-0.02em" }}>CodeArena</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
        <motion.div {...fadeUp(0.1)} style={{
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: "36px 36px 40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,91,240,0.04)"
        }}>
          <motion.div {...fadeUp(0.15)} style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.025em" }}>Create an account</h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Start mastering coding interviews today</p>
          </motion.div>

          {/* Social signup */}
          <motion.div {...fadeUp(0.2)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <a href={`${BACKEND_URL}/api/auth/github`} className="btn btn-github" style={{ padding: '11px', fontSize: 13, borderRadius: 12, textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a href={`${BACKEND_URL}/api/auth/google`} className="btn btn-google" style={{ padding: '11px', fontSize: 13, borderRadius: 12, textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </a>
          </motion.div>

          <div className="divider" style={{ marginBottom: 24 }}>or</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <motion.div {...fadeUp(0.25)} className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input" type="text" placeholder="John Doe"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </motion.div>
            <motion.div {...fadeUp(0.28)} className="input-group">
              <label className="input-label">Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </motion.div>
            <motion.div {...fadeUp(0.31)} className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPass ? "text" : "password"}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.34)} className="input-group">
              <label className="input-label">Confirm Password</label>
              <input className="input" type="password"
                value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
            </motion.div>
            
            <motion.button {...fadeUp(0.37)} type="submit" disabled={loading} className="btn btn-primary btn-full"
              style={{ marginTop: 8, padding: '13px', borderRadius: 12 }}>
              {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <>Create Account <ArrowRight size={14} /></>}
            </motion.button>
          </form>

          <motion.div {...fadeUp(0.4)} style={{ marginTop: 24, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--accent-violet-light)', textDecoration: 'none' }}>Sign in</Link>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupPage;
