import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isSignedIn ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!isSignedIn ? <SignupPage /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!isSignedIn ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
        <Route path="/reset-password/:token" element={!isSignedIn ? <ResetPasswordPage /> : <Navigate to="/dashboard" />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isSignedIn ? <ProfilePage /> : <Navigate to="/login" />} />
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
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--bg-border)',
            boxShadow: 'var(--shadow-lg)'
          }
        }} 
      />
    </>
  );
}

export default App;
