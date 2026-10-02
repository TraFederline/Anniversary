// ========================================================
// CINEMATIC ANNIVERSARY MASTER TIMELINE — SCRIPT.JS
// ========================================================

gsap.registerPlugin(ScrollTrigger);

// Elements
const video = document.getElementById("anniversaryVideo");
const ambientOverlay = document.getElementById("ambientOverlay");
const replayBtn = document.getElementById("replayBtn");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const musicToggle = document.getElementById("musicToggle");
const particleCanvas = document.getElementById("particleCanvas");

// State
let videoDuration = 0;
let targetTime = 0;
let currentTimeInterpolated = 0;
let isAudioPlaying = false;
let audioContext = null;

// Initialize Video Duration
if (video) {
  video.addEventListener("loadedmetadata", () => {
    videoDuration = video.duration;
  });
  if (video.readyState >= 1 && video.duration > 0) {
    videoDuration = video.duration;
  }
}

// --------------------------------------------------------
// 1. MASTER SCROLLTRIGGER CONTROLLER
// --------------------------------------------------------
ScrollTrigger.create({
  trigger: ".scroll-track",
  start: "top top",
  end: "bottom bottom",
  scrub: 1.2,
  onUpdate: (self) => {
    const progress = self.progress;

    // A. Sync video target time with scrub
    if (videoDuration > 0) {
      targetTime = progress * videoDuration;
    }

    // B. Dynamically shift ambient lighting overlay
    updateLighting(progress);

    // C. Update scene transforms
    updateScenes(progress);
  },
});

// Smooth RAF Video Scrub Loop to avoid stuttering
function renderVideoScrub() {
  if (video && videoDuration > 0 && !video.seeking) {
    currentTimeInterpolated += (targetTime - currentTimeInterpolated) * 0.16;
    if (Math.abs(video.currentTime - currentTimeInterpolated) > 0.035) {
      const timeToSet = Math.max(0, Math.min(videoDuration - 0.01, currentTimeInterpolated));
      if ("fastSeek" in video) {
        video.fastSeek(timeToSet);
      } else {
        video.currentTime = timeToSet;
      }
    }
  }
  requestAnimationFrame(renderVideoScrub);
}
requestAnimationFrame(renderVideoScrub);

// --------------------------------------------------------
// 2. AMBIENT LIGHTING SYNCHRONIZATION
// --------------------------------------------------------
function updateLighting(p) {
  if (!ambientOverlay) return;
  if (p < 0.2) {
    // Deep Obsidian / Starlight
    ambientOverlay.style.background =
      "radial-gradient(circle at 50% 50%, rgba(7, 5, 12, 0.2) 0%, rgba(7, 5, 12, 0.75) 100%)";
  } else if (p < 0.5) {
    // Twilight Lavender & Blue Hour
    ambientOverlay.style.background =
      "radial-gradient(circle at 50% 50%, rgba(200, 160, 255, 0.06) 0%, rgba(7, 5, 12, 0.7) 100%)";
  } else if (p < 0.75) {
    // Warm Golden Hour Sunset
    ambientOverlay.style.background =
      "radial-gradient(circle at 50% 50%, rgba(255, 180, 140, 0.08) 0%, rgba(7, 5, 12, 0.72) 100%)";
  } else {
    // Intimate Rose Dusk & Champagne
    ambientOverlay.style.background =
      "radial-gradient(circle at 50% 50%, rgba(255, 160, 200, 0.09) 0%, rgba(7, 5, 12, 0.78) 100%)";
  }
}

// --------------------------------------------------------
// 3. SCENE MOTION CHOREOGRAPHY
// --------------------------------------------------------
const scenes = [
  { id: "sceneOpening", enterStart: 0.0, enterEnd: 0.02, exitStart: 0.05, exitEnd: 0.085 },
  { id: "sceneHero", enterStart: 0.08, enterEnd: 0.11, exitStart: 0.155, exitEnd: 0.185 },
  { id: "sceneBeginning", enterStart: 0.185, enterEnd: 0.21, exitStart: 0.295, exitEnd: 0.325 },
  { id: "sceneJourney", enterStart: 0.33, enterEnd: 0.36, exitStart: 0.42, exitEnd: 0.46 },
  { id: "sceneMemories", enterStart: 0.46, enterEnd: 0.49, exitStart: 0.585, exitEnd: 0.625 },
  { id: "sceneLittleThings", enterStart: 0.625, enterEnd: 0.65, exitStart: 0.71, exitEnd: 0.745 },
  { id: "sceneKinetic", enterStart: 0.745, enterEnd: 0.765, exitStart: 0.805, exitEnd: 0.83 },
  { id: "sceneLetter", enterStart: 0.83, enterEnd: 0.85, exitStart: 0.905, exitEnd: 0.93 },
  { id: "sceneAnniversary", enterStart: 0.93, enterEnd: 0.945, exitStart: 0.975, exitEnd: 0.988 },
  { id: "sceneFinal", enterStart: 0.985, enterEnd: 0.995, exitStart: 1.0, exitEnd: 1.0 },
];

function updateScenes(p) {
  scenes.forEach(({ id, enterStart, enterEnd, exitStart, exitEnd }) => {
    const el = document.getElementById(id);
    if (!el) return;

    let opacity = 0;
    let blur = 14;
    let translateY = 30;
    let scale = 0.96;

    if (p >= enterStart && p <= exitEnd) {
      if (p < enterEnd) {
        // Entering
        const ratio = (p - enterStart) / (enterEnd - enterStart);
        opacity = ratio;
        blur = (1 - ratio) * 14;
        translateY = (1 - ratio) * 30;
        scale = 0.96 + ratio * 0.04;
      } else if (p > exitStart) {
        // Exiting
        const exitRatio = (p - exitStart) / (exitEnd - exitStart);
        opacity = 1 - exitRatio;
        blur = exitRatio * 16;
        translateY = -exitRatio * 25;
        scale = 1 + exitRatio * 0.04;
      } else {
        // Fully active
        opacity = 1;
        blur = 0;
        translateY = 0;
        scale = 1;
      }
    }

    el.style.opacity = opacity.toFixed(3);
    el.style.filter = `blur(${blur.toFixed(1)}px)`;
    el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    el.style.visibility = opacity > 0.005 ? "visible" : "hidden";
    el.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
  });
}

// --------------------------------------------------------
// 4. DESKTOP CURSOR
// --------------------------------------------------------
if (cursorDot && cursorRing && !("ontouchstart" in window)) {
  window.addEventListener("mousemove", (e) => {
    cursorDot.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
    cursorRing.style.transform = `translate3d(${e.clientX - 17}px, ${e.clientY - 17}px, 0)`;
  });

  document.querySelectorAll("button, a, .memory-card").forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursorRing.style.width = "50px";
      cursorRing.style.height = "50px";
      cursorRing.style.borderColor = "rgba(255, 143, 171, 0.8)";
      cursorRing.style.transform += " translate(-8px, -8px)";
    });
    target.addEventListener("mouseleave", () => {
      cursorRing.style.width = "34px";
      cursorRing.style.height = "34px";
      cursorRing.style.borderColor = "rgba(255, 255, 255, 0.3)";
    });
  });
}

// --------------------------------------------------------
// 5. REPLAY BUTTON
// --------------------------------------------------------
if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --------------------------------------------------------
// 6. PARTICLE CANVAS
// --------------------------------------------------------
if (particleCanvas) {
  const ctx = particleCanvas.getContext("2d");
  let w = (particleCanvas.width = window.innerWidth);
  let h = (particleCanvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    w = particleCanvas.width = window.innerWidth;
    h = particleCanvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 45; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.3 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
    });
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 220, 235, 0.6)";

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 225, 240, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }
  loop();
}

// --------------------------------------------------------
// 7. MUSIC TOGGLE WITH AUDIO API FALLBACK
// --------------------------------------------------------
if (musicToggle) {
  const bgAudio = new Audio("assets/music.mp3");
  bgAudio.loop = true;

  musicToggle.addEventListener("click", () => {
    if (isAudioPlaying) {
      bgAudio.pause();
      isAudioPlaying = false;
      musicToggle.style.background = "rgba(15, 10, 22, 0.7)";
    } else {
      bgAudio.play().catch(() => {
        // Fallback or muted autoplay policy
      });
      isAudioPlaying = true;
      musicToggle.style.background = "rgba(255, 143, 171, 0.3)";
    }
  });
}
