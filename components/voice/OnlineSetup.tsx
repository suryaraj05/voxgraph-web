"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Play,
  ShieldAlert,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  applyOnlineConfig,
  onlineDefaultConfig,
  pingServer,
  testOnlineConfig,
  wsToHttpBase,
  type ConfigCheck,
  type VoxGraphSetupConfig,
} from "@/lib/voxgraph-config";

type OnlineSetupProps = {
  onContinue: (config: VoxGraphSetupConfig) => void;
  onBack: () => void;
};

function Toggle({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="try-setup-toggle-row">
      <div>
        <label htmlFor={id} className="try-setup-toggle-label">
          {label}
        </label>
        <p className="try-setup-toggle-hint">{hint}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`try-setup-switch${checked ? " try-setup-switch-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="try-setup-switch-knob" />
      </button>
    </div>
  );
}

function SecretInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="try-setup-field">
      <span>
        {label}
        {required && <span className="try-setup-required"> *</span>}
      </span>
      <input
        id={id}
        type="password"
        className="try-setup-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </label>
  );
}

export function OnlineSetup({ onContinue, onBack }: OnlineSetupProps) {
  const [config, setConfig] = useState<VoxGraphSetupConfig>(onlineDefaultConfig);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [testing, setTesting] = useState(false);
  const [applying, setApplying] = useState(false);
  const [checks, setChecks] = useState<ConfigCheck[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const patch = useCallback((partial: Partial<VoxGraphSetupConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
    setChecks(null);
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    pingServer(config.apiBaseUrl).then((ok) => {
      if (!cancelled) setServerOnline(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [config.apiBaseUrl]);

  const handleWsChange = (wsUrl: string) => {
    patch({ wsUrl, apiBaseUrl: wsToHttpBase(wsUrl) });
  };

  const handleTest = async () => {
    setTesting(true);
    setError(null);
    setChecks(null);
    try {
      const result = await testOnlineConfig(config);
      setChecks(result.checks);
      if (!result.ok) {
        setError("One or more checks failed — fix the issues above and try again.");
      }
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Connection test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleContinue = async () => {
    setApplying(true);
    setError(null);
    try {
      await applyOnlineConfig(config);
      onContinue(config);
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not apply configuration");
    } finally {
      setApplying(false);
    }
  };

  const canContinue =
    Boolean(config.deepgramApiKey.trim() && config.googleApiKey.trim()) &&
    !config.wsUrl.includes("example.com");

  return (
    <div className="try-setup-shell">
      <header className="try-setup-header">
        <button type="button" className="try-setup-back" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="try-setup-title">Online setup</h1>
          <p className="try-setup-subtitle">
            Connect to your hosted VoxGraph server and configure API keys
          </p>
        </div>
      </header>

      <div className="try-setup-panel glass-card">
        <div className="try-setup-panel-head">
          <h2>Hosted server</h2>
          <span
            className={`try-setup-server-badge${serverOnline ? " try-setup-server-badge-ok" : ""}`}
          >
            {serverOnline === null
              ? "Checking server…"
              : serverOnline
                ? "Server reachable"
                : "Server not reachable"}
          </span>
        </div>

        <label className="try-setup-field">
          <span>Hosted WebSocket URL</span>
          <input
            className="try-setup-input"
            value={config.wsUrl}
            onChange={(e) => handleWsChange(e.target.value)}
            placeholder="wss://your-server.example.com/audio"
            spellCheck={false}
          />
        </label>

        <SecretInput
          id="deepgram-key"
          label="Deepgram API key"
          value={config.deepgramApiKey}
          onChange={(v) => patch({ deepgramApiKey: v })}
          placeholder="STT + Aura TTS"
          required
        />

        <SecretInput
          id="google-key"
          label="Google API key (Gemini)"
          value={config.googleApiKey}
          onChange={(v) => patch({ googleApiKey: v })}
          placeholder="Cloud LLM"
          required
        />

        <label className="try-setup-field">
          <span>TTS provider</span>
          <select
            className="try-setup-input"
            value={config.ttsProvider}
            onChange={(e) =>
              patch({
                ttsProvider: e.target.value as VoxGraphSetupConfig["ttsProvider"],
              })
            }
          >
            <option value="deepgram">Deepgram Aura (recommended)</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="none">None (text only)</option>
          </select>
        </label>

        {config.ttsProvider === "elevenlabs" && (
          <SecretInput
            id="elevenlabs-key"
            label="ElevenLabs API key"
            value={config.elevenlabsApiKey}
            onChange={(v) => patch({ elevenlabsApiKey: v })}
            placeholder="Required when TTS is ElevenLabs"
          />
        )}

        <div className="try-setup-toggles">
          <Toggle
            id="demo-mode"
            label="Demo mode"
            hint="Lower latency — shorter debounce and faster endpointing"
            checked={config.demoMode}
            onChange={(demoMode) => patch({ demoMode })}
          />
          <Toggle
            id="stt-only"
            label="STT only"
            hint="Transcribe speech only — skip LLM and TTS"
            checked={config.sttOnly}
            onChange={(sttOnly) => patch({ sttOnly })}
          />
          <Toggle
            id="save-audio"
            label="Save audio"
            hint="Write last TTS reply to last_response.wav on the server"
            checked={config.saveAudio}
            onChange={(saveAudio) => patch({ saveAudio })}
          />
        </div>

        <p className="try-setup-note">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Keys are sent to your hosted Python server over HTTPS/WSS — not to localhost. Set{" "}
          <code>NEXT_PUBLIC_VOXGRAPH_ONLINE_WS_URL</code> in the website build to pre-fill the
          server URL.
        </p>

        {checks && (
          <ul className="try-setup-checks">
            {checks.map((check) => (
              <li key={check.name} data-ok={check.ok}>
                <strong>{check.name}</strong>
                <span>{check.detail}</span>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="try-setup-error">{error}</p>}

        <div className="try-setup-actions">
          <button
            type="button"
            className="try-setup-btn try-setup-btn-secondary"
            onClick={handleTest}
            disabled={testing || applying}
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing…
              </>
            ) : (
              "Test connection"
            )}
          </button>
          <button
            type="button"
            className="try-setup-btn try-setup-btn-primary"
            onClick={handleContinue}
            disabled={!canContinue || applying || testing}
          >
            {applying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting…
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start voice chat
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
