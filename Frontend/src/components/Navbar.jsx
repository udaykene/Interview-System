import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContextState";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../lib/axios";
import {
  Code2,
  LayoutDashboard,
  BookOpen,
  LogOut,
  User,
  ChevronDown,
  Shield,
  Users,
  BarChart3,
  Search,
  CheckCircle2,
} from "lucide-react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ problems: [], users: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ problems: [], users: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/search?q=${query}`);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (type, item) => {
    setIsOpen(false);
    setQuery("");
    if (type === "problem") {
      navigate(`/problem/${item.slug}`);
    } else {
      navigate(`/u/${item.username}`);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: 300, marginRight: 20 }} className="md-hidden">
      <div style={{ position: "relative" }}>
        <Search
          size={14}
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Search problems or users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          style={{
            width: "100%",
            padding: "8px 12px 8px 36px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            color: "var(--text-primary)",
            fontSize: 13,
            outline: "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        />
      </div>

      <AnimatePresence>
        {isOpen && (results.problems.length > 0 || results.users.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              overflow: "hidden",
              zIndex: 100,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {results.problems.length > 0 && (
              <div style={{ padding: "8px 0" }}>
                <div style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Problems
                </div>
                {results.problems.map((p) => (
                  <div
                    key={p.slug}
                    onClick={() => handleSelect("problem", p)}
                    style={{
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.difficulty === "Easy" ? "var(--accent-green)" : p.difficulty === "Medium" ? "var(--accent-yellow)" : "var(--accent-red)" }} />
                    <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{p.title}</span>
                  </div>
                ))}
              </div>
            )}

            {results.users.length > 0 && (
              <div style={{ padding: "8px 0", borderTop: results.problems.length > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Users
                </div>
                {results.users.map((u) => (
                  <div
                    key={u.username}
                    onClick={() => handleSelect("user", u)}
                    style={{
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {u.profileImage ? (
                      <img src={u.profileImage} alt={u.name} style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white" }}>
                        {u.name[0].toUpperCase()}
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{u.name}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>@{u.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const interviewHref = "/interview";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link
        to="/problems"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            // background: "var(--gradient-brand)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // boxShadow: "0 0 16px rgba(124,91,240,0.25)",
          }}
        >
          <Code2 size={22} fontWeight={200} color="white" />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          CodeArena
        </span>
      </Link>

      {/* Nav Links */}
      <div className="md-hidden" style={{ display: "flex", gap: 4, flex: 1 }}>
        <NavLink
          to="/problems"
          icon={<BookOpen size={14} />}
          active={isActive("/problems") || isActive("/problem")}
        >
          Problems
        </NavLink>
        <NavLink
          to={interviewHref}
          icon={<Users size={14} />}
          active={isActive("/interview")}
          newTab
        >
          Interview
        </NavLink>
        <NavLink
          to="/dashboard"
          icon={<BarChart3 size={14} />}
          active={isActive("/dashboard")}
        >
          Dashboard
        </NavLink>
        {user?.role === "admin" && (
          <NavLink
            to="/admin/problems"
            icon={<Shield size={14} />}
            active={isActive("/admin/problems")}
          >
            Admin
          </NavLink>
        )}
      </div>

      <div style={{ flex: 1 }} className="md-hidden" />

      {/* Search Bar */}
      <SearchBar />

      {/* User Menu */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            // gap: 10,
            background: "rgba(255,255,255,0.04)",
            // border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "50%",
            padding: "6px 8px 6px 6px",
            cursor: "pointer",
            color: "var(--text-primary)",
            transition: "all 0.25s",
          }}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "var(--gradient-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "white",
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              maxWidth: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {/* {user?.username || user?.name || "User"} */}
          </span>
          {/* <ChevronDown
            size={13}
            color="var(--text-muted)"
            style={{
              transform: dropdownOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.25s",
            }}
          /> */}
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
                onClick={() => setDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  minWidth: 220,
                  zIndex: 11,
                  boxShadow:
                    "0 16px 48px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                {/* User info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 18px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "var(--gradient-brand)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <div
                      style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}
                    >
                      {user?.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 6 }}>
                  <DropdownItem
                    icon={<User size={14} />}
                    onClick={() => {
                      navigate(`/profile`);
                      setDropdownOpen(false);
                    }}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    icon={<BarChart3 size={14} />}
                    onClick={() => {
                      navigate("/dashboard");
                      setDropdownOpen(false);
                    }}
                  >
                    Dashboard
                  </DropdownItem>
                  <DropdownItem
                    icon={<Users size={14} />}
                    onClick={() => {
                      window.open(interviewHref, "_blank", "noopener,noreferrer");
                      setDropdownOpen(false);
                    }}
                  >
                    Interview
                  </DropdownItem>
                  <DropdownItem
                    icon={<BookOpen size={14} />}
                    onClick={() => {
                      navigate("/problems");
                      setDropdownOpen(false);
                    }}
                  >
                    Problems
                  </DropdownItem>
                  {user?.role === "admin" && (
                    <DropdownItem
                      icon={<Shield size={14} />}
                      onClick={() => {
                        navigate("/admin/problems");
                        setDropdownOpen(false);
                      }}
                    >
                      Admin Panel
                    </DropdownItem>
                  )}
                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.06)",
                      margin: "4px 0",
                    }}
                  />
                  <DropdownItem
                    icon={<LogOut size={14} />}
                    onClick={handleLogout}
                    danger
                  >
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

function NavLink({ to, icon, children, active, newTab = false }) {
  return (
    <Link
      to={to}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 14px",
        borderRadius: 10,
        textDecoration: "none",
        fontSize: 13,
        fontWeight: 500,
        transition: "all 0.2s",
        // background: active ? "rgba(124,91,240,0.1)" : "transparent",
        color: active ? "#9b7bff" : "var(--text-secondary)",
        // border: active
        // ? "1px solid rgba(124,91,240,0.15)"
        // : "1px solid transparent",
      }}
    >
      {icon}
      {children}
    </Link>
  );
}

function DropdownItem({ icon, children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 10,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontSize: 13,
        color: danger ? "var(--accent-red)" : "var(--text-secondary)",
        transition: "all 0.15s",
        fontFamily: "'Geist', sans-serif",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = danger
          ? "rgba(239,68,68,0.08)"
          : "rgba(255,255,255,0.05)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
      {children}
    </button>
  );
}

export default Navbar;
