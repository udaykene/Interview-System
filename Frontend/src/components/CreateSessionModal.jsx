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
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
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
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Session Type</span>
            </label>
            <div className="flex gap-3">
              <button
                className={`btn ${roomConfig.visibility === "public" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setRoomConfig({ ...roomConfig, visibility: "public" })}
              >
                Public
              </button>
              <button
                className={`btn ${roomConfig.visibility === "private" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setRoomConfig({ ...roomConfig, visibility: "private" })}
              >
                Private
              </button>
            </div>
            <p className="text-sm text-base-content/60">
              Private sessions require a join code. Public sessions appear in the live list.
            </p>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Type: <span className="font-medium">{roomConfig.visibility}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
