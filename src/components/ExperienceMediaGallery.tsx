import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Experience } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";

interface ExperienceMediaGalleryProps {
  experience: Experience;
  className?: string;
  onClick?: () => void;
}

export function getExperiencePhotos(experience: Experience): string[] {
  return getExperiencePhotosExtended(experience).map(p => p.url);
}

export function getExperiencePhotosExtended(experience: Experience): {url: string, originalUrl?: string}[] {
  let list: {url: string, originalUrl?: string}[] = [];
  
  if (experience.mediaGallery && experience.mediaGallery.length > 0) {
    list = experience.mediaGallery
      .filter(item => item.type === "image")
      .map(item => ({ url: item.url, originalUrl: item.originalUrl || item.url }));
  }
  
  if (list.length === 0 && experience.photos && experience.photos.length > 0) {
    list = experience.photos.filter(p => p && p.trim() !== "").map(url => ({ url, originalUrl: url }));
  }
        
  if (list.length === 0) {
    list = [{ url: "https://placehold.co/800x600/e2e8f0/64748b.png?text=Sem+Foto", originalUrl: "https://placehold.co/800x600/e2e8f0/64748b.png?text=Sem+Foto" }];
  }
        
  return list;
}

export default function ExperienceMediaGallery({ experience, className = "", onClick }: ExperienceMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const photos = getExperiencePhotosExtended(experience);
  const hasMultiple = photos.length > 1;

  const nextPhoto = () => {
    setActiveIndex(prev => (prev + 1) % photos.length);
  };
  
  const prevPhoto = () => {
    setActiveIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
    if (onClick) onClick();
  };

  return (
    <>
      <div 
        className={`relative overflow-hidden group select-none bg-zinc-100 cursor-pointer ${className}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleMainClick}
      >
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={photos[activeIndex].url}
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
          
          {/* Zoom Indicator */}
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4" />
          </div>
        </div>

        {hasMultiple && (
          <>
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
            
            <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[9px] font-accent font-black tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10 select-none uppercase">
              {activeIndex + 1} de {photos.length}
            </span>
            
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

      {/* Lightbox Portal */}
      {lightboxOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col backdrop-blur-sm">
          <div className="flex justify-between items-center p-4 z-10">
            <span className="text-white/70 font-accent tracking-widest text-xs uppercase font-bold">
              {activeIndex + 1} / {photos.length}
            </span>
            <button 
              onClick={() => setLightboxOpen(false)}
              className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div 
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={photos[activeIndex].originalUrl}
                alt={`${experience.name} - Imagem ${activeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full object-contain pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {hasMultiple && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors hidden md:flex"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors hidden md:flex"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          {hasMultiple && (
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-2 justify-center min-w-max mx-auto">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      i === activeIndex ? "ring-2 ring-[#E8711A] scale-110 z-10" : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={photo.url} 
                      className="w-full h-full object-cover" 
                      alt={`Thumbnail ${i+1}`}
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
