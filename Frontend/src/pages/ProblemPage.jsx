import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useProblem, useProblems } from "../hooks/useProblems";
import axiosInstance from "../lib/axios";
import { Loader2, Code2, Play, CheckCircle2 } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: problemData, isLoading } = useProblem(id);
  const problem = problemData?.problem;

  useEffect(() => {
    setOutput(null);
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
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput(null);
    try {
      const res = await axiosInstance.post('/execute/run', { language: selectedLanguage, code });
      setOutput({ type: 'run', data: res.data });
    } catch (err) {
      setOutput({ type: 'run', data: { error: err.response?.data?.error || err.message } });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim() || !problem) return;
    setIsSubmitting(true);
    setOutput(null);
    try {
      const res = await axiosInstance.post('/execute/submit', {
        problemId: problem._id,
        language: selectedLanguage,
        code
      });
      setOutput({ type: 'submit', data: res.data });
      if (res.data.status === 'Accepted') {
        toast.success("All test cases passed!");
        triggerConfetti();
      } else {
        toast.error(`Submission failed: ${res.data.status}`);
      }
    } catch (err) {
      setOutput({ type: 'submit', data: { status: 'Error', error: err.response?.data?.error || err.message } });
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

  if (isLoading) return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );

  if (!problem) return (
    <div className="min-h-screen animated-bg flex items-center justify-center color-text-muted">
      Problem not found
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PanelGroup direction="horizontal">
          
          {/* LEFT: PROBLEM DETAILS */}
          <Panel defaultSize={45} minSize={30}>
            <div style={{ height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--bg-border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg-border)', background: 'var(--bg-card)' }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {problem.title}
                  <span style={{ fontSize: 13, padding: '2px 8px', borderRadius: 4, background: `${getDifficultyColor(problem.difficulty)}22`, color: getDifficultyColor(problem.difficulty) }}>
                    {problem.difficulty}
                  </span>
                </h1>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {problem.tags?.map(t => (
                    <span key={t} style={{ fontSize: 12, padding: '2px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 24, paddingBottom: 60 }}>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: 32, whiteSpace: 'pre-wrap' }}>
                  {problem.description?.text}
                </div>

                {problem.examples?.map((ex, i) => (
                  <div key={i} style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Example {i + 1}:</h3>
                    <div className="code-block" style={{ borderLeft: '3px solid var(--accent-indigo)', borderRadius: '0 8px 8px 0' }}>
                      <div style={{ marginBottom: 4 }}><strong style={{ color: 'var(--text-secondary)' }}>Input:</strong> {ex.input}</div>
                      <div style={{ marginBottom: ex.explanation ? 4 : 0 }}><strong style={{ color: 'var(--text-secondary)' }}>Output:</strong> {ex.output}</div>
                      {ex.explanation && <div><strong style={{ color: 'var(--text-secondary)' }}>Explanation:</strong> {ex.explanation}</div>}
                    </div>
                  </div>
                ))}

                {problem.constraints?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Constraints:</h3>
                    <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {problem.constraints.map((c, i) => (
                        <li key={i}><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{c}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="panel-handle-v" />

          {/* RIGHT: EDITOR AND OUTPUT */}
          <Panel defaultSize={55} minSize={30}>
            <PanelGroup direction="vertical">
              
              <Panel defaultSize={65} minSize={20}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                />
              </Panel>

              <PanelResizeHandle className="panel-handle-h" />

              <Panel defaultSize={35} minSize={15}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
                  <div style={{ padding: '8px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Code2 size={15} color="var(--accent-indigo)" /> Execution Results
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary" onClick={handleRunCode} disabled={isRunning || isSubmitting}>
                        {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Run
                      </button>
                      <button className="btn btn-sm btn-primary" onClick={handleSubmitCode} disabled={isRunning || isSubmitting}>
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Submit
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
