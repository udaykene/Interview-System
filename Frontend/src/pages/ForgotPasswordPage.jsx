import { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Mail, ArrowLeft } from "lucide-react";
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
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-6">
      <div className="w-full animate-fade-in" style={{ maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, background: 'var(--gradient-brand)',
            borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
          }}>
            <Code2 size={22} color="white" />
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
          borderRadius: 20, padding: 32
        }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(99,102,241,0.1)', border: '2px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <Mail size={24} color="var(--accent-indigo)" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Check your inbox</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
                We sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
              </p>
              <Link to="/login" className="btn btn-primary btn-full">Back to Login</Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Forgot your password?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input type="email" className="input" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? <><div className="spinner" />Sending...</> : "Send Reset Link"}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14
                }}>
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
