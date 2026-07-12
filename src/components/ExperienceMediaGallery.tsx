import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Experience } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ExperienceMediaGalleryProps {
  experience: Experience;
  className?: string;
}

export function getFallbackPhotos(expId: string): string[] {
  switch (expId) {
    case "bate-volta-arraial":
      return [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
      ];
    case "experiencia-gastronomica-mar":
      return [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      ];
    case "passeio-barco-toboagua":
      return [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?auto=format&fit=crop&w=800&q=80"
      ];
    case "passeio-lancha-cabo-frio":
      return [
        "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605281317010-fe5fed93a444?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
      ];
    case "quadriciclo-arraial":
      return [
        "https://images.unsplash.com/photo-1531846802906-ac976e449ee0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1473116763269-25541579ffbe?auto=format&fit=crop&w=800&q=80"
      ];
    case "buggy-arraial-novo":
      return [
        "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"
      ];
    case "mergulho-batismo-novo":
      return [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
      ];
    default:
      return [];
  }
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

    list = getFallbackPhotos(experience.id);

  }

  

  if (list.length === 0) {

    list = ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"];

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
