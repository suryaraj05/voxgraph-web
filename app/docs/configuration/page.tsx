import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuration",
  description: "VoxGraph environment variables: API keys, LLM, TTS, latency tuning, memory limits.",
};

export default function ConfigurationPage() {
  return (
    <>
      <h1>Configuration</h1>
      <p>
        Copy <code>.env.example</code> to <code>.env</code> in the repo root. The server loads
        <code>.env</code> on startup (see <code>voxgraph/core/settings.py</code>).
      </p>

      <h2>API keys</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>DEEPGRAM_API_KEY</code></td>
            <td>Yes</td>
            <td>Deepgram STT + Aura TTS</td>
          </tr>
          <tr>
            <td><code>GOOGLE_API_KEY</code></td>
            <td>If Gemini</td>
            <td>Google GenAI for <code>LLM_PROVIDER=gemini</code></td>
          </tr>
          <tr>
            <td><code>ELEVENLABS_API_KEY</code></td>
            <td>Optional</td>
            <td>Fallback TTS when <code>TTS_PROVIDER=elevenlabs</code></td>
          </tr>
        </tbody>
      </table>

      <h2>LLM</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>LLM_PROVIDER</code></td>
            <td>gemini</td>
            <td><code>ollama</code> or <code>gemini</code></td>
          </tr>
          <tr>
            <td><code>OLLAMA_BASE_URL</code></td>
            <td>http://localhost:11434</td>
            <td>Ollama server URL</td>
          </tr>
          <tr>
            <td><code>OLLAMA_MODEL</code></td>
            <td>llama3.2:1b</td>
            <td>Model tag (e.g. <code>qwen2.5:7b</code>)</td>
          </tr>
          <tr>
            <td><code>OLLAMA_NUM_CTX</code></td>
            <td>8192</td>
            <td>Context window tokens</td>
          </tr>
          <tr>
            <td><code>OLLAMA_NUM_PREDICT</code></td>
            <td>256</td>
            <td>Max reply tokens</td>
          </tr>
          <tr>
            <td><code>VOICE_MAX_WORDS</code></td>
            <td>45</td>
            <td>Soft cap in system prompt for spoken replies</td>
          </tr>
        </tbody>
      </table>

      <h2>TTS</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>TTS_PROVIDER</code></td>
            <td>auto</td>
            <td><code>deepgram</code>, <code>elevenlabs</code>, or <code>none</code></td>
          </tr>
          <tr>
            <td><code>DEEPGRAM_TTS_MODEL</code></td>
            <td>aura-2-thalia-en</td>
            <td>Deepgram Aura voice model</td>
          </tr>
          <tr>
            <td><code>TTS_MIN_PHRASE_CHARS</code></td>
            <td>12</td>
            <td>Batch LLM tokens before TTS HTTP call</td>
          </tr>
        </tbody>
      </table>

      <h2>Latency (demo mode)</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Demo</th>
            <th>Normal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>DEMO_MODE</code></td>
            <td>1</td>
            <td>0</td>
          </tr>
          <tr>
            <td><code>UTTERANCE_DEBOUNCE_SEC</code></td>
            <td>0.12</td>
            <td>2.5</td>
          </tr>
          <tr>
            <td><code>DEEPGRAM_ENDPOINTING_MS</code></td>
            <td>180</td>
            <td>300</td>
          </tr>
        </tbody>
      </table>

      <h2>Memory</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>EPISODIC_MAX_TURNS</code></td>
            <td>30</td>
            <td>Max conversation turns stored per user</td>
          </tr>
          <tr>
            <td><code>EPISODIC_MAX_CHARS</code></td>
            <td>12000</td>
            <td>Character budget for history in LLM prompt</td>
          </tr>
        </tbody>
      </table>

      <h2>Other</h2>
      <ul>
        <li><code>STT_ONLY=1</code> — transcribe only, skip LLM/TTS</li>
        <li><code>SAVE_AUDIO=0</code> — do not write <code>last_response.wav</code> on disk</li>
      </ul>
    </>
  );
}
