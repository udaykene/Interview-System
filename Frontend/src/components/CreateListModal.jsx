import { X } from "lucide-react";
import { useState } from "react";

function CreateListModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name: title, description, isPublic: !isPrivate });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Create New List</h2>
          <button onClick={onClose} className="btn-icon" style={{ background: 'transparent' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label className="sidebar-title" style={{ padding: 0 }}>Title</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="input" 
                placeholder="Enter a list name" 
                maxLength={30}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ padding: '12px 16px', borderRadius: 12, fontSize: 14 }}
              />
              <span style={{ position: 'absolute', right: 12, bottom: 12, fontSize: 10, color: 'var(--text-muted)' }}>{title.length}/30</span>
            </div>
          </div>

          <div className="input-group">
            <label className="sidebar-title" style={{ padding: 0 }}>Description</label>
            <div style={{ position: 'relative' }}>
              <textarea 
                className="input" 
                placeholder="Describe your list" 
                maxLength={150}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: 12, fontSize: 14, resize: 'none' }}
              />
              <span style={{ position: 'absolute', right: 12, bottom: 12, fontSize: 10, color: 'var(--text-muted)' }}>{description.length}/150</span>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={isPrivate} 
              onChange={(e) => setIsPrivate(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--accent-violet)' }}
            />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Private</span>
          </label>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ borderRadius: 12 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ borderRadius: 12, padding: '10px 24px', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListModal;
