"use client";

type VoiceState = "idle" | "listening" | "thinking" | "speaking";

export function VoiceOrb({ state }: { state: VoiceState }) {
  const label =
    state === "listening"
      ? "I'm listening"
      : state === "thinking"
        ? "Thinking…"
        : state === "speaking"
          ? "Speaking…"
          : "Tap mic to start";

  return (
    <div className="voice-orb-wrap">
      <div className={`voice-orb ${state !== "idle" ? "voice-orb-active" : ""}`} aria-hidden>
        <div className="voice-orb-ring voice-orb-ring-1" />
        <div className="voice-orb-ring voice-orb-ring-2" />
        <div className="voice-orb-ring voice-orb-ring-3" />
        <div className="voice-orb-core" />
      </div>
      <p className="voice-orb-label">{label}</p>
    </div>
  );
}
