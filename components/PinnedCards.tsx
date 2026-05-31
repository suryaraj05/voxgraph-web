const cards = [
  {
    num: "01",
    title: "Real-time audio",
    body: "WebSocket /audio accepts linear16 PCM at 16 kHz. TTS streams back at 24 kHz.",
    pin: { head: "#f59e0b", shaft: "#d97706", glow: "rgba(245, 158, 11, 0.4)" },
    rotate: "-2deg",
    align: "self-start" as const,
  },
  {
    num: "02",
    title: "Pluggable LLM",
    body: "Google Gemini in the cloud or Ollama locally — swap via one env var.",
    pin: { head: "#3b82f6", shaft: "#2563eb", glow: "rgba(59, 130, 246, 0.5)" },
    rotate: "1.5deg",
    align: "self-end" as const,
  },
  {
    num: "03",
    title: "Built-in memory",
    body: "Semantic facts plus rolling episodic turns injected into every chat.",
    pin: { head: "#8b5cf6", shaft: "#7c3aed", glow: "rgba(139, 92, 246, 0.4)" },
    rotate: "-1deg",
    align: "self-start" as const,
  },
  {
    num: "04",
    title: "Starter kit",
    body: "Not a black box — fork, add intents, tools, and your own client UI.",
    pin: { head: "#10b981", shaft: "#059669", glow: "rgba(16, 185, 129, 0.4)" },
    rotate: "2deg",
    align: "self-end" as const,
  },
  {
    num: "05",
    title: "Demo mode",
    body: "Low-latency debounce and endpointing tuned for live conversation.",
    pin: { head: "#f43f5e", shaft: "#e11d48", glow: "rgba(244, 63, 94, 0.35)" },
    rotate: "-1.5deg",
    align: "self-start" as const,
  },
];

function PushPin({ head, shaft, glow }: { head: string; shaft: string; glow: string }) {
  return (
    <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[18px]" aria-hidden>
      <div
        className="absolute left-1/2 top-2 h-6 w-6 -translate-x-1/2 rounded-full blur-md"
        style={{ background: glow }}
      />
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none" className="relative">
        <ellipse cx="14" cy="12" rx="11" ry="10" fill={head} />
        <ellipse cx="10" cy="9" rx="3" ry="2.5" fill="white" opacity="0.45" />
        <rect x="12.5" y="20" width="3" height="14" rx="1.5" fill={shaft} />
      </svg>
    </div>
  );
}

function PinnedCard({
  card,
  className = "",
}: {
  card: (typeof cards)[0];
  className?: string;
}) {
  return (
    <article
      className={`neon-card relative w-full max-w-[340px] rounded-2xl px-7 pb-7 pt-10 ${className}`}
      style={{ transform: `rotate(${card.rotate})` }}
    >
      <PushPin head={card.pin.head} shaft={card.pin.shaft} glow={card.pin.glow} />
      <span className="font-mono text-xs text-muted">{card.num}</span>
      <h3 className="section-title mt-2 text-lg">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
    </article>
  );
}

export function PinnedCards() {
  return (
    <section className="neon-section py-24" style={{ background: "var(--bg-surface)" }}>
      <div className="neon-section-glow" aria-hidden />

      <div className="relative mx-auto max-w-[900px] px-4 sm:px-6">
        <h2 className="section-title mb-3 text-3xl md:text-4xl">Why developers use VoxGraph</h2>
        <p className="mb-16 max-w-lg text-sm leading-relaxed text-muted">
          A hackable foundation — pin your own features on top and ship fast.
        </p>

        <div className="relative hidden md:block">
          <svg
            className="pointer-events-none absolute left-1/2 top-0 h-full w-[520px] -translate-x-1/2"
            viewBox="0 0 520 900"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <filter id="pin-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 130 40 Q 260 80 390 180 Q 260 280 130 380 Q 260 480 390 580 Q 260 680 130 780"
              fill="none"
              stroke="var(--accent-bright)"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              opacity="0.45"
              filter="url(#pin-glow)"
            />
          </svg>

          <div className="relative flex flex-col gap-16">
            {cards.map((card) => (
              <PinnedCard key={card.num} card={card} className={card.align} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 md:hidden">
          {cards.map((card) => (
            <PinnedCard
              key={card.num}
              card={{
                ...card,
                rotate: `${parseFloat(card.rotate) * 0.6}deg`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
