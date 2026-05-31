export const site = {
  name: "VoxGraph",
  tagline: "Real-time voice AI starter kit for developers",
  description:
    "Open-source Python starter kit: WebSocket audio in, Deepgram STT, LLM (Gemini or Ollama), TTS out — with episodic memory and a live mic client. Fork it, plug in your keys, ship your voice agent.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://voxgraph.vercel.app",
  github: "https://github.com/suryaraj05/voxgraph",
  keywords: [
    "voice AI",
    "speech to text",
    "text to speech",
    "FastAPI WebSocket",
    "Deepgram",
    "Ollama",
    "Gemini",
    "voice assistant starter kit",
    "real-time audio",
    "conversational AI",
    "Python voice agent",
  ],
  author: "VoxGraph",
} as const;

export function absoluteUrl(path: string) {
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
