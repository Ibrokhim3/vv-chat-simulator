"use client";

import { useChatStore } from "@/store/useChatStore";
import { useVideoController } from "@/hooks/useVideoController";

export default function VideoPlayer() {
  const currentVideo = useChatStore((s) => s.currentVideo);
  const { videoA, videoB, isAActive } = useVideoController(currentVideo);

  return (
    <div className="relative w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoA}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
          isAActive ? "opacity-100" : "opacity-0"
        }`}
        playsInline
        muted
      />

      <video
        ref={videoB}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
          !isAActive ? "opacity-100" : "opacity-0"
        }`}
        playsInline
        muted
      />
    </div>
  );
}
