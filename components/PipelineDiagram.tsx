import {
  Mic,
  Zap,
  FileText,
  Brain,
  Volume2,
  Headphones,
} from "lucide-react";
import { FlowCapsule, FlowConnector } from "@/components/FlowCapsule";

const nodes = [
  { icon: Mic, label: "Mic Input", sub: "linear16 PCM" },
  { icon: Zap, label: "WebSocket", sub: "/audio" },
  { icon: FileText, label: "Deepgram", sub: "STT" },
  { icon: Brain, label: "LLM", sub: "Ollama / Gemini", highlight: true },
  { icon: Volume2, label: "Deepgram", sub: "Aura TTS" },
  { icon: Headphones, label: "Audio Out", sub: "24 kHz stream" },
];

export function PipelineDiagram() {
  return (
    <section className="neon-section py-24" style={{ background: "var(--bg-base)" }}>
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-heading text-[clamp(4rem,12vw,9rem)] font-medium leading-none tracking-tight"
        style={{ color: "rgba(59, 130, 246, 0.04)" }}
      >
        Pipeline
      </p>

      <div className="neon-section-glow" aria-hidden />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
        <h2 className="section-title mb-3 text-center text-3xl md:text-4xl">How it works</h2>
        <p className="mx-auto mb-14 max-w-lg text-center text-sm leading-relaxed text-muted">
          Real-time voice loop — from microphone to spoken reply in one WebSocket session.
        </p>

        <div className="overflow-x-auto pb-4">
          <div className="mx-auto flex w-max items-center px-2">
            {nodes.map((node, i) => (
              <div key={node.label + node.sub} className="flex items-center">
                <FlowCapsule {...node} />
                {i < nodes.length - 1 && <FlowConnector />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
