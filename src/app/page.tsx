"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { useChatStore } from "@/store/useChatStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { matchKeyword } from "@/utils/keywordRouter";
import { useEffect } from "react";
import { useRef } from "react";
import { SILENCE_TIME } from "@/consts/silince-time";

export default function Home() {
  const { state, setState, playVideo, setTranscript, resetChat } =
    useChatStore();

  const speech = useSpeechRecognition((text) => {
    useChatStore.getState().resetSilence();
    setTranscript(text);

    const video = matchKeyword(text);

    if (video === "goodbye") {
      playVideo("goodbye");
      setState("goodbye");
      return;
    }

    playVideo(video);
    setState("responding");
  });

  useEffect(() => {
    if (state === "listening") {
      (window as any).__chatListening = true;
      speech.start();
    } else {
      (window as any).__chatListening = false;
      speech.stop();
    }
  }, [state]);

  const startChat = () => {
    playVideo("greeting");
    setState("greeting");
  };

  //Silence timer. Prompt video is triggered after 8 seconds of silence
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state !== "listening") {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      return;
    }

    silenceTimer.current = setTimeout(() => {
      const { silenceCount, playVideo, setState, incrementSilence } =
        useChatStore.getState();

      if (silenceCount === 0) {
        incrementSilence();
        playVideo("prompt");
        setState("prompt");
      } else {
        playVideo("goodbye");
        setState("goodbye");
      }
    }, SILENCE_TIME);

    return () => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [state]);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-900 to-black text-white flex flex-col items-center justify-center p-4 gap-6">
      <VideoPlayer />

      {state === "idle" && (
        <button
          onClick={startChat}
          className="px-6 py-3 bg-pink-500 rounded-full text-lg hover:bg-pink-600 transition"
        >
          Start Chat
        </button>
      )}

      {state === "listening" && (
        <div className="flex items-center gap-2 text-pink-400 animate-pulse">
          🎤 Listening...
        </div>
      )}
    </main>
  );
}
