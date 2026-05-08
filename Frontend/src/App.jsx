import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
import InterviewPage from "./pages/InterviewPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminProblemsPage from "./pages/AdminProblemsPage";
import JoinRedirectPage from "./pages/JoinRedirectPage";
import { useAuth } from "./context/AuthContextState";
import { Toaster } from "react-hot-toast";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  // Spotlight cursor tracker
  useEffect(() => {
    const handler = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  if (!isLoaded) {
    return (
      <div className="spotlight" style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 2 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            LOADING CODEARENA...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="spotlight">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!isSignedIn ? <LoginPage /> : <Navigate to="/problems" />} />
        <Route path="/signup" element={!isSignedIn ? <SignupPage /> : <Navigate to="/problems" />} />
        <Route path="/forgot-password" element={!isSignedIn ? <ForgotPasswordPage /> : <Navigate to="/problems" />} />
        <Route path="/reset-password/:token" element={!isSignedIn ? <ResetPasswordPage /> : <Navigate to="/problems" />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/interview" element={isSignedIn ? <InterviewPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isSignedIn ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/u/:username" element={isSignedIn ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/login" />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to="/login" />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to="/login" />} />
        <Route path="/session/join/:code" element={isSignedIn ? <JoinRedirectPage /> : <Navigate to="/login" />} />
        
        {/* Admin Route */}
        <Route path="/admin/problems" element={isSignedIn ? <AdminProblemsPage /> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster 
        position="bottom-right"
        toastOptions={{ 
          duration: 4000,
          style: {
            background: '#111111',
            color: '#e8eaed',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
            fontFamily: "'Geist', sans-serif",
          }
        }} 
      />
    </div>
  );
}

export default App;
