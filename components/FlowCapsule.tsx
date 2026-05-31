import type { LucideIcon } from "lucide-react";

export type FlowCapsuleProps = {
  icon: LucideIcon;
  label: string;
  sub?: string;
  highlight?: boolean;
  compact?: boolean;
};

export function FlowCapsule({ icon: Icon, label, sub, highlight, compact }: FlowCapsuleProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-full ${compact ? "gap-1.5 px-2 py-0.5" : "gap-2 px-2.5 py-1"}`}
      style={
        highlight
          ? {
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              border: "1px solid rgba(0, 212, 255, 0.45)",
              boxShadow: "0 0 18px rgba(59, 130, 246, 0.45), 0 0 36px rgba(59, 130, 246, 0.12)",
            }
          : {
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 0 10px rgba(59, 130, 246, 0.1)",
              backdropFilter: "blur(10px)",
            }
      }
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${compact ? "h-6 w-6" : "h-7 w-7"}`}
        style={
          highlight
            ? { background: "rgba(255,255,255,0.18)" }
            : { background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.35)" }
        }
      >
        <Icon
          className={compact ? "h-3 w-3" : "h-3.5 w-3.5"}
          style={{ color: highlight ? "#fff" : "var(--accent-bright)" }}
        />
      </span>
      <div className="min-w-0 pr-0.5">
        <p
          className={`whitespace-nowrap font-medium leading-none ${compact ? "text-[10px]" : "text-[11px]"}`}
          style={{ color: highlight ? "#fff" : "var(--text-primary)" }}
        >
          {label}
        </p>
        {sub && (
          <p
            className="mt-0.5 whitespace-nowrap text-[9px] leading-none"
            style={{ color: highlight ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export function FlowConnector({ width = 24 }: { width?: number }) {
  return (
    <svg width={width} height={14} viewBox="0 0 40 24" className="mx-0 shrink-0" aria-hidden>
      <defs>
        <filter id="flow-connector-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1="0"
        y1="12"
        x2="28"
        y2="12"
        stroke="var(--accent-bright)"
        strokeWidth="1.5"
        filter="url(#flow-connector-glow)"
        className="pipeline-arrow"
      />
      <polygon points="28,8 36,12 28,16" fill="var(--accent-bright)" opacity="0.85" />
    </svg>
  );
}

export function FlowConnectorDown() {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" className="shrink-0" aria-hidden>
      <line
        x1="7"
        y1="0"
        x2="7"
        y2="14"
        stroke="var(--accent-bright)"
        strokeWidth="1.5"
        strokeOpacity="0.75"
      />
      <polygon points="3,14 11,14 7,19" fill="var(--accent-bright)" opacity="0.85" />
    </svg>
  );
}
