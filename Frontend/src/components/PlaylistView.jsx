import { Search, Play, Plus, Edit, MoreHorizontal, Star, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PlaylistView({ playlist, isSolved, favoriteIds, onToggleFavorite, onAddToList }) {
  const navigate = useNavigate();

  if (!playlist) return null;

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <div className="playlist-cover">
          <Star size={64} color="white" fill={playlist.name === "Favorite" ? "white" : "none"} />
        </div>
        <div className="playlist-info">
          <h1>{playlist.name}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            {playlist.userId?.name || "User"} • {playlist.problems?.length || 0} questions
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn" style={{ background: 'white', color: 'black', borderRadius: 99, padding: '10px 24px' }}>
              <Play size={16} fill="black" style={{ marginRight: 8 }} /> Practice
            </button>
            <button className="btn-icon" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }}><Plus size={20} /></button>
            <button className="btn-icon" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }}><Edit size={18} /></button>
            <button className="btn-icon" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }}><MoreHorizontal size={20} /></button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            className="input" 
            placeholder="Search questions" 
            style={{ paddingLeft: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: 'none' }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' }}>
        <table className="problem-table">
          <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Title</th>
              <th style={{ width: 100 }}>Acceptance</th>
              <th style={{ width: 100 }}>Difficulty</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {(playlist.problems || []).map((problem, i) => (
              <tr key={problem.slug} className="problem-row" onClick={() => navigate(`/problem/${problem.slug}`)}>
                <td>
                  {isSolved(problem._id) ? (
                    <CheckCircle2 size={16} color="var(--accent-green)" />
                  ) : (
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: '2px solid rgba(255,255,255,0.1)' }} />
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: 8, fontSize: 13 }}>{i + 1}.</span>
                  {problem.title}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  {problem.acceptanceRate?.toFixed(1) || '0.0'}%
                </td>
                <td style={{ color: problem.difficulty === 'Easy' ? 'var(--accent-green)' : problem.difficulty === 'Medium' ? 'var(--accent-yellow)' : 'var(--accent-red)', fontSize: 13, fontWeight: 700 }}>
                  {problem.difficulty}
                </td>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <Star 
                    size={16} 
                    color={favoriteIds.includes(problem._id) ? "var(--accent-yellow)" : "rgba(255,255,255,0.1)"}
                    fill={favoriteIds.includes(problem._id) ? "var(--accent-yellow)" : "none"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(problem._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <button 
                    className="btn-icon" 
                    style={{ padding: 4, background: 'transparent' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList(problem._id);
                    }}
                  >
                    <Plus size={16} color="var(--text-muted)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlaylistView;
