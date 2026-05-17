import Editor from "@monaco-editor/react";
import { LANGUAGE_CONFIG } from "../data/problems";
import { useState, useRef, useEffect } from "react";

function CodeEditorPanel({ selectedLanguage, code, onLanguageChange, onCodeChange, remoteTyping }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGUAGE_CONFIG[selectedLanguage];

  return (
    <div style={{ height: '100%', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px 20px', background: '#0a0a0a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>

        {/* Custom Dropdown */}
        <div ref={ref} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none',
              color: 'var(--text-primary)', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
              letterSpacing: '0.03em', padding: '4px 6px',
              borderRadius: 6,
            }}
          >
            <img src={current?.icon} alt={current?.name} style={{ width: 15, height: 15, opacity: 0.85 }} />
            {current?.name}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5, marginLeft: 2 }}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0,
              background: '#111', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, overflow: 'hidden',
              minWidth: 140, zIndex: 50,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <div
                  key={key}
                  onClick={() => { onLanguageChange({ target: { value: key } }); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                    color: key === selectedLanguage ? 'white' : 'var(--text-secondary)',
                    background: key === selectedLanguage ? 'rgba(255,255,255,0.06)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = key === selectedLanguage ? 'rgba(255,255,255,0.06)' : 'transparent'}
                >
                  <img src={lang.icon} alt={lang.name} style={{ width: 15, height: 15, opacity: 0.85 }} />
                  {lang.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {remoteTyping && (
          <div className="badge badge-purple" style={{ animation: 'pulse-glow 2s infinite' }}>
            <div className="status-dot status-active" style={{ marginRight: 6, width: 6, height: 6 }} />
            PEER TYPING
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={current?.monacoLang || 'javascript'}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            wordWrap: 'on',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;