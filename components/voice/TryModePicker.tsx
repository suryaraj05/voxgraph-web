"use client";

import Link from "next/link";
import { ArrowLeft, Cloud, HardDrive } from "lucide-react";
import { useEffect, useState } from "react";
import { pingLocalServer } from "@/lib/voxgraph-config";

type TryModePickerProps = {
  onLocal: () => void;
  onOnline: () => void;
};

export function TryModePicker({ onLocal, onOnline }: TryModePickerProps) {
  const [localServerUp, setLocalServerUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    pingLocalServer().then((ok) => {
      if (!cancelled) setLocalServerUp(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="try-setup-shell">
      <header className="try-setup-header">
        <Link href="/" className="try-setup-back" aria-label="Back to home">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="try-setup-title">Try VoxGraph</h1>
          <p className="try-setup-subtitle">How are you running the voice server?</p>
        </div>
      </header>

      <div className="try-setup-mode-grid">
        <button type="button" className="try-setup-mode-card" onClick={onLocal}>
          <HardDrive className="h-6 w-6" />
          <strong>Run local</strong>
          <span>
            Python server on your machine — uses your <code>.env</code>, no keys needed here.
          </span>
          <span
            className={`try-setup-inline-badge${localServerUp ? " try-setup-server-badge-ok" : ""}`}
          >
            {localServerUp === null
              ? "Checking localhost:8001…"
              : localServerUp
                ? "Local server detected"
                : "Start: uvicorn on port 8001"}
          </span>
        </button>

        <button type="button" className="try-setup-mode-card" onClick={onOnline}>
          <Cloud className="h-6 w-6" />
          <strong>Try online</strong>
          <span>
            Connect to a hosted VoxGraph server — enter your API keys and env toggles on the next
            screen.
          </span>
        </button>
      </div>

      <p className="try-setup-footnote">
        Local mode reads configuration from <code>voxgraph/.env</code> on the machine where Python
        runs. Online mode is for when the server lives in the cloud and you bring your own keys
        through the website.
      </p>
    </div>
  );
}
