function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  const getDifficultyColor = (diff) => {
    if (!diff) return 'var(--text-muted)';
    const d = diff.toLowerCase();
    if (d === 'easy') return 'var(--accent-green)';
    if (d === 'medium') return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#0a0a0a' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>{problem.title}</h1>
          <span className="badge" style={{
            background: `${getDifficultyColor(problem.difficulty)}12`,
            color: getDifficultyColor(problem.difficulty),
            border: `1px solid ${getDifficultyColor(problem.difficulty)}25`,
          }}>
            {problem.difficulty?.toUpperCase()}
          </span>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{problem.category?.toUpperCase()}</p>

        <div style={{ marginTop: 14 }}>
          <select className="input" style={{ cursor: 'pointer', fontSize: 13 }}
            value={currentProblemId} onChange={(e) => onProblemChange(e.target.value)}>
            {allProblems.map(p => (
              <option key={p.slug} value={p.slug} style={{ background: '#111', color: 'white' }}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Description */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, marginBottom: 14, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>DESCRIPTION</h2>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p>{problem.description?.text}</p>
            {(problem.description?.notes || []).map((note, idx) => (
              <p key={idx} style={{ marginTop: 8 }}>{note}</p>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, marginBottom: 14, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>EXAMPLES</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(problem.examples || []).map((example, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="badge badge-purple">{idx + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>Example {idx + 1}</span>
                </div>
                <div className="code-block" style={{ borderLeft: '3px solid var(--accent-violet)', borderRadius: '0 12px 12px 0' }}>
                  <div style={{ marginBottom: 4 }}><span style={{ color: 'var(--accent-violet-light)', fontWeight: 600 }}>Input:</span> {example.input}</div>
                  <div><span style={{ color: 'var(--accent-violet-light)', fontWeight: 600 }}>Output:</span> {example.output}</div>
                  {example.explanation && (
                    <div style={{ paddingTop: 8, marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 600 }}>Explanation:</span> {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, marginBottom: 14, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>CONSTRAINTS</h2>
          <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(problem.constraints || []).map((constraint, idx) => (
              <li key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-violet)', fontSize: 10 }}>●</span>
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 6 }}>{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
