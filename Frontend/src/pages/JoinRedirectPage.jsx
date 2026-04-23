import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { sessionApi } from "../api/sessions";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function JoinRedirectPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const join = async () => {
      try {
        const normalized = code?.toUpperCase();
        const data = await sessionApi.joinByCode(normalized);
        navigate(`/session/${data.session._id}?code=${normalized}`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to join session");
        navigate("/dashboard");
      }
    };
    if (code) join();
  }, [code, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="var(--accent-violet)" style={{ margin: '0 auto 16px', display: 'block' }} />
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
          JOINING SESSION...
        </p>
      </div>
    </div>
  );
}

export default JoinRedirectPage;
