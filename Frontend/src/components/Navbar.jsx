import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextState";
import { Code2, LayoutDashboard, BookOpen, LogOut, User, ChevronDown, Menu, X, Shield } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={{
      height: 'var(--navbar-height)',
      background: 'rgba(13,15,26,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--bg-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 24
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0
      }}>
        <div style={{
          width: 32, height: 32, background: 'var(--gradient-brand)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Code2 size={16} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>CodeInterview</span>
      </Link>

      {/* Nav Links (desktop) */}
      <div className="md-hidden flex" style={{ gap: 4, flex: 1 }}>
        <NavLink to="/dashboard" icon={<LayoutDashboard size={15} />}>Dashboard</NavLink>
        <NavLink to="/problems" icon={<BookOpen size={15} />}>Problems</NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin/problems" icon={<Shield size={15} />}>Admin</NavLink>
        )}
      </div>

      <div style={{ flex: 1 }} className="md-hidden" />

      {/* User menu */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setDropdownOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
            borderRadius: 10, padding: '6px 12px 6px 8px',
            cursor: 'pointer', color: 'var(--text-primary)',
            transition: 'all 0.2s'
          }}
        >
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name}
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white'
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span style={{ fontSize: 14, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.username || user?.name || 'User'}
          </span>
          <ChevronDown size={14} color="var(--text-muted)"
            style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {dropdownOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setDropdownOpen(false)} />
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'var(--bg-card)', border: '1px solid var(--bg-border)',
              borderRadius: 12, minWidth: 200, zIndex: 11,
              boxShadow: 'var(--shadow-lg)', overflow: 'hidden'
            }} className="animate-fade-in">
              {/* User info */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--bg-border)' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{user?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <div style={{ padding: 6 }}>
                <DropdownItem icon={<User size={15} />} onClick={() => { navigate(`/profile`); setDropdownOpen(false); }}>
                  My Profile
                </DropdownItem>
                <DropdownItem icon={<LayoutDashboard size={15} />} onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }}>
                  Dashboard
                </DropdownItem>
                <DropdownItem icon={<BookOpen size={15} />} onClick={() => { navigate('/problems'); setDropdownOpen(false); }}>
                  Problems
                </DropdownItem>
                {user?.role === "admin" && (
                  <DropdownItem icon={<Shield size={15} />} onClick={() => { navigate('/admin/problems'); setDropdownOpen(false); }}>
                    Admin Panel
                  </DropdownItem>
                )}
                <div style={{ height: 1, background: 'var(--bg-border)', margin: '4px 0' }} />
                <DropdownItem icon={<LogOut size={15} />} onClick={handleLogout} danger>
                  Sign Out
                </DropdownItem>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, icon, children }) {
  const isActive = window.location.pathname === to || window.location.pathname.startsWith(to + '/');
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
      fontSize: 14, fontWeight: 500, transition: 'all 0.15s',
      background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
      color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)',
    }}>
      {icon}{children}
    </Link>
  );
}

function DropdownItem({ icon, children, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 8, border: 'none',
      background: 'transparent', cursor: 'pointer', textAlign: 'left',
      fontSize: 14, color: danger ? 'var(--accent-red)' : 'var(--text-secondary)',
      transition: 'all 0.15s'
    }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {icon}{children}
    </button>
  );
}

export default Navbar;
