export function TerminalBlock() {
  return (
    <div
      className="neon-card mt-12 w-full max-w-2xl overflow-hidden rounded-xl"
      style={{ boxShadow: "0 0 32px rgba(59, 130, 246, 0.12)" }}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "rgba(59, 130, 246, 0.15)", background: "rgba(255,255,255,0.02)" }}
      >
        <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
        <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
        <span className="h-3 w-3 rounded-full bg-[#10b981]" />
        <span className="ml-2 font-mono text-[11px] text-muted">terminal</span>
      </div>
      <div
        className="space-y-1 p-6 font-mono text-sm leading-relaxed sm:p-7"
        style={{ background: "var(--bg-terminal)" }}
      >
        <p style={{ color: "var(--text-muted)" }}># Terminal 1 — server</p>
        <p style={{ color: "var(--accent-bright)" }}>
          python -u -m uvicorn voxgraph:app --host 0.0.0.0 --port 8001
        </p>
        <p className="pt-3" style={{ color: "var(--text-muted)" }}>
          # Terminal 2 — live mic
        </p>
        <p style={{ color: "var(--accent-bright)" }}>
          python scripts/live_mic_client.py --demo --url ws://127.0.0.1:8001/audio
        </p>
      </div>
    </div>
  );
}
