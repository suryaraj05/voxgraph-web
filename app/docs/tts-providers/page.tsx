import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TTS providers",
  description: "VoxGraph text-to-speech: Deepgram Aura PCM streaming and ElevenLabs fallback.",
};

export default function TtsProvidersPage() {
  return (
    <>
      <h1>TTS providers</h1>

      <h2>Deepgram Aura (default)</h2>
      <pre>{`TTS_PROVIDER=deepgram
DEEPGRAM_TTS_MODEL=aura-2-thalia-en`}</pre>
      <ul>
        <li>Same API key as STT</li>
        <li>REST streaming → linear16 PCM at 24 kHz</li>
        <li>Phrase-level pipelining: LLM tokens batched, multiple HTTP speak calls per reply</li>
        <li>Retries on transient network errors</li>
      </ul>

      <h2>ElevenLabs</h2>
      <pre>{`TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=your_key
ELEVENLABS_OUTPUT_FORMAT=pcm_24000`}</pre>
      <p>
        WebSocket stream-input with token streaming. Falls back to Deepgram if ElevenLabs returns no
        audio. Note: some free accounts hit policy blocks — Deepgram is the reliable default.
      </p>

      <h2>No TTS</h2>
      <pre>{`TTS_PROVIDER=none`}</pre>
      <p>LLM text only; server sends <code>reply_text</code> JSON events to the client.</p>

      <h2>Client playback</h2>
      <p>
        Your client must play 24 kHz int16 mono PCM. The reference client uses{" "}
        <code>sounddevice</code> with a queued writer thread.
      </p>
    </>
  );
}
