import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { useProblems } from "../hooks/useProblems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const { data } = useProblems();
  const problems = data?.problems || [];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Create New Session</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* PROBLEM SELECTION */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Select Problem <span style={{ color: 'var(--accent-red)' }}>*</span>
            </label>

            <select
              className="input"
              style={{ width: '100%', cursor: 'pointer' }}
              value={roomConfig.problemId || ""}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.slug === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: selectedProblem.title,
                  problemId: selectedProblem.slug,
                  visibility: roomConfig.visibility || "public",
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.slug} value={problem.slug}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* VISIBILITY */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Session Type
            </label>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <button
                className={`btn ${roomConfig.visibility === "public" ? "btn-primary" : "btn-secondary"}`}
                style={{ flex: 1 }}
                onClick={() => setRoomConfig({ ...roomConfig, visibility: "public" })}
              >
                Public
              </button>
              <button
                className={`btn ${roomConfig.visibility === "private" ? "btn-primary" : "btn-secondary"}`}
                style={{ flex: 1 }}
                onClick={() => setRoomConfig({ ...roomConfig, visibility: "private" })}
              >
                Private
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Private sessions require a join code. Public sessions appear in the live list.
            </p>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              display: 'flex', gap: 16, alignItems: 'center'
            }}>
              <Code2Icon size={24} color="var(--accent-green)" />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--accent-green)', marginBottom: 4 }}>Room Summary:</p>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Problem: <strong style={{ color: 'var(--text-primary)' }}>{roomConfig.problem}</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Type: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{roomConfig.visibility}</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Max Participants: <strong style={{ color: 'var(--text-primary)' }}>2 (1-on-1 session)</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--bg-border)' }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon size={18} className="animate-spin" />
            ) : (
              <PlusIcon size={18} />
            )}
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateSessionModal;
