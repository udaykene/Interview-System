import { useState } from "react";
import { useNavigate } from "react-router";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { useAuth } from "../context/AuthContextState";
import { useProblems } from "../hooks/useProblems";
import Navbar from "../components/Navbar";
import CreateSessionModal from "../components/CreateSessionModal";
import {
  Plus, Hash, Zap, Users, Clock, ChevronRight,
  BookOpen, Code2, Activity, Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function DashboardPage() {
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1225 0%, #0d0f1a 100%)',
        borderBottom: '1px solid var(--bg-border)',
        padding: '36px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>{greeting} 👋</p>
              <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>
                {user?.name?.split(' ')[0] || 'Coder'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Ready to crush some interviews today?
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => navigate("/problems")}>
                <BookOpen size={16} />Practice Solo
              </button>
              <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />New Session
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Active Sessions', value: activeSessions.length, icon: <Activity size={15} />, color: '#10b981' },
              { label: 'Past Sessions', value: recentSessions.length, icon: <Clock size={15} />, color: '#6366f1' },
              { label: 'Problems Solved', value: user?.stats?.problemsSolved || 0, icon: <Code2 size={15} />, color: '#f59e0b' },
            ].map((stat, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--bg-border)',
                borderRadius: 10, padding: '10px 16px'
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: `${stat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
                }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {/* Join by code */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Hash size={18} color="var(--accent-indigo)" />
            <h2 style={{ fontWeight: 700, fontSize: 16 }}>Join with Code</h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="input" style={{ maxWidth: 240, letterSpacing: 3, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}
              placeholder="XXXXXX"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.replace(/\s/g, '').toUpperCase())}
              maxLength={6}
            />
            <button className="btn btn-primary" disabled={!joinCode}
              onClick={() => { if (joinCode) navigate(`/session/join/${joinCode}`); }}>
              Join Session
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            Paste the 6-character code shared by the host.
          </p>
        </div>

        {/* Active Sessions */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
            <h2 style={{ fontWeight: 700, fontSize: 18 }}>Active Sessions</h2>
            <span className="badge badge-purple" style={{ marginLeft: 'auto', fontSize: 12 }}>{activeSessions.length} live</span>
          </div>

          {loadingActive ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <Loader2 size={28} className="animate-spin" color="var(--accent-indigo)" />
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>No active sessions right now</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowCreateModal(true)}>
                <Plus size={15} />Create one!
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {activeSessions.map(session => (
                <SessionCard
                  key={session._id} session={session}
                  isOwn={isUserInSession(session)}
                  onJoin={() => navigate(`/session/${session._id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Recent Sessions</h2>
          {loadingRecent ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <Loader2 size={28} className="animate-spin" color="var(--accent-indigo)" />
            </div>
          ) : recentSessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <Clock size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-muted)' }}>No completed sessions yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentSessions.map(session => (
                <RecentSessionRow key={session._id} session={session} />
              ))}
            </div>
          )}
        </div>
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
      {difficulty}
    </span>
  );
}

function SessionCard({ session, isOwn, onJoin }) {
  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={onJoin}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {session.problem}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DiffBadge difficulty={session.difficulty?.charAt(0).toUpperCase() + session.difficulty?.slice(1)} />
            {isOwn && <span className="badge badge-purple" style={{ fontSize: 11 }}>Yours</span>}
          </div>
        </div>
        <button className="btn btn-sm btn-primary" style={{ flexShrink: 0, marginLeft: 10 }} onClick={e => { e.stopPropagation(); onJoin(); }}>
          <Zap size={13} />Join
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
        {session.host?.profileImage ? (
          <img src={session.host.profileImage} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>
            {session.host?.name?.[0]}
          </div>
        )}
        <span>{session.host?.name}</span>
        <span style={{ marginLeft: 'auto' }}>
          {session.participant ? <><Users size={12} /> 2/2</> : <><Users size={12} /> 1/2</>}
        </span>
      </div>
    </div>
  );
}

function RecentSessionRow({ session }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
      <DiffBadge difficulty={session.difficulty?.charAt(0).toUpperCase() + session.difficulty?.slice(1)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.problem}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {session.createdAt && formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
        </div>
      </div>
      <span className="badge" style={{ background: 'rgba(100,116,139,0.1)', color: 'var(--text-muted)', fontSize: 11 }}>Completed</span>
    </div>
  );
}

export default DashboardPage;
