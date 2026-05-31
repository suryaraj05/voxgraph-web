export type DocLink = {
  title: string;
  href: string;
  description?: string;
};

export type DocSection = {
  title: string;
  links: DocLink[];
};

export const docsNav: DocSection[] = [
  {
    title: "Start here",
    links: [
      { title: "Introduction", href: "/docs", description: "What VoxGraph is and who it's for" },
      { title: "Quick start", href: "/docs/quick-start", description: "Running locally in 5 minutes" },
      { title: "Architecture", href: "/docs/architecture", description: "Pipeline and components" },
    ],
  },
  {
    title: "Integrate",
    links: [
      { title: "WebSocket API", href: "/docs/websocket-api", description: "Audio protocol and events" },
      { title: "Configuration", href: "/docs/configuration", description: "Environment variables" },
      { title: "Memory", href: "/docs/memory", description: "Semantic facts and episodic turns" },
      { title: "Live mic client", href: "/docs/live-client", description: "Continuous voice sessions" },
    ],
  },
  {
    title: "Extend",
    links: [
      { title: "LLM providers", href: "/docs/llm-providers", description: "Gemini vs Ollama" },
      { title: "TTS providers", href: "/docs/tts-providers", description: "Deepgram Aura and ElevenLabs" },
      { title: "Customize", href: "/docs/customize", description: "Intents, prompts, and your code" },
    ],
  },
];

export function allDocPages(): DocLink[] {
  return docsNav.flatMap((s) => s.links);
}
