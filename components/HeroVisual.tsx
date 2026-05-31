import { Mic } from "lucide-react";

const bars = [0.35, 0.6, 0.85, 0.5, 0.95, 0.7, 0.4, 0.75, 0.55, 0.9, 0.45, 0.65];

export function HeroVisual() {
  return (
    <div
      className="neon-card relative w-full max-w-md overflow-hidden rounded-2xl p-6"
      style={{ boxShadow: "0 0 48px rgba(59, 130, 246, 0.18), 0 0 80px rgba(59, 130, 246, 0.06)" }}
    >
      <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <span className="font-semibold text-primary">Hey VoxGraph</span> — what can you
        help me build today?
      </p>

      <div className="mb-6 flex h-16 items-center justify-center gap-[3px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="wave-bar w-[3px] rounded-full"
            style={{
              height: `${h * 100}%`,
              background: "linear-gradient(to top, var(--accent), var(--accent-bright))",
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: "#fff",
            boxShadow: "0 0 32px rgba(59, 130, 246, 0.35)",
          }}
        >
          <Mic className="h-6 w-6" style={{ color: "#050d1a" }} />
        </div>
      </div>
    </div>
  );
}
