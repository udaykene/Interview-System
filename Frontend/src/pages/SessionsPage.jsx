import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { useProblem } from "../hooks/useProblems";
import { useAuth } from "../context/AuthContextState";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2, LogOut, Code2, Users, AlertCircle, Play, CheckCircle2 } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import getSocket, { disconnectSocket } from "../lib/socket";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [remoteTyping, setRemoteTyping] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const session = sessionData?.session;
  const problemSlug = session?.problemId || "";
  const { data: problemDataResponse } = useProblem(problemSlug);
  const problem = problemDataResponse?.problem;

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();
  
  const isHost = session?.host?._id === user?.id;
  const isParticipant = session?.participant?._id === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session, loadingSession, isHost, isParticipant
  );

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Auto-join logic
  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) setJoinCode(codeParam.toUpperCase());
  }, [searchParams]);

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    if (session.visibility === "private" && !joinCode && !searchParams.get("code")) return;
    
    joinSessionMutation.mutate({ id, code: searchParams.get("code") || joinCode }, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id, searchParams, joinCode]);

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard", { replace: true });
  }, [session, loadingSession, navigate]);

  // 2. Initialize Socket.IO
  useEffect(() => {
    if (!token || !session || loadingSession || (!isHost && !isParticipant)) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    socket.emit("join-session", { sessionId: id });

    socket.on("code-update", ({ code: newCode, language: newLang, from }) => {
      if (from !== user.id) {
        setCode(newCode);
        if (newLang !== selectedLanguage) setSelectedLanguage(newLang);
      }
    });

    socket.on("language-update", ({ language: newLang, from }) => {
      if (from !== user.id) setSelectedLanguage(newLang);
    });

    socket.on("user-typing", ({ userId }) => {
      if (userId !== user.id) {
        setRemoteTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setRemoteTyping(false), 2000);
      }
    });

    return () => {
      socket.off("code-update");
      socket.off("language-update");
      socket.off("user-typing");
      // Don't disconnect here if they navigate between rooms, just leave room if needed
      // but let's just keep it simple
    };
  }, [id, token, session, loadingSession, isHost, isParticipant, user?.id, selectedLanguage]);

  // 3. Set initial code from session DB or problem starter code
  useEffect(() => {
    if (session && problem) {
      if (session.selectedLanguage) setSelectedLanguage(session.selectedLanguage);
      
      const savedCode = session.sharedCode?.[session.selectedLanguage || selectedLanguage];
      if (savedCode) {
        setCode(savedCode);
      } else if (problem.starterCode?.[session.selectedLanguage || selectedLanguage]) {
        setCode(problem.starterCode[session.selectedLanguage || selectedLanguage]);
      }
    }
  }, [session, problem]);

  // Handlers
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    
    const newCode = session?.sharedCode?.[newLang] || problem?.starterCode?.[newLang] || "";
    setCode(newCode);
    setOutput(null);

    socketRef.current?.emit("language-change", { sessionId: id, language: newLang });
    socketRef.current?.emit("code-change", { sessionId: id, code: newCode, language: newLang });
  };

  const handleCodeChange = (val) => {
    setCode(val);
    socketRef.current?.emit("code-change", { sessionId: id, code: val, language: selectedLanguage });
    socketRef.current?.emit("typing", { sessionId: id });
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

  const handleEndSession = () => {
    if (window.confirm("End this session for all participants?")) {
      endSessionMutation.mutate(id, { onSuccess: () => {
        disconnectSocket();
        navigate("/dashboard");
      }});
    }
  };

  const getDifficultyColor = (diff) => {
    if (!diff) return 'var(--text-muted)';
    const d = diff.toLowerCase();
    if (d === 'easy') return 'var(--accent-green)';
    if (d === 'medium') return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  if (loadingSession || !session) return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PanelGroup direction="horizontal">
          {/* LEFT: PROBLEM & EDITOR */}
          <Panel defaultSize={70} minSize={40}>
            <PanelGroup direction="horizontal">
              
              {/* PROBLEM DETAILS */}
              <Panel defaultSize={40} minSize={20}>
                <div style={{ height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--bg-border)', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Problem Header */}
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg-border)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                          {session.problem}
                          <span style={{ fontSize: 13, padding: '2px 8px', borderRadius: 4, background: `${getDifficultyColor(session.difficulty)}22`, color: getDifficultyColor(session.difficulty) }}>
                            {session.difficulty}
                          </span>
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {session.participant ? '2/2' : '1/2'} participants</span>
                          {session.visibility === 'private' && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={14} /> Private Session</span>}
                        </div>
                      </div>
                      {isHost && (
                        <button className="btn btn-sm btn-danger" onClick={handleEndSession} disabled={endSessionMutation.isPending}>
                          {endSessionMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />} End
                        </button>
                      )}
                    </div>

                    {isHost && session.visibility === 'private' && (
                      <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--accent-indigo)', fontWeight: 600, marginBottom: 2 }}>Invite Participant</div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Code: <strong style={{ letterSpacing: 1, color: 'var(--text-primary)' }}>{session.joinCode}</strong></div>
                        </div>
                        <button className="btn btn-sm btn-ghost" onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/session/${id}?code=${session.joinCode}`);
                          toast.success("Link copied!");
                        }}>Copy Link</button>
                      </div>
                    )}
                  </div>

                  {/* Problem Content */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: 24, paddingBottom: 60 }}>
                    {!problem ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 40 }}>Loading problem...</div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="panel-handle-v" />

              {/* CODE EDITOR & OUTPUT */}
              <Panel defaultSize={60} minSize={30}>
                <PanelGroup direction="vertical">
                  
                  {/* Editor */}
                  <Panel defaultSize={65} minSize={20}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={handleCodeChange}
                      remoteTyping={remoteTyping}
                    />
                  </Panel>

                  <PanelResizeHandle className="panel-handle-h" />

                  {/* Output Panel Container */}
                  <Panel defaultSize={35} minSize={15}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
                      {/* Actions Bar */}
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
                      
                      {/* Output Content */}
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <OutputPanel output={output} />
                      </div>
                    </div>
                  </Panel>

                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="panel-handle-v" />

          {/* RIGHT: VIDEO & CHAT */}
          <Panel defaultSize={30} minSize={20}>
            <div style={{ height: '100%', background: 'var(--bg-secondary)', position: 'relative' }}>
              {isInitializingCall ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p style={{ color: 'var(--text-muted)' }}>Connecting to video...</p>
                </div>
              ) : !streamClient || !call ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertCircle size={32} color="var(--accent-red)" />
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>Video call unavailable</p>
                </div>
              ) : (
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI chatClient={chatClient} channel={channel} />
                  </StreamCall>
                </StreamVideo>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;
