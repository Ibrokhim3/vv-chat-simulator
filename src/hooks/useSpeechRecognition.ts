import { useCallback, useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/useChatStore";

type SpeechHook = {
  start: () => void;
  stop: () => void;
  isListening: boolean;
  error: string | null;
};

export function useSpeechRecognition(
  onResult: (text: string) => void,
): SpeechHook {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);

  const [isListening, setIsListening] = useState(false);

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [error, setError] = useState<string | null>(
    isSupported ? null : "Speech recognition not supported",
  );

  // Always keep latest callback without recreating SpeechRecognition
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // Create SpeechRecognition ONCE
  useEffect(() => {
    if (!isSupported) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      if (event.results[0].isFinal) {
        onResultRef.current(text);
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      // Controlled auto-restart using Zustand state
      const { isListening: shouldListen } = useChatStore.getState();

      if (shouldListen) {
        recognition.start();
        setIsListening(true);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, []);

  // Stable controls
  const start = useCallback(() => {
    setError(null);
    useChatStore.getState().setListening(true);
    setIsListening(true);
    recognitionRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    useChatStore.getState().setListening(false);
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { start, stop, isListening, error };
}
