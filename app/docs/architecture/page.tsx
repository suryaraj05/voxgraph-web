import type { Metadata } from "next";
import { DocsFlowDiagram } from "@/components/DocsFlowDiagram";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "VoxGraph pipeline architecture: WebSocket audio, Deepgram STT, debounced LLM, Deepgram TTS, episodic memory.",
};

export default function ArchitecturePage() {
  return (
    <>
      <h1>Architecture</h1>
      <p>
        VoxGraph is a single FastAPI process exposing one WebSocket endpoint. All real-time work
        happens over that connection — binary PCM in, binary PCM + JSON status events out.
      </p>

      <h2>Pipeline overview</h2>
      <DocsFlowDiagram />

      <h2>Key modules</h2>
      <div className="docs-table-wrap">
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>voxgraph.py</code></td>
              <td>FastAPI app, WebSocket handler, debounce, response pipeline</td>
            </tr>
            <tr>
              <td><code>llm_providers.py</code></td>
              <td>Gemini + Ollama streaming, system prompt, chat history</td>
            </tr>
            <tr>
              <td><code>tts_providers.py</code></td>
              <td>Deepgram Aura TTS, phrase chunking, PCM streaming</td>
            </tr>
            <tr>
              <td><code>memory_store.py</code></td>
              <td>SQLite semantic facts + episodic turns</td>
            </tr>
            <tr>
              <td><code>voice_intents.py</code></td>
              <td>Fast-path replies without LLM (names, greetings)</td>
            </tr>
            <tr>
              <td><code>ws_outbound.py</code></td>
              <td>Serialized WebSocket sends (safe concurrent send/receive)</td>
            </tr>
            <tr>
              <td><code>scripts/live_mic_client.py</code></td>
              <td>Reference client: continuous mic + speaker playback</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Concurrency model</h2>
      <ul>
        <li>Main loop: <code>receive_bytes()</code> from client → forward to Deepgram</li>
        <li>Deepgram callbacks: append transcripts, schedule debounced LLM task</li>
        <li>LLM/TTS runs in <code>asyncio</code> task; outbound audio via <code>WsOutbound</code> queue</li>
        <li>Keepalive pings Deepgram during long LLM+TTS so the STT stream stays open</li>
      </ul>

      <h2>Design goals</h2>
      <ul>
        <li><strong>Hackable</strong> — small files, clear extension points</li>
        <li><strong>Local-first</strong> — Ollama + Deepgram without mandatory cloud LLM</li>
        <li><strong>Conversation-aware</strong> — episodic turns fed back as Ollama chat messages</li>
      </ul>
    </>
  );
}
