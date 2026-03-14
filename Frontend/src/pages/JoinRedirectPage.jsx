import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { sessionApi } from "../api/sessions";
import toast from "react-hot-toast";

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70">Joining session...</p>
      </div>
    </div>
  );
}

export default JoinRedirectPage;
