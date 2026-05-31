"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BrowserSpeechRecognition, SpeechRecognitionCtor } from "@/types/speech";

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechCaption(enabled: boolean) {
  const [caption, setCaption] = useState("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  useEffect(() => {
    const Ctor = getSpeechRecognition();
    if (!enabled || !Ctor) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setCaption(text.trim());
    };

    recognition.onerror = () => {
      /* optional caption — ignore errors */
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [enabled]);

  const reset = useCallback(() => setCaption(""), []);

  return { caption, resetCaption: reset };
}
