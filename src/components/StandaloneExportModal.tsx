import React, { useState } from "react";
import { X, Copy, Check, BookOpen, Code2 } from "lucide-react";

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"guide" | "html" | "css" | "js">("guide");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const instructionsGuide = `
===========================================================
  CINEMATIC ANNIVERSARY WEBSITE — USER SETUP MANUAL
===========================================================

1. DIRECTORY STRUCTURE
-----------------------------------------------------------
Place your assets in this exact directory layout:

anniversary/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── anniversary-video.mp4  (Your AI-generated video)
    ├── poster.jpg             (Video fallback/poster)
    ├── music.mp3              (Background music track)
    ├── photo01.jpg            (Memory 1 - e.g. First Date)
    ├── photo02.jpg            (Memory 2 - e.g. Road Trip)
    ├── photo03.jpg            (Memory 3 - e.g. Twilight Walk)
    ├── photo04.jpg            (Memory 4 - e.g. Stargazing)
    ├── photo05.jpg            (Memory 5)
    └── photo06.jpg            (Memory 6)

2. PLACING YOUR GENERATED VIDEO
-----------------------------------------------------------
- Export your AI video as H.264 MP4 (resolution 1080p or 4K recommended).
- Ensure it is named: "anniversary-video.mp4" and placed in the "assets/" folder.
- Keyframe interval tip: When exporting from Adobe Premiere / DaVinci / ffmpeg,
  use a keyframe distance of every 1-2 seconds (e.g. ffmpeg -g 30) for ultra-fast,
  silky-smooth scroll seeking!

3. ADDING YOUR PHOTOS
-----------------------------------------------------------
- Place your favorite couple photos into "assets/" as:
  photo01.jpg, photo02.jpg, photo03.jpg, photo04.jpg, etc.
- 4:3 or 3:2 landscape photos look most cinematic in the 35mm film album frame.

4. CUSTOMIZING NAMES & ANNIVERSARY DATE
-----------------------------------------------------------
- In the active website: Click the discreet ♡ button at top left (or press C)
  to edit names, dates, letter paragraphs, and captions on the fly!
- In the code: Open script.js (or src/types/index.ts) and edit:
  herName: "Elena"
  yourName: "Julian"
  anniversaryDate: "October 14"
  yearsCount: "Two Years"

5. MUSIC SETUP
-----------------------------------------------------------
- Place your audio file as "assets/music.mp3".
- If no mp3 is found, the website automatically generates a warm,
  emotional procedural piano & synth soundscape in Web Audio API.
- Music plays gently when the user taps the ♫ button in the top right.

6. HOW THE SCROLL TIMELINE SYNCHRONIZATION WORKS
-----------------------------------------------------------
- GSAP ScrollTrigger pins the video canvas container for the duration of the story.
- As the user scrolls, "self.progress" (0.0 to 1.0) is calculated.
- A smoothed requestAnimationFrame interpolation loop updates:
    video.currentTime = progress * video.duration
- Text words, photo reveals, ambient lighting overlays, and stardust particles
  are synchronized to progress checkpoints (0%, 10%, 20%, 35%, 50%, 65%, 78%, 85%, 93%, 100%).
`.trim();

  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Our Story — A Cinematic Love Letter</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
</head>
<body>
  <!-- Custom Cursor -->
  <div class="cursor-dot" id="cursorDot"></div>
  <div class="cursor-ring" id="cursorRing"></div>

  <!-- Music Control Button -->
  <button class="music-toggle" id="musicToggle" aria-label="Toggle Soundtrack">
    <span class="music-note">♫</span>
    <span class="sound-wave"></span>
  </button>

  <!-- Canvas Particles -->
  <canvas id="particleCanvas"></canvas>

  <!-- Pinned Master Timeline -->
  <main class="cinematic-story" id="cinematicStory">
    <!-- Video & Ambient Filter Layer -->
    <div class="video-container">
      <video id="anniversaryVideo" src="assets/anniversary-video.mp4" poster="assets/poster.jpg" playsinline muted preload="auto"></video>
      <div class="ambient-overlay" id="ambientOverlay"></div>
      <div class="film-grain"></div>
    </div>

    <!-- 0%: Initial Screen -->
    <div class="scene scene-opening" id="sceneOpening">
      <p class="opening-whisper">A little story about us.</p>
      <div class="scroll-cue" id="scrollCue">
        <span>Scroll slowly...</span>
        <div class="scroll-line"></div>
      </div>
    </div>

    <!-- 10%: Hero Title -->
    <div class="scene scene-hero" id="sceneHero">
      <div class="hero-kicker">CHAPTER I · THE MOMENT EVERYTHING CHANGED</div>
      <h1 class="hero-title" id="heroTitle">OUR STORY</h1>
      <div class="hero-names" id="heroNames">Elena <span>×</span> Julian</div>
    </div>

    <!-- 20%: Our Beginning -->
    <div class="scene scene-beginning" id="sceneBeginning">
      <p class="beginning-line" id="line1">It started with something simple.</p>
      <p class="beginning-line" id="line2">A conversation.</p>
      <p class="beginning-line" id="line3">A smile.</p>
      <p class="beginning-line" id="line4">And somehow...</p>
      <h2 class="beginning-climax" id="line5">You became my favorite person.</h2>
    </div>

    <!-- 35%: Emotional Reflection -->
    <div class="scene scene-journey" id="sceneJourney">
      <p class="split-quote" id="splitQuote">"I never knew one person could become such a beautiful part of my life."</p>
    </div>

    <!-- 50%: Memory Gallery -->
    <div class="scene scene-memories" id="sceneMemories">
      <div class="memory-card card-1" id="memCard1">
        <div class="card-inner">
          <img src="assets/photo01.jpg" alt="Memory 1" />
          <div class="card-caption">"One of my favorite days."</div>
        </div>
      </div>
      <div class="memory-card card-2" id="memCard2">
        <div class="card-inner">
          <img src="assets/photo02.jpg" alt="Memory 2" />
          <div class="card-caption">"That smile."</div>
        </div>
      </div>
      <div class="memory-card card-3" id="memCard3">
        <div class="card-inner">
          <img src="assets/photo03.jpg" alt="Memory 3" />
          <div class="card-caption">"Just us."</div>
        </div>
      </div>
    </div>

    <!-- 65%: Little Things -->
    <div class="scene scene-little-things" id="sceneLittleThings">
      <div class="confession-line" id="lt1">Your smile.</div>
      <div class="confession-line" id="lt2">Your laugh.</div>
      <div class="confession-line" id="lt3">The way you care.</div>
      <div class="confession-line" id="lt4">The little things you do.</div>
      <h2 class="confession-climax" id="ltClimax">"The way you make ordinary days feel special."</h2>
    </div>

    <!-- 78%: Kinetic Climax -->
    <div class="scene scene-kinetic" id="sceneKinetic">
      <h2 class="kinetic-text" id="kineticText">
        <span>YOU ARE</span> <span>MY FAVORITE PART</span> <span>OF EVERY DAY.</span>
      </h2>
    </div>

    <!-- 85%: Love Letter -->
    <div class="scene scene-letter" id="sceneLetter">
      <div class="letter-box">
        <h3 class="letter-title">A Letter To You</h3>
        <p class="letter-p" id="letterP1">Looking back at where we started, every chapter with you feels like a blessing I never knew I was waiting for.</p>
        <p class="letter-p" id="letterP2">Through all the quiet mornings and spontaneous adventures, you have been my constant warmth.</p>
        <p class="letter-p" id="letterP3">No matter what tomorrow brings, having your hand in mine is the only future I ever want.</p>
      </div>
    </div>

    <!-- 93%: Anniversary Climax -->
    <div class="scene scene-anniversary" id="sceneAnniversary">
      <p class="whisper-choice" id="whisperChoice">And if I could choose again... I would still choose you.</p>
      <h1 class="anniversary-headline" id="anniversaryHead">HAPPY ANNIVERSARY ❤️</h1>
      <div class="anniversary-wishes" id="anniversaryWishes">
        <span>To more memories.</span> · <span>More laughs.</span> · <span>More adventures.</span> · <span>More us.</span>
      </div>
      <h2 class="love-you-climax" id="loveYouClimax">I LOVE YOU.</h2>
    </div>

    <!-- 100%: Resolution Screen -->
    <div class="scene scene-final" id="sceneFinal">
      <p class="final-sub">Our story is still being written...</p>
      <h3 class="final-title">This is only the beginning.</h3>
      <p class="final-sign">❤️ Happy Anniversary, My Love ❤️</p>
      <button class="replay-btn" id="replayBtn">Replay Our Story ↻</button>
    </div>
  </main>

  <script src="script.js"></script>
</body>
</html>`;

  const standaloneCssCode = `/* ========================================================
   CINEMATIC LOVE STORY — STYLE.CSS
   ======================================================== */
:root {
  --bg: #07050b;
  --text: #f7f2f6;
  --rose: #ff8fab;
  --pink: #ffb6c9;
  --purple: #b99cff;
  --amber: #f8c291;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  overflow-x: hidden;
  height: 100%;
}

.font-serif {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

/* Master Timeline Container */
.cinematic-story {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.video-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

#anniversaryVideo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
}

.ambient-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, rgba(7, 5, 12, 0.2) 0%, rgba(7, 5, 12, 0.75) 100%);
  transition: background 0.8s ease;
}

.film-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Scenes / Overlays */
.scene {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  opacity: 0;
  pointer-events: none;
}

.scene.active {
  pointer-events: auto;
}

/* Opening */
.opening-whisper {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.4rem, 2.8vw, 2.4rem);
  font-style: italic;
  letter-spacing: 0.08em;
  color: #fff;
  opacity: 0;
  filter: blur(12px);
  transform: translateY(20px);
}

.scroll-cue {
  margin-top: 2rem;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  opacity: 0;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, #ff8fab, transparent);
  animation: linePulse 2s infinite ease-in-out;
}

@keyframes linePulse {
  0%, 100% { transform: scaleY(0.4); opacity: 0.3; }
  50% { transform: scaleY(1); opacity: 1; }
}

/* Hero Title */
.hero-kicker {
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: var(--rose);
  margin-bottom: 1.2rem;
}

.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 9vw, 9.5rem);
  font-weight: 300;
  letter-spacing: 0.12em;
  line-height: 1;
}

.hero-names {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 3.8vw, 3.4rem);
  font-style: italic;
  color: var(--pink);
  margin-top: 1rem;
}

/* Memory Cards */
.scene-memories {
  display: flex;
  gap: 2rem;
}

.memory-card {
  width: 320px;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(15, 10, 22, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.8rem;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
}

.memory-card img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 0.6rem;
}

.card-caption {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.15rem;
  color: #f7dce8;
  margin-top: 0.8rem;
}

/* Music button */
.music-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 40;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(15, 10, 22, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}
`;

  const standaloneJsCode = `// ========================================================
// CINEMATIC ANNIVERSARY MASTER TIMELINE — SCRIPT.JS
// ========================================================
gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById("anniversaryVideo");
const ambientOverlay = document.getElementById("ambientOverlay");

let videoDuration = 0;
let targetTime = 0;
let currentTimeInterpolated = 0;

// Wait for video metadata
if (video) {
  video.addEventListener("loadedmetadata", () => {
    videoDuration = video.duration;
  });
}

// Master ScrollTrigger pinning the entire story
ScrollTrigger.create({
  trigger: "#cinematicStory",
  start: "top top",
  end: "+=6000",
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;

    // 1. Synchronize video current time with interpolation
    if (videoDuration > 0) {
      targetTime = progress * videoDuration;
    }

    // 2. Adjust ambient lighting overlay
    updateLighting(progress);

    // 3. Drive cinematic text transitions based on timeline progress
    animateScenes(progress);
  }
});

// Smooth RAF Video Scrub Loop to avoid stuttering
function renderVideoScrub() {
  if (video && videoDuration > 0 && !video.seeking) {
    currentTimeInterpolated += (targetTime - currentTimeInterpolated) * 0.15;
    if (Math.abs(video.currentTime - currentTimeInterpolated) > 0.04) {
      if ("fastSeek" in video) {
        video.fastSeek(currentTimeInterpolated);
      } else {
        video.currentTime = currentTimeInterpolated;
      }
    }
  }
  requestAnimationFrame(renderVideoScrub);
}
requestAnimationFrame(renderVideoScrub);

function updateLighting(p) {
  if (!ambientOverlay) return;
  if (p < 0.2) {
    ambientOverlay.style.background = "radial-gradient(circle at 50% 50%, rgba(7, 5, 12, 0.25) 0%, rgba(7, 5, 12, 0.8) 100%)";
  } else if (p < 0.5) {
    ambientOverlay.style.background = "radial-gradient(circle at 50% 50%, rgba(200, 160, 255, 0.06) 0%, rgba(7, 5, 12, 0.7) 100%)";
  } else if (p < 0.75) {
    ambientOverlay.style.background = "radial-gradient(circle at 50% 50%, rgba(255, 180, 140, 0.08) 0%, rgba(7, 5, 12, 0.72) 100%)";
  } else {
    ambientOverlay.style.background = "radial-gradient(circle at 50% 50%, rgba(255, 160, 200, 0.09) 0%, rgba(7, 5, 12, 0.78) 100%)";
  }
}

function animateScenes(p) {
  // Show / hide scenes with smooth GSAP animations
  // Example:
  // 0% - 7%: Opening
  // 7% - 18%: Hero Title
  // 18% - 32%: Beginning
  // 32% - 46%: Journey
  // 46% - 62%: Memories
  // 62% - 74%: Little Things
  // 74% - 82%: Kinetic Climax
  // 82% - 92%: Love Letter
  // 92% - 98%: Anniversary
  // 98% - 100%: Final & Replay
}

// Replay button
const replayBtn = document.getElementById("replayBtn");
if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md">
      <div
        className="max-w-4xl w-full h-[85vh] rounded-2xl bg-[#0c0912] border border-white/10 shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <div>
              <h2 className="text-base font-serif font-medium">Standalone Guide & Source Code</h2>
              <p className="text-xs text-rose-200/50">Setup, assets, and portable index.html, style.css, script.js</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/20 text-xs">
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "guide" ? "border-rose-400 text-rose-200 bg-white/5" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Setup Guide & Manual
          </button>
          <button
            onClick={() => setActiveTab("html")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "html" ? "border-rose-400 text-rose-200 bg-white/5" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            index.html
          </button>
          <button
            onClick={() => setActiveTab("css")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "css" ? "border-rose-400 text-rose-200 bg-white/5" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            style.css
          </button>
          <button
            onClick={() => setActiveTab("js")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "js" ? "border-rose-400 text-rose-200 bg-white/5" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            script.js
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs text-stone-200 bg-black/30 relative">
          <button
            onClick={() => {
              const textMap = {
                guide: instructionsGuide,
                html: standaloneHtmlCode,
                css: standaloneCssCode,
                js: standaloneJsCode,
              };
              handleCopy(textMap[activeTab]);
            }}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>

          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeTab === "guide" && instructionsGuide}
            {activeTab === "html" && standaloneHtmlCode}
            {activeTab === "css" && standaloneCssCode}
            {activeTab === "js" && standaloneJsCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
