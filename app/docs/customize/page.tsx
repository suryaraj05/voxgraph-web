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
        <code>voxgraph/voice/intents.py</code> — return a fixed string from{" "}
        <code>try_direct_voice_reply()</code> to handle common phrases without LLM latency (names,
        greetings, support FAQs).
      </p>

      <h2>2. System prompt & personality</h2>
      <p>
        <code>voxgraph/providers/llm.py</code> — change <code>build_system_prompt()</code> for your
        brand, domain (cooking, support, coaching), and reply style.
      </p>

      <h2>3. Tools & actions</h2>
      <p>
        Hook into <code>voxgraph/pipeline/response.py</code> before or after the LLM call: calendar
        APIs, RAG, database lookups, home automation. LangGraph scaffolding is already imported for
        future graph-based flows.
      </p>

      <h2>4. Your client</h2>
      <ul>
        <li>Next.js / React — browser WebSocket + Web Audio API for playback (see this site&apos;s <code>/try</code>)</li>
        <li>Mobile — native audio capture at 16 kHz, stream to <code>/audio</code></li>
        <li>Telephony — bridge PSTN audio to the same WebSocket format</li>
        <li>Terminal — extend <code>scripts/live_mic_client.py</code></li>
      </ul>

      <h2>5. Multi-user</h2>
      <p>
        Today <code>DEFAULT_USER_ID = &quot;default&quot;</code> in <code>voxgraph/core/settings.py</code>.
        Pass a user id from your auth layer and thread it through <code>voxgraph/memory/</code> for
        per-user facts and history.
      </p>

      <h2>6. Deploy</h2>
      <ul>
        <li>Backend: Docker + uvicorn on Render (see <code>DEPLOY.md</code> in the voxgraph repo)</li>
        <li>WebSocket: use <code>wss://</code> in production</li>
        <li>Marketing + docs: deploy <code>voxgraph-web</code> to Vercel (<code>NEXT_PUBLIC_SITE_URL</code>)</li>
        <li>CORS: set <code>ALLOWED_ORIGINS</code> on the backend to your Vercel domain</li>
      </ul>

      <h2>What not to fork blindly</h2>
      <ul>
        <li>Keep <code>WsOutbound</code> (<code>voxgraph/transport/outbound.py</code>) for concurrent send/receive</li>
        <li>Keep Deepgram keepalive during long TTS (<code>voxgraph/voice/utterance.py</code>)</li>
        <li>Do not commit <code>.env</code> or <code>voxgraph.db</code></li>
      </ul>
    </>
  );
}
