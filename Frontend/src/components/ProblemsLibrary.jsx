import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle2, Star, ListFilter, SortAsc, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function ProblemsLibrary({ problems, favoriteIds, onToggleFavorite, isSolved, onAddToList, activeView }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const topics = useMemo(() => {
    const topicMap = new Map();

    problems.forEach(problem => {
      const problemTopics = new Set([
        problem.category || "Uncategorized",
        ...(Array.isArray(problem.tags) ? problem.tags : []),
      ].filter(Boolean));

      problemTopics.forEach(topic => {
        topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
      });
    });

    return [
      ["All Topics", problems.length],
      ...Array.from(topicMap.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    ];
  }, [problems]);


  // Fetch users if activeView is 'users'
  useEffect(() => {
    if (activeView === 'users') {
      const fetchUsers = async () => {
        setUsersLoading(true);
        try {
          // We can use the global search with empty query or a dedicated list-users API
          // For now let's use search with a wildcard or just fetch all (if API exists)
          // Since we added globalSearch, let's use it or assume we'll add /api/users
          const { data } = await axiosInstance.get(`/search?q=${search || ' '}`);
          setUsers(data.users);
        } catch (err) {
          console.error(err);
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsers();
    }
  }, [activeView, search]);

  const filteredProblems = problems.filter(p => {
    // Search filter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                       p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    // Category filter
    const matchCategory = activeCategory === "All Topics" || 
                         p.category === activeCategory || 
                         (p.tags && p.tags.includes(activeCategory));

    return matchSearch && matchCategory;
  });

  const getDifficultyColor = (diff) => {
    const d = diff?.toLowerCase();
    if (d === 'easy') return '#00b8a3';
    if (d === 'medium') return '#ffc01e';
    return '#ff375f';
  };

  const handleToggleFollow = async (userId) => {
    try {
      const { data } = await axiosInstance.post(`/auth/user/${userId}/follow`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isFollowing: data.isFollowing } : u));
      toast.success(data.isFollowing ? "Following" : "Unfollowed");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (activeView === 'users') {
    return (
      <div className="users-view">
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              className="input" 
              placeholder="Search users" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: 'none' }}
            />
          </div>
        </div>

        {usersLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {users.map(user => (
              <div 
                key={user.username} 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12,
                  cursor: 'pointer', transition: 'background 0.2s'
                }}
                onClick={() => navigate(`/u/${user.username}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {user.profileImage ? (
                    <img src={user.profileImage} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>@{user.username}</div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleToggleFollow(user._id); }}
                  style={{
                    padding: '8px 24px', borderRadius: 8,
                    background: user.isFollowing ? 'rgba(255,255,255,0.05)' : '#10b981',
                    color: 'white', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                  }}
                >
                  {user.isFollowing ? 'Unfollow' : '+ Follow'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Problems View (Library)
  return (
    <div className="problems-library">
      {/* Featured Cards (Optional, keeping them for premium feel) */}
      <div className="featured-grid">
         {/* Featured cards content */}
      </div>

      {/* Topic Filters */}
      <div className="category-chips">
        {topics.map(([cat, count]) => (
          <button 
            key={cat} 
            className={`chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>{cat}</span>
            <span style={{ 
              fontSize: 10, 
              background: activeCategory === cat ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)', 
              padding: '2px 6px', 
              borderRadius: 99 
            }}>
              {count}
            </span>
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
              <th style={{ width: 80 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem, i) => (
              <tr key={problem.slug} className="problem-row" onClick={() => navigate(`/problem/${problem.slug}`)} 
                  style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderRadius: 8 }}>
                <td style={{ padding: '16px 12px' }}>
                  {isSolved(problem._id) ? (
                    <CheckCircle2 size={16} color="#00b8a3" />
                  ) : (
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: '2px solid rgba(255,255,255,0.1)' }} />
                  )}
                </td>
                <td style={{ fontWeight: 600, padding: '16px 12px' }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: 8, fontSize: 13 }}>{i + 1}.</span>
                  {problem.title}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13, padding: '16px 12px' }}>
                  {problem.acceptanceRate?.toFixed(1) || '57.4'}%
                </td>
                <td style={{ color: getDifficultyColor(problem.difficulty), fontSize: 13, fontWeight: 700, padding: '16px 12px' }}>
                  {problem.difficulty}
                </td>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 12px' }}>
                   <Star 
                    size={16} 
                    color={favoriteIds.includes(problem._id) ? "#ffc01e" : "rgba(255,255,255,0.1)"}
                    fill={favoriteIds.includes(problem._id) ? "#ffc01e" : "none"}
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
