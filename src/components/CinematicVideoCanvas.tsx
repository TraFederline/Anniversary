import React, { useEffect, useRef, useState, useCallback } from "react";

interface CinematicVideoCanvasProps {
  videoSrc: string;
  progress: number; // 0 to 1
  posterSrc?: string;
  onVideoLoaded?: (duration: number) => void;
  onVideoError?: (err: string) => void;
}

export const CinematicVideoCanvas: React.FC<CinematicVideoCanvasProps> = ({
  videoSrc,
  progress,
  posterSrc = "/assets/poster.jpg",
  onVideoLoaded,
  onVideoError,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoAvailable, setVideoAvailable] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const lastTargetTime = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);
  const currentInterpolatedTime = useRef<number>(0);
  const rafId = useRef<number | null>(null);

  // Check if video file actually loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    const handleLoadedMetadata = () => {
      if (!isMounted) return;
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        setVideoAvailable(true);
        if (onVideoLoaded) onVideoLoaded(video.duration);
      }
    };

    const handleCanPlay = () => {
      if (!isMounted) return;
      setVideoAvailable(true);
    };

    const handleError = () => {
      if (!isMounted) return;
      setVideoAvailable(false);
      if (onVideoError) onVideoError("Video file not found or format unsupported. Using cinematic generator.");
    };

    const handleSeeking = () => {
      setIsSeeking(true);
    };

    const handleSeeked = () => {
      setIsSeeking(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);

    // Initial check
    if (video.readyState >= 1 && video.duration > 0) {
      handleLoadedMetadata();
    }

    return () => {
      isMounted = false;
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [videoSrc, onVideoLoaded, onVideoError]);

  // Smooth video scrub RAF loop
  const updateVideoFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || !duration || isNaN(duration)) {
      rafId.current = requestAnimationFrame(updateVideoFrame);
      return;
    }

    // Lerp toward target time for cinematic liquid smoothness
    const target = targetTimeRef.current;
    currentInterpolatedTime.current += (target - currentInterpolatedTime.current) * 0.18;

    const diff = Math.abs(video.currentTime - currentInterpolatedTime.current);

    // Only update if difference exceeds perceptual jitter threshold (~33ms) and not currently locked in seek
    if (diff > 0.035 && !video.seeking) {
      try {
        const timeToSet = Math.max(0, Math.min(duration - 0.01, currentInterpolatedTime.current));
        // Use fastSeek if available on Safari/Firefox/Chrome
        if ("fastSeek" in video && typeof (video as unknown as { fastSeek: (t: number) => void }).fastSeek === "function") {
          (video as unknown as { fastSeek: (t: number) => void }).fastSeek(timeToSet);
        } else {
          video.currentTime = timeToSet;
        }
        lastTargetTime.current = timeToSet;
      } catch {
        // Ignore rapid scrub race conditions
      }
    }

    rafId.current = requestAnimationFrame(updateVideoFrame);
  }, [duration]);

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateVideoFrame);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateVideoFrame]);

  // Sync scroll progress to target video time
  useEffect(() => {
    if (duration > 0) {
      targetTimeRef.current = progress * duration;
    }
  }, [progress, duration]);

  // Procedural Cinematic Canvas Simulation (When no video file is provided yet)
  useEffect(() => {
    if (videoAvailable) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let simRafId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;

    const renderSimulation = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Gradient background responding to progress
      const p = progress;
      const grad = ctx.createRadialGradient(
        width * (0.5 + Math.sin(time * 0.4) * 0.05),
        height * (0.45 + (1 - p) * 0.1),
        width * 0.05,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );

      // Color shifts: Obsidian -> Twilight Violet -> Golden Hour Sunset -> Deep Wine Rose -> Celestial Gold
      if (p < 0.2) {
        grad.addColorStop(0, "rgba(35, 24, 52, 0.95)");
        grad.addColorStop(0.5, "rgba(16, 11, 28, 0.98)");
        grad.addColorStop(1, "rgba(7, 5, 12, 1)");
      } else if (p < 0.5) {
        // Twilight to Golden Dawn
        const ratio = (p - 0.2) / 0.3;
        grad.addColorStop(0, `rgba(${Math.floor(45 + ratio * 70)}, ${Math.floor(25 + ratio * 35)}, ${Math.floor(65 - ratio * 20)}, 0.95)`);
        grad.addColorStop(0.6, "rgba(22, 14, 34, 0.98)");
        grad.addColorStop(1, "rgba(7, 5, 12, 1)");
      } else if (p < 0.75) {
        // Golden Amber & Sunset Glow
        grad.addColorStop(0, "rgba(110, 52, 40, 0.92)");
        grad.addColorStop(0.4, "rgba(65, 24, 38, 0.95)");
        grad.addColorStop(0.8, "rgba(24, 10, 26, 0.98)");
        grad.addColorStop(1, "rgba(7, 5, 12, 1)");
      } else {
        // Ethereal Starlight & Rose Dusk
        grad.addColorStop(0, "rgba(75, 28, 60, 0.92)");
        grad.addColorStop(0.5, "rgba(38, 14, 45, 0.96)");
        grad.addColorStop(1, "rgba(6, 4, 10, 1)");
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Anamorphic horizontal lens flare beam
      const flareY = height * (0.4 + Math.sin(time * 0.5) * 0.04);
      const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
      flareGrad.addColorStop(0, "rgba(255, 190, 215, 0)");
      flareGrad.addColorStop(0.3, "rgba(255, 200, 180, 0.08)");
      flareGrad.addColorStop(0.5, "rgba(255, 240, 220, 0.22)");
      flareGrad.addColorStop(0.7, "rgba(255, 180, 210, 0.08)");
      flareGrad.addColorStop(1, "rgba(255, 190, 215, 0)");

      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, flareY - 14, width, 28);

      // Secondary lens circles (bokeh)
      const bokehPoints = [
        { x: width * 0.35 + Math.cos(time * 0.7) * 20, y: height * 0.35, r: 60, a: 0.04 },
        { x: width * 0.65 - Math.sin(time * 0.6) * 25, y: height * 0.55, r: 90, a: 0.03 },
        { x: width * 0.5 + Math.sin(time * 0.3) * 15, y: height * 0.42, r: 120, a: 0.035 },
      ];

      bokehPoints.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 230, ${b.a})`;
        ctx.fill();
      });

      simRafId = requestAnimationFrame(renderSimulation);
    };

    renderSimulation();

    return () => {
      cancelAnimationFrame(simRafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [videoAvailable, progress]);

  // Lighting overlay calculated from progress
  const getLightingFilter = () => {
    if (progress < 0.15) {
      return "brightness(0.7) contrast(1.15) saturate(0.9)";
    } else if (progress < 0.45) {
      return "brightness(0.85) contrast(1.08) saturate(1.05)";
    } else if (progress < 0.75) {
      return "brightness(0.92) contrast(1.12) saturate(1.15)";
    } else {
      return "brightness(0.88) contrast(1.1) saturate(1.1)";
    }
  };

  return (
    <div className="fixed inset-0 z-0 h-full w-full overflow-hidden bg-[#07050b]">
      {/* Real HTML5 Video element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        playsInline
        muted
        preload="auto"
        className={`h-full w-full object-cover transition-opacity duration-1000 ${
          videoAvailable ? "opacity-90" : "opacity-0 pointer-events-none"
        }`}
        style={{
          filter: getLightingFilter(),
          transform: "scale(1.02)", // Prevents white seam edges during browser repaint
        }}
      />

      {/* Procedural Cinematic Fallback Canvas */}
      {!videoAvailable && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Cinematic Vignette & Ambient Light Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-colors duration-1000"
        style={{
          background:
            progress < 0.25
              ? "radial-gradient(circle at 50% 50%, rgba(7, 5, 12, 0.2) 0%, rgba(7, 5, 12, 0.75) 100%)"
              : progress < 0.6
              ? "radial-gradient(circle at 50% 50%, rgba(255, 180, 160, 0.05) 0%, rgba(7, 5, 12, 0.7) 100%)"
              : progress < 0.85
              ? "radial-gradient(circle at 50% 50%, rgba(255, 140, 180, 0.07) 0%, rgba(7, 5, 12, 0.75) 100%)"
              : "radial-gradient(circle at 50% 50%, rgba(255, 210, 180, 0.08) 0%, rgba(7, 5, 12, 0.8) 100%)",
        }}
      />

      {/* Delicate Film Grain Texture */}
      <div className="film-grain pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-overlay" />
    </div>
  );
};
