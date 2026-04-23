import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) return toast.error("Please enter a new password");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password: form.password });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
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
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Check size={24} color="#10b981" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>Password reset!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7, fontSize: 14 }}>
                Your password has been successfully changed. You can now sign in.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ borderRadius: 12 }}>Sign In <ArrowRight size={14} /></Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.025em' }}>Set new password</h1>
                <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Enter your new password below</p>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input" type={showPass ? "text" : "password"}
                      value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPass(s => !s)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                    }}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm Password</label>
                  <input className="input" type="password" value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ padding: '13px', borderRadius: 12, marginTop: 4 }}>
                  {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <>Reset Password <ArrowRight size={14} /></>}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
