"use client";



import Link from "next/link";

import { ArrowLeft, Mic, MicOff, Settings2, Sparkles, X } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { MicStreamer } from "@/lib/voxgraph-audio";

import { VoxGraphSession } from "@/lib/voxgraph-ws";

import { VoiceWaveform } from "@/components/voice/VoiceWaveform";



type ChatMessage = {

  id: string;

  role: "user" | "assistant" | "system";

  content: string;

  streaming?: boolean;

};



type SessionPhase = "idle" | "connecting" | "live" | "error";



const DEFAULT_WS =

  process.env.NEXT_PUBLIC_VOXGRAPH_WS_URL ?? "ws://127.0.0.1:8001/audio";



function uid() {

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

}



export function VoiceChatApp({
  initialWsUrl,
  mode = "local",
  onBackToSetup,
}: {
  initialWsUrl?: string;
  mode?: "local" | "online";
  onBackToSetup?: () => void;
} = {}) {

  const sessionRef = useRef<VoxGraphSession | null>(null);

  const micRef = useRef<MicStreamer | null>(null);

  const phaseRef = useRef<SessionPhase>("idle");

  const thinkingRef = useRef(false);

  const streamingIdRef = useRef<string | null>(null);



  const [phase, setPhase] = useState<SessionPhase>("idle");

  const [messages, setMessages] = useState<ChatMessage[]>([

    {

      id: "welcome",

      role: "system",

      content: "Connect your mic and talk to VoxGraph. Make sure the Python server is running on port 8001.",

    },

  ]);

  const [status, setStatus] = useState("Ready");

  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");

  const [wsUrl, setWsUrl] = useState(initialWsUrl ?? DEFAULT_WS);

  const [showSettings, setShowSettings] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [aiSpeaking, setAiSpeaking] = useState(false);



  const live = phase === "live";



  useEffect(() => {

    phaseRef.current = phase;

  }, [phase]);



  const scrollRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });

  }, [messages, status]);



  const pushMessage = useCallback((msg: Omit<ChatMessage, "id"> & { id?: string }) => {
    setMessages((prev) => [...prev, { ...msg, id: msg.id ?? uid() }]);
  }, []);

  const commitUserTranscript = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinkingRef.current) return;
      thinkingRef.current = true;
      pushMessage({ role: "user", content: trimmed });
    },
    [pushMessage],
  );



  const appendToStreaming = useCallback((delta: string) => {

    const streamId = streamingIdRef.current;

    if (!streamId) return;

    setMessages((prev) =>

      prev.map((m) => (m.id === streamId ? { ...m, content: m.content + delta } : m)),

    );

  }, []);



  const startStreamingReply = useCallback(() => {

    const id = uid();

    streamingIdRef.current = id;

    pushMessage({ id, role: "assistant", content: "", streaming: true });

  }, [pushMessage]);



  const finishStreamingReply = useCallback(() => {

    const streamId = streamingIdRef.current;

    if (!streamId) return;

    setMessages((prev) =>

      prev.map((m) => (m.id === streamId ? { ...m, streaming: false } : m)),

    );

  }, []);



  const finalizeReplyText = useCallback((text: string) => {

    const streamId = streamingIdRef.current;

    if (streamId) {

      setMessages((prev) =>

        prev.map((m) =>

          m.id === streamId ? { ...m, content: text, streaming: false } : m,

        ),

      );

      streamingIdRef.current = null;

      return;

    }

    setMessages((prev) => {

      for (let i = prev.length - 1; i >= 0; i--) {

        if (prev[i].role === "assistant") {

          if (prev[i].content === text) return prev;

          return prev.map((m, idx) => (idx === i ? { ...m, content: text } : m));

        }

      }

      return [...prev, { id: uid(), role: "assistant", content: text }];

    });

  }, []);



  const stopSession = useCallback(() => {

    micRef.current?.stop();

    micRef.current = null;

    sessionRef.current?.disconnect();

    sessionRef.current = null;

    streamingIdRef.current = null;

    setPhase("idle");

    setVoiceState("idle");

    setAiSpeaking(false);

    setStatus("Disconnected");

  }, []);



  const startSession = useCallback(async () => {

    setError(null);

    setPhase("connecting");

    setStatus("Connecting…");



    const session = new VoxGraphSession();

    sessionRef.current = session;



    session.player.onSpeakingChange = (speaking) => {

      setAiSpeaking(speaking);

      setVoiceState(speaking ? "speaking" : "listening");

      micRef.current?.setMuted(speaking);

      if (!speaking) {

        void micRef.current?.resume();

        micRef.current?.setMuted(false);

      }

    };



    session.connect(wsUrl, {

      onOpen: async () => {

        try {

          await session.player.warmup();

          const mic = new MicStreamer();

          micRef.current = mic;

          await mic.start((pcm) => session.sendPcm(pcm));

          setPhase("live");

          setVoiceState("listening");

          setStatus("Ready — speak anytime");

          pushMessage({ role: "system", content: "Connected. Speak naturally — I'll reply when you pause." });

        } catch (err) {

          const msg = err instanceof Error ? err.message : "Microphone access denied";

          setError(msg);

          setPhase("error");

          session.disconnect();

        }

      },

      onClose: () => {

        if (phaseRef.current !== "idle") stopSession();

      },

      onError: (msg) => {

        setError(msg);

        setPhase("error");

      },

      onEvent: (event) => {
        if (event.type === "user_transcript") {
          commitUserTranscript(event.message);
          setVoiceState("thinking");
        } else if (event.type === "status") {
          setStatus(event.message);

          if (event.message.includes("Thinking")) {
            setVoiceState("thinking");
          } else if (event.message.includes("Speaking")) {
            setVoiceState("speaking");
          } else if (event.message.includes("Ready")) {
            thinkingRef.current = false;
            finishStreamingReply();

            if (!sessionRef.current?.player.speaking) {
              setVoiceState("listening");
              micRef.current?.setMuted(false);
              void micRef.current?.resume();
            }
          }
        } else if (event.type === "reply_start") {

          startStreamingReply();

          setVoiceState("thinking");

        } else if (event.type === "reply_delta") {

          if (!streamingIdRef.current) startStreamingReply();

          appendToStreaming(event.message);

        } else if (event.type === "reply_done") {

          finishStreamingReply();

        } else if (event.type === "reply_text") {

          finalizeReplyText(event.message);

        } else if (event.type === "error") {

          setError(event.message);

          pushMessage({ role: "system", content: event.message });

        }

      },

    });

  }, [

    wsUrl,

    pushMessage,

    stopSession,

    commitUserTranscript,

    appendToStreaming,

    startStreamingReply,

    finishStreamingReply,

    finalizeReplyText,

  ]);



  const toggleSession = () => {

    if (live || phase === "connecting") stopSession();

    else void startSession();

  };



  const isSpeaking = live && (aiSpeaking || voiceState === "speaking");



  useEffect(() => () => stopSession(), [stopSession]);



  return (
    <div className="voice-chat-shell">
      <div className="voice-chat-sticky-top">
        <header className="voice-chat-header">

        <Link href="/" className="voice-chat-back" aria-label="Back home">

          <ArrowLeft className="h-5 w-5" />

        </Link>

        <div className="voice-chat-title">

          <Sparkles className="h-4 w-4 text-accent-bright" />

          <div>

            <p className="text-sm font-semibold text-primary">VoxGraph</p>

            <p className="text-[11px] text-muted">Voice demo</p>

          </div>

        </div>

        <button

          type="button"

          className="voice-chat-icon-btn"

          onClick={() => setShowSettings((v) => !v)}

          aria-label="Settings"

        >

          <Settings2 className="h-4 w-4" />

        </button>

      </header>



      {showSettings && (

        <div className="voice-chat-settings">

          <label className="text-xs text-muted" htmlFor="ws-url">

            WebSocket URL

          </label>

          <input

            id="ws-url"

            className="voice-chat-input"

            value={wsUrl}

            onChange={(e) => setWsUrl(e.target.value)}

            disabled={live}

            spellCheck={false}

          />

          {onBackToSetup && (
            <button
              type="button"
              className="voice-chat-setup-link"
              onClick={() => {
                stopSession();
                onBackToSetup();
              }}
            >
              {mode === "online" ? "Change API keys & server" : "Switch local / online"}
            </button>
          )}

        </div>

      )}



      {live && <VoiceWaveform isSpeaking={isSpeaking} className="voice-waveform-slot" />}
      </div>

      <div className="voice-chat-messages" ref={scrollRef}>

        {messages.map((msg) => (

          <div

            key={msg.id}

            className={[
              "voice-chat-bubble",
              msg.role === "user"
                ? "voice-chat-bubble-user"
                : msg.role === "assistant"
                  ? "voice-chat-bubble-assistant"
                  : "voice-chat-bubble-system",
              msg.streaming ? "voice-chat-bubble-streaming" : "",
            ]
              .filter(Boolean)
              .join(" ")}

          >

            {msg.role === "assistant" && (

              <span className="voice-chat-avatar voice-chat-avatar-ai">

                <Sparkles className="h-3.5 w-3.5" />

              </span>

            )}

            <div className="voice-chat-bubble-body">

              <p>{msg.content || (msg.streaming ? "…" : "")}</p>

            </div>

          </div>

        ))}

      </div>

      <div className="voice-chat-bottom">
      <div className="voice-chat-status">

        <span className="voice-chat-status-dot" data-live={live} />

        {status}

      </div>



      {error && <p className="voice-chat-error">{error}</p>}



      <footer className="voice-chat-footer">

        <button

          type="button"

          className="voice-chat-icon-btn"

          onClick={stopSession}

          disabled={!live && phase !== "connecting"}

          aria-label="End session"

        >

          <X className="h-4 w-4" />

        </button>



        <button

          type="button"

          className={`voice-chat-mic ${live ? "voice-chat-mic-live" : ""}`}

          onClick={toggleSession}

          disabled={phase === "connecting"}

          aria-label={live ? "Stop voice session" : "Start voice session"}

        >

          <span className="voice-chat-mic-rings" aria-hidden />

          {live ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}

        </button>



        <div className="w-9" />

      </footer>
      </div>

    </div>

  );

}

