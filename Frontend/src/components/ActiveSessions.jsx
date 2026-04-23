import { ArrowRight, Code2, Sparkles, Users, Zap, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>Live Sessions</h2>
        <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>{sessions.length} LIVE</span>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={24} className="animate-spin" color="var(--accent-violet)" />
        </div>
      ) : sessions.length > 0 ? (
        <div className="bento-grid">
          {sessions.map((session, i) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="card-glow hover-lift"
              style={{ cursor: 'pointer', padding: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                    {session.problem}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <DiffBadge difficulty={session.difficulty} />
                    {session.visibility === 'private' && (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>PRIVATE</span>
                    )}
                  </div>
                </div>

                {session.participant && !isUserInSession(session) ? (
                  <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>FULL</span>
                ) : (
                  <Link to={`/session/${session._id}`} className="btn btn-sm btn-violet"
                    style={{ flexShrink: 0, marginLeft: 12 }}>
                    <Zap size={12} />{isUserInSession(session) ? "Rejoin" : "Join"}
                  </Link>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                {session.host?.profileImage ? (
                  <img src={session.host.profileImage} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} alt="" />
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>
                    {session.host?.name?.[0]}
                  </div>
                )}
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{session.host?.name}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.04em' }}>
                  <Users size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {session.participant ? '2/2' : '1/2'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Sparkles size={36} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>No active sessions right now</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, opacity: 0.7 }}>Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}

function DiffBadge({ difficulty }) {
  const d = difficulty?.toLowerCase();
  const cls = d === 'easy' ? 'badge-easy' : d === 'medium' ? 'badge-medium' : 'badge-hard';
  const label = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : '';
  return <span className={`badge ${cls}`}>{label?.toUpperCase()}</span>;
}

export default ActiveSessions;
