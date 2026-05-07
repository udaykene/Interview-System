import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

function OutputPanel({ output }) {
  if (!output) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.04em' }}>
        RUN OR SUBMIT CODE TO SEE RESULTS
      </div>
    );
  }

  const { type, data } = output;

  if (data.error) {
    return (
      <div style={{ padding: 20, height: '100%', overflowY: 'auto', background: 'rgba(239,68,68,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-red)', fontWeight: 600, marginBottom: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.04em' }}>
          <AlertCircle size={15} /> EXECUTION ERROR
        </div>
        <pre className="mono" style={{ color: 'var(--accent-red)', fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {data.error}
        </pre>
      </div>
    );
  }

  const renderStructuredTestResults = () => {
    const isAccepted = data.status === 'Accepted';
    return (
      <div style={{ padding: 20, height: '100%', overflowY: 'auto' }} key={`${type}-structured`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700, marginBottom: 20, color: isAccepted ? 'var(--accent-green)' : 'var(--accent-red)', letterSpacing: '-0.01em' }}>
          {isAccepted ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {data.status}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>PASSED</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: isAccepted ? 'var(--accent-green)' : 'white' }}>
              {data.passedTests} / {data.totalTests}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>TIME</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
              {data.runtimeMs != null ? `${data.runtimeMs} ms` : 'N/A'}
            </div>
          </div>
        </div>

        {data.results?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>TEST CASES</div>
            {data.results.map((res, i) => (
              <div key={i} className={`${res.passed ? 'test-case-pass' : res.error ? 'test-case-error' : 'test-case-fail'}`}
                style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: '0.03em' }}>CASE {i + 1}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: res.passed ? 'var(--accent-green)' : res.error ? 'var(--accent-yellow)' : 'var(--accent-red)', letterSpacing: '0.04em' }}>
                    {res.passed ? 'PASSED' : res.error ? 'ERROR' : 'FAILED'}
                  </span>
                </div>
                {!res.isHidden ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, lineHeight: 1.6 }} className="mono">
                    <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> {res.input}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Expected:</span> {res.expectedOutput}</div>
                    {res.actualOutput && <div><span style={{ color: 'var(--text-muted)' }}>Actual:</span> <span style={{ color: res.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}>{res.actualOutput}</span></div>}
                    {res.error && <div><span style={{ color: 'var(--text-muted)' }}>Error:</span> <span style={{ color: 'var(--accent-yellow)' }}>{res.error}</span></div>}
                  </div>
                ) : (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>HIDDEN TEST CASE</div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.stderr && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent-red)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.06em' }}>STDERR</div>
            <pre className="mono" style={{ color: 'var(--accent-red)', fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {data.stderr}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if ((type === 'run' || type === 'submit') && Array.isArray(data.results)) {
    return renderStructuredTestResults();
  }

  if (type === 'run') {
    return (
      <div style={{ padding: 20, height: '100%', overflowY: 'auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.06em' }}>STDOUT</div>
        <pre className="mono" style={{ color: 'var(--text-primary)', fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {data.stdout || "Program exited with no output"}
        </pre>
        {data.stderr && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent-red)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.06em' }}>STDERR</div>
            <pre className="mono" style={{ color: 'var(--accent-red)', fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {data.stderr}
            </pre>
          </div>
        )}
      </div>
    );
  }

  if (type === 'submit') {
    return renderStructuredTestResults();
  }

  return null;
}

export default OutputPanel;
