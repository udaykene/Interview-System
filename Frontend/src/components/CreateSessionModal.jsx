import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProblems } from "../hooks/useProblems";

function CreateSessionModal({ isOpen, onClose, roomConfig, setRoomConfig, onCreateRoom, isCreating }) {
  const { data } = useProblems();
  const problems = data?.problems || [];
  const selectHasValue = Boolean(roomConfig.problemId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%', maxWidth: 560,
              background: '#111111', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 36,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <span className="mono-label" style={{ marginBottom: 8, display: 'block' }}>NEW SESSION</span>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, letterSpacing: '-0.02em' }}>Create Interview Room</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Problem Selection */}
              <div className="input-group">
                <label className="input-label">Select Problem <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                <select
                  className="input"
                  style={{
                    cursor: 'pointer',
                    color: selectHasValue ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: '#171717',
                    appearance: 'auto',
                    WebkitAppearance: 'menulist',
                  }}
                  value={roomConfig.problemId || ""}
                  onChange={(e) => {
                    const sp = problems.find(p => p.slug === e.target.value);
                    if (!sp) {
                      setRoomConfig((prev) => ({ ...prev, problem: "", problemId: "", difficulty: "", visibility: "private" }));
                      return;
                    }
                    setRoomConfig({
                      difficulty: sp.difficulty,
                      problem: sp.title,
                      problemId: sp.slug,
                      visibility: "private",
                    });
                  }}
                >
                  <option value="" disabled style={{ color: '#94a3b8', backgroundColor: '#171717' }}>
                    Choose a coding problem...
                  </option>
                  {problems.map((p) => (
                    <option
                      key={p.slug}
                      value={p.slug}
                      style={{ color: '#f8fafc', backgroundColor: '#111111' }}
                    >
                      {p.title} ({p.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Session Type</label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Private only</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Every new interview room is invite-only and protected by a join code.
                    </div>
                  </div>
                  <span className="badge" style={{ background: 'rgba(129,140,248,0.14)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.22)' }}>
                    PRIVATE
                  </span>
                </div>
              </div>

              {/* Summary */}
              {roomConfig.problem && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 14, padding: 20, display: 'flex', gap: 16, alignItems: 'center'
                  }}>
                  <Code2Icon size={22} color="var(--accent-green)" />
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--accent-green)', marginBottom: 6, fontSize: 13 }}>Room Summary</p>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      <div>Problem: <strong style={{ color: 'var(--text-primary)' }}>{roomConfig.problem}</strong></div>
                      <div>Type: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{roomConfig.visibility}</strong></div>
                      <div>Access: <strong style={{ color: 'var(--text-primary)' }}>Join code required</strong></div>
                      <div>Participants: <strong style={{ color: 'var(--text-primary)' }}>2 (1-on-1)</strong></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={onCreateRoom} disabled={isCreating || !roomConfig.problem}>
                {isCreating ? <LoaderIcon size={16} className="animate-spin" /> : <PlusIcon size={16} />}
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateSessionModal;
