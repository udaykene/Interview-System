import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  Code,
  Database,
  Trophy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Plus,
  Loader2,
  Trash2,
  X,
  Search,
} from "lucide-react";
import {
  useStudyPlans,
  useStudyPlan,
  useCreateStudyPlan,
  useDeleteStudyPlan,
} from "../hooks/useStudyPlans";

function StudyPlanView({ problems = [] }) {
  const navigate = useNavigate();
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Queries & Mutations
  const { data: plansData, isLoading: listLoading, error: listError } = useStudyPlans();
  const { data: detailData, isLoading: detailLoading } = useStudyPlan(selectedSlug);
  const createMutation = useCreateStudyPlan();
  const deleteMutation = useDeleteStudyPlan();

  // Create Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("linear-gradient(135deg, #2563eb 0%, #1e40af 100%)");
  const [newIcon, setNewIcon] = useState("BookOpen");
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchProblem, setSearchProblem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const colors = [
    { label: "Blue", value: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" },
    { label: "Teal", value: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" },
    { label: "Purple", value: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" },
    { label: "Sky", value: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" },
    { label: "Amber", value: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
    { label: "Rose", value: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)" },
  ];

  const icons = [
    { name: "BookOpen", label: "Book" },
    { name: "Award", label: "Award" },
    { name: "Code", label: "Code" },
    { name: "Database", label: "DB" },
    { name: "Trophy", label: "Trophy" },
  ];

  const getIcon = (iconName, size = 24, color = "white") => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen size={size} color={color} />;
      case "Award":
        return <Award size={size} color={color} />;
      case "Code":
        return <Code size={size} color={color} />;
      case "Database":
        return <Database size={size} color={color} />;
      case "Trophy":
        return <Trophy size={size} color={color} />;
      default:
        return <BookOpen size={size} color={color} />;
    }
  };

  const getDifficultyColor = (diff) => {
    const d = diff?.toLowerCase();
    if (d === "easy") return "#00b8a3";
    if (d === "medium") return "#ffc01e";
    return "#ff375f";
  };

  // Unique categories in problem pool
  const categories = ["All", ...new Set(problems.map((p) => p.category).filter(Boolean))];

  // Filtering problems inside create modal
  const filteredProblems = problems.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchProblem.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchProblem.toLowerCase()));
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleToggleProblem = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createMutation.mutate(
      {
        title: newTitle,
        description: newDescription,
        color: newColor,
        icon: newIcon,
        problems: selectedProblems,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setNewTitle("");
          setNewDescription("");
          setSelectedProblems([]);
        },
      }
    );
  };

  const handleDeletePlan = (id) => {
    if (window.confirm("Are you sure you want to delete this study plan?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setSelectedSlug(null);
        },
      });
    }
  };

  if (listLoading) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={36} className="animate-spin" color="var(--accent-violet)" />
      </div>
    );
  }

  if (listError) {
    return (
      <div className="card" style={{ maxWidth: 520, margin: "64px auto", padding: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Failed to load study plans</h2>
        <p style={{ color: "var(--text-muted)" }}>Please refresh and try again.</p>
      </div>
    );
  }

  const { official = [], custom = [] } = plansData || {};

  // Detailed View
  if (selectedSlug) {
    if (detailLoading || !detailData?.studyPlan) {
      return (
        <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={36} className="animate-spin" color="var(--accent-violet)" />
        </div>
      );
    }

    const plan = detailData.studyPlan;

    return (
      <div className="study-plan-detail-view animate-fade-in">
        {/* Back navigation */}
        <button
          onClick={() => setSelectedSlug(null)}
          className="btn-secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 12,
            padding: "8px 14px",
            fontSize: 13,
            marginBottom: 24,
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={16} /> Back to plans
        </button>

        {/* Banner */}
        <div
          style={{
            background: plan.color,
            borderRadius: 24,
            padding: "32px clamp(20px, 4vw, 40px)",
            position: "relative",
            overflow: "hidden",
            marginBottom: 40,
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 40,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.15,
            }}
            className="md-hidden"
          >
            {getIcon(plan.icon, 120)}
          </div>

          <div style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  padding: 8,
                  borderRadius: 12,
                  display: "inline-flex",
                }}
              >
                {getIcon(plan.icon, 20)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  background: plan.isOfficial ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                {plan.isOfficial ? "Official Track" : "Custom Plan"}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 12 }}>
              {plan.title}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.8)", marginBottom: 28, lineHeight: 1.6 }}>
              {plan.description || "No description provided."}
            </p>

            {/* Progress stats */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "white", fontWeight: 600, marginBottom: 8 }}>
                <span>Progress</span>
                <span>
                  {plan.progress.solvedCount} / {plan.progress.totalCount} Solved ({plan.progress.percentage}%)
                </span>
              </div>
              <div style={{ height: 8, background: "rgba(255, 255, 255, 0.2)", borderRadius: 99, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "white",
                    width: `${plan.progress.percentage}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {!plan.isOfficial && (
              <button
                onClick={() => handleDeletePlan(plan._id)}
                className="btn-danger"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontSize: 13,
                  marginTop: 24,
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={14} /> Delete Plan
              </button>
            )}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {plan.sections.map((section) => (
            <div key={section._id} className="card animate-fade-in" style={{ padding: 24, background: "rgba(255,255,255,0.015)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: 16, marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{section.title}</h3>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                  {section.problems.filter((p) => p.isSolved).length} / {section.problems.length} Solved
                </span>
              </div>

              {section.problems.length === 0 ? (
                <div style={{ padding: "16px 0", color: "var(--text-muted)", fontSize: 13 }}>
                  No problems added to this section.
                </div>
              ) : (
                <table className="problem-table" style={{ width: "100%" }}>
                  <tbody>
                    {section.problems.map((problem) => (
                      <tr
                        key={problem.slug}
                        className="problem-row"
                        onClick={() => navigate(`/problem/${problem.slug}`)}
                        style={{ borderRadius: 12 }}
                      >
                        <td style={{ width: 40, padding: "12px 8px" }}>
                          {problem.isSolved ? (
                            <CheckCircle2 size={18} color="#00b8a3" fill="rgba(0, 184, 163, 0.1)" />
                          ) : (
                            <Circle size={18} color="var(--text-muted)" />
                          )}
                        </td>
                        <td style={{ fontWeight: 600, fontSize: 14, padding: "12px 16px" }}>
                          {problem.title}
                        </td>
                        <td style={{ width: 120, padding: "12px 16px" }}>
                          <span
                            style={{
                              color: getDifficultyColor(problem.difficulty),
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td style={{ width: 150, color: "var(--text-muted)", fontSize: 12, padding: "12px 16px" }}>
                          {problem.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dashboard List View
  return (
    <div className="study-plan-view animate-fade-in">
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Study Plans</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Prepare for target interviews systematically using custom and curated plans.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={16} /> Create Custom Plan
        </button>
      </div>

      {/* Featured/Official Plans */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 20 }}>Curated Plans</h2>
      <div className="featured-grid">
        {official.map((plan) => (
          <div
            key={plan._id}
            onClick={() => setSelectedSlug(plan.slug)}
            className="featured-card"
            style={{ background: plan.color, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    padding: 6,
                    borderRadius: 10,
                    display: "inline-flex",
                  }}
                >
                  {getIcon(plan.icon, 18)}
                </span>
                {plan.progress.solvedCount > 0 && (
                  <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                    {plan.progress.percentage}%
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "white" }}>{plan.title}</h3>
              <p style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.85)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {plan.description}
              </p>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span>Progress</span>
                <span>
                  {plan.progress.solvedCount} / {plan.progress.totalCount} Solved
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 99, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "white",
                    width: `${plan.progress.percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Custom Plans */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 20, marginTop: 48 }}>
        My Custom Plans
      </h2>
      <div className="featured-grid">
        {custom.map((plan) => (
          <div
            key={plan._id}
            onClick={() => setSelectedSlug(plan.slug)}
            className="featured-card"
            style={{ background: plan.color, height: 200, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    padding: 6,
                    borderRadius: 10,
                    display: "inline-flex",
                  }}
                >
                  {getIcon(plan.icon, 18)}
                </span>
                <span style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                  {plan.progress.percentage}%
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "white" }}>{plan.title}</h3>
              <p style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.85)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {plan.description || "No description."}
              </p>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span>Progress</span>
                <span>
                  {plan.progress.solvedCount} / {plan.progress.totalCount} Solved
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 99, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "white",
                    width: `${plan.progress.percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Inline Create card */}
        <div
          onClick={() => setIsCreateOpen(true)}
          style={{
            height: 200,
            borderRadius: 20,
            border: "2px dashed rgba(255,255,255,0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            gap: 12,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-violet)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div style={{ padding: 10, background: "rgba(255,255,255,0.05)", borderRadius: 50 }}>
            <Plus size={20} color="var(--text-secondary)" />
          </div>
          <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>Create custom plan</span>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div
            className="modal-content animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 580, padding: 32, borderRadius: 24 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>New Custom Study Plan</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="btn-icon"
                style={{ background: "transparent" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="input-group">
                <label className="sidebar-title" style={{ padding: 0 }}>Title</label>
                <input
                  className="input"
                  placeholder="LeetCode Crash Course"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{ padding: "12px 16px", borderRadius: 12, fontSize: 14 }}
                />
              </div>

              <div className="input-group">
                <label className="sidebar-title" style={{ padding: 0 }}>Description</label>
                <textarea
                  className="input"
                  placeholder="A targeted list of key algorithmic problems..."
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ padding: "12px 16px", borderRadius: 12, fontSize: 14, resize: "none" }}
                />
              </div>

              {/* Color Gradient Select */}
              <div>
                <label className="sidebar-title" style={{ padding: 0, marginBottom: 8, display: "block" }}>Color Gradient</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {colors.map((c) => (
                    <div
                      key={c.value}
                      onClick={() => setNewColor(c.value)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c.value,
                        cursor: "pointer",
                        border: newColor === c.value ? "3px solid white" : "3px solid transparent",
                        boxSizing: "border-box",
                        boxShadow: newColor === c.value ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Select */}
              <div>
                <label className="sidebar-title" style={{ padding: 0, marginBottom: 8, display: "block" }}>Icon</label>
                <div style={{ display: "flex", gap: 12 }}>
                  {icons.map((ic) => (
                    <div
                      key={ic.name}
                      onClick={() => setNewIcon(ic.name)}
                      style={{
                        padding: 10,
                        borderRadius: 12,
                        background: newIcon === ic.name ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                        border: newIcon === ic.name ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={ic.label}
                    >
                      {getIcon(ic.name, 18, newIcon === ic.name ? "white" : "var(--text-secondary)")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem Selector checklist */}
              <div>
                <label className="sidebar-title" style={{ padding: 0, marginBottom: 8, display: "block" }}>
                  Add Problems ({selectedProblems.length} Selected)
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search
                      size={14}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      className="input"
                      placeholder="Search..."
                      value={searchProblem}
                      onChange={(e) => setSearchProblem(e.target.value)}
                      style={{
                        paddingLeft: 34,
                        borderRadius: 10,
                        fontSize: 12,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "#151515",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "var(--text-secondary)",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    maxHeight: 180,
                    overflowY: "auto",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: 8,
                  }}
                >
                  {filteredProblems.length === 0 ? (
                    <div style={{ padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                      No problems found
                    </div>
                  ) : (
                    filteredProblems.map((prob) => (
                      <div
                        key={prob._id}
                        onClick={() => handleToggleProblem(prob._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: selectedProblems.includes(prob._id)
                            ? "rgba(124, 91, 240, 0.08)"
                            : "transparent",
                          transition: "background 0.2s",
                          marginBottom: 4,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProblems.includes(prob._id)}
                          onChange={() => {}} // handled by click on parent div
                          style={{ accentColor: "var(--accent-violet)" }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{prob.title}</span>
                        <span
                          style={{
                            fontSize: 11,
                            color: getDifficultyColor(prob.difficulty),
                            fontWeight: 700,
                          }}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="btn-ghost"
                  style={{ borderRadius: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    borderRadius: 12,
                    padding: "10px 24px",
                    background: "var(--accent-violet)",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyPlanView;
