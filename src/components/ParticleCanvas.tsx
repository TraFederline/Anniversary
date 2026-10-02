import React, { useEffect, useRef } from "react";

interface ParticleCanvasProps {
  timelineProgress: number; // 0 to 1
  mousePos: { x: number; y: number };
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulseOffset: number;
  type: "dust" | "star" | "sparkle" | "heart";
  color: string;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  timelineProgress,
  mousePos,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const isMobile = width < 768;
    const count = isMobile ? 24 : 55;

    // Palette shifts with timeline progress
    const getParticlePalette = (progress: number) => {
      if (progress < 0.25) {
        return ["rgba(255, 255, 255,", "rgba(220, 225, 255,", "rgba(200, 190, 255,"];
      } else if (progress < 0.6) {
        return ["rgba(255, 240, 220,", "rgba(255, 210, 180,", "rgba(255, 185, 205,"];
      } else if (progress < 0.85) {
        return ["rgba(255, 180, 200,", "rgba(255, 140, 180,", "rgba(240, 190, 255,"];
      } else {
        return ["rgba(255, 225, 200,", "rgba(255, 255, 255,", "rgba(255, 180, 210,"];
      }
    };

    const palette = getParticlePalette(timelineProgress);

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      // Very rare heart: ~3 out of 55 particles
      const isHeart = i < 3;
      const isSparkle = i >= 3 && i < 10;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHeart ? 6 + Math.random() * 4 : Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.35 - 0.1,
        opacity: Math.random() * 0.6 + 0.2,
        baseOpacity: Math.random() * 0.5 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
        type: isHeart ? "heart" : isSparkle ? "sparkle" : "dust",
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    const drawHeart = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      alpha: number
    ) => {
      context.save();
      context.translate(cx, cy);
      context.scale(size / 10, size / 10);
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(-5, -6, -10, 0, 0, 10);
      context.bezierCurveTo(10, 0, 5, -6, 0, 0);
      context.fillStyle = `rgba(255, 160, 185, ${alpha * 0.4})`;
      context.shadowColor = "rgba(255, 150, 180, 0.4)";
      context.shadowBlur = 6;
      context.fill();
      context.restore();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Mouse subtle parallax offset
      const offsetX = (mousePos.x - width / 2) * 0.02;
      const offsetY = (mousePos.y - height / 2) * 0.02;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around borders
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Dynamic pulsing
        const alpha =
          p.baseOpacity +
          Math.sin(tick * p.pulseSpeed + p.pulseOffset) * (p.baseOpacity * 0.5);

        const renderX = p.x + offsetX * (p.size / 2);
        const renderY = p.y + offsetY * (p.size / 2);

        if (p.type === "heart") {
          drawHeart(ctx, renderX, renderY, p.size, alpha);
        } else if (p.type === "sparkle") {
          ctx.save();
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0.01, Math.min(1, alpha))})`;
          ctx.shadowColor = "rgba(255, 230, 200, 0.6)";
          ctx.shadowBlur = 8;
          ctx.fill();

          // Delicate 4-point sparkle ray
          const ray = p.size * 1.8;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(renderX - ray, renderY);
          ctx.lineTo(renderX + ray, renderY);
          ctx.moveTo(renderX, renderY - ray);
          ctx.lineTo(renderX, renderY + ray);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0.01, Math.min(1, alpha))})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [timelineProgress, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-80"
    />
  );
};
