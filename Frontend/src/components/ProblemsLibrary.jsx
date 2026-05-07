import { useState } from "react";
import { Search, ChevronRight, CheckCircle2, Star, ListFilter, SortAsc, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ProblemsLibrary({ problems, favoriteIds, onToggleFavorite, isSolved, onAddToList }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Topics");

  const categories = ["All Topics", "Algorithms", "Database", "Shell", "Concurrency", "JavaScript", "Pandas"];

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                       p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const getDifficultyColor = (diff) => {
    const d = diff?.toLowerCase();
    if (d === 'easy') return 'var(--accent-green)';
    if (d === 'medium') return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  const featuredCards = [
    { title: "LeetCode at Your Fingertips", color: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", icon: "🚀" },
    { title: "JavaScript 30 Days Challenge", color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", icon: "JS", subtitle: "Beginner Friendly" },
    { title: "Top Interview Questions", color: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)", icon: "💬" },
    { title: "LeetCode's Interview Crash Course", color: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)", icon: "⚡" },
  ];

  return (
    <div className="problems-library">
      {/* Featured Cards */}
      <div className="featured-grid">
        {featuredCards.map((card, i) => (
          <div key={i} className="featured-card" style={{ background: card.color }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, marginBottom: 4 }}>{card.subtitle || "Featured"}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{card.title}</h3>
            </div>
            <div style={{ alignSelf: 'flex-end', fontSize: 24, fontWeight: 900, opacity: 0.2 }}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
         {["Array", "String", "Hash Table", "Math", "Dynamic Programming", "Sorting"].map(t => (
           <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
             <span>{t}</span>
             <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 99 }}>{Math.floor(Math.random() * 2000)}</span>
           </div>
         ))}
      </div>

      {/* Category Chips */}
      <div className="category-chips">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            className="input" 
            placeholder="Search questions" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: 'none' }}
          />
        </div>
        <button className="btn-icon" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}><SortAsc size={18} /></button>
        <button className="btn-icon" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}><ListFilter size={18} /></button>
      </div>

      {/* Problem Table */}
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
            {filtered.map((problem, i) => (
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
                <td style={{ color: getDifficultyColor(problem.difficulty), fontSize: 13, fontWeight: 700 }}>
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

export default ProblemsLibrary;
