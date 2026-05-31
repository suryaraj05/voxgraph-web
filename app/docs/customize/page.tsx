import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customize",
  description:
    "Extend VoxGraph: voice intents, tools, custom clients, deployment patterns for voice AI apps.",
};

export default function CustomizePage() {
  return (
    <>
      <h1>Customize & extend</h1>
      <p>
        VoxGraph is intentionally small. Most products built on it add code in these places:
      </p>

      <h2>1. Voice intents</h2>
      <p>
        <code>voice_intents.py</code> — return a fixed string from <code>try_direct_voice_reply()</code>{" "}
        to handle common phrases without LLM latency (names, greetings, support FAQs).
      </p>

      <h2>2. System prompt & personality</h2>
      <p>
        <code>llm_providers.py</code> — change <code>build_system_prompt()</code> for your brand,
        domain (cooking, support, coaching), and reply style.
      </p>

      <h2>3. Tools & actions</h2>
      <p>
        Hook into <code>_response_pipeline()</code> in <code>voxgraph.py</code> before or after the
        LLM call: calendar APIs, RAG, database lookups, home automation. LangGraph scaffolding is
        already imported for future graph-based flows.
      </p>

      <h2>4. Your client</h2>
      <ul>
        <li>Next.js / React — browser WebSocket + Web Audio API for playback</li>
        <li>Mobile — native audio capture at 16 kHz, stream to <code>/audio</code></li>
        <li>Telephony — bridge PSTN audio to the same WebSocket format</li>
      </ul>

      <h2>5. Multi-user</h2>
      <p>
        Today <code>DEFAULT_USER_ID = &quot;default&quot;</code>. Pass a user id from your auth layer and thread
        it through <code>memory_store</code> calls for per-user facts and history.
      </p>

      <h2>6. Deploy</h2>
      <ul>
        <li>Server: Docker + uvicorn behind HTTPS reverse proxy</li>
        <li>WebSocket: use <code>wss://</code> in production</li>
        <li>Docs site: deploy <code>web/</code> to Vercel (<code>NEXT_PUBLIC_SITE_URL</code>)</li>
      </ul>

      <h2>What not to fork blindly</h2>
      <ul>
        <li>Keep <code>WsOutbound</code> for concurrent send/receive</li>
        <li>Keep Deepgram keepalive during long TTS</li>
        <li>Do not commit <code>.env</code> or <code>voxgraph.db</code></li>
      </ul>
    </>
  );
}
