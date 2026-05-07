import React from 'react';

const ProgressGauge = ({ solved, total, easy, medium, hard, totalEasy, totalMedium, totalHard }) => {
  // Semi-circle gauge dimensions
  const width = 220;
  const height = 130;
  const cx = width / 2;
  const cy = 110;
  const radius = 80;
  const strokeWidth = 10;

  // Total solved percentage for the arc
  const totalSolvedPct = total > 0 ? solved / total : 0;

  // Build the semi-circle arc path (from left to right, curving upward)
  const startAngle = Math.PI; // 180° (left)
  const endAngle = 0;        // 0° (right)
  const sweepAngle = Math.PI; // full semi-circle

  const startX = cx + radius * Math.cos(startAngle);
  const startY = cy + radius * Math.sin(startAngle);
  const endX = cx + radius * Math.cos(endAngle);
  const endY = cy + radius * Math.sin(endAngle);

  const bgArc = `M ${startX},${startY} A ${radius},${radius} 0 0 1 ${endX},${endY}`;

  // Progress arc — partial
  const progressAngle = startAngle - sweepAngle * totalSolvedPct;
  const progEndX = cx + radius * Math.cos(progressAngle);
  const progEndY = cy + radius * Math.sin(progressAngle);
  const largeArc = totalSolvedPct > 0.5 ? 1 : 0;
  const progressArc = `M ${startX},${startY} A ${radius},${radius} 0 ${largeArc} 1 ${progEndX},${progEndY}`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#111111',
      padding: '24px 24px 20px',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.05)',
      width: '100%',
    }}>
      {/* Gauge */}
      <div style={{ position: 'relative', width, height, flexShrink: 0 }}>
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          {/* Background arc */}
          <path
            d={bgArc}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          {totalSolvedPct > 0 && (
            <path
              d={progressArc}
              fill="none"
              stroke="url(#gauge-grad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ transition: 'all 1s ease-out' }}
            />
          )}
          <defs>
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center label */}
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: 4,
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {solved}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            fontSize: 10, fontWeight: 600, color: '#6b7280', marginTop: 4,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Solved
          </div>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div style={{ width: '100%', marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <DifficultyRow label="Easy" solved={easy} total={totalEasy} color="#10b981" bgColor="rgba(16,185,129,0.08)" />
        <DifficultyRow label="Med." solved={medium} total={totalMedium} color="#f59e0b" bgColor="rgba(245,158,11,0.08)" />
        <DifficultyRow label="Hard" solved={hard} total={totalHard} color="#ef4444" bgColor="rgba(239,68,68,0.08)" />
      </div>
    </div>
  );
};

const DifficultyRow = ({ label, solved, total, color, bgColor }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderRadius: 8,
    background: bgColor,
  }}>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      fontWeight: 700,
      color,
      letterSpacing: '0.02em',
    }}>
      {label}
    </span>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
    }}>
      <span style={{ color: 'white', fontWeight: 700 }}>{solved}</span>
      <span style={{ color: '#4b5563' }}>/</span>
      <span style={{ color: '#6b7280' }}>{total}</span>
    </div>
  </div>
);

export default ProgressGauge;
