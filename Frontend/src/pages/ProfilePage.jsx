import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContextState";
import Navbar from "../components/Navbar";
import {
  Camera, Edit3, Check, X, Github, Linkedin, Twitter, Globe,
  Code2, Users, Trophy, Calendar, LinkIcon
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

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
    { label: "Sessions", value: user?.stats?.sessionCount || 0, icon: <Users size={18} />, color: '#6366f1' },
    { label: "Solved", value: user?.stats?.problemsSolved || 0, icon: <Trophy size={18} />, color: '#10b981' },
    { label: "Provider", value: user?.provider || 'local', icon: <Code2 size={18} />, color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px' }}>

        {/* Profile Card */}
        <div className="card animate-fade-in" style={{ marginBottom: 20 }}>
          {/* Cover gradient */}
          <div style={{
            height: 100, borderRadius: '10px 10px 0 0', margin: '-20px -20px 0',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginTop: -36, position: 'relative', padding: '0 4px' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {form.profileImage ? (
                <img src={form.profileImage} alt={form.name}
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--bg-card)', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--bg-card)',
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
                    background: 'var(--gradient-brand)', border: '2px solid var(--bg-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <Camera size={13} color="white" />
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
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: 18, fontWeight: 700, padding: '6px 10px' }} />
                  <input className="input" placeholder="username" value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    style={{ padding: '6px 10px', color: 'var(--text-muted)' }} />
                </div>
              ) : (
                <>
                  <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{user?.name}</h1>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                    @{user?.username || user?.email?.split('@')[0]}
                  </span>
                </>
              )}
            </div>

            {/* Edit / Save buttons */}
            <div style={{ paddingTop: 40, display: 'flex', gap: 8, flexShrink: 0 }}>
              {editing ? (
                <>
                  <button className="btn btn-sm btn-ghost" onClick={() => setEditing(false)}>
                    <X size={14} />Cancel
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Check size={14} />}
                    Save
                  </button>
                </>
              ) : (
                <button className="btn btn-sm btn-secondary" onClick={() => setEditing(true)}>
                  <Edit3 size={14} />Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginTop: 20 }}>
            {editing ? (
              <textarea className="input" placeholder="Write a short bio about yourself..."
                value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3} style={{ resize: 'vertical' }} maxLength={300} />
            ) : user?.bio ? (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{user.bio}</p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No bio yet.</p>
            )}
          </div>

          {/* Social Links */}
          {editing ? (
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { key: 'github', icon: <Github size={14} />, placeholder: 'github.com/username' },
                { key: 'linkedin', icon: <Linkedin size={14} />, placeholder: 'linkedin.com/in/username' },
                { key: 'twitter', icon: <Twitter size={14} />, placeholder: 'twitter.com/username' },
                { key: 'website', icon: <Globe size={14} />, placeholder: 'yourwebsite.com' },
              ].map(({ key, icon, placeholder }) => (
                <div key={key} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    {icon}
                  </div>
                  <input className="input" placeholder={placeholder}
                    value={form.socialLinks[key]}
                    onChange={e => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: e.target.value } }))}
                    style={{ paddingLeft: 32 }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              {user?.socialLinks?.github && <SocialLink icon={<Github size={14} />} href={user.socialLinks.github}>GitHub</SocialLink>}
              {user?.socialLinks?.linkedin && <SocialLink icon={<Linkedin size={14} />} href={user.socialLinks.linkedin}>LinkedIn</SocialLink>}
              {user?.socialLinks?.twitter && <SocialLink icon={<Twitter size={14} />} href={user.socialLinks.twitter}>Twitter</SocialLink>}
              {user?.socialLinks?.website && <SocialLink icon={<Globe size={14} />} href={user.socialLinks.website}>Website</SocialLink>}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} className="card animate-fade-in" style={{ textAlign: 'center', animationDelay: `${i * 0.08}s` }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, margin: '0 auto 12px',
                background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Login Method" value={user?.provider?.charAt(0).toUpperCase() + user?.provider?.slice(1)} />
            <InfoRow label="Role" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} />
            <InfoRow label="Email Verified" value={user?.emailVerified ? "✅ Verified" : "❌ Not verified"} />
            <InfoRow label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "—"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ icon, href, children }) {
  const fullUrl = href.startsWith('http') ? href : `https://${href}`;
  return (
    <a href={fullUrl} target="_blank" rel="noopener noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 99, fontSize: 13,
      background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)',
      color: 'var(--text-secondary)', textDecoration: 'none',
      transition: 'all 0.15s'
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {icon}{children}
    </a>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--bg-border)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default ProfilePage;
