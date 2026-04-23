import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Code2, CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "../lib/axios";

function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosInstance.get(`/auth/verify-email/${token}`);
        setMessage(res.data.message);
        setStatus("success");
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed");
        setStatus("error");
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-6">
      <div className="animate-fade-in" style={{
        maxWidth: 420, width: '100%',
        background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
        borderRadius: 20, padding: 40, textAlign: 'center'
      }}>
        <div style={{
          width: 44, height: 44, background: 'var(--gradient-brand)',
          borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24
        }}>
          <Code2 size={22} color="white" />
        </div>

        {status === "loading" && (
          <>
            <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px', borderWidth: 3 }} />
            <p style={{ color: 'var(--text-muted)' }}>Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
            }}>
              <CheckCircle size={32} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Email verified! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>{message}</p>
            <Link to="/login" className="btn btn-primary btn-full">Sign In Now</Link>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
            }}>
              <XCircle size={32} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Verification failed</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>{message}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/signup" className="btn btn-primary btn-full">Create New Account</Link>
              <Link to="/login" className="btn btn-secondary btn-full">Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
