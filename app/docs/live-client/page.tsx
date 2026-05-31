import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live mic client",
  description:
    "VoxGraph live_mic_client.py: continuous voice mode, barge-in, headphones, demo flags.",
};

export default function LiveClientPage() {
  return (
    <>
      <h1>Live mic client</h1>
      <p>
        Reference implementation in <code>scripts/live_mic_client.py</code>. Use it to test the
        server before building your own UI (web, mobile, desktop).
      </p>

      <h2>Continuous mode (default)</h2>
      <pre>{`python scripts/live_mic_client.py --demo --url ws://127.0.0.1:8001/audio`}</pre>
      <ul>
        <li>Mic streams continuously — no Enter per turn</li>
        <li>Server Deepgram endpointing detects when you stop talking</li>
        <li>TTS plays through default output device (<code>sounddevice</code>)</li>
        <li>Type <code>q</code> + Enter to exit</li>
      </ul>

      <h2>Flags</h2>
      <table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>--demo</code></td>
            <td>Smaller mic chunks + low-latency playback (pair with <code>DEMO_MODE=1</code>)</td>
          </tr>
          <tr>
            <td><code>--turn-based</code></td>
            <td>Press Enter before each recording (legacy)</td>
          </tr>
          <tr>
            <td><code>--no-duck</code></td>
            <td>Keep sending mic while AI speaks (may cause echo)</td>
          </tr>
          <tr>
            <td><code>--barge-in-threshold</code></td>
            <td>Mic RMS level to interrupt AI playback (default 1200)</td>
          </tr>
        </tbody>
      </table>

      <h2>Audio tips</h2>
      <ul>
        <li>Use headphones — speaker output feeds back into the mic and confuses STT</li>
        <li>Client prints input/output device names at startup — verify the correct speaker</li>
        <li>Look for <code>· Thinking…</code> / <code>· Speaking…</code> and audio byte logs</li>
      </ul>

      <h2>PCM file testing</h2>
      <p>
        For automated tests without a microphone, use <code>scripts/send_test_pcm.py</code> with a
        raw 16 kHz mono PCM file (see <code>samples/README.md</code>).
      </p>
    </>
  );
}
