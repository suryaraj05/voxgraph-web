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
              <th>Module</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>voxgraph/api/audio.py</code></td>
              <td>WebSocket handler, Deepgram STT stream, debounce, response pipeline</td>
            </tr>
            <tr>
              <td><code>voxgraph/api/config.py</code></td>
              <td>Hosted setup: <code>/config/health</code>, <code>/config/test</code>, <code>/config/apply</code></td>
            </tr>
            <tr>
              <td><code>voxgraph/providers/llm.py</code></td>
              <td>Gemini + Ollama streaming, system prompt, chat history</td>
            </tr>
            <tr>
              <td><code>voxgraph/providers/tts.py</code></td>
              <td>Deepgram Aura TTS, phrase chunking, PCM streaming</td>
            </tr>
            <tr>
              <td><code>voxgraph/pipeline/response.py</code></td>
              <td>Orchestrates STT → memory → LLM → TTS for each utterance</td>
            </tr>
            <tr>
              <td><code>voxgraph/voice/utterance.py</code></td>
              <td>Debouncing, barge-in, pending utterance staging</td>
            </tr>
            <tr>
              <td><code>voxgraph/memory/store.py</code></td>
              <td>SQLite semantic facts + episodic turns</td>
            </tr>
            <tr>
              <td><code>voxgraph/voice/intents.py</code></td>
              <td>Fast-path replies without LLM (names, greetings)</td>
            </tr>
            <tr>
              <td><code>voxgraph/transport/outbound.py</code></td>
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
        <li>Barge-in cancels in-flight TTS when new speech is detected</li>
      </ul>

      <h2>Design goals</h2>
      <ul>
        <li><strong>Hackable</strong> — small modules under <code>voxgraph/</code>, clear extension points</li>
        <li><strong>Local-first</strong> — Ollama + Deepgram without mandatory cloud LLM</li>
        <li><strong>Conversation-aware</strong> — episodic turns fed back as Ollama chat messages</li>
        <li><strong>Hostable</strong> — Docker + Render; runtime config API for online demos</li>
      </ul>
    </>
  );
}
