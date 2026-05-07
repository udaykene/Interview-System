import { ChevronRight } from "lucide-react";

function StudyPlanView() {
  const featuredPlans = [
    { title: "LeetCode 75", subtitle: "Ace Coding Interview with 75 Qs", color: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" },
    { title: "Top Interview 150", subtitle: "Must-do List for Interview Prep", color: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" },
    { title: "Binary Search", subtitle: "8 Patterns, 42 Qs - Master BS", color: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" },
    { title: "SQL 50", subtitle: "Crack SQL Interview in 50 Qs", color: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" },
  ];

  return (
    <div className="study-plan-view">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Study Plan</h1>
        <button className="btn-secondary" style={{ borderRadius: 12, padding: '8px 16px', fontSize: 13 }}>
          My Study Plan <ChevronRight size={14} style={{ marginLeft: 4 }} />
        </button>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 24 }}>Featured</h2>
      <div className="featured-grid">
        {featuredPlans.map((plan, i) => (
          <div key={i} className="featured-card" style={{ background: plan.color, height: 220 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{plan.title}</h3>
              <p style={{ fontSize: 13, opacity: 0.8 }}>{plan.subtitle}</p>
            </div>
            <div style={{ alignSelf: 'center', width: 80, height: 80, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Icon placeholder */}
              <div style={{ width: 40, height: 40, border: '3px solid white', borderRadius: '50%', borderTopColor: 'transparent' }} />
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 24, marginTop: 48 }}>Introduction To</h2>
      <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 20, maxWidth: 400 }}>
        <div style={{ width: 60, height: 60, background: '#0d9488', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>PD</div>
        <div>
          <h4 style={{ fontWeight: 700 }}>Introduction to Pandas</h4>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Learn Basic Pandas in 15 Qs</p>
        </div>
      </div>
      
      <div style={{ marginTop: 64, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 14 }}>More plans coming soon...</p>
      </div>
    </div>
  );
}

export default StudyPlanView;
