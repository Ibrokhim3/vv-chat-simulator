"use client";

import { useChatStore } from "@/store/useChatStore";
import { useVideoController } from "@/hooks/useVideoController";
import { loopVideos } from "@/utils/videoBehavior";
import { cn } from "@/utils/cn";

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
      const { state, playVideo, setState, resetChat } = useChatStore.getState();

      // Looping videos should never end the flow
      if (state === "idle" || state === "listening") return;

      // Any normal response or prompt → back to listening
      if (
        state === "greeting" ||
        state === "responding" ||
        state === "prompt"
      ) {
        playVideo("listening");
        setState("listening");
        return;
      }

      // Goodbye ends the conversation
      if (state === "goodbye") {
        resetChat();
      }
    };
  }

  const shouldLoop = loopVideos.includes(currentVideo);

  return (
    <div className="relative w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden shadow-lg min-h-[225px]">
      <video
        ref={videoA}
        muted={muted}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity",
          isAActive ? "opacity-100" : "opacity-0",
        )}
        playsInline
        loop={shouldLoop}
      />

      <video
        ref={videoB}
        muted={muted}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity",
          !isAActive ? "opacity-100" : "opacity-0",
        )}
        playsInline
        loop={shouldLoop}
      />
    </div>
  );
}
