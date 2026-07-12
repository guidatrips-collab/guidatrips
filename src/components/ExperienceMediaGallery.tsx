import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Experience } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ExperienceMediaGalleryProps {
  experience: Experience;
  className?: string;
}



export function getExperiencePhotos(experience: Experience): string[] {
  let list: string[] = [];
  if (experience.mediaGallery && experience.mediaGallery.length > 0) {
    list = experience.mediaGallery
      .filter(item => item.type === "image")
      .map(item => item.url);
  }
  
  if (list.length === 0 && experience.photos && experience.photos.length > 0) {
    list = experience.photos.filter(p => p && p.trim() !== "");
  }
      
  if (list.length === 0) {
    list = ["https://placehold.co/800x600/e2e8f0/64748b.png?text=Sem+Foto"];
  }
      
  return list;
}

export default function ExperienceMediaGallery({ experience, className = "" }: ExperienceMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);


  const photos = getExperiencePhotos(experience);
  const hasMultiple = photos.length > 1;

  const nextPhoto = () => {
    setActiveIndex(prev => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActiveIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextPhoto();
    } else if (diff < -50) {
      prevPhoto();
    }
    touchStartX.current = null;
  };

  return (
    <div 
      className={`relative overflow-hidden group select-none bg-zinc-100 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Active Photo with motion transition */}
      <div className="w-full h-full relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={photos[activeIndex]}
            alt={`${experience.name} - Imagem ${activeIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Navigation Controls (Visible only if more than 1 image) */}
      {hasMultiple && (
        <>
          {/* Arrow Buttons (Desktop layout - hidden on touch, shown on hover/group-hover) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white text-zinc-800 hover:text-[#E8711A] rounded-full shadow-md cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center active:scale-95"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white text-zinc-800 hover:text-[#E8711A] rounded-full shadow-md cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center active:scale-95"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Discreet indicator (Counter) on top-right */}
          <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[9px] font-accent font-black tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10 select-none uppercase">
            {activeIndex + 1} de {photos.length}
          </span>

          {/* Discrete Dot indicators at the bottom */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                    ? "w-4.5 bg-[#E8711A]" 
                    : "w-1.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Ir para foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
