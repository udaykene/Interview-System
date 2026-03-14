import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Code2, Zap, Users, Trophy } from "lucide-react";
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
    <div className="min-h-screen animated-bg flex">
      {/* Left Brand Panel */}
      <div className="hidden md-hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ display: 'flex' }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', right: '-10%', width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 60 }}>
            <div style={{
              width: 40, height: 40,
              background: 'var(--gradient-brand)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Code2 size={20} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>CodeInterview</span>
          </div>

          <div style={{ marginBottom: 48 }}>
            <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 16 }}>
              Level up your<br />
              <span className="gradient-text">coding interviews</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Practice with friends, conduct real interviews, and master algorithms in a collaborative environment.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <Zap size={18} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', title: 'Live Collaborative Coding', desc: 'Code together in real-time with video & chat' },
              { icon: <Users size={18} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: '1:1 Interview Sessions', desc: 'Create sessions and share invite links instantly' },
              { icon: <Trophy size={18} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: '200+ Curated Problems', desc: 'From Easy to Hard with test case validation' },
            ].map((item, i) => (
              <div key={i} className="animate-fade-in"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  background: 'rgba(22,26,39,0.6)', border: '1px solid var(--bg-border)',
                  borderRadius: 12, padding: '14px 16px',
                  animationDelay: `${i * 0.1}s`
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: item.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color, flexShrink: 0
                }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', position: 'relative', zIndex: 1 }}>
          © 2024 CodeInterview. Built for engineers, by engineers.
        </p>
      </div>

      {/* Right Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ minWidth: 0 }}>
        <div className="w-full animate-fade-in" style={{ maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="flex items-center gap-2" style={{ marginBottom: 32, justifyContent: 'center' }}>
            <div style={{
              width: 36, height: 36, background: 'var(--gradient-brand)',
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Code2 size={18} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700 }}>CodeInterview</span>
          </div>

          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
            borderRadius: 20, padding: 32
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Sign in to your account</p>

            {/* Social Login */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <a href={`${BACKEND_URL}/api/auth/google`} className="btn btn-google flex-1">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </a>
              <a href={`${BACKEND_URL}/api/auth/github`} className="btn btn-github flex-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>

            <div className="divider" style={{ marginBottom: 24 }}>or continue with email</div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--accent-indigo)', textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? "text" : "password"}
                    className="input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
                style={{ marginTop: 8 }}>
                {loading ? <><div className="spinner" />Signing in...</> : "Sign In"}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--accent-indigo)', fontWeight: 600, textDecoration: 'none' }}>
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
