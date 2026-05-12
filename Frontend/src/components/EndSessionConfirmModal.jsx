import { useEffect, useMemo, useState } from "react";
import { Loader2, LogOut } from "lucide-react";

function EndSessionConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  isConfirming,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Start close
      if (isVisible) {
        setShouldUnmount(true);
        window.setTimeout(() => {
          setIsVisible(false);
          setShouldUnmount(false);
        }, 180);
      }
      return;
    }

    setIsVisible(true);
    setShouldUnmount(false);
  }, [isOpen, isVisible]);

  const overlayStyle = useMemo(
    () => ({
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      opacity: isOpen ? 1 : 0,
      transition: "opacity 180ms cubic-bezier(0.16, 1, 0.3, 1)",
      pointerEvents: isOpen ? "auto" : "none",
    }),
    [isOpen]
  );

  const cardBaseStyle = {
    width: "min(520px, calc(100vw - 32px))",
    background: "#0b0b0b",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
  };

  const cardStyle = {
    ...cardBaseStyle,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0px) scale(1)" : "translateY(8px) scale(0.98)",
    transition: "opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1)",
  };

  if (!isOpen && !shouldUnmount) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={overlayStyle}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="card" style={cardStyle}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div
              style={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: "var(--accent-red)",
                letterSpacing: "0.06em",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Confirm
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 6 }}>
              End this session?
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.5 }}>
              This will end the session for all participants.
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
          <button className="btn btn-sm btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-sm btn-danger" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />} End
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndSessionConfirmModal;

