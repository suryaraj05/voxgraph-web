export type RunMode = "local" | "online";

export type VoxGraphSetupConfig = {
  mode: RunMode;
  wsUrl: string;
  apiBaseUrl: string;
  deepgramApiKey: string;
  googleApiKey: string;
  elevenlabsApiKey: string;
  llmProvider: "ollama" | "gemini";
  ttsProvider: "deepgram" | "elevenlabs" | "none";
  sttOnly: boolean;
  demoMode: boolean;
  saveAudio: boolean;
};

export type ConfigCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

const STORAGE_KEY = "voxgraph-online-config";

export const DEFAULT_LOCAL_WS =
  process.env.NEXT_PUBLIC_VOXGRAPH_WS_URL ?? "ws://127.0.0.1:8001/audio";

export const DEFAULT_ONLINE_WS =
  process.env.NEXT_PUBLIC_VOXGRAPH_ONLINE_WS_URL ?? "wss://your-voxgraph-server.example.com/audio";

export function wsToHttpBase(wsUrl: string): string {
  try {
    const url = new URL(wsUrl);
    url.protocol = url.protocol === "wss:" ? "https:" : "http:";
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "http://127.0.0.1:8001";
  }
}

/** Local chat — server reads keys from .env on the machine running Python. */
export function localChatConfig(): VoxGraphSetupConfig {
  const wsUrl = DEFAULT_LOCAL_WS;
  return {
    mode: "local",
    wsUrl,
    apiBaseUrl: wsToHttpBase(wsUrl),
    deepgramApiKey: "",
    googleApiKey: "",
    elevenlabsApiKey: "",
    llmProvider: "ollama",
    ttsProvider: "deepgram",
    sttOnly: false,
    demoMode: true,
    saveAudio: false,
  };
}

/** Online chat — user supplies keys for a hosted Python server. */
export function onlineDefaultConfig(): VoxGraphSetupConfig {
  const wsUrl = DEFAULT_ONLINE_WS;
  return {
    mode: "online",
    wsUrl,
    apiBaseUrl: wsToHttpBase(wsUrl),
    deepgramApiKey: "",
    googleApiKey: "",
    elevenlabsApiKey: "",
    llmProvider: "gemini",
    ttsProvider: "deepgram",
    sttOnly: false,
    demoMode: true,
    saveAudio: false,
  };
}

export function loadStoredOnlineConfig(): VoxGraphSetupConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VoxGraphSetupConfig;
    if (parsed.mode !== "online") return null;
    return { ...onlineDefaultConfig(), ...parsed };
  } catch {
    return null;
  }
}

export function saveStoredOnlineConfig(config: VoxGraphSetupConfig): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearStoredOnlineConfig(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

function payloadFromConfig(config: VoxGraphSetupConfig) {
  return {
    mode: "online" as const,
    deepgramApiKey: config.deepgramApiKey || undefined,
    googleApiKey: config.googleApiKey || undefined,
    elevenlabsApiKey: config.elevenlabsApiKey || undefined,
    llmProvider: "gemini" as const,
    ttsProvider: config.ttsProvider,
    sttOnly: config.sttOnly,
    demoMode: config.demoMode,
    saveAudio: config.saveAudio,
  };
}

export async function testOnlineConfig(
  config: VoxGraphSetupConfig,
): Promise<{ ok: boolean; checks: ConfigCheck[] }> {
  const base = config.apiBaseUrl.replace(/\/$/, "");
  const resp = await fetch(`${base}/config/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadFromConfig(config)),
  });
  if (!resp.ok) {
    throw new Error(
      resp.status === 404
        ? "Hosted server has no /config/test endpoint."
        : `Test failed (HTTP ${resp.status})`,
    );
  }
  return resp.json();
}

export async function applyOnlineConfig(
  config: VoxGraphSetupConfig,
): Promise<{ ok: boolean; summary: Record<string, string> }> {
  const base = config.apiBaseUrl.replace(/\/$/, "");
  const resp = await fetch(`${base}/config/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadFromConfig(config)),
  });
  if (!resp.ok) {
    throw new Error(
      resp.status === 404
        ? "Hosted server has no /config/apply endpoint."
        : `Apply failed (HTTP ${resp.status})`,
    );
  }
  return resp.json();
}

export async function pingServer(apiBaseUrl: string): Promise<boolean> {
  try {
    const base = apiBaseUrl.replace(/\/$/, "");
    const resp = await fetch(`${base}/config/health`, { method: "GET" });
    return resp.ok;
  } catch {
    return false;
  }
}

export async function pingLocalServer(): Promise<boolean> {
  return pingServer(wsToHttpBase(DEFAULT_LOCAL_WS));
}
