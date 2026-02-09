import { VideoKey } from "@/store/useChatStore";

export const videoMap: Record<VideoKey, string> = {
  idle: "/videos/idle.mp4",
  greeting: "/videos/greeting.mp4",
  listening: "/videos/listening.mp4",
  weather: "/videos/weather.mp4",
  general: "/videos/general_response.mp4",
  fallback: "/videos/fallback.mp4",
  prompt: "/videos/prompt.mp4",
  goodbye: "/videos/goodbye.mp4",
};
