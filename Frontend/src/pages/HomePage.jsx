import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContextState";

const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const normalizedApiUrl = (() => {
  if (!rawApiUrl) return "/api";
  const withoutTrailingSlash = rawApiUrl.replace(/\/+$/, "");
  return /\/api$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
})();
const authUrl = `${normalizedApiUrl}/auth`;

const codeSnippet = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
}`;

const HomePage = () => {
  const { isSignedIn } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", overflowX: "hidden", color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        height: "100px",
        background: "#0a0a0a",
        borderBottom: "1px solid #ffffffff",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        // padding: "0 24px"
      }}>
        {/* Logo */}
        <div className="pl-6" style={{ display: "flex",paddingLeft:"24px", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="6" height="6" rx="2" fill="white"/>
            <rect x="10" y="4" width="6" height="6" rx="2" fill="white"/>
            <rect x="2" y="12" width="6" height="6" rx="2" fill="white"/>
            <rect x="10" y="12" width="6" height="6" rx="2" fill="white"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: 28, color: "white" }}>
            CodeInterview
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Auth Buttons */}
        <div className="h-[100px] w-[200px]" style={{ display: "flex", alignItems: "center" }}>
          {isSignedIn ? (
            <Link className="bg-white text-black h-full w-full flex justify-center items-center text-2xl " to="/dashboard">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ color: "#a0a0a0", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                Sign in
              </Link>
              <Link to="/signup" style={{
                background: "white", color: "black", fontWeight: 500, padding: "8px 16px", borderRadius: 4, textDecoration: "none", fontSize: 14
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <div style={{ padding: "100px 24px 80px", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        {/* LEFT — Copy */}
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1 style={{ fontSize: "56px", fontWeight: 500, lineHeight: 1.1, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ffffff" }}>Your fastest path to</span>
            <br />
            <span style={{ color: "#ffffff" }}>mastery for</span>
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1px #ffffff", fontWeight: 500 }}>coding interviews.</span>
          </h1>

          <p style={{ fontSize: 18, color: "#8a8f98", lineHeight: 1.6, margin: 0, maxWidth: 500, fontWeight: 400 }}>
            Intuitive collaboration to scale any interview from your first practice run to your dream job.
          </p>

          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <Link to={isSignedIn ? "/dashboard" : "/signup"} style={{
              background: "white", color: "black", fontWeight: 500, padding: "12px 24px", borderRadius: 4, textDecoration: "none", fontSize: 16, display: "inline-flex", alignItems: "center"
            }}>
              Get Started for Free
            </Link>
          </div>
        </div>

        {/* RIGHT — Terminal / Editor Graphic */}
        <div className="animate-slide-up" style={{
          background: "#121212", border: "1px solid #2a2a2a", borderRadius: 8, padding: 24, paddingBottom: 40, position: "relative"
        }}>
          {/* Mock terminal header */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
          </div>
          
          <pre style={{
            margin: 0, color: "#d4d4d4", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 1.5, overflowX: "auto"
          }}>
            <code dangerouslySetInnerHTML={{ __html: codeSnippet.replace(/function|const|let|for|if|return/g, '<span style="color: #c586c0">$&</span>').replace(/twoSum|Map|set|has|get/g, '<span style="color: #dcdcaa">$&</span>') }} />
          </pre>
          
          <div style={{ 
            position: "absolute", bottom: -20, right: 30, background: "#1e1e1e", border: "1px solid #333", borderRadius: 4, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span style={{ fontFamily: "monospace", color: "#10b981", fontSize: 14 }}>All tests passed.</span>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <div style={{
        marginTop: 60,
        borderTop: "1px solid #1f1f1f",
        padding: "32px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        maxWidth: 1200, margin: "60px auto 0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#a0a0a0", fontWeight: 500 }}>
            CodeInterview © 2025
          </span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Terms", "Privacy", "Security"].map((l) => (
             <span key={l} style={{ fontSize: 14, color: "#a0a0a0", cursor: "pointer", fontWeight: 500 }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
