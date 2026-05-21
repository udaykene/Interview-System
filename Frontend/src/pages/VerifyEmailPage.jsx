import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Check, X, Loader2 } from "lucide-react";
import axiosInstance from "../lib/axios";

function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (!token || hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true;

    const verify = async () => {
      try {
        await axiosInstance.get(`/auth/verify-email/${token}`);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

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
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "48px 36px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)", textAlign: "center"
          }}>
          {status === "loading" && (
            <>
              <Loader2 size={36} className="animate-spin" color="var(--accent-violet)" style={{ margin: '0 auto 20px', display: 'block' }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>Verifying your email...</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Please wait a moment</p>
            </>
          )}
          {status === "success" && (
            <>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Check size={24} color="#10b981" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>Email verified!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7, fontSize: 14 }}>
                Your account is now active. You can sign in and start practicing.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ borderRadius: 12 }}>Sign In</Link>
            </>
          )}
          {status === "error" && (
            <>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <X size={24} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>Verification failed</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7, fontSize: 14 }}>
                This link may have expired or is invalid. Please try signing up again.
              </p>
              <Link to="/signup" className="btn btn-primary" style={{ borderRadius: 12 }}>Sign Up Again</Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
