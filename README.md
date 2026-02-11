40 minutes
2 hours

# Virtual Anime Video Chat Simulator

A modern web application that simulates a real-time video conversation with a virtual anime-style character.  
The app listens to the user’s speech, detects keywords, and plays pre-recorded video responses with seamless, cinematic transitions.

---

## 🚀 Setup & Run Instructions

### Requirements

- Node.js 18+
- Google Chrome or Microsoft Edge (Web Speech API support)

### Install dependencies

```bash
npm install

###
```

## 🛠 Tech Choices & Rationale

| Area                   | Technology                      | Why                                                                                |
| :--------------------- | :------------------------------ | :--------------------------------------------------------------------------------- |
| **Framework**          | Next.js 16 + React + TypeScript | Modern production-grade React stack with clean architecture and type safety.       |
| **Styling**            | Tailwind CSS                    | Fast UI development, responsive layout, and animation utilities.                   |
| **State Management**   | Zustand                         | Simple and predictable global state for managing the chat and video state machine. |
| **Speech Recognition** | Web Speech API                  | Free, fast, no backend required, works well in Chrome & Edge.                      |
| **Video Playback**     | Native HTML5 `<video>`          | Maximum control, preloading support, and smooth playback without heavy libraries.  |

---

## 🎥 Video Playback Strategy (Seamlessness)

To avoid black frames, flickering, or loading delays, the app uses a **Dual-Video Layer** system (Layer A and Layer B).

### The "Warm-Swap" Process:

While one video is visible and playing, the next video is:

1.  **Preloaded** in the background.
2.  **Buffered** until the `oncanplay` event fires.
3.  **Prepared** in the hidden video layer.
4.  **Cross-faded** using CSS opacity transitions once ready.

**This ensures:**

- No blank frames or "pop-in."
- No loading spinners.
- No sudden cuts.
- Smooth audio and visual transitions.
- Looping videos (Idle and Listening) stay active without triggering unnecessary state changes.

---

## 🎤 Speech Recognition & Keyword Logic

The app leverages the browser’s **Web Speech API** to handle voice interactions.

- **Activation:** Microphone is activated exactly when the "Listening" video state starts.
- **Real-time:** Both interim and final speech results are supported for instant UI feedback.
- **Persistence:** Recognition automatically restarts if the user pauses or the API times out prematurely.

### Keyword Mapping

When speech is finalized, the transcript is stored in **Zustand** and processed through a keyword router:

| User Input                     | Video Response       |
| :----------------------------- | :------------------- |
| "hello", "hi"                  | **Greeting**         |
| "weather", "today"             | **Weather**          |
| "easter"                       | **Easter Egg**       |
| "bye", "goodbye"               | **Goodbye**          |
| "general", "fine", "thank you" | **General Response** |
| _Speech error / unclear_       | **Fallback**         |

> [!NOTE]  
> The router supports partial matches and is entirely case-insensitive.

---

## ✅ Implemented Features

### Core Requirements

- **Seamless video playback & transitions** (Dual-buffer system).
- **Video state machine** driven by Zustand.
- **Browser speech recognition** integration.
- **Keyword-based video routing**.
- **Silence detection** with automated prompting.
- **Goodbye auto-exit** logic.
- **Fallback and Easter-egg** video paths.

### Stretch Goals Completed

- 🎤 **Microphone pulse/glow** animation during the listening state.
- 📝 **Live transcript display** for real-time user feedback.
- 📱 **Fully responsive layout** for desktop and mobile.
- 🎬 **Cross-fade transitions** between video layers.
- 🎧 **Audio Syncing:** Correct audio management per active video layer.

---

## 🧩 Challenges & Solutions

- **Video flickering / black frames:** Solved by dual-video buffering and switching only after the `oncanplay` event.
- **Audio playing from hidden videos:** Implemented logic to ensure only the visible layer is unmuted; the inactive layer stays silent.
- **Speech recognition stopping unexpectedly:** Added auto-restart logic to keep recognition active while the state machine remains in the "Listening" state.
- **UI jumping when transcript appears:** Reserved layout space in the DOM to prevent layout shifts (CLS).

---

## ⚠ Known Limitations

- **Browser Support:** Web Speech API works best in Chrome & Edge.
- **Hardware:** Speech accuracy is highly dependent on microphone quality.
- **Localization:** Single-language (English) only.
- **Logic:** No backend or AI-generated responses (Static keyword mapping).

---

## 🚀 Future Improvements

- Multilingual speech recognition support.
- Emotion-based video responses (Sentiment analysis).
- AI-driven dialogue (Integration with GPT + TTS + Video).
- Improved lip-sync and procedural animations.
- Native Android / iOS versions.
