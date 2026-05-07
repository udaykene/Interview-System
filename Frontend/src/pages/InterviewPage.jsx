import { useState } from "react";
import { useNavigate } from "react-router";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { useAuth } from "../context/AuthContextState";
import Navbar from "../components/Navbar";
import CreateSessionModal from "../components/CreateSessionModal";
import { motion } from "framer-motion";
import {
  Plus, Hash, Zap, Users, Clock, ChevronRight,
  BookOpen, Code2, Activity, Loader2, ArrowRight, Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
});

function InterviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [roomConfig, setRoomConfig] = useState({ problem: "", problemId: "", difficulty: "", visibility: "public" });

  const createSessionMutation = useCreateSession();
  const { data: activeData, isLoading: loadingActive } = useActiveSessions();
  const { data: recentData, isLoading: loadingRecent } = useMyRecentSessions();

  const activeSessions = activeData?.sessions || [];
  const recentSessions = recentData?.sessions || [];

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      { problemId: roomConfig.problemId, problem: roomConfig.problem, difficulty: roomConfig.difficulty.toLowerCase(), visibility: roomConfig.visibility },
      { onSuccess: (data) => { setShowCreateModal(false); navigate(`/session/${data.session._id}`); } }
    );
  };

  const isUserInSession = (session) => session.host?._id === user?.id || session.participant?._id === user?.id;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <Navbar />

      {/* ─── Hero Header ─────────────────────────────────────── */}
      <div className="mesh-gradient" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 40px' }}>
        <div className="page-container" style={{ padding: '0 clamp(20px, 4vw, 48px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <motion.div {...fadeUp(0)}>
              <span className="mono-label" style={{ marginBottom: 10, display: 'block' }}>{greeting} 👋</span>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em', color: 'white' }}>
                Interview Sessions
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Create or join collaborative coding interview sessions.
              </p>
            </motion.div>
            <motion.div {...fadeUp(0.15)} style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => navigate("/problems")}>
                <BookOpen size={15} />Practice Solo
              </button>
              <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                <Plus size={15} />New Session
              </button>
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div {...fadeUp(0.2)} style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'ACTIVE', value: activeSessions.length, icon: <Activity size={14} />, color: '#10b981' },
              { label: 'PAST', value: recentSessions.length, icon: <Clock size={14} />, color: '#818cf8' },
              { label: 'SOLVED', value: user?.stats?.problemsSolved || 0, icon: <Code2 size={14} />, color: '#f59e0b' },
            ].map((stat, i) => (
              <div key={i} className="hover-glow" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '14px 20px',
                transition: 'all 0.25s'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${stat.color}12`, border: `1px solid ${stat.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
                }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{stat.value}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────── */}
      <div className="page-container">
        
        {/* Join by Code */}
        <motion.div {...fadeUp(0.25)} className="card" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Hash size={16} color="var(--accent-violet-light)" />
            <h2 style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>Join with Code</h2>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <input className="input" style={{
              maxWidth: 220, letterSpacing: 4,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase', textAlign: 'center'
            }}
              placeholder="XXXXXX"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.replace(/\s/g, '').toUpperCase())}
              maxLength={6}
            />
            <button className="btn btn-violet" disabled={!joinCode}
              onClick={() => { if (joinCode) navigate(`/session/join/${joinCode}`); }}>
              Join <ArrowRight size={14} />
            </button>
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginTop: 10, letterSpacing: '0.02em' }}>
            Paste the 6-character code shared by the host.
          </p>
        </motion.div>

        {/* Active Sessions */}
        <motion.div {...fadeUp(0.3)} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
            <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>Active Sessions</h2>
            <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>{activeSessions.length} LIVE</span>
          </div>

          {loadingActive ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <Loader2 size={24} className="animate-spin" color="var(--accent-violet)" />
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>No active sessions right now</p>
              <button className="btn btn-violet" onClick={() => setShowCreateModal(true)}>
                <Sparkles size={14} />Create one
              </button>
            </div>
          ) : (
            <div className="bento-grid">
              {activeSessions.map((session, i) => (
                <SessionCard
                  key={session._id} session={session}
                  isOwn={isUserInSession(session)}
                  onJoin={() => navigate(`/session/${session._id}`)}
                  index={i}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Sessions */}
        <motion.div {...fadeUp(0.35)}>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20, letterSpacing: '-0.01em' }}>Recent Sessions</h2>
          {loadingRecent ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <Loader2 size={24} className="animate-spin" color="var(--accent-violet)" />
            </div>
          ) : recentSessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)' }}>No completed sessions yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentSessions.map((session, i) => (
                <RecentSessionRow key={session._id} session={session} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </div>
  );
}

function DiffBadge({ difficulty }) {
  const cl = difficulty?.toLowerCase();
  return (
    <span className={`badge badge-${cl === 'easy' ? 'easy' : cl === 'medium' ? 'medium' : 'hard'}`}>
      {difficulty?.toUpperCase()}
    </span>
  );
}

/* ─── Session Card ────────────────────── */
function SessionCard({ session, isOwn, onJoin, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card-glow hover-lift"
      style={{ cursor: 'pointer', padding: 24 }}
      onClick={onJoin}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            {session.problem}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DiffBadge difficulty={session.difficulty?.charAt(0).toUpperCase() + session.difficulty?.slice(1)} />
            {isOwn && <span className="badge badge-purple">YOURS</span>}
          </div>
        </div>
        <button className="btn btn-sm btn-violet" style={{ flexShrink: 0, marginLeft: 12 }}
          onClick={e => { e.stopPropagation(); onJoin(); }}>
          <Zap size={12} />Join
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
        {session.host?.profileImage ? (
          <img src={session.host.profileImage} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} />
        ) : (
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, color: 'white', fontWeight: 700
          }}>
            {session.host?.name?.[0]}
          </div>
        )}
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{session.host?.name}</span>
        <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.04em' }}>
          {session.participant ? <><Users size={11} /> 2/2</> : <><Users size={11} /> 1/2</>}
        </span>
      </div>
    </motion.div>
  );
}

function RecentSessionRow({ session, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card hover-glow"
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px' }}
    >
      <DiffBadge difficulty={session.difficulty?.charAt(0).toUpperCase() + session.difficulty?.slice(1)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{session.problem}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginTop: 3, letterSpacing: '0.02em' }}>
          {session.createdAt && formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
        </div>
      </div>
      <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>
        COMPLETED
      </span>
    </motion.div>
  );
}

export default InterviewPage;
