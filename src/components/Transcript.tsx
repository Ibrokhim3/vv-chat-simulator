"use client";
import { useChatStore } from "@/store/useChatStore";

export default function Transcript() {
  const text = useChatStore((s) => s.lastTranscript);

  if (!text) return null;

  return (
    <div className="px-4 py-2 bg-black/50 rounded-xl text-pink-100 text-md text-center max-w-md transition-opacity duration-300">
      “{text}”
    </div>
  );
}
