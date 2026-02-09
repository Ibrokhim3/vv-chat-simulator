import { VideoKey } from "@/store/useChatStore";

export function matchKeyword(text: string): VideoKey {
  const t = text.toLowerCase();

  if (t.includes("bye") || t.includes("goodbye")) return "goodbye";
  if (t.includes("hello") || t.includes("hi")) return "general";
  if (t.includes("weather") || t.includes("today")) return "weather";

  return "general";
}
