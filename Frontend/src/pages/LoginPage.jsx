import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContextState";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill all fields");
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
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", color: "white", fontFamily: "'Inter', sans-serif" }}>
      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        padding: "0 24px"
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="6" height="6" rx="2" fill="white"/>
            <rect x="10" y="4" width="6" height="6" rx="2" fill="white"/>
            <rect x="2" y="12" width="6" height="6" rx="2" fill="white"/>
            <rect x="10" y="12" width="6" height="6" rx="2" fill="white"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: 18, color: "white" }}>
            CodeInterview
          </span>
        </Link>
      </nav>

      {/* ─── AUTH FORM ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", paddingTop: "80px" }}>
        <div style={{ width: "100%", maxWidth: "420px", padding: "0 20px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "32px", textAlign: "center" }}>
            Sign In to CodeInterview
          </h1>

          {/* Social Login */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <a href={`${BACKEND_URL}/api/auth/github`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', border: '1px solid #333', borderRadius: '4px',
              color: 'white', textDecoration: 'none', fontSize: '14px', background: 'transparent', transition: 'border-color 0.2s'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href={`${BACKEND_URL}/api/auth/google`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', border: '1px solid #333', borderRadius: '4px',
              color: 'white', textDecoration: 'none', fontSize: '14px', background: 'transparent', transition: 'border-color 0.2s'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
            <span style={{ fontSize: '12px', color: '#888', background: '#0a0a0a', zIndex: 1, padding: '0 10px' }}>or</span>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#333' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                style={{
                  width: '100%', padding: '12px', background: '#121212', border: '1px solid #333',
                  borderRadius: '4px', color: 'white', fontSize: '14px', outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder=""
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '12px', paddingRight: '44px', background: '#121212', border: '1px solid #333',
                    borderRadius: '4px', color: 'white', fontSize: '14px', outline: 'none'
                  }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#888'
                  }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <button type="submit" disabled={loading}
              style={{
                marginTop: '12px', padding: '12px', width: '100px', background: 'white', color: 'black',
                border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              {loading ? "..." : "Sign in"}
            </button>
          </form>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
              Forgot your password? <span style={{ textDecoration: 'underline' }}>Reset it</span>
            </Link>
            <span style={{ fontSize: '13px', color: '#888' }}>
              Need an account? <Link to="/signup" style={{ color: '#888', textDecoration: 'underline' }}>Sign up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
