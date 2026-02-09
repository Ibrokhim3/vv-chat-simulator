"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { useChatStore } from "@/store/useChatStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { matchKeyword } from "@/utils/keywordRouter";
import { useEffect } from "react";

export default function Home() {
  const { state, setState, playVideo, setTranscript, resetChat } =
    useChatStore();

  const speech = useSpeechRecognition((text) => {
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

  // When response video ends → go back to listening
  useEffect(() => {
    if (state === "responding") {
      const timeout = setTimeout(() => {
        playVideo("listening");
        setState("listening");
        speech.start();
      }, 3000); // approximate video length for now

      return () => clearTimeout(timeout);
    }

    if (state === "greeting") {
      const timeout = setTimeout(() => {
        playVideo("listening");
        setState("listening");
        speech.start();
      }, 3000);

      return () => clearTimeout(timeout);
    }

    if (state === "goodbye") {
      const timeout = setTimeout(() => {
        resetChat();
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [state]);

  const startChat = () => {
    playVideo("greeting");
    setState("greeting");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white flex flex-col items-center justify-center p-4 gap-6">
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
