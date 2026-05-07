import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContextState";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, LayoutDashboard, BookOpen, LogOut, User, ChevronDown, Shield, Users, BarChart3 } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/problems" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30, background: 'var(--gradient-brand)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(124,91,240,0.25)'
        }}>
          <Code2 size={14} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          CodeArena
        </span>
      </Link>

      {/* Nav Links */}
      <div className="md-hidden" style={{ display: 'flex', gap: 4, flex: 1 }}>
        <NavLink to="/problems" icon={<BookOpen size={14} />} active={isActive('/problems') || isActive('/problem')}>Problems</NavLink>
        <NavLink to="/interview" icon={<Users size={14} />} active={isActive('/interview')}>Interview</NavLink>
        <NavLink to="/dashboard" icon={<BarChart3 size={14} />} active={isActive('/dashboard')}>Dashboard</NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin/problems" icon={<Shield size={14} />} active={isActive('/admin/problems')}>Admin</NavLink>
        )}
      </div>

      <div style={{ flex: 1 }} className="md-hidden" />

      {/* User Menu */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setDropdownOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '6px 14px 6px 8px',
            cursor: 'pointer', color: 'var(--text-primary)',
            transition: 'all 0.25s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name}
              style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'white'
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.username || user?.name || 'User'}
          </span>
          <ChevronDown size={13} color="var(--text-muted)"
            style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setDropdownOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: '#111111', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, minWidth: 220, zIndex: 11,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* User info */}
                <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{user?.email}</div>
                </div>
                <div style={{ padding: 6 }}>
                  <DropdownItem icon={<User size={14} />} onClick={() => { navigate(`/profile`); setDropdownOpen(false); }}>
                    My Profile
                  </DropdownItem>
                  <DropdownItem icon={<BarChart3 size={14} />} onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem icon={<Users size={14} />} onClick={() => { navigate('/interview'); setDropdownOpen(false); }}>
                    Interview
                  </DropdownItem>
                  <DropdownItem icon={<BookOpen size={14} />} onClick={() => { navigate('/problems'); setDropdownOpen(false); }}>
                    Problems
                  </DropdownItem>
                  {user?.role === "admin" && (
                    <DropdownItem icon={<Shield size={14} />} onClick={() => { navigate('/admin/problems'); setDropdownOpen(false); }}>
                      Admin Panel
                    </DropdownItem>
                  )}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                  <DropdownItem icon={<LogOut size={14} />} onClick={handleLogout} danger>
                    Sign Out
                  </DropdownItem>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, children, active }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '7px 14px', borderRadius: 10, textDecoration: 'none',
      fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
      background: active ? 'rgba(124,91,240,0.1)' : 'transparent',
      color: active ? '#9b7bff' : 'var(--text-secondary)',
      border: active ? '1px solid rgba(124,91,240,0.15)' : '1px solid transparent',
    }}>
      {icon}{children}
    </Link>
  );
}

function DropdownItem({ icon, children, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderRadius: 10, border: 'none',
      background: 'transparent', cursor: 'pointer', textAlign: 'left',
      fontSize: 13, color: danger ? 'var(--accent-red)' : 'var(--text-secondary)',
      transition: 'all 0.15s', fontFamily: "'Geist', sans-serif",
    }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {icon}{children}
    </button>
  );
}

export default Navbar;
