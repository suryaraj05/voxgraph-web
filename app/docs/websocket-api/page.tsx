import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebSocket API",
  description:
    "VoxGraph /audio WebSocket protocol: PCM input format, TTS binary output, JSON status events.",
};

export default function WebSocketApiPage() {
  return (
    <>
      <h1>WebSocket API</h1>
      <p>
        Connect to <code>ws://HOST:PORT/audio</code> (default port 8000 or 8001 in docs examples).
      </p>

      <h2>Client → server (binary)</h2>
      <p>Send raw PCM frames continuously while the user is speaking:</p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Encoding</td>
            <td>linear16 (signed 16-bit LE)</td>
          </tr>
          <tr>
            <td>Sample rate</td>
            <td>16000 Hz</td>
          </tr>
          <tr>
            <td>Channels</td>
            <td>1 (mono)</td>
          </tr>
          <tr>
            <td>Frame size</td>
            <td>Flexible; reference client uses 512–1024 samples/chunk</td>
          </tr>
        </tbody>
      </table>

      <h2>Server → client (binary)</h2>
      <p>TTS audio chunks during a reply:</p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Encoding</td>
            <td>linear16</td>
          </tr>
          <tr>
            <td>Sample rate</td>
            <td>24000 Hz (configurable via <code>TTS_SAMPLE_RATE</code>)</td>
          </tr>
          <tr>
            <td>Channels</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>

      <h2>Server → client (JSON text)</h2>
      <p>Status and fallback text when voice fails:</p>
      <pre>{`{ "type": "status", "message": "Thinking…" }
{ "type": "status", "message": "Speaking…" }
{ "type": "status", "message": "Ready — speak anytime" }
{ "type": "reply_text", "message": "Full LLM text if TTS failed" }
{ "type": "error", "message": "Human-readable error" }`}</pre>

      <h2>Utterance lifecycle</h2>
      <ol>
        <li>Client streams PCM while user talks</li>
        <li>Deepgram emits interim + final transcripts; <code>speech_final</code> marks end of phrase</li>
        <li>Server debounces (~120 ms in demo mode) then merges segments into one user question</li>
        <li>LLM + TTS pipeline runs; client should play binary chunks and show JSON status</li>
        <li>While AI speaks, reference client ducks mic (optional barge-in on loud speech)</li>
      </ol>

      <h2>Building your own client</h2>
      <ul>
        <li>Use any WebSocket library; set <code>max_size=None</code> for large TTS frames</li>
        <li>Run one task for <code>send(mic_pcm)</code> and one for <code>recv()</code> (duplex)</li>
        <li>Parse string frames as JSON; treat everything else as PCM for playback</li>
        <li>See <code>scripts/send_test_pcm.py</code> for <code>TtsPlayback</code> and <code>continuous_tts_playback</code></li>
      </ul>
    </>
  );
}
