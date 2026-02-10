import { useEffect, useRef, useState } from "react";

type SpeechHook = {
  start: () => void;
  stop: () => void;
  transcript: string;
  isListening: boolean;
  error: string | null;
};

export function useSpeechRecognition(
  onResult: (text: string) => void,
): SpeechHook {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");

      setTranscript(text);

      if (event.results[0].isFinal) {
        onResult(text);
        setIsListening(false);
      }
    };

    recognition.onerror = (e: any) => {
      setError(e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      // Auto-restart if still in listening mode
      if ((window as any).__chatListening) {
        recognition.start();
        setIsListening(true);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const start = () => {
    setTranscript("");
    setError(null);
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return { start, stop, transcript, isListening, error };
}
