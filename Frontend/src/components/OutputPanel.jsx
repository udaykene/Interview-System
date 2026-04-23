import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

function OutputPanel({ output }) {
  if (!output) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        Run or submit code to see results here
      </div>
    );
  }

  const { type, data } = output;

  if (data.error) {
    return (
      <div style={{ padding: 16, height: '100%', overflowY: 'auto', background: 'rgba(239,68,68,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-red)', fontWeight: 600, marginBottom: 12 }}>
          <AlertCircle size={16} /> Execution Error
        </div>
        <pre className="mono" style={{ color: 'var(--accent-red)', fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {data.error}
        </pre>
      </div>
    );
  }

  if (type === 'run') {
    return (
      <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Standard Output</div>
        <pre className="mono" style={{ color: 'var(--text-primary)', fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {data.run?.stdout || "Program exited with no output"}
        </pre>
        {data.run?.stderr && (
          <div style={{ marginTop: 16 }}>
             <div style={{ color: 'var(--accent-red)', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Standard Error</div>
             <pre className="mono" style={{ color: 'var(--accent-red)', fontSize: 13, whiteSpace: 'pre-wrap' }}>
               {data.run.stderr}
             </pre>
          </div>
        )}
      </div>
    );
  }

  if (type === 'submit') {
    const isAccepted = data.status === 'Accepted';
    
    return (
      <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 16, color: isAccepted ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {isAccepted ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          {data.status}
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--bg-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Test Cases Passed</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: isAccepted ? 'var(--accent-green)' : 'var(--text-primary)' }}>
              {data.passedTests} / {data.totalTests}
            </div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--bg-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Execution Time</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
               {data.run?.stdout ? '0ms' : 'N/A'}
            </div>
          </div>
        </div>

        {data.results?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>Test Case Details</div>
            {data.results.map((res, i) => (
              <div key={i} className={`card-flat ${res.passed ? 'test-case-pass' : res.error ? 'test-case-error' : 'test-case-fail'}`} style={{ padding: 12, border: '1px solid var(--bg-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Test Case {i + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: res.passed ? 'var(--accent-green)' : res.error ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                    {res.passed ? 'Passed' : res.error ? 'Error' : 'Failed'}
                  </span>
                </div>
                {!res.isHidden ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }} className="mono">
                    <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> {res.input}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Expected:</span> {res.expectedOutput}</div>
                    {res.actualOutput && <div><span style={{ color: 'var(--text-muted)' }}>Actual:</span> <span style={{ color: res.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}>{res.actualOutput}</span></div>}
                    {res.error && <div><span style={{ color: 'var(--text-muted)' }}>Error:</span> <span style={{ color: 'var(--accent-yellow)' }}>{res.error}</span></div>}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Hidden Test Case</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default OutputPanel;
