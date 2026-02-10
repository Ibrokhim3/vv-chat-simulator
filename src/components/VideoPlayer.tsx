"use client";

import { useChatStore } from "@/store/useChatStore";
import { useVideoController } from "@/hooks/useVideoController";

export default function VideoPlayer() {
  const currentVideo = useChatStore((s) => s.currentVideo);
  const state = useChatStore((s) => s.state);
  const { videoA, videoB, isAActive, activeVideoEl } =
    useVideoController(currentVideo);
  const setState = useChatStore((s) => s.setState);
  const playVideo = useChatStore((s) => s.playVideo);

  const muted = state === "idle";

  if (activeVideoEl.current) {
    activeVideoEl.current.onended = () => {
      const state = useChatStore.getState().state;

      if (state === "greeting" || state === "responding") {
        playVideo("listening");
        setState("listening");
      }

      if (state === "goodbye") {
        useChatStore.getState().resetChat();
      }
    };
  }

  return (
    <div className="relative w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoA}
        muted={muted}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
          isAActive ? "opacity-100" : "opacity-0"
        }`}
        playsInline
      />

      <video
        ref={videoB}
        muted={muted}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
          !isAActive ? "opacity-100" : "opacity-0"
        }`}
        playsInline
      />
    </div>
  );
}
