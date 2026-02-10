import { VideoKey } from "@/store/useChatStore";

export function matchKeyword(text: string): VideoKey {
  const t = text.toLowerCase();
  if (t.includes("masterbek") || t.includes("asterone")) return "easter_egg";
  if (t.includes("bye") || t.includes("goodbye")) return "goodbye";
  if (t.includes("hello") || t.includes("hi") || t.includes("general"))
    return "general";
  if (t.includes("weather") || t.includes("today")) return "weather";

  return "fallback";
}
