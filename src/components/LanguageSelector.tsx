import React, { useState, useRef, useEffect } from "react";
import { useLanguage, SupportedLanguage } from "../context/LanguageContext";
import { ChevronDown, Globe } from "lucide-react";

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  shortLabel: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "pt", label: "Português (BR)", shortLabel: "PT", flag: "🇧🇷" },
  { code: "en", label: "English (US)", shortLabel: "EN", flag: "🇺🇸" },
  { code: "es", label: "Español (ES)", shortLabel: "ES", flag: "🇪🇸" }
];

export default function LanguageSelector({ isDarkHero = false }: { isDarkHero?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-accent font-bold transition-all duration-200 border ${
          isDarkHero
            ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
            : "bg-zinc-100 hover:bg-zinc-200 text-[#0D1B2A] border-zinc-200"
        }`}
        title="Alterar Idioma / Change Language / Cambiar Idioma"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="uppercase tracking-wider">{currentOption.shortLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-zinc-100 mb-1 flex items-center gap-1.5 text-[10px] font-accent font-extrabold uppercase text-zinc-400 tracking-wider">
            <Globe className="w-3 h-3 text-[#E8711A]" /> Idioma / Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between font-medium transition-colors ${
                  isSelected
                    ? "bg-[#0D1B2A] text-white font-bold"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <span className="text-[10px] bg-[#E8711A] text-white px-1.5 py-0.5 rounded-full font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
