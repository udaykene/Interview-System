import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEndSession, useJoinSession, useLeaveSession, useSessionById } from "../hooks/useSessions";
import { useProblem } from "../hooks/useProblems";
import { useAuth } from "../context/AuthContextState";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2, LogOut, Code2, Users, AlertCircle, Play, CheckCircle2, Copy } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import EndSessionConfirmModal from "../components/EndSessionConfirmModal";
import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import getSocket, { disconnectSocket } from "../lib/socket";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const SESSION_LANGUAGES = ["javascript", "python", "java"];

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
  const [sharedCodeByLanguage, setSharedCodeByLanguage] = useState({
    javascript: "",
    python: "",
    java: "",
  });
  const [remoteTyping, setRemoteTyping] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const session = sessionData?.session;
  const problemSlug = session?.problemId || "";
  const { data: problemDataResponse } = useProblem(problemSlug);
  const problem = problemDataResponse?.problem;

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();
  const leaveSessionMutation = useLeaveSession();
  
  const isHost = session?.host?._id === user?.id;
  const isParticipant = session?.participant?._id === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session, loadingSession, isHost, isParticipant
  );

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedLanguageRef = useRef("javascript");
  const initializedSessionRef = useRef(null);

  const code = sharedCodeByLanguage[selectedLanguage] || "";

  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  // Auto-join logic
  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) setJoinCode(codeParam.toUpperCase());
  }, [searchParams]);

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    if (session.visibility === "private" && !joinCode && !searchParams.get("code")) return;
    joinSessionMutation.mutate({ id, code: searchParams.get("code") || joinCode }, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id, searchParams, joinCode, joinSessionMutation, refetch]);

  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/interview", { replace: true });
  }, [session, loadingSession, navigate]);

  // Socket.IO
  useEffect(() => {
    if (!token || !session || loadingSession || (!isHost && !isParticipant)) return;
    const socket = getSocket(token);
    socketRef.current = socket;
    socket.emit("join-session", { sessionId: id });
    socket.on("code-update", ({ code: newCode, language: newLang, from }) => {
      if (from !== user.id) {
        setSharedCodeByLanguage((prev) => ({ ...prev, [newLang]: newCode || "" }));
        if (newLang !== selectedLanguageRef.current) setSelectedLanguage(newLang);
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
    socket.on("session-ended", () => {
      toast.success("The session has been ended.");
      navigate("/interview", { replace: true });
    });
    socket.on("participant-left-notify", () => {
      toast.error("The participant has left the session. They can rejoin later.");
      refetch();
    });
    return () => {
      socket.off("code-update");
      socket.off("language-update");
      socket.off("user-typing");
      socket.off("session-ended");
      socket.off("participant-left-notify");
    };
  }, [id, token, session, loadingSession, isHost, isParticipant, user?.id, navigate, refetch]);

  useEffect(() => {
    if (!session) return;

    const isNewSession = initializedSessionRef.current !== session._id;

    setSharedCodeByLanguage((prev) => {
      const next = isNewSession
        ? { javascript: "", python: "", java: "" }
        : { ...prev };

      for (const language of SESSION_LANGUAGES) {
        const persistedCode = session.sharedCode?.[language] || "";
        const starterCode = problem?.starterCode?.[language] || "";
        const currentCode = next[language] || "";

        if (isNewSession || !currentCode) {
          next[language] = persistedCode || starterCode;
        }
      }

      return next;
    });

    if (isNewSession && session.selectedLanguage) {
      setSelectedLanguage(session.selectedLanguage);
    }

    initializedSessionRef.current = session._id;
  }, [session, problem]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setSharedCodeByLanguage((prev) => {
      if (prev[newLang]) return prev;
      return {
        ...prev,
        [newLang]: session?.sharedCode?.[newLang] || problem?.starterCode?.[newLang] || "",
      };
    });
    const newCode = sharedCodeByLanguage[newLang] || session?.sharedCode?.[newLang] || problem?.starterCode?.[newLang] || "";
    setOutput(null);
    socketRef.current?.emit("language-change", { sessionId: id, language: newLang });
    socketRef.current?.emit("code-change", { sessionId: id, code: newCode, language: newLang });
  };

  const handleCodeChange = (val) => {
    const nextCode = val || "";
    setSharedCodeByLanguage((prev) => ({ ...prev, [selectedLanguageRef.current]: nextCode }));
    socketRef.current?.emit("code-change", { sessionId: id, code: nextCode, language: selectedLanguageRef.current });
    socketRef.current?.emit("typing", { sessionId: id });
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true); setOutput(null);
    try { const res = await axiosInstance.post('/execute/run', { language: selectedLanguage, code }); setOutput({ type: 'run', data: res.data }); }
    catch (err) { setOutput({ type: 'run', data: { error: err.response?.data?.message || err.response?.data?.error || err.message } }); }
    finally { setIsRunning(false); }
  };

  const handleSubmitCode = async () => {
    if (!code.trim() || !problem) return;
    setIsSubmitting(true); setOutput(null);
    try {
      const res = await axiosInstance.post('/execute/submit', { problemId: problem._id, language: selectedLanguage, code });
      setOutput({ type: 'submit', data: res.data });
      if (res.data.status === 'Accepted') toast.success("All test cases passed!");
      else toast.error(`Submission failed: ${res.data.status}`);
    } catch (err) {
      setOutput({ type: 'submit', data: { status: 'Error', error: err.response?.data?.message || err.response?.data?.error || err.message } });
      toast.error("Execution failed");
    } finally { setIsSubmitting(false); }
  };

  const [confirmEndOpen, setConfirmEndOpen] = useState(false);

  const handleEndSession = () => {
    setConfirmEndOpen(true);
  };

  const confirmEndSession = () => {
    socketRef.current?.emit("session-ended", { sessionId: id });
    endSessionMutation.mutate(id, {
      onSuccess: () => {
        disconnectSocket();
        navigate("/interview");
      },
    });
    setConfirmEndOpen(false);
  };

  const cancelEndSession = () => {
    setConfirmEndOpen(false);
  };

  const handleLeaveSession = () => {
    if (!isParticipant) {
      disconnectSocket();
      navigate("/interview");
      return;
    }

    leaveSessionMutation.mutate(id, {
      onSuccess: () => {
        socketRef.current?.emit("participant-left", { sessionId: id });
        disconnectSocket();
        navigate("/interview");
      },
    });
  };

  const getDifficultyColor = (diff) => {
    if (!diff) return 'var(--text-muted)';
    const d = diff.toLowerCase();
    if (d === 'easy') return 'var(--accent-green)';
    if (d === 'medium') return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  if (loadingSession || !session) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" />
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050505' }}>
      <Navbar />

      <EndSessionConfirmModal
        isOpen={confirmEndOpen}
        onCancel={cancelEndSession}
        onConfirm={confirmEndSession}
        isConfirming={endSessionMutation.isPending}
      />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PanelGroup direction="horizontal">
          {/* LEFT: PROBLEM & EDITOR */}
          <Panel defaultSize={70} minSize={40}>
            <PanelGroup direction="horizontal">
              {/* PROBLEM DETAILS */}
              <Panel defaultSize={40} minSize={20}>
                <div style={{ height: '100%', background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.02em' }}>
                          {session.problem}
                          <span className="badge" style={{ background: `${getDifficultyColor(session.difficulty)}12`, color: getDifficultyColor(session.difficulty), border: `1px solid ${getDifficultyColor(session.difficulty)}25` }}>
                            {session.difficulty?.toUpperCase()}
                          </span>
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={12} /> {session.participant ? '2/2' : '1/2'}</span>
                          {session.visibility === 'private' && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><AlertCircle size={12} /> PRIVATE</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {isParticipant && (
                          <button className="btn btn-sm btn-secondary" onClick={handleLeaveSession} disabled={leaveSessionMutation.isPending}>
                            <LogOut size={13} /> Leave
                          </button>
                        )}
                        {(isHost || isParticipant) && (
                          <button className="btn btn-sm btn-danger" onClick={handleEndSession} disabled={endSessionMutation.isPending}>
                            {endSessionMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />} End
                          </button>
                        )}
                      </div>
                    </div>

                    {isHost && session.visibility === 'private' && (
                      <div style={{
                        background: 'rgba(124,91,240,0.06)', border: '1px solid rgba(124,91,240,0.15)',
                        padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--accent-violet-light)', fontWeight: 600, marginBottom: 3, letterSpacing: '0.06em' }}>INVITE CODE</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: 'white', letterSpacing: 2 }}>{session.joinCode}</div>
                        </div>
                        <button className="btn btn-sm btn-ghost" onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/session/${id}?code=${session.joinCode}`);
                          toast.success("Link copied!");
                        }}><Copy size={13} /> Copy</button>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: 24, paddingBottom: 60 }}>
                    {!problem ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 40 }}>Loading problem...</div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="panel-handle-v" />

              {/* CODE EDITOR & OUTPUT */}
              <Panel defaultSize={60} minSize={30}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={65} minSize={20}>
                    <CodeEditorPanel selectedLanguage={selectedLanguage} code={code}
                      onLanguageChange={handleLanguageChange} onCodeChange={handleCodeChange} remoteTyping={remoteTyping} />
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
                      <div style={{ flex: 1, overflow: 'hidden' }}><OutputPanel output={output} /></div>
                    </div>
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="panel-handle-v" />

          {/* RIGHT: VIDEO & CHAT */}
          <Panel defaultSize={30} minSize={20}>
            <div style={{ height: '100%', background: '#0a0a0a', position: 'relative' }}>
              {isInitializingCall ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                  <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" />
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>CONNECTING VIDEO...</p>
                </div>
              ) : !streamClient || !call ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertCircle size={24} color="var(--accent-red)" />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Video call unavailable</p>
                </div>
              ) : (
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI chatClient={chatClient} channel={channel} onLeave={handleLeaveSession} />
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
