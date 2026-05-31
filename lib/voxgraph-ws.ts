import { parseServerEvent, TtsPlayer, type ServerEvent } from "./voxgraph-audio";

export type ChatHandlers = {
  onEvent: (event: ServerEvent) => void;
  onOpen: () => void;
  onClose: () => void;
  onError: (message: string) => void;
  onAudioActivity?: () => void;
};

export class VoxGraphSession {
  private ws: WebSocket | null = null;
  readonly player = new TtsPlayer();

  connect(url: string, handlers: ChatHandlers) {
    this.disconnect();
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => handlers.onOpen();
    this.ws.onclose = () => handlers.onClose();
    this.ws.onerror = () => handlers.onError("WebSocket connection failed");

    this.ws.onmessage = async (msg) => {
      if (typeof msg.data === "string") {
        const event = parseServerEvent(msg.data);
        if (event) handlers.onEvent(event);
        return;
      }
      if (msg.data instanceof ArrayBuffer) {
        handlers.onAudioActivity?.();
        await this.player.playChunk(msg.data);
      }
    };
  }

  sendPcm(pcm: Blob | ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(pcm);
    }
  }

  disconnect() {
    this.player.stop();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
    }
    this.ws = null;
  }

  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
