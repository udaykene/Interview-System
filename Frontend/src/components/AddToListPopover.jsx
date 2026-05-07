import { Plus, X, Lock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AddToListPopover({ isOpen, onClose, playlists, problemId, onToggleProblem, onCreateNew }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{ position: 'fixed', inset: 0, zIndex: 1100 }} 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          zIndex: 1101,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>My Lists</h3>
            <button onClick={onClose} className="btn-icon" style={{ padding: 4, background: 'transparent' }}><X size={16} /></button>
          </div>
        </div>

        <div style={{ maxHeight: 300, overflowY: 'auto', padding: 8 }}>
          {playlists.map(list => {
            const isIncluded = list.problems?.some(p => (typeof p === 'string' ? p : p._id) === problemId);
            return (
              <div 
                key={list._id} 
                className="sidebar-item" 
                style={{ borderRadius: 8 }}
                onClick={() => onToggleProblem(list._id, problemId, isIncluded)}
              >
                <div style={{ 
                  width: 18, height: 18, 
                  borderRadius: 4, border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isIncluded ? 'var(--accent-violet)' : 'transparent',
                  borderColor: isIncluded ? 'var(--accent-violet)' : 'rgba(255,255,255,0.2)'
                }}>
                  {isIncluded && <Check size={12} color="white" />}
                </div>
                <span style={{ flex: 1, fontSize: 13 }}>{list.name}</span>
                {!list.isPublic && <Lock size={12} color="var(--text-muted)" />}
              </div>
            );
          })}
        </div>

        <button 
          onClick={onCreateNew}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 13,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Plus size={18} />
          <span>Create a new list</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddToListPopover;
