import { motion } from "framer-motion";
import { Users, Trophy } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  const stats = [
    { label: "ACTIVE", value: activeSessionsCount, icon: <Users size={18} />, color: '#10b981' },
    { label: "TOTAL", value: recentSessionsCount, icon: <Trophy size={18} />, color: '#818cf8' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="card hover-glow"
          style={{ textAlign: 'center', padding: 28 }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, margin: '0 auto 14px',
            background: `${s.color}10`, border: `1px solid ${s.color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color
          }}>
            {s.icon}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 4, letterSpacing: '-0.02em' }}>
            {s.value}
          </div>
          <div className="mono-label">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsCards;
