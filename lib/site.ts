export const site = {
  name: "VoxGraph",
  /** Alternate spellings search engines may map to this product */
  alternateNames: [
    "VoxGraph",
    "Voxgraph",
    "voxgraph",
    "VOXGRAPH",
    "Vox Graph",
  ] as const,
  tagline: "Real-time voice AI starter kit for developers",
  description:
    "VoxGraph is an open-source Python voice AI starter kit by Surya Raj: WebSocket audio in, Deepgram STT, LLM (Gemini or Ollama), TTS out — episodic memory, barge-in, browser demo, and Docker deploy.",
  shortDescription:
    "Open-source voice AI starter kit — FastAPI, Deepgram, Gemini/Ollama, WebSocket PCM, MIT license.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://voxgraph-web.vercel.app",
  github: "https://github.com/suryaraj05/voxgraph",
  githubWeb: "https://github.com/suryaraj05/voxgraph-web",
  author: process.env.NEXT_PUBLIC_AUTHOR_NAME ?? "Surya Raj",
  /** Legal / indexed name variants */
  authorFullName: process.env.NEXT_PUBLIC_AUTHOR_FULL_NAME ?? "Surya Raj Salve",
  authorAlternateNames: [
    "Surya Raj",
    "Surya Raj Salve",
    "Salve Surya Raj",
    "Salve Surya",
    "Salve SuryaRaj",
    "SuryaRaj",
    "SuryaRaj Salve",
    "suryaraj05",
  ] as const,
  authorUrl: process.env.NEXT_PUBLIC_AUTHOR_URL ?? "https://github.com/suryaraj05",
  authorLinkedIn:
    process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN ?? "https://www.linkedin.com/in/salve-surya-raj",
  keywords: [
    "VoxGraph",
    "voxgraph",
    "Voxgraph",
    "voice AI starter kit",
    "open source voice AI",
    "Python voice agent",
    "real-time voice assistant",
    "FastAPI WebSocket voice",
    "Deepgram STT TTS",
    "Gemini voice AI",
    "Ollama voice assistant",
    "speech to text text to speech pipeline",
    "conversational AI open source",
    "voice AI developer toolkit",
    "Surya Raj",
    "Surya Raj Salve",
    "Salve Surya Raj",
    "SuryaRaj",
    "projects by Surya Raj",
    "suryaraj05 voxgraph",
    "build voice AI from scratch",
    "WebSocket PCM voice server",
  ],
} as const;

export function absoluteUrl(path: string) {
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
