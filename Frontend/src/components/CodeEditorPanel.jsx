import Editor from "@monaco-editor/react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({ selectedLanguage, code, onLanguageChange, onCodeChange, remoteTyping }) {
  return (
    <div style={{ height: '100%', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px 20px', background: '#0a0a0a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={LANGUAGE_CONFIG[selectedLanguage]?.icon} alt={LANGUAGE_CONFIG[selectedLanguage]?.name}
            style={{ width: 15, height: 15, opacity: 0.8 }} />
          <select
            value={selectedLanguage}
            onChange={onLanguageChange}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
              outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: 16,
              letterSpacing: '0.03em'
            }}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key} style={{ background: '#111111', color: 'var(--text-primary)' }}>
                {lang.name}
              </option>
            ))}
          </select>
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
          language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || 'javascript'}
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
