/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Compass, Info, BookOpen, MessageSquare, Menu, X, ShoppingBag, ShieldCheck } from "lucide-react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ currentView, onNavigate, cartCount, onOpenCart }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Início", icon: Compass },
    { id: "wizard", label: "Roteiro Inteligente 🧭", icon: Compass },
    { id: "experiencias", label: "Experiências", icon: Compass },
    { id: "hospedagens", label: "Hospedagens", icon: Compass },
    { id: "destino", label: "Guia de Arraial", icon: Compass },
    { id: "sobre", label: "Sobre Nós", icon: Info },
    { id: "blog", label: "Revista/Blog", icon: BookOpen },
    { id: "contato", label: "Contato", icon: MessageSquare },
  ];

  const isThemeDarkHero = currentView === "home" && !isScrolled;

  const handleLinkClick = (viewId: string) => {
    onNavigate(viewId);
    setIsOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-[#0D1B2A]/10 py-3 shadow-[0_1px_15px_rgba(13,27,42,0.05)]"
          : isThemeDarkHero
          ? "bg-transparent py-5"
          : "bg-white/50 backdrop-blur-md border-b border-[#0D1B2A]/5 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* logo oficial da Guida Trips em HTML/CSS pura */}
          <div 
            id="brand-logo" 
            className="flex flex-col cursor-pointer select-none group"
            onClick={() => handleLinkClick("home")}
          >
            <div className="flex items-baseline mb-0.5">
              <span className={`font-serif text-2xl font-extrabold tracking-tight transition-colors duration-250 ${
                isThemeDarkHero ? "text-[#F4EFE6]" : "text-[#0D1B2A]"
              }`}>
                GUID<span className="relative">A<span className="absolute bottom-0 left-0 w-4 h-[3px] bg-[#E8711A] rounded-full transform rotate-[-12deg] translate-y-[2px]"></span></span>
              </span>
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-[0.2em] ml-1.5 uppercase">
                &mdash; TRIPS &mdash;
              </span>
            </div>
            <span className={`font-sans text-[7px] uppercase tracking-[0.25em] -mt-1 font-semibold transition-colors duration-250 ${
              isThemeDarkHero ? "text-[#F4EFE6]/70" : "text-[#0D1B2A]/70"
            }`}>
              Experiências que conectam
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === "blog" && currentView.startsWith("blog"));
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-4 py-2 font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-250 ${
                    isActive
                      ? "text-[#E8711A]"
                      : isThemeDarkHero
                      ? "text-[#8A96A3] hover:text-[#F4EFE6]"
                      : "text-zinc-500 hover:text-[#0D1B2A]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E8711A] rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Backoffice Button */}
            <button
              onClick={() => handleLinkClick("admin")}
              className={`p-2.5 rounded-full transition-all duration-250 hover:scale-105 ${
                currentView.startsWith("admin")
                  ? "text-[#E8711A]"
                  : isThemeDarkHero
                  ? "text-[#8A96A3] hover:bg-white/5 hover:text-[#F4EFE6]"
                  : "text-zinc-400 hover:bg-zinc-100 hover:text-[#0D1B2A]"
              }`}
              title="Acesso Privado Backoffice"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* Painel do Cliente */}
            <button
              onClick={() => handleLinkClick("cliente")}
              className={`flex items-center gap-1.5 border px-4 py-2.5 rounded-full text-xs font-bold uppercase transition-all duration-300 hover:scale-105 ${
                isThemeDarkHero
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-[#0D1B2A]/20 text-[#0D1B2A] hover:bg-[#0D1B2A]/5"
              }`}
            >
              Área do Cliente
            </button>

            {/* CTA do Whatsapp */}
            <a
              href={`https://wa.me/552299887766`}
              target="_blank"
              referrerPolicy="no-referrer"
              className={`flex items-center gap-1.5 border px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-all duration-300 hover:scale-105 ${
                isThemeDarkHero
                  ? "border-[#E8711A] text-[#F4EFE6] hover:bg-[#E8711A] hover:text-[#0D1B2A]"
                  : "border-[#0D1B2A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white"
              }`}
            >
              CONEXÃO ↗
            </a>
          </div>

          {/* Hamburger Menu & Cart (Mobile) */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Menu Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-full transition-all ${
                isThemeDarkHero ? "text-[#F4EFE6]" : "text-[#0D1B2A]"
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay / Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white/98 backdrop-blur-2xl z-40 flex flex-col justify-between py-6 px-6 border-t border-zinc-100 h-[calc(100vh-60px)] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === "blog" && currentView.startsWith("blog"));
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`flex items-center space-x-4 py-3 border-b border-zinc-100 text-left font-sans text-sm tracking-widest uppercase transition-all ${
                    isActive
                      ? "text-[#E8711A] font-bold border-b-2 border-b-[#E8711A]"
                      : "text-zinc-600 hover:text-[#0D1B2A]"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => handleLinkClick("admin")}
              className={`flex items-center space-x-4 py-3 border-b border-zinc-100 text-left font-sans text-sm tracking-widest uppercase transition-all ${
                currentView.startsWith("admin") ? "text-[#E8711A] font-bold" : "text-zinc-600 hover:text-[#0D1B2A]"
              }`}
            >
              <span>Backoffice</span>
            </button>
            <button
              onClick={() => handleLinkClick("cliente")}
              className={`flex items-center space-x-4 py-3 border-b border-zinc-100 text-left font-sans text-sm tracking-widest uppercase transition-all ${
                currentView.startsWith("cliente") ? "text-[#E8711A] font-bold" : "text-[#0D1B2A] font-bold"
              }`}
            >
              <span>Área do Cliente</span>
            </button>
          </div>

          <div className="flex flex-col space-y-4 mt-8">
            <p className="font-accent text-[10px] text-zinc-400 tracking-widest text-center uppercase">
              EXPERIÊNCIAS QUE CONECTAM
            </p>
            <a
              href={`https://wa.me/552299887766`}
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-full text-center bg-[#0D1B2A] hover:bg-[#E8711A] hover:text-[#0D1B2A] text-white py-3 rounded-sm font-accent text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              FALAR NO WHATSAPP ↗
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
