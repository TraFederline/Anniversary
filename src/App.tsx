/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEFAULT_STORY_CONFIG, StoryConfig, MemoryItem } from "./types";
import { CinematicVideoCanvas } from "./components/CinematicVideoCanvas";
import { ParticleCanvas } from "./components/ParticleCanvas";
import { CustomCursor } from "./components/CustomCursor";
import { StoryCustomizer } from "./components/StoryCustomizer";
import { MemoryModal } from "./components/MemoryModal";
import { StandaloneExportModal } from "./components/StandaloneExportModal";
import { audioManager } from "./utils/audio";
import { Heart, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [config, setConfig] = useState<StoryConfig>(() => {
    const saved = localStorage.getItem("cinematic_anniversary_config_km");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_STORY_CONFIG;
  });

  const [progress, setProgress] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDirectorOpen, setIsDirectorOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.65);
  const [hasStartedScroll, setHasStartedScroll] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);

  // Save config changes to localStorage
  const handleUpdateConfig = (newConfig: StoryConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("cinematic_anniversary_config_km", JSON.stringify(newConfig));
    } catch {
      // Ignore quota
    }
  };

  // Mouse tracker for cursor and particle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Keyboard shortcut: press 'C' to open Director studio, 'M' to toggle music
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "c" || e.key === "C") {
        setIsDirectorOpen((prev) => !prev);
      } else if (e.key === "m" || e.key === "M") {
        handleToggleMusic();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlayingMusic]);

  // Master ScrollTrigger setup
  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);
        if (p > 0.01 && !hasStartedScroll) {
          setHasStartedScroll(true);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [hasStartedScroll]);

  // Music toggle handler
  const handleToggleMusic = async () => {
    const playing = await audioManager.toggle(config.audioSrc);
    setIsPlayingMusic(playing);
  };

  const handleVolumeChange = (vol: number) => {
    setMusicVolume(vol);
    audioManager.setVolume(vol);
  };

  // Replay handler
  const handleReplay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setProgress(0);
  }, []);

  // Jump to specific progress (used by chapters menu)
  const handleJumpToProgress = (targetP: number) => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const maxScroll = track.offsetHeight - window.innerHeight;
    const scrollTarget = maxScroll * targetP;
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  // Cinematic helper functions to compute opacity, blur, and translateY from progress windows
  const getSceneTransform = (
    currentP: number,
    enterStart: number,
    enterEnd: number,
    exitStart: number,
    exitEnd: number
  ) => {
    let opacity = 0;
    let blur = 14;
    let translateY = 30;
    let scale = 0.96;

    if (currentP >= enterStart && currentP <= exitEnd) {
      if (currentP < enterEnd) {
        // Entering phase
        const ratio = (currentP - enterStart) / (enterEnd - enterStart);
        opacity = Math.min(1, Math.max(0, ratio));
        blur = (1 - ratio) * 14;
        translateY = (1 - ratio) * 30;
        scale = 0.96 + ratio * 0.04;
      } else if (currentP > exitStart) {
        // Exiting phase
        const exitRatio = (currentP - exitStart) / (exitEnd - exitStart);
        opacity = Math.max(0, 1 - exitRatio);
        blur = exitRatio * 16;
        translateY = -exitRatio * 25;
        scale = 1 + exitRatio * 0.04;
      } else {
        // Fully active hold phase
        opacity = 1;
        blur = 0;
        translateY = 0;
        scale = 1;
      }
    }

    return {
      opacity,
      filter: `blur(${blur.toFixed(1)}px)`,
      transform: `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
      visibility: (opacity > 0.005 ? "visible" : "hidden") as "visible" | "hidden",
      pointerEvents: (opacity > 0.4 ? "auto" : "none") as "auto" | "none",
    };
  };

  // Split sentence into phrases/words with progressive stagger (preserving whole Khmer words)
  const renderStaggeredWords = (
    text: string,
    currentP: number,
    startP: number,
    endP: number,
    className: string = ""
  ) => {
    const parts = text.split(" ");
    const totalParts = parts.length;

    return (
      <span className={`inline-flex flex-wrap justify-center items-center gap-x-3 gap-y-2 leading-relaxed ${className}`}>
        {parts.map((word, idx) => {
          const wordStart = startP + (idx / totalParts) * (endP - startP) * 0.7;
          const wordEnd = wordStart + ((endP - startP) / totalParts) * 0.8;

          let wordOpacity = 0;
          let wordBlur = 10;
          let wordY = 24;

          if (currentP >= wordStart) {
            const r = Math.min(1, Math.max(0, (currentP - wordStart) / (wordEnd - wordStart)));
            wordOpacity = r;
            wordBlur = (1 - r) * 10;
            wordY = (1 - r) * 24;
          }

          return (
            <span
              key={`${word}-${idx}`}
              className="inline-block whitespace-nowrap transition-transform duration-75"
              style={{
                opacity: wordOpacity,
                filter: `blur(${wordBlur.toFixed(1)}px)`,
                transform: `translate3d(0, ${wordY.toFixed(1)}px, 0)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  };

  // Section 01: Opening scene (0.00 to 0.08)
  const openingStyle = useMemo(
    () => getSceneTransform(progress, 0.0, 0.02, 0.05, 0.085),
    [progress]
  );

  // Section 02: Hero Title (0.08 to 0.18)
  const heroStyle = useMemo(
    () => getSceneTransform(progress, 0.08, 0.11, 0.155, 0.185),
    [progress]
  );

  // Section 03: Our Beginning (0.185 to 0.32)
  const beginningStyle = useMemo(
    () => getSceneTransform(progress, 0.185, 0.21, 0.295, 0.325),
    [progress]
  );

  // Section 04: The Journey Reflection (0.33 to 0.45)
  const journeyStyle = useMemo(
    () => getSceneTransform(progress, 0.33, 0.36, 0.42, 0.46),
    [progress]
  );

  // Section 05: Memories Photo Album (0.46 to 0.62)
  const memoriesStyle = useMemo(
    () => getSceneTransform(progress, 0.46, 0.49, 0.585, 0.625),
    [progress]
  );

  // Section 06: Little Things I Love About You (0.625 to 0.74)
  const littleThingsStyle = useMemo(
    () => getSceneTransform(progress, 0.625, 0.65, 0.71, 0.745),
    [progress]
  );

  // Section 07: Kinetic Typography Climax (0.745 to 0.825)
  const kineticStyle = useMemo(
    () => getSceneTransform(progress, 0.745, 0.765, 0.805, 0.83),
    [progress]
  );

  // Section 08: Love Letter (0.83 to 0.925)
  const letterStyle = useMemo(
    () => getSceneTransform(progress, 0.83, 0.85, 0.905, 0.93),
    [progress]
  );

  // Section 09: Anniversary Reveal (0.93 to 0.985)
  const anniversaryStyle = useMemo(
    () => getSceneTransform(progress, 0.93, 0.945, 0.975, 0.988),
    [progress]
  );

  // Section 10: Final Resolution Screen (0.985 to 1.00)
  const finalStyle = useMemo(
    () => getSceneTransform(progress, 0.985, 0.995, 1.0, 1.0),
    [progress]
  );

  return (
    <div className="relative min-h-screen bg-[#07050b] text-[#f7f2f6] font-khmer selection:bg-rose-500/30 selection:text-rose-100">
      {/* Desktop Custom Cursor */}
      <CustomCursor mousePos={mousePos} />

      {/* Floating Minimal Controls */}
      <div className="fixed top-5 left-5 z-40 flex items-center gap-3">
        {/* Discrete Love Story Menu button */}
        <button
          onClick={() => setIsDirectorOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:border-rose-400/50 hover:bg-rose-500/10 transition-all duration-300 shadow-lg text-xs"
          aria-label="បើកផ្ទាំងគ្រប់គ្រង"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform fill-rose-400/20" />
          <span className="tracking-wide font-medium text-rose-100/90 group-hover:text-white">
            {config.herName} & {config.yourName}
          </span>
          <span className="text-[10px] text-white/40 hidden md:inline ml-1 font-mono">
            [C]
          </span>
        </button>

        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-[11px] font-mono text-stone-300">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </div>

      {/* Music Toggle Floating Control */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={handleToggleMusic}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel transition-all duration-300 text-xs shadow-lg ${
            isPlayingMusic
              ? "border-rose-400/50 text-rose-200 bg-rose-500/15"
              : "border-white/10 text-stone-300 hover:text-white hover:border-white/25"
          }`}
          aria-label="បើក/បិទភ្លេង"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          )}
          <span className="text-[11px] font-medium">
            {isPlayingMusic ? "ភ្លេងអម" : "ចាក់ភ្លេង"}
          </span>
          <span className="text-[9px] text-white/40 hidden md:inline font-mono">
            [M]
          </span>
        </button>
      </div>

      {/* Floating Scroll Cue */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none transition-all duration-700 ${
          hasStartedScroll || progress > 0.03 ? "opacity-0 translate-y-4" : "opacity-90 translate-y-0"
        }`}
      >
        <span className="text-[11px] tracking-wider text-rose-200/80 font-khmer">
          រំកិលចុះក្រោម ដើម្បីទស្សនា
        </span>
        <div className="w-[1px] h-9 bg-gradient-to-b from-rose-300/80 via-rose-400/40 to-transparent animate-pulse" />
      </div>

      {/* Long Scroll Track: The physical height that powers the ScrollTrigger progress */}
      <div ref={scrollTrackRef} className="relative w-full h-[7000px]">
        {/* Pinned Viewport Container */}
        <div
          ref={containerRef}
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        >
          {/* Layer 0: The Master Cinematic Video Canvas */}
          <CinematicVideoCanvas
            videoSrc={config.videoSrc}
            progress={progress}
            posterSrc="/assets/poster.jpg"
          />

          {/* Layer 1: Ambient Dust & Sparkle Particle Engine */}
          <ParticleCanvas timelineProgress={progress} mousePos={mousePos} />

          {/* Layer 2: Master Visual Choreography Scenes */}

          {/* ========================================================
              SCENE 01: 0% — THE THRESHOLD / OPENING
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none"
            style={openingStyle}
          >
            <p className="font-khmer text-2xl md:text-4xl text-white/95 tracking-wide font-light mb-4 leading-relaxed">
              « ដំណើររឿងតូចមួយ អំពីពួកយើង... »
            </p>
            <p className="text-xs md:text-sm tracking-widest text-rose-200/70 font-khmer">
              សូមរំកិលចុះក្រោមយឺតៗ...
            </p>
          </div>

          {/* ========================================================
              SCENE 02: 10% — HERO TITLE CHOREOGRAPHY
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none"
            style={heroStyle}
          >
            <div className="text-xs md:text-sm tracking-wider text-rose-300/90 font-khmer mb-3 md:mb-5">
              {config.heroKicker}
            </div>

            <h1 className="font-khmer-title text-4xl sm:text-6xl md:text-8xl text-white leading-normal drop-shadow-2xl">
              {config.heroTitle}
            </h1>

            <div className="font-khmer text-2xl sm:text-4xl md:text-5xl text-rose-200/95 mt-4 md:mt-6 font-medium">
              <span>{config.herName}</span>
              <span className="mx-3 text-rose-400 font-thin">×</span>
              <span>{config.yourName}</span>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs md:text-sm tracking-widest text-stone-300/80 font-khmer">
              <span>{config.anniversaryDate}</span>
              <span aria-hidden="true">·</span>
              <span>{config.yearsCount}</span>
            </div>
          </div>

          {/* ========================================================
              SCENE 03: 20% — OUR BEGINNING
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-20 z-20 max-w-4xl mx-auto w-full pointer-events-none"
            style={beginningStyle}
          >
            <div className="space-y-4 md:space-y-6 text-left">
              <p
                className="font-khmer text-xl md:text-3xl text-stone-300 transition-all duration-300 leading-relaxed"
                style={{
                  opacity: progress > 0.185 ? Math.min(1, (progress - 0.185) / 0.02) : 0,
                  transform: `translateY(${Math.max(0, (0.205 - progress) * 80)}px)`,
                }}
              >
                {config.beginningLead}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-base md:text-xl font-khmer text-rose-200/90">
                <span
                  style={{
                    opacity: progress > 0.205 ? Math.min(1, (progress - 0.205) / 0.015) : 0,
                  }}
                >
                  {config.beginningSteps[0]}
                </span>
                <span
                  style={{
                    opacity: progress > 0.22 ? Math.min(1, (progress - 0.22) / 0.015) : 0,
                  }}
                >
                  · {config.beginningSteps[1]}
                </span>
                <span
                  style={{
                    opacity: progress > 0.235 ? Math.min(1, (progress - 0.235) / 0.015) : 0,
                  }}
                >
                  · {config.beginningSteps[2]}
                </span>
              </div>

              <h2
                className="font-khmer text-2xl sm:text-4xl md:text-6xl font-normal text-white leading-relaxed mt-6 text-balance"
                style={{
                  opacity: progress > 0.25 ? Math.min(1, (progress - 0.25) / 0.025) : 0,
                  filter: `blur(${Math.max(0, (0.275 - progress) * 200)}px)`,
                  transform: `translateY(${Math.max(0, (0.275 - progress) * 60)}px)`,
                }}
              >
                {config.beginningClimax}
              </h2>
            </div>
          </div>

          {/* ========================================================
              SCENE 04: 35% — THE JOURNEY (WORD-BY-WORD CHOREOGRAPHY)
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none max-w-4xl mx-auto"
            style={journeyStyle}
          >
            <p className="text-xs md:text-sm tracking-wider text-rose-300/80 mb-6 font-khmer">
              ការយល់ចិត្តដ៏ស្ងប់ស្ងាត់
            </p>

            <blockquote className="font-khmer text-2xl sm:text-3xl md:text-4xl text-rose-100 font-light leading-loose text-balance">
              {renderStaggeredWords(config.storyQuote, progress, 0.33, 0.40)}
            </blockquote>
          </div>

          {/* ========================================================
              SCENE 05: 50% — 35mm MEMORY PHOTO ALBUM
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20 max-w-6xl mx-auto w-full"
            style={memoriesStyle}
          >
            <div className="text-center mb-6 pointer-events-none">
              <span className="text-xs md:text-sm tracking-wider text-rose-300/90 font-khmer">
                អនុស្សាវរីយ៍ដក់ជាប់ក្នុងបេះដូង
              </span>
              <h2 className="font-khmer text-xl md:text-3xl text-white font-light mt-1.5 leading-normal">
                ជំពូកជីវិតដែលពួកយើងបានឆ្លងកាត់ជាមួយគ្នា
              </h2>
            </div>

            {/* Gallery grid with 35mm film aesthetic and depth rotation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
              {config.memories.slice(0, 4).map((memory, idx) => {
                const baseRotations = [-2.5, 2, -1.8, 2.8];
                const rot = baseRotations[idx % baseRotations.length];

                return (
                  <div
                    key={memory.id}
                    onClick={() => setSelectedMemory(memory)}
                    className="memory-card group relative cursor-pointer rounded-xl overflow-hidden glass-panel p-2 md:p-3 border border-white/10 hover:border-rose-400/50 transition-all duration-500 hover:scale-105 hover:z-30 shadow-2xl"
                    style={{
                      transform: `rotate(${rot}deg)`,
                    }}
                    data-cursor="photo"
                  >
                    <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-black/40">
                      <img
                        src={memory.image}
                        alt={memory.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>

                    <div className="mt-2.5 px-1 text-left">
                      <p className="font-khmer text-xs md:text-sm text-rose-100 line-clamp-1 group-hover:text-white transition-colors leading-relaxed">
                        {memory.caption}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1 font-khmer">
                        <span>{memory.location || "អនុស្សាវរីយ៍"}</span>
                        <span>{memory.date || ""}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] md:text-xs text-stone-400 mt-4 tracking-wider font-khmer">
              ចុចលើរូបថត ដើម្បីមើលទំហំធំច្បាស់
            </p>
          </div>

          {/* ========================================================
              SCENE 06: 65% — LITTLE THINGS I LOVE ABOUT YOU
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none max-w-4xl mx-auto"
            style={littleThingsStyle}
          >
            <div className="text-xs md:text-sm tracking-wider text-rose-300/90 mb-6 font-khmer">
              {config.littleThingsKicker}
            </div>

            <div className="space-y-4 md:space-y-6">
              {config.littleThings.slice(0, 3).map((item, i) => {
                const itemProgressThreshold = 0.635 + i * 0.025;
                const isRevealed = progress > itemProgressThreshold;
                return (
                  <p
                    key={i}
                    className="font-khmer text-xl sm:text-2xl md:text-3xl text-rose-200/95 transition-all duration-500 font-light leading-relaxed"
                    style={{
                      opacity: isRevealed ? 1 : 0.05,
                      filter: `blur(${isRevealed ? 0 : 8}px)`,
                      transform: `translateY(${isRevealed ? 0 : 15}px)`,
                    }}
                  >
                    {item}
                  </p>
                );
              })}

              <h2
                className="font-khmer text-2xl sm:text-4xl md:text-5xl text-white font-normal mt-8 pt-4 leading-relaxed text-balance"
                style={{
                  opacity: progress > 0.71 ? Math.min(1, (progress - 0.71) / 0.02) : 0,
                  filter: `blur(${Math.max(0, (0.73 - progress) * 200)}px)`,
                  transform: `translateY(${Math.max(0, (0.73 - progress) * 40)}px)`,
                }}
              >
                {config.littleThingsClimax}
              </h2>
            </div>
          </div>

          {/* ========================================================
              SCENE 07: 78% — KINETIC TYPOGRAPHY CLIMAX
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none max-w-5xl mx-auto"
            style={kineticStyle}
          >
            <div className="text-xs md:text-sm tracking-wider text-rose-300 mb-4 font-khmer font-medium">
              {config.kineticKicker}
            </div>

            <h1 className="font-khmer text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-relaxed drop-shadow-2xl">
              <span
                className="block transition-transform duration-100"
                style={{
                  opacity: progress > 0.75 ? Math.min(1, (progress - 0.75) / 0.015) : 0,
                  transform: `scale(${0.92 + Math.min(0.08, (progress - 0.75) * 2)})`,
                }}
              >
                {config.kineticLines[0]}
              </span>
              <span
                className="block text-rose-200 font-normal transition-transform duration-100 my-2"
                style={{
                  opacity: progress > 0.765 ? Math.min(1, (progress - 0.765) / 0.015) : 0,
                }}
              >
                {config.kineticLines[1]}
              </span>
              <span
                className="block text-white transition-transform duration-100"
                style={{
                  opacity: progress > 0.78 ? Math.min(1, (progress - 0.78) / 0.015) : 0,
                  filter: `blur(${Math.max(0, (0.795 - progress) * 200)}px)`,
                }}
              >
                {config.kineticLines[2]}
              </span>
            </h1>
          </div>

          {/* ========================================================
              SCENE 08: 85% — A LETTER TO YOU (INTIMATE SANCTUARY)
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20 max-w-3xl mx-auto w-full pointer-events-none"
            style={letterStyle}
          >
            <div className="w-full glass-panel rounded-2xl p-6 sm:p-10 border border-white/10 shadow-2xl relative">
              <div className="text-center mb-6">
                <span className="text-xs tracking-wider text-rose-300 font-khmer">
                  {config.letterKicker}
                </span>
                <h3 className="font-khmer text-2xl sm:text-3xl md:text-4xl text-rose-100 font-medium mt-1 leading-normal">
                  {config.letterTitle}
                </h3>
              </div>

              <div className="space-y-4 text-stone-200 font-khmer text-sm sm:text-base md:text-lg leading-[1.8] text-left">
                {config.letterParagraphs.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      opacity: progress > 0.84 + i * 0.015 ? 1 : 0.2,
                      filter: `blur(${progress > 0.84 + i * 0.015 ? 0 : 4}px)`,
                      transform: `translateY(${progress > 0.84 + i * 0.015 ? 0 : 10}px)`,
                      transition: "all 0.5s ease",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-khmer text-rose-300/90">
                <span>ស្រឡាញ់អូនជានិច្ច,</span>
                <span className="font-khmer text-base sm:text-lg text-rose-200 font-medium">
                  {config.yourName}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              SCENE 09: 93% — FINAL ANNIVERSARY REVEAL
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none max-w-4xl mx-auto"
            style={anniversaryStyle}
          >
            <p className="font-khmer text-xl sm:text-2xl text-stone-300 mb-4 font-light leading-relaxed">
              {config.finalPhrase}
            </p>

            <h1 className="font-khmer-title text-3xl sm:text-5xl md:text-7xl text-white font-normal leading-normal drop-shadow-2xl">
              {config.anniversaryHeadline}
            </h1>
            <div className="text-4xl md:text-6xl text-rose-400 mt-2">❤️</div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-sm sm:text-lg font-khmer text-rose-200/95">
              {config.wishesPhrases.map((w, i) => (
                <React.Fragment key={i}>
                  <span>{w}</span>
                  {i < config.wishesPhrases.length - 1 && (
                    <span aria-hidden="true" className="text-rose-400">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <h2 className="font-khmer text-3xl sm:text-5xl md:text-7xl font-semibold text-rose-100 tracking-wide mt-8">
              {config.loveYouPhrase}
            </h2>
          </div>

          {/* ========================================================
              SCENE 10: 100% — FINAL RESOLUTION & REPLAY
             ======================================================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-auto max-w-2xl mx-auto"
            style={finalStyle}
          >
            <p className="text-xs md:text-sm tracking-wider text-rose-300/90 mb-3 font-khmer">
              {config.resolutionKicker}
            </p>
            <h2 className="font-khmer text-2xl sm:text-4xl md:text-5xl font-medium text-white leading-normal">
              {config.resolutionTitle}
            </h2>
            <p className="font-khmer text-lg sm:text-2xl text-rose-200 mt-3 font-light leading-relaxed">
              {config.resolutionSubtitle}
            </p>

            <div className="my-8 py-3 px-6 rounded-full glass-panel border border-rose-400/30 text-rose-100 font-khmer text-base md:text-xl">
              {config.resolutionBadge}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleReplay}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-rose-500/25 font-khmer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{config.replayButtonText}</span>
              </button>

              <button
                onClick={() => setIsDirectorOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-full glass-panel hover:bg-white/10 text-stone-200 text-sm transition-all border border-white/15 font-khmer"
              >
                <Sparkles className="w-4 h-4 text-rose-300" />
                <span>កែសម្រួលឈ្មោះ និងអនុស្សាវរីយ៍</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Photo Lightbox Modal */}
      <MemoryModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />

      {/* Director & Customization Drawer */}
      <StoryCustomizer
        isOpen={isDirectorOpen}
        onClose={() => setIsDirectorOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onJumpToProgress={handleJumpToProgress}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        musicVolume={musicVolume}
        onVolumeChange={handleVolumeChange}
        onOpenExportGuide={() => {
          setIsDirectorOpen(false);
          setIsExportOpen(true);
        }}
      />

      {/* Standalone Export & Setup Instructions Modal */}
      <StandaloneExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
