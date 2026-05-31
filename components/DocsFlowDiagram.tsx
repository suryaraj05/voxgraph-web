import {
  Mic,
  Zap,
  FileText,
  Layers,
  Database,
  Brain,
  Volume2,
  Radio,
  type LucideIcon,
} from "lucide-react";
import { FlowCapsule, FlowConnector, FlowConnectorDown } from "@/components/FlowCapsule";

type Step = {
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
};

const row1: Step[] = [
  { icon: Mic, label: "Client" },
  { icon: Zap, label: "WebSocket" },
  { icon: FileText, label: "STT" },
  { icon: Layers, label: "Utterance" },
];

const row2: Step[] = [
  { icon: Database, label: "Memory" },
  { icon: Brain, label: "LLM", highlight: true },
  { icon: Volume2, label: "TTS" },
];

const outputs: Step[] = [
  { icon: Radio, label: "JSON events" },
  { icon: Volume2, label: "PCM 24 kHz" },
];

function FlowRow({ steps, compact = true }: { steps: Step[]; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <FlowCapsule {...step} compact={compact} />
          {i < steps.length - 1 && <FlowConnector width={10} />}
        </div>
      ))}
    </div>
  );
}

export function DocsFlowDiagram() {
  return (
    <div
      className="neon-card relative my-6 w-full overflow-hidden rounded-xl px-2 py-4 sm:px-3"
      style={{ boxShadow: "0 0 28px rgba(59, 130, 246, 0.1)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative flex w-full flex-col items-center gap-1">
        <FlowRow steps={row1} />

        <FlowConnectorDown />

        <FlowRow steps={row2} />

        <svg width="80" height="22" viewBox="0 0 80 22" aria-hidden className="mt-0.5">
          <path
            d="M 40 0 L 40 8 C 40 13 18 13 18 20"
            fill="none"
            stroke="var(--accent-bright)"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
          <path
            d="M 40 0 L 40 8 C 40 13 62 13 62 20"
            fill="none"
            stroke="var(--accent-bright)"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
          <polygon points="14,18 18,22 22,18" fill="var(--accent-bright)" opacity="0.85" />
          <polygon points="58,18 62,22 66,18" fill="var(--accent-bright)" opacity="0.85" />
        </svg>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {outputs.map((out) => (
            <FlowCapsule key={out.label} {...out} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
