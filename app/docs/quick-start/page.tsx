import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Quick start",
  description:
    "Run VoxGraph locally in minutes: Python venv, Deepgram API key, Ollama or Gemini, live mic client.",
};

export default function QuickStartPage() {
  return (
    <>
      <h1>Quick start</h1>
      <p>Get a full voice loop running on your machine: speak → STT → LLM → TTS → hear the reply.</p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Python 3.10+</li>
        <li>
          <a href="https://console.deepgram.com/" target="_blank" rel="noopener noreferrer">
            Deepgram API key
          </a>{" "}
          (STT + Aura TTS)
        </li>
        <li>
          <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer">
            Ollama
          </a>{" "}
          (local LLM, recommended) or Google Gemini API key
        </li>
        <li>Headphones (reduces echo from speaker → mic)</li>
      </ul>

      <h2>1. Clone and install</h2>
      <CodeBlock
        code={`git clone https://github.com/suryaraj05/voxgraph.git
cd voxgraph
python -m venv .venv
.venv\\Scripts\\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt`}
      />

      <h2>2. Configure environment</h2>
      <CodeBlock code="cp .env.example .env" />
      <p>
        Edit <code>.env</code>. Minimum for local demo:
      </p>
      <CodeBlock
        language="env"
        code={`DEEPGRAM_API_KEY=your_key
LLM_PROVIDER=ollama
OLLAMA_MODEL=qwen2.5:7b
TTS_PROVIDER=deepgram
DEMO_MODE=1
STT_ONLY=0`}
      />

      <h2>3. Start Ollama (if using local LLM)</h2>
      <CodeBlock
        code={`ollama serve
ollama pull qwen2.5:7b`}
      />

      <h2>4. Run the server</h2>
      <CodeBlock code="python -u -m uvicorn voxgraph:app --host 0.0.0.0 --port 8001" />

      <h2>5. Run the live mic client</h2>
      <p>In a second terminal, from the <code>voxgraph</code> folder:</p>
      <CodeBlock code="python scripts/live_mic_client.py --demo --url ws://127.0.0.1:8001/audio" />
      <p>
        Speak naturally. The server detects end-of-utterance, calls the LLM, and streams TTS back.
        Type <code>q</code> + Enter to quit.
      </p>

      <h2>Verify it works</h2>
      <ul>
        <li>Server log: <code>Deepgram connection opened</code></li>
        <li>Client log: <code>Live playback on (24000 Hz PCM)...</code></li>
        <li>After you speak: <code>· Thinking…</code> → <code>· Speaking…</code> on the client</li>
      </ul>

      <h2>Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/architecture">Architecture</Link> — how the pipeline fits together
        </li>
        <li>
          <Link href="/docs/configuration">Configuration</Link> — all environment variables
        </li>
        <li>
          <Link href="/docs/customize">Customize</Link> — add your own logic
        </li>
      </ul>
    </>
  );
}
