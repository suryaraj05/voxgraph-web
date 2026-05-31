"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearStoredOnlineConfig,
  loadStoredOnlineConfig,
  localChatConfig,
  saveStoredOnlineConfig,
  type VoxGraphSetupConfig,
} from "@/lib/voxgraph-config";
import { OnlineSetup } from "@/components/voice/OnlineSetup";
import { TryModePicker } from "@/components/voice/TryModePicker";
import { VoiceChatApp } from "@/components/voice/VoiceChatApp";

type Step = "pick" | "online-setup" | "chat";

export function VoiceTryFlow() {
  const [step, setStep] = useState<Step>("pick");
  const [config, setConfig] = useState<VoxGraphSetupConfig | null>(null);

  useEffect(() => {
    const stored = loadStoredOnlineConfig();
    if (stored?.wsUrl) {
      setConfig(stored);
      setStep("chat");
    }
  }, []);

  const startLocal = useCallback(() => {
    clearStoredOnlineConfig();
    setConfig(localChatConfig());
    setStep("chat");
  }, []);

  const startOnlineSetup = useCallback(() => {
    setStep("online-setup");
  }, []);

  const finishOnlineSetup = useCallback((next: VoxGraphSetupConfig) => {
    saveStoredOnlineConfig(next);
    setConfig(next);
    setStep("chat");
  }, []);

  const backToPicker = useCallback(() => {
    if (config?.mode === "online") {
      clearStoredOnlineConfig();
    }
    setConfig(null);
    setStep("pick");
  }, [config?.mode]);

  if (step === "chat" && config) {
    return (
      <VoiceChatApp
        initialWsUrl={config.wsUrl}
        mode={config.mode}
        onBackToSetup={backToPicker}
      />
    );
  }

  if (step === "online-setup") {
    return <OnlineSetup onContinue={finishOnlineSetup} onBack={() => setStep("pick")} />;
  }

  return <TryModePicker onLocal={startLocal} onOnline={startOnlineSetup} />;
}
