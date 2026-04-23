import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2, MessageSquare, Users, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={28} className="animate-spin" color="var(--accent-violet)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>JOINING CALL...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', gap: 0, position: 'relative' }} className="str-video">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          background: 'rgba(255,255,255,0.02)', padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={14} color="var(--accent-violet)" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
              {participantCount} {participantCount === 1 ? "PARTICIPANT" : "PARTICIPANTS"}
            </span>
          </div>
          {chatClient && channel && (
            <button onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-sm ${isChatOpen ? "btn-violet" : "btn-ghost"}`}
              style={{ padding: '5px 12px', fontSize: 12 }}>
              <MessageSquare size={13} /> Chat
            </button>
          )}
        </div>

        {/* Video */}
        <div style={{ flex: 1, background: '#080808', overflow: 'hidden', position: 'relative' }}>
          <SpeakerLayout />
        </div>

        {/* Controls */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'center'
        }}>
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* Chat Panel */}
      {chatClient && channel && (
        <div style={{
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: isChatOpen ? 300 : 0, opacity: isChatOpen ? 1 : 0,
        }}>
          {isChatOpen && (
            <>
              <div style={{
                background: 'rgba(255,255,255,0.02)', padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'white', letterSpacing: '0.06em' }}>SESSION CHAT</h3>
                <button onClick={() => setIsChatOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }} className="stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;
