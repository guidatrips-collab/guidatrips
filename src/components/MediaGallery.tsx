
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from "lucide-react";
import { MediaItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";

interface HasMedia {
  name: string;
  mediaGallery?: MediaItem[];
  photos?: string[];
  category?: string;
}

interface MediaGalleryProps {
  item: HasMedia;
  className?: string;
  onClick?: () => void;
}

export function getMediaPhotos(item: HasMedia): string[] {
  return getMediaPhotosExtended(item).map(p => p.url);
}

export function getMediaPhotosExtended(item: HasMedia): {url: string, originalUrl?: string}[] {
  let list: {url: string, originalUrl?: string}[] = [];
  
  if (item.mediaGallery && item.mediaGallery.length > 0) {
    list = item.mediaGallery
      .filter(m => m.type === "image")
      .map(m => ({ url: m.url, originalUrl: m.originalUrl || m.url }));
  }
  
  if (list.length === 0 && item.photos && item.photos.length > 0) {
    list = item.photos.filter(p => p && p.trim() !== "").map(url => ({ url, originalUrl: url }));
  }
        
  if (list.length === 0) {
    list = [{ url: "https://placehold.co/800x600/e2e8f0/64748b.png?text=Sem+Foto", originalUrl: "https://placehold.co/800x600/e2e8f0/64748b.png?text=Sem+Foto" }];
  }
        
  return list;
}

export default function MediaGallery({ item, className = "", onClick }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const photos = getMediaPhotosExtended(item);
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
        className={`relative overflow-hidden group select-none bg-zinc-900 cursor-pointer ${className}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleMainClick}
      >
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={photos[activeIndex].url}
              alt={`${item.name} - Imagem ${activeIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full object-cover pointer-events-none filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Maximize2 className="w-4 h-4" />
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
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-zinc-800 hover:text-[#E8711A] rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center justify-center active:scale-95 transform -translate-x-4 group-hover:translate-x-0"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-zinc-800 hover:text-[#E8711A] rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center justify-center active:scale-95 transform translate-x-4 group-hover:translate-x-0"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
            
            <div className="absolute top-4 right-4 hidden group-hover:flex">
              {/* Overwritten by Maximize2 above for elegance */}
            </div>
            
            {/* Modern pill indicator at the bottom */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full z-10 border border-white/10">
              {activeIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Portal */}
      {lightboxOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/95 flex flex-col backdrop-blur-xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 z-20 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-left text-white">
               {item.category && (
                 <span className="text-[10px] font-accent text-[#E8711A] font-bold uppercase tracking-widest block mb-1">
                   {item.category}
                 </span>
               )}
               <h3 className="font-serif text-xl sm:text-2xl font-bold">{item.name}</h3>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              className="text-white/60 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div 
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setLightboxOpen(false)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={photos[activeIndex].originalUrl}
                alt={`${item.name} - Imagem ${activeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-2xl"
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
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/80 text-white rounded-full transition-all hidden md:flex cursor-pointer hover:scale-110 active:scale-95 border border-white/10"
                >
                  <ChevronLeft className="w-8 h-8 stroke-[2]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/80 text-white rounded-full transition-all hidden md:flex cursor-pointer hover:scale-110 active:scale-95 border border-white/10"
                >
                  <ChevronRight className="w-8 h-8 stroke-[2]" />
                </button>
              </>
            )}
          </div>
          
          {hasMultiple && (
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
              <div className="flex flex-col items-center gap-4">
                <span className="text-white/60 font-mono text-xs">
                  {activeIndex + 1} de {photos.length}
                </span>
                <div className="flex gap-3 justify-center overflow-x-auto max-w-full px-4 pb-2 snap-x hide-scrollbar">
                  {photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(i);
                      }}
                      className={`relative w-16 sm:w-20 aspect-video rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer snap-center ${
                        i === activeIndex ? "ring-2 ring-[#E8711A] scale-110 z-10" : "opacity-40 hover:opacity-100"
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
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
