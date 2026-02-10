import { useEffect, useRef, useState } from "react";
import { VideoKey } from "@/store/useChatStore";
import { videoMap } from "@/utils/videoMap";

export function useVideoController(activeVideo: VideoKey) {
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);

  const [isAActive, setIsAActive] = useState(true);

  // Load first video
  useEffect(() => {
    const el = videoA.current;
    if (!el) return;
    el.preload = "auto";

    el.src = videoMap[activeVideo];
    el.load();
    el.play().catch(() => {});
  }, []);

  // Swap videos when activeVideo changes
  useEffect(() => {
    const active = isAActive ? videoA.current : videoB.current;
    const hidden = isAActive ? videoB.current : videoA.current;

    if (!hidden || !active) return;

    hidden.src = videoMap[activeVideo];
    hidden.load();

    const onCanPlay = () => {
      hidden
        .play()
        .then(() => {
          active.pause();
          setIsAActive((v) => !v);
        })
        .catch(() => {});
    };

    hidden.addEventListener("canplaythrough", onCanPlay, { once: true });
  }, [activeVideo]);

  const activeVideoEl = isAActive ? videoA : videoB;

  return {
    videoA,
    videoB,
    isAActive,
    activeVideoEl,
  };
}
