import { create } from "zustand";

export type ChatState =
  | "idle"
  | "greeting"
  | "listening"
  | "responding"
  | "goodbye";

export type VideoKey =
  | "idle"
  | "greeting"
  | "listening"
  | "weather"
  | "general"
  | "fallback"
  | "prompt"
  | "goodbye";

interface ChatStore {
  state: ChatState;
  currentVideo: VideoKey;
  lastTranscript: string;
  silenceCount: number;

  setState: (state: ChatState) => void;
  playVideo: (video: VideoKey) => void;
  setTranscript: (text: string) => void;
  incrementSilence: () => void;
  resetSilence: () => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  state: "idle",
  currentVideo: "idle",
  lastTranscript: "",
  silenceCount: 0,

  setState: (state) => set({ state }),

  playVideo: (video) => set({ currentVideo: video }),

  setTranscript: (text) => set({ lastTranscript: text }),

  incrementSilence: () => set((s) => ({ silenceCount: s.silenceCount + 1 })),

  resetSilence: () => set({ silenceCount: 0 }),

  resetChat: () =>
    set({
      state: "idle",
      currentVideo: "idle",
      lastTranscript: "",
      silenceCount: 0,
    }),
}));
