import React, { useEffect, useState } from "react";

interface CustomCursorProps {
  mousePos: { x: number; y: number };
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mousePos }) => {
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false);
  const [isHoveringPhoto, setIsHoveringPhoto] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isButton = target.closest("button, a, input, textarea, [role='button']");
      const isPhoto = target.closest(".memory-card, img, [data-cursor='photo']");

      setIsHoveringInteractive(!!isButton);
      setIsHoveringPhoto(!!isPhoto);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center pinpoint */}
      <div
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-white transition-transform duration-75"
        style={{
          transform: `translate3d(${mousePos.x - 3}px, ${mousePos.y - 3}px, 0)`,
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
        }}
      />

      {/* Trailing blurred ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-rose-300/40 transition-all duration-300 ease-out ${
          isHoveringPhoto
            ? "h-16 w-16 -ml-8 -mt-8 bg-rose-500/10 border-rose-200/60 scale-125"
            : isHoveringInteractive
            ? "h-12 w-12 -ml-6 -mt-6 bg-white/10 border-white/70 scale-110"
            : "h-8 w-8 -ml-4 -mt-4 bg-transparent border-white/25"
        }`}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          backdropFilter: isHoveringPhoto ? "blur(2px)" : "none",
        }}
      />
    </div>
  );
};
