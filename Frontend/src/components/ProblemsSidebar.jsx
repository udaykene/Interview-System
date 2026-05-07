import { BookOpen, Compass, Flame, GraduationCap, Plus, Star, Lock } from "lucide-react";

function ProblemsSidebar({ activeView, setActiveView, playlists = [] }) {
  const mainItems = [
    { id: "library", label: "Library", icon: <BookOpen size={18} /> },
    { id: "quest", label: "Quest", icon: <Flame size={18} />, badge: "New" },
    { id: "explore", label: "Explore", icon: <Compass size={18} /> },
    { id: "study-plan", label: "Study Plan", icon: <GraduationCap size={18} /> },
  ];

  return (
    <aside className="problems-sidebar">
      <div className="sidebar-section">
        {mainItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => setActiveView(item.id)}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{ 
                fontSize: 10, 
                background: "var(--accent-blue)", 
                color: "white", 
                padding: "2px 6px", 
                borderRadius: 99,
                fontWeight: 700
              }}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 8 }}>
          <span className="sidebar-title">My Lists</span>
          <button 
            className="btn-icon" 
            style={{ padding: 4, background: 'transparent' }}
            onClick={() => setActiveView("create-list")}
          >
            <Plus size={16} color="var(--text-muted)" />
          </button>
        </div>
        
        <div 
          className={`sidebar-item ${activeView === "favorites" ? "active" : ""}`}
          onClick={() => setActiveView("favorites")}
        >
          <div style={{ 
            width: 20, height: 20, 
            background: "var(--accent-orange)", 
            borderRadius: 4, 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <Star size={12} color="white" fill="white" />
          </div>
          <span style={{ flex: 1 }}>Favorite</span>
          <Lock size={12} color="var(--text-muted)" />
        </div>

        {playlists.map((list) => (
          <div
            key={list._id}
            className={`sidebar-item ${activeView === `list-${list._id}` ? "active" : ""}`}
            onClick={() => setActiveView(`list-${list._id}`)}
          >
            <div style={{ 
              width: 20, height: 20, 
              background: "rgba(255,255,255,0.1)", 
              borderRadius: 4, 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <BookOpen size={12} color="var(--text-muted)" />
            </div>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {list.name}
            </span>
            {!list.isPublic && <Lock size={12} color="var(--text-muted)" />}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ProblemsSidebar;
