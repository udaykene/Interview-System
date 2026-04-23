import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContextState";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Camera, Edit3, Check, X, Github, Linkedin, Twitter, Globe,
  Code2, Users, Trophy
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
});

function ProfilePage() {
  const { user, refresh } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
    socialLinks: {
      github: user?.socialLinks?.github || "",
      linkedin: user?.socialLinks?.linkedin || "",
      twitter: user?.socialLinks?.twitter || "",
      website: user?.socialLinks?.website || "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, profileImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put("/auth/me", form);
      await refresh();
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: "SESSIONS", value: user?.stats?.sessionCount || 0, icon: <Users size={18} />, color: '#818cf8' },
    { label: "SOLVED", value: user?.stats?.problemsSolved || 0, icon: <Trophy size={18} />, color: '#10b981' },
    { label: "PROVIDER", value: (user?.provider || 'local').toUpperCase(), icon: <Code2 size={18} />, color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px clamp(20px, 4vw, 48px)' }}>

        {/* Profile Card */}
        <motion.div {...fadeUp(0)} className="card" style={{ marginBottom: 24, overflow: 'hidden', padding: 0 }}>
          {/* Cover */}
          <div style={{
            height: 110,
            background: 'linear-gradient(135deg, rgba(124,91,240,0.2) 0%, rgba(129,140,248,0.1) 50%, rgba(124,91,240,0.15) 100%)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 30% 50%, rgba(124,91,240,0.15) 0%, transparent 60%)',
            }} />
          </div>

          <div style={{ padding: '0 28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginTop: -36 }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {form.profileImage ? (
                  <img src={form.profileImage} alt={form.name}
                    style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #111111', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', border: '3px solid #111111',
                    background: 'var(--gradient-brand)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 700, color: 'white'
                  }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                {editing && (
                  <>
                    <button onClick={() => fileRef.current?.click()} style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--gradient-brand)', border: '2px solid #111111',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                      <Camera size={12} color="white" />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                  </>
                )}
              </div>

              {/* Name + username */}
              <div style={{ flex: 1, paddingTop: 40 }}>
                {editing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input className="input" placeholder="Full name" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={{ fontSize: 18, fontWeight: 700, padding: '8px 12px' }} />
                    <input className="input" placeholder="username" value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                      style={{ padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-muted)' }} />
                  </div>
                ) : (
                  <>
                    <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>{user?.name}</h1>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', fontSize: 13, letterSpacing: '0.02em' }}>
                      @{user?.username || user?.email?.split('@')[0]}
                    </span>
                  </>
                )}
              </div>

              {/* Edit/Save */}
              <div style={{ paddingTop: 40, display: 'flex', gap: 8, flexShrink: 0 }}>
                {editing ? (
                  <>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditing(false)}><X size={13} />Cancel</button>
                    <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Check size={13} />}Save
                    </button>
                  </>
                ) : (
                  <button className="btn btn-sm btn-secondary" onClick={() => setEditing(true)}><Edit3 size={13} />Edit</button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginTop: 24 }}>
              {editing ? (
                <textarea className="input" placeholder="Write a short bio..." value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3} style={{ resize: 'vertical' }} maxLength={300} />
              ) : user?.bio ? (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{user.bio}</p>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>No bio yet.</p>
              )}
            </div>

            {/* Social Links */}
            {editing ? (
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { key: 'github', icon: <Github size={13} />, placeholder: 'github.com/username' },
                  { key: 'linkedin', icon: <Linkedin size={13} />, placeholder: 'linkedin.com/in/username' },
                  { key: 'twitter', icon: <Twitter size={13} />, placeholder: 'twitter.com/username' },
                  { key: 'website', icon: <Globe size={13} />, placeholder: 'yourwebsite.com' },
                ].map(({ key, icon, placeholder }) => (
                  <div key={key} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{icon}</div>
                    <input className="input" placeholder={placeholder} value={form.socialLinks[key]}
                      onChange={e => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: e.target.value } }))}
                      style={{ paddingLeft: 34, fontSize: 13 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                {user?.socialLinks?.github && <SocialLink icon={<Github size={13} />} href={user.socialLinks.github}>GitHub</SocialLink>}
                {user?.socialLinks?.linkedin && <SocialLink icon={<Linkedin size={13} />} href={user.socialLinks.linkedin}>LinkedIn</SocialLink>}
                {user?.socialLinks?.twitter && <SocialLink icon={<Twitter size={13} />} href={user.socialLinks.twitter}>Twitter</SocialLink>}
                {user?.socialLinks?.website && <SocialLink icon={<Globe size={13} />} href={user.socialLinks.website}>Website</SocialLink>}
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <motion.div key={i} {...fadeUp(0.1 + i * 0.08)} className="card hover-glow" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, margin: '0 auto 14px',
                background: `${s.color}10`, border: `1px solid ${s.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color
              }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 4, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div className="mono-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Account Info */}
        <motion.div {...fadeUp(0.35)} className="card">
          <span className="mono-label" style={{ marginBottom: 16, display: 'block' }}>ACCOUNT</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Login Method" value={user?.provider?.charAt(0).toUpperCase() + user?.provider?.slice(1)} />
            <InfoRow label="Role" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} />
            <InfoRow label="Email Verified" value={user?.emailVerified ? "✅ Verified" : "❌ Not verified"} />
            <InfoRow label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "—"} last />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SocialLink({ icon, href, children }) {
  const fullUrl = href.startsWith('http') ? href : `https://${href}`;
  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '6px 14px', borderRadius: 99, fontSize: 12,
      fontFamily: "'JetBrains Mono', monospace",
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s', letterSpacing: '0.02em'
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,91,240,0.3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {icon}{children}
    </a>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default ProfilePage;
