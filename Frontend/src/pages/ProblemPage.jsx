import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import SubmissionsTab from "../components/SubmissionsTab";
import AcceptedTab from "../components/AcceptedTab";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useProblem, useToggleFavorite, useFavorites } from "../hooks/useProblems";
import axiosInstance from "../lib/axios";
import { Loader2, Code2, Play, CheckCircle2, Star, FileText, History } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [acceptedResult, setAcceptedResult] = useState(null);

  const { data: problemData, isLoading } = useProblem(id);
  const problem = problemData?.problem;
  const toggleFavMutation = useToggleFavorite();
  const { data: favData } = useFavorites();
  const favoriteIds = (favData?.favorites || []).map(f => typeof f === 'string' ? f : f._id);
  const isFavorited = problem ? favoriteIds.includes(problem._id) : false;

  useEffect(() => {
    setOutput(null);
    setAcceptedResult(null);
    setActiveTab("description");
    if (problem?.starterCode?.[selectedLanguage]) {
      setCode(problem.starterCode[selectedLanguage]);
    }
  }, [problem, selectedLanguage, id]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problem?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleRunCode = async () => {
    if (!code.trim() || !problem) return;
    setIsRunning(true);
    setOutput(null);
    try {
      const res = await axiosInstance.post('/execute/run', {
        problemId: problem._id,
        language: selectedLanguage,
        code,
      });
      setOutput({ type: 'run', data: res.data });
    } catch (err) {
      setOutput({ type: 'run', data: { error: err.response?.data?.message || err.response?.data?.error || err.message } });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim() || !problem) return;
    setIsSubmitting(true);
    setOutput(null);
    try {
      const res = await axiosInstance.post('/execute/submit', { problemId: problem._id, language: selectedLanguage, code });
      setOutput({ type: 'submit', data: res.data });

      // Invalidate submissions cache so SubmissionsTab refreshes
      queryClient.invalidateQueries({ queryKey: ["submissions", problem._id] });

      if (res.data.status === 'Accepted') {
        toast.success("All test cases passed!");
        triggerConfetti();
        setAcceptedResult(res.data);
        setActiveTab("accepted");
      } else {
        toast.error(`Submission failed: ${res.data.status}`);
      }
    } catch (err) {
      setOutput({ type: 'submit', data: { status: 'Error', error: err.response?.data?.message || err.response?.data?.error || err.message } });
      toast.error("Execution failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (diff) => {
    if (!diff) return 'var(--text-muted)';
    const d = diff.toLowerCase();
    if (d === 'easy') return 'var(--accent-green)';
    if (d === 'medium') return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  // Tab definitions — "accepted" only shows when we have an accepted result
  const tabs = [
    { id: "description", label: "Description", icon: <FileText size={13} /> },
    { id: "submissions", label: "Submissions", icon: <History size={13} /> },
    ...(acceptedResult ? [{ id: "accepted", label: "Accepted", icon: <CheckCircle2 size={13} /> }] : []),
  ];

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" />
    </div>
  );

  if (!problem) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Problem not found
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050505' }}>
      <Navbar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PanelGroup direction="horizontal">
          {/* LEFT: TABBED PANEL */}
          <Panel defaultSize={45} minSize={30}>
            <div style={{ height: '100%', background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>

              {/* Tab bar */}
              <div style={{
                display: 'flex', gap: 0,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                padding: '0 16px',
                flexShrink: 0,
              }}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const isAcceptedTab = tab.id === "accepted";
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '12px 16px',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: isActive
                          ? isAcceptedTab ? 'var(--accent-green)' : 'white'
                          : 'var(--text-muted)',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: isActive
                          ? `2px solid ${isAcceptedTab ? 'var(--accent-green)' : 'var(--accent-violet)'}`
                          : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: -1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                      {isAcceptedTab && (
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'var(--accent-green)',
                          boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {/* DESCRIPTION TAB */}
                {activeTab === "description" && (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.02em', flex: 1 }}>
                          {problem.title}
                          <span className="badge" style={{
                            background: `${getDifficultyColor(problem.difficulty)}12`,
                            color: getDifficultyColor(problem.difficulty),
                            border: `1px solid ${getDifficultyColor(problem.difficulty)}25`,
                          }}>
                            {problem.difficulty?.toUpperCase()}
                          </span>
                        </h1>
                        <button
                          onClick={() => toggleFavMutation.mutate(problem._id)}
                          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                          style={{
                            background: isFavorited ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isFavorited ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'all 0.25s', flexShrink: 0,
                            color: isFavorited ? '#f59e0b' : 'var(--text-muted)',
                            fontSize: 12, fontWeight: 600,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = isFavorited ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = isFavorited ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.08)'}
                        >
                          <Star size={14} fill={isFavorited ? '#f59e0b' : 'none'} />
                          {isFavorited ? 'Favorited' : 'Favorite'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {problem.tags?.map(t => (
                          <span key={t} style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '3px 10px',
                            borderRadius: 99, background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)',
                            border: '1px solid rgba(255,255,255,0.04)', letterSpacing: '0.03em'
                          }}>{t}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: 24, paddingBottom: 60 }}>
                      <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 32, whiteSpace: 'pre-wrap' }}>
                        {problem.description?.text}
                      </div>
                      {problem.examples?.map((ex, i) => (
                        <div key={i} style={{ marginBottom: 24 }}>
                          <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>EXAMPLE {i + 1}</h3>
                          <div className="code-block" style={{ borderLeft: '3px solid var(--accent-violet)', borderRadius: '0 12px 12px 0' }}>
                            <div style={{ marginBottom: 4 }}><strong style={{ color: 'var(--text-muted)' }}>Input:</strong> {ex.input}</div>
                            <div style={{ marginBottom: ex.explanation ? 4 : 0 }}><strong style={{ color: 'var(--text-muted)' }}>Output:</strong> {ex.output}</div>
                            {ex.explanation && <div><strong style={{ color: 'var(--text-muted)' }}>Explanation:</strong> {ex.explanation}</div>}
                          </div>
                        </div>
                      ))}
                      {problem.constraints?.length > 0 && (
                        <div>
                          <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>CONSTRAINTS</h3>
                          <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {problem.constraints.map((c, i) => (
                              <li key={i}><code style={{ fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>{c}</code></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUBMISSIONS TAB */}
                {activeTab === "submissions" && problem && (
                  <SubmissionsTab problemId={problem._id} />
                )}

                {/* ACCEPTED TAB */}
                {activeTab === "accepted" && acceptedResult && (
                  <AcceptedTab result={acceptedResult} />
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="panel-handle-v" />

          {/* RIGHT: EDITOR AND OUTPUT */}
          <Panel defaultSize={55} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={65} minSize={20}>
                <CodeEditorPanel selectedLanguage={selectedLanguage} code={code}
                  onLanguageChange={handleLanguageChange} onCodeChange={setCode} />
              </Panel>
              <PanelResizeHandle className="panel-handle-h" />
              <Panel defaultSize={35} minSize={15}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{
                    padding: '10px 20px', background: '#0a0a0a',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Code2 size={14} color="var(--accent-violet)" /> OUTPUT
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary" onClick={handleRunCode} disabled={isRunning || isSubmitting}>
                        {isRunning ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />} Run
                      </button>
                      <button className="btn btn-sm btn-primary" onClick={handleSubmitCode} disabled={isRunning || isSubmitting}>
                        {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Submit
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <OutputPanel output={output} />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
