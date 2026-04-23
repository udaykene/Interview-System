import Editor from "@monaco-editor/react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  onLanguageChange,
  onCodeChange,
  remoteTyping,
}) {
  return (
    <div style={{ height: '100%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img src={LANGUAGE_CONFIG[selectedLanguage]?.icon} alt={LANGUAGE_CONFIG[selectedLanguage]?.name} style={{ width: 16, height: 16 }} />
            <select 
              className="select select-sm" 
              value={selectedLanguage} 
              onChange={onLanguageChange}
              style={{
                background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
                outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: 16
              }}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {remoteTyping && (
          <div className="badge badge-purple" style={{ fontSize: 11, animation: 'pulse-glow 2s infinite' }}>
            <div className="status-dot status-active" style={{ marginRight: 6 }} />
            Peer is typing...
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
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;
