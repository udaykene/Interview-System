import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Mail } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-gradient" style={{ minHeight: "100vh", background: "#050505", display: "flex", flexDirection: "column", color: "#e8eaed", fontFamily: "'Geist', sans-serif" }}>
      <nav style={{ height: 64, display: "flex", alignItems: "center", padding: "0 clamp(20px, 4vw, 48px)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, background: 'var(--gradient-brand)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(124,91,240,0.2)' }}>
            <Code2 size={13} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "white", letterSpacing: "-0.02em" }}>CodeArena</span>
        </Link>
      </nav>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "0 20px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "40px 36px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
          }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124,91,240,0.08)', border: '1px solid rgba(124,91,240,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Mail size={24} color="#9b7bff" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>Check your email</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7, fontSize: 14 }}>
                If an account exists for <strong style={{ color: 'white' }}>{email}</strong>, we've sent a reset link.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ borderRadius: 12 }}>Back to Login</Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.025em' }}>Reset your password</h1>
                <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Enter your email and we'll send you a reset link</p>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input className="input" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ padding: '13px', borderRadius: 12, marginTop: 4 }}>
                  {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <>Send Reset Link <ArrowRight size={14} /></>}
                </button>
              </form>
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Link to="/login" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Remember your password? <span style={{ color: 'var(--accent-violet-light)' }}>Sign in</span>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
