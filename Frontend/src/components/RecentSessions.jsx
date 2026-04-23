import { Code2, Clock, Users, Trophy, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Clock size={16} color="var(--accent-indigo)" />
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>Past Sessions</h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={24} className="animate-spin" color="var(--accent-violet)" />
        </div>
      ) : sessions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sessions.map((session, i) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="card hover-glow"
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px' }}
            >
              <DiffBadge difficulty={session.difficulty} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                  {session.problem}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                    {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.02em' }}>
                    <Users size={11} /> {session.participant ? '2' : '1'}
                  </span>
                </div>
              </div>

              {session.status === 'active' ? (
                <div className="badge badge-easy" style={{ animation: 'pulse-glow 2s infinite' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', marginRight: 6 }} />
                  ACTIVE
                </div>
              ) : (
                <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  COMPLETED
                </span>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Trophy size={36} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>No sessions yet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, opacity: 0.7 }}>Start your coding journey today!</p>
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

export default RecentSessions;
