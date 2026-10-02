import React, { useEffect } from "react";
import { MemoryItem } from "../types";
import { X, Calendar, MapPin } from "lucide-react";

interface MemoryModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ memory, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (memory) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [memory, onClose]);

  if (!memory) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-colors"
          aria-label="Close photo preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-black/40">
          <img
            src={memory.image}
            alt={memory.caption}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-stone-200 font-khmer">
          <div>
            <p className="font-khmer text-lg md:text-2xl text-rose-100 font-medium leading-relaxed">
              « {memory.caption} »
            </p>
            {(memory.location || memory.date) && (
              <div className="flex items-center gap-4 mt-2 text-xs md:text-sm text-rose-200/70 font-khmer">
                {memory.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-300/80" />
                    {memory.location}
                  </span>
                )}
                {memory.location && memory.date && <span>·</span>}
                {memory.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-300/80" />
                    {memory.date}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="text-right text-xs text-rose-300/70 font-khmer">
            អនុស្សាវរីយ៍ភាពយន្ត ៣៥មម
          </div>
        </div>
      </div>
    </div>
  );
};
