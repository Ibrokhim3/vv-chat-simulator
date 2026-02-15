"use client";

import { useChatStore } from "@/store/useChatStore";
import { useVideoController } from "@/hooks/useVideoController";
import { loopVideos } from "@/utils/videoBehavior";
import { cn } from "@/utils/cn";
import { useEffect } from "react";

export default function VideoPlayer() {
  const currentVideo = useChatStore((s) => s.currentVideo);
  const state = useChatStore((s) => s.state);
  const { videoA, videoB, isAActive, activeVideoEl } =
    useVideoController(currentVideo);

  const muted = state === "idle";

  useEffect(() => {
    const video = activeVideoEl.current;
    if (!video) return;

    const handleEnded = () => {
      const { state, playVideo, setState, resetChat } = useChatStore.getState();

      if (state === "idle" || state === "listening") return;

      if (
        state === "greeting" ||
        state === "responding" ||
        state === "prompt"
      ) {
        playVideo("listening");
        setState("listening");
        return;
      }

      if (state === "goodbye") {
        resetChat();
      }
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeVideoEl]);

  const shouldLoop = loopVideos.includes(currentVideo);

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute -inset-4 rounded-2xl blur-xl transition-opacity duration-500",
          state === "listening"
            ? "opacity-100 bg-pink-500/50 animate-pulse"
            : "opacity-0",
        )}
      />
      <div className="relative w-full max-w-md aspect-square sm:aspect-video bg-black rounded-2xl overflow-hidden shadow-lg min-h-[250px]">
        <video
          ref={videoA}
          muted={muted || !isAActive}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
            isAActive ? "opacity-100" : "opacity-0",
          )}
          playsInline
          loop={shouldLoop && isAActive}
        />

        <video
          ref={videoB}
          muted={muted || !isAActive}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
            !isAActive ? "opacity-100" : "opacity-0",
          )}
          playsInline
          loop={shouldLoop}
        />
      </div>
    </div>
  );
}
