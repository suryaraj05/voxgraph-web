"use client";

import { useEffect, useRef } from "react";

const HEIGHT = 160;
const STEP = 1.5;
const LAYERS = 10;

/** Bell-curve envelope: 0 at edges, 1 at center — matches reference taper. */
function envelope(t: number): number {
  return Math.sin(Math.PI * t) ** 1.15;
}

const GRADIENT_STOPS: [number, string][] = [
  [0.0, "#2563eb"],
  [0.15, "#0ea5e9"],
  [0.28, "#22d3ee"],
  [0.38, "#4ade80"],
  [0.46, "#fde047"],
  [0.5, "#ffffff"],
  [0.54, "#fb923c"],
  [0.62, "#f87171"],
  [0.72, "#a78bfa"],
  [0.85, "#38bdf8"],
  [1.0, "#2563eb"],
];

function layerOpacity(i: number, mix: number): number {
  const dist = Math.abs(i - (LAYERS - 1) / 2) / ((LAYERS - 1) / 2);
  const base = 0.25 + (1 - dist) * 0.75;
  return 0.15 + (base - 0.15) * mix;
}

type VoiceWaveformProps = {
  isSpeaking: boolean;
  className?: string;
};

export function VoiceWaveform({ isSpeaking, className }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const ampRef = useRef(3);
  const mixRef = useRef(0);
  const widthRef = useRef(300);
  const isSpeakingRef = useRef(isSpeaking);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = Math.max(1, Math.floor(container.clientWidth));
      widthRef.current = w;
      canvas.width = w;
      canvas.height = HEIGHT;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const makeGradient = (w: number) => {
      const g = ctx.createLinearGradient(0, 0, w, 0);
      for (const [stop, color] of GRADIENT_STOPS) {
        g.addColorStop(stop, color);
      }
      return g;
    };

    const sampleY = (
      x: number,
      w: number,
      centerY: number,
      amplitude: number,
      layerIndex: number,
      time: number,
      mirror: boolean,
    ): number => {
      const t = x / w;
      const env = envelope(t);
      const phase = layerIndex * 0.11 - (LAYERS - 1) * 0.055;
      const freq = 1.85 + layerIndex * 0.04;
      const strandOffset = (layerIndex - (LAYERS - 1) / 2) * 1.2;

      const wave =
        Math.sin((t - 0.5) * Math.PI * 2 * freq - time * 1.35 + phase) * env * amplitude +
        strandOffset * env;

      if (mirror) return centerY - wave * 0.32;
      return centerY + wave;
    };

    const drawRibbon = (
      w: number,
      centerY: number,
      amplitude: number,
      mix: number,
      time: number,
      mirror: boolean,
      alphaScale: number,
    ) => {
      const gradient = makeGradient(w);

      for (let i = 0; i < LAYERS; i++) {
        const opacity = layerOpacity(i, mix) * alphaScale;

        ctx.beginPath();
        for (let x = 0; x <= w; x += STEP) {
          const y = sampleY(x, w, centerY, amplitude, i, time, mirror);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = mirror ? 0.7 : 1.1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    };

    const drawGlow = (w: number, centerY: number, amplitude: number, mix: number, time: number) => {
      const gradient = makeGradient(w);
      const glowWidths = [5, 9, 14];
      const glowAlphas = [0.12, 0.07, 0.04];

      for (let g = 0; g < glowWidths.length; g++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += STEP * 2) {
          const y = sampleY(x, w, centerY, amplitude, 4, time, false);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = glowAlphas[g] * mix;
        ctx.lineWidth = glowWidths[g];
        ctx.lineCap = "round";
        ctx.stroke();
      }
    };

    const tick = () => {
      const speaking = isSpeakingRef.current;
      mixRef.current += ((speaking ? 1 : 0) - mixRef.current) * 0.06;

      const mix = mixRef.current;
      timeRef.current += 0.008 + 0.032 * mix;

      const peak = 52 + Math.sin(timeRef.current * 0.45) * 14;
      const targetAmp = 2 + (peak - 2) * mix;
      ampRef.current += (targetAmp - ampRef.current) * 0.07;

      const w = widthRef.current;
      const centerY = HEIGHT * 0.48;
      const amplitude = ampRef.current;
      const time = timeRef.current;

      ctx.clearRect(0, 0, w, HEIGHT);

      if (mix > 0.02) {
        drawRibbon(w, centerY, amplitude, mix, time, true, 0.18);
        drawGlow(w, centerY, amplitude, mix, time);
        drawRibbon(w, centerY, amplitude, mix, time, false, 1);
        drawGlow(w, centerY, amplitude, mix * 0.85, time);
      } else {
        ctx.beginPath();
        for (let x = 0; x <= w; x += STEP) {
          const t = x / w;
          const y = centerY + Math.sin(t * Math.PI * 3 + time * 0.5) * envelope(t) * 1.5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = makeGradient(w);
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        background: "transparent",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: `${HEIGHT}px` }}
      />
    </div>
  );
}
