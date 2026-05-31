const MIC_RATE = 16000;
const TTS_RATE = 24000;

export function downsampleToInt16(input: Float32Array, inputRate: number, outputRate = MIC_RATE): Int16Array {
  if (inputRate === outputRate) {
    const out = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  const ratio = inputRate / outputRate;
  const outLen = Math.floor(input.length / ratio);
  const out = new Int16Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const idx = Math.floor(i * ratio);
    const s = Math.max(-1, Math.min(1, input[idx]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

export class MicStreamer {
  private context: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private silentGain: GainNode | null = null;
  private onChunk: ((pcm: Blob) => void) | null = null;
  private muted = false;

  async start(onChunk: (pcm: Blob) => void): Promise<void> {
    this.onChunk = onChunk;
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.context = new AudioContext();
    await this.context.resume();
    this.source = this.context.createMediaStreamSource(this.stream);
    this.processor = this.context.createScriptProcessor(4096, 1, 1);
    this.silentGain = this.context.createGain();
    this.silentGain.gain.value = 0;

    this.processor.onaudioprocess = (event) => {
      if (this.muted || !this.onChunk) return;
      const input = event.inputBuffer.getChannelData(0);
      const pcm = downsampleToInt16(input, this.context!.sampleRate, MIC_RATE);
      const copy = new Int16Array(pcm);
      this.onChunk(new Blob([copy.buffer], { type: "application/octet-stream" }));
    };

    this.source.connect(this.processor);
    this.processor.connect(this.silentGain);
    this.silentGain.connect(this.context.destination);
  }

  async resume() {
    if (this.context?.state === "suspended") {
      await this.context.resume();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  stop() {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.silentGain?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    void this.context?.close();
    this.processor = null;
    this.source = null;
    this.silentGain = null;
    this.stream = null;
    this.context = null;
    this.onChunk = null;
  }
}

export class TtsPlayer {
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gain: GainNode | null = null;
  private freqData: Uint8Array | null = null;
  private waveData: Uint8Array | null = null;
  private nextTime = 0;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private _speaking = false;
  onSpeakingChange: ((speaking: boolean) => void) | null = null;

  get speaking() {
    return this._speaking;
  }

  private setSpeaking(value: boolean) {
    if (this._speaking === value) return;
    this._speaking = value;
    this.onSpeakingChange?.(value);
  }

  private ensureContext() {
    if (!this.context) {
      this.context = new AudioContext();
      this.gain = this.context.createGain();
      this.gain.gain.value = 1;
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.82;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;
      this.gain.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.waveData = new Uint8Array(this.analyser.fftSize);
    }
    return this.context;
  }

  /** Call during the user-gesture handler so playback is not blocked by autoplay policy. */
  async warmup() {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.freqData) return null;
    this.analyser.getByteFrequencyData(this.freqData as Uint8Array<ArrayBuffer>);
    return this.freqData;
  }

  getWaveformData(): Uint8Array | null {
    if (!this.analyser || !this.waveData) return null;
    this.analyser.getByteTimeDomainData(this.waveData as Uint8Array<ArrayBuffer>);
    return this.waveData;
  }

  async playChunk(pcm: ArrayBuffer) {
    const ctx = this.ensureContext();
    await ctx.resume();

    const int16 = new Int16Array(pcm);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;

    const buffer = ctx.createBuffer(1, float32.length, TTS_RATE);
    buffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gain!);

    const now = ctx.currentTime;
    if (this.nextTime < now) this.nextTime = now;
    source.start(this.nextTime);
    this.nextTime += buffer.duration;

    this.setSpeaking(true);
    this.scheduleSpeakingEnd();
  }

  private scheduleSpeakingEnd() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    const ctx = this.context;
    if (!ctx) return;

    const delayMs = Math.max(50, (this.nextTime - ctx.currentTime) * 1000 + 120);
    this.idleTimer = setTimeout(() => {
      const current = this.context;
      if (!current) {
        this.setSpeaking(false);
        return;
      }
      if (current.currentTime >= this.nextTime - 0.05) {
        this.setSpeaking(false);
      } else {
        this.scheduleSpeakingEnd();
      }
    }, delayMs);
  }

  interrupt() {
    if (this.context) {
      void this.context.close();
      this.context = null;
      this.analyser = null;
      this.gain = null;
      this.freqData = null;
      this.waveData = null;
    }
    this.nextTime = 0;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.setSpeaking(false);
  }

  stop() {
    this.interrupt();
  }
}

export type ServerEvent = {
  type: string;
  message: string;
};

export function parseServerEvent(raw: string): ServerEvent | null {
  try {
    const data = JSON.parse(raw) as ServerEvent;
    if (data && typeof data.type === "string") return data;
  } catch {
    /* binary or invalid */
  }
  return null;
}
