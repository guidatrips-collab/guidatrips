/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Compass, Calendar, Users, MapPin, Check, X, ArrowRight, Share2, Search, Info, Plus } from "lucide-react";
import { Experience, ExperienceCategory, BookingCartItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ExperiencesViewProps {
  experiences: Experience[];
  cart: BookingCartItem[];
  onAddToCart: (item: BookingCartItem) => void;
  onRemoveFromCart: (idx: number) => void;
  onOpenCart: () => void;
  whatsappNumber: string;
}

export default function ExperiencesView({
  experiences,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onOpenCart,
  whatsappNumber
}: ExperiencesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedLocation, setSelectedLocation] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null);

  // Form states inside details modal
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSchedule, setBookingSchedule] = useState("");
  const [bookingAdults, setBookingAdults] = useState<number>(2);
  const [bookingChildren, setBookingChildren] = useState<number>(0);
  const [bookingInfants, setBookingInfants] = useState<number>(0);
  const [bookingObservations, setBookingObservations] = useState("");

  // FAQ open/close state inside modal
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Category list
  const categories = [
    { id: "todos", label: "Todas Categorias" },
    { id: ExperienceCategory.NAUTICO, label: "🚤 Náutico" },
    { id: ExperienceCategory.OFF_ROAD, label: "🚙 Off-Road" },
    { id: ExperienceCategory.CULTURA, label: "🏛️ Cultura" },
    { id: ExperienceCategory.GASTRONOMIA, label: "🍴 Gastronomia" },
    { id: ExperienceCategory.TEMPORADA, label: "🐋 Temporada" },
  ];

  // Dynamically group unique locations with active status
  const availableLocations = [
    { id: "todos", label: "🗺️ Todos os Destinos" },
    ...Array.from(
      new Set(
        experiences
          .filter((exp) => exp.status === "active")
          .map((exp) => exp.location || "Arraial do Cabo")
      )
    ).map((loc) => ({ id: loc, label: `📍 ${loc}` })),
  ];

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = selectedCategory === "todos" || exp.category === selectedCategory;
    const matchesLocation = selectedLocation === "todos" || (exp.location || "Arraial do Cabo") === selectedLocation;
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLocation && matchesSearch && exp.status === "active";
  });

  const handleOpenDetails = (exp: Experience) => {
    setActiveExperience(exp);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setBookingDate(`${yyyy}-${mm}-${dd}`);
    setBookingSchedule(exp.schedules && exp.schedules.length > 0 ? exp.schedules[0] : "08:00");
    setBookingAdults(2);
    setBookingChildren(0);
    setBookingInfants(0);
    setBookingObservations("");
    setOpenFaqIndex(null);
  };

  const handleAddCartItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExperience) return;

    onAddToCart({
      experienceId: activeExperience.id,
      date: bookingDate,
      schedule: bookingSchedule || (activeExperience.schedules && activeExperience.schedules.length > 0 ? activeExperience.schedules[0] : "08:00"),
      adults: bookingAdults,
      children: bookingChildren,
      infants: bookingInfants,
      people: bookingAdults + bookingChildren + bookingInfants,
      observations: bookingObservations,
    });

    // Reset and close
    setActiveExperience(null);
    onOpenCart(); // Automatically open cart drawer to guide user to WhatsApp!
  };

  return (
    <div id="experiences-view" className="py-24 bg-[#0D1B2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* HEADER EXTRAORDINÁRIO */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase">
            Curadoria Exclusiva
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#F4EFE6] tracking-tight leading-tight">
            Cada passeio é o começo de uma história.
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#8A96A3] max-w-lg mx-auto leading-relaxed">
            Navegue pelos filtros de curadoria editorial. Do off-road nas dunas móveis de sal ao mergulho intocado com biólogos marinhos selecionados.
          </p>
        </div>

        {/* INPUT DE PESQUISA & FILTROS DE CATEGORIA */}
        <div className="space-y-6 mb-12 border-b border-white/5 pb-8">
          {/* Linha 1: Destinos */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-accent text-[10px] text-[#8A96A3] uppercase tracking-wider mr-2 font-bold">Destino:</span>
              {availableLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`px-3.5 py-1.5 rounded-sm font-accent text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    selectedLocation === loc.id
                      ? "bg-[#E8711A] text-[#0D1B2A] shadow-sm"
                      : "bg-[#132033] text-[#8A96A3] border border-white/5 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Campo de Busca layout elegante */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8A96A3]" />
              <input
                type="text"
                placeholder="Buscar passeio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#132033] border border-white/5 rounded-sm text-xs text-[#F4EFE6] placeholder-[#8A96A3] focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A]"
              />
            </div>
          </div>

          {/* Linha 2: Categorias */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-accent text-[10px] text-[#8A96A3] uppercase tracking-wider mr-2 font-bold">Categoria:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full font-accent text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#F4EFE6]/95 text-[#0D1B2A]"
                    : "bg-[#132033] text-[#8A96A3] border border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTAGEM DE CARDS */}
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((exp) => (
              <div 
                key={exp.id}
                className="group flex flex-col justify-between bg-[#132033] border border-white/5 rounded-sm overflow-hidden hover:border-[#E8711A] transition-all duration-300 shadow-md h-full"
              >
                {/* Capa com fotos e badges */}
                <div className="relative h-56 overflow-hidden select-none">
                  <img 
                    src={exp.photos[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"} 
                    alt={exp.name} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {/* Badge de destaque de vendas */}
                  {exp.badge && (
                    <span className="absolute top-4 left-4 font-accent text-[9px] font-bold tracking-widest text-[#0D1B2A] bg-[#E8711A] px-2.5 py-1 uppercase rounded-sm shadow-md">
                      {exp.badge === "mais-vendido" && "🔥 MAIS VENDIDO"}
                      {exp.badge === "novidade" && "✨ NOVIDADE"}
                      {exp.badge === "temporada" && "🐋 TEMPORADA"}
                    </span>
                  )}

                  {/* Categoria */}
                  <span className="absolute bottom-4 left-4 font-accent text-[9px] font-bold tracking-widest text-[#E8711A] bg-black/65 px-2 py-0.5 uppercase rounded-sm">
                    {exp.category === "nautico" && "🚤 NÁUTICO"}
                    {exp.category === "off-road" && "🚙 OFF-ROAD"}
                    {exp.category === "cultura" && "🏛️ CULTURA"}
                    {exp.category === "gastronomia" && "🍴 GASTRONOMIA"}
                    {exp.category === "temporada" && "🐋 TEMPORADA"}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#F4EFE6] group-hover:text-[#E8711A] transition-colors leading-snug line-clamp-2">
                      {exp.name}
                    </h3>
                    <p className="font-sans text-xs text-[#8A96A3] mt-2 leading-relaxed line-clamp-3 select-none">
                      {exp.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Linha de Specs em Mono/Accent */}
                    <div className="flex items-center justify-between border-t border-b border-white/5 py-3 font-accent text-[10px] text-[#8A96A3]">
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[#E8711A]">⏱</span> {exp.duration}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 font-bold text-[#F4EFE6]">
                        <span className="text-[#E8711A]">💰</span> R$ {exp.priceFrom}
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0 border-l border-white/5 pl-2 text-[9px] uppercase tracking-wider text-[#E8711A] font-bold">
                        <span>📍</span> {exp.location || "Arraial"}
                      </div>
                    </div>

                    {/* Botão de Ver Detalhes */}
                    <button
                      onClick={() => handleOpenDetails(exp)}
                      className="w-full text-center border border-white/15 hover:border-[#E8711A] p-3 text-xs font-accent font-semibold text-[#F4EFE6] hover:text-[#0D1B2A] hover:bg-[#E8711A] transition-all rounded-sm uppercase tracking-widest cursor-pointer"
                    >
                      Ver Detalhes &rarr;
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#132033]/40 border border-white/5 rounded-sm">
            <p className="font-sans text-xs text-[#8A96A3] mb-4">Nenhuma experiência encontrada nesta categoria.</p>
            <button
              onClick={() => { setSelectedCategory("todos"); setSearchQuery(""); }}
              className="px-6 py-2 bg-transparent border border-[#E8711A] text-[#E8711A] hover:bg-[#E8711A] hover:text-[#0D1B2A] font-accent text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Mostrar todas
            </button>
          </div>
        )}

      </div>

      {/* DETAIL MODAL LIGHTBOX */}
      <AnimatePresence>
        {activeExperience && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              id="details-modal"
              className="bg-white border border-zinc-200/90 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Botão fechar */}
              <button 
                onClick={() => setActiveExperience(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-100 hover:bg-[#E8711A]/10 text-zinc-700 hover:text-[#E8711A] transition-all font-bold text-sm cursor-pointer shadow-xs"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Lado Esquerdo: Imagem / Galeria (7 colunas) */}
                <div className="md:col-span-7 p-6 space-y-6 text-left">
                  <div className="relative h-64 md:h-[350px] overflow-hidden select-none border border-zinc-200">
                    <img 
                      src={activeExperience.photos[0]} 
                      alt={activeExperience.name} 
                      className="w-full h-full object-cover filter brightness-98"
                    />
                    <div className="absolute top-4 left-4 font-accent text-[9px] font-bold tracking-widest text-[#E8711A] bg-white border border-[#E8711A]/20 shadow-xs px-2.5 py-1 uppercase rounded-lg">
                      {activeExperience.category.toUpperCase()}
                    </div>
                  </div>

                  {/* Outras imagens em grid pequeno */}
                  {activeExperience.photos.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 shrink-0">
                      {activeExperience.photos.slice(1).map((pic, i) => (
                        <div key={i} className="h-16 overflow-hidden rounded-sm border border-white/5">
                          <img src={pic} className="w-full h-full object-cover" alt="Galeria" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Descrição em Markdown Formatada */}
                  <div className="space-y-4 border-t border-zinc-200/60 pt-6">
                    <h3 className="font-serif text-lg font-extrabold text-[#0D1B2A]">A Jornada:</h3>
                    <div className="font-sans text-xs sm:text-sm text-zinc-650 leading-relaxed whitespace-pre-line space-y-3">
                      {activeExperience.fullDescription}
                    </div>
                    
                    {/* Itens incluídos / não incluídos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="bg-zinc-50/50 p-5 border border-zinc-200/60 rounded-2xl space-y-3">
                        <span className="font-accent text-[10px] text-[#E8711A] font-black tracking-widest uppercase flex items-center gap-1">
                          ✨ O que Inclui
                        </span>
                        <ul className="space-y-1.5 font-sans text-xs text-zinc-600">
                          {activeExperience.included.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#E8711A] select-none">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-zinc-50/50 p-5 border border-zinc-200/60 rounded-2xl space-y-3">
                        <span className="font-accent text-[10px] text-zinc-500 font-extrabold tracking-widest uppercase flex items-center gap-1">
                          🚫 Não Inclui
                        </span>
                        <ul className="space-y-1.5 font-sans text-xs text-zinc-600">
                          {activeExperience.notIncluded.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-zinc-400 select-none">✕</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Ponto de encontro */}
                    <div className="flex items-start gap-2.5 pt-3 text-xs font-sans text-zinc-600 bg-[#FAF8F5] p-3.5 border border-zinc-200/50 rounded-xl">
                      <MapPin className="w-4 h-4 text-[#E8711A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-[#0D1B2A]">Ponto de encontro:</span> {activeExperience.meetingPoint}
                      </div>
                    </div>

                    {/* FAQ ACCORDION SECTION */}
                    {activeExperience.faqs && activeExperience.faqs.length > 0 && (
                      <div className="border-t border-zinc-200/60 pt-6 space-y-3">
                        <h3 className="font-serif text-lg font-extrabold text-[#0D1B2A] flex items-center gap-1">
                          ❓ Perguntas Frequentes do Passeio
                        </h3>
                        <div className="space-y-2.5">
                          {activeExperience.faqs.map((faq, idx) => {
                            const isFaqOpen = openFaqIndex === idx;
                            return (
                              <div key={idx} className="border border-zinc-200 bg-zinc-50/40 rounded-xl overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => setOpenFaqIndex(isFaqOpen ? null : idx)}
                                  className="w-full p-4 text-left font-serif text-xs sm:text-sm font-bold text-zinc-800 hover:text-[#E8711A] transition-colors flex justify-between items-center bg-white cursor-pointer"
                                >
                                  <span>{faq.question}</span>
                                  <span className="text-zinc-400 text-xs">{isFaqOpen ? "▲" : "▼"}</span>
                                </button>
                                {isFaqOpen && (
                                  <div className="px-4 pb-4 text-xs sm:text-sm text-zinc-650 leading-relaxed border-t border-zinc-150 pt-3 bg-zinc-50/30">
                                    {faq.answer}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* COMPANION INTELLIGENT RECOMMENDATIONS SECTION */}
                    {activeExperience.recommendations && activeExperience.recommendations.length > 0 && (
                      <div className="border-t border-zinc-200/60 pt-6 space-y-3.5">
                        <h3 className="font-serif text-base font-extrabold text-[#0D1B2A]">
                          💡 Quem faz este passeio também costuma amar:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {activeExperience.recommendations.map((recId) => {
                            const recExp = experiences.find(e => e.id === recId);
                            if (!recExp) return null;
                            return (
                              <div 
                                key={recId}
                                onClick={() => handleOpenDetails(recExp)}
                                className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex gap-3 hover:border-[#E8711A] hover:bg-white transition-all cursor-pointer items-center justify-between shadow-xs hover:shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 shrink-0 bg-zinc-200 rounded-xl overflow-hidden border border-zinc-150">
                                    <img src={recExp.photos[0]} alt={recExp.name} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-serif text-xs font-bold text-[#0D1B2A] line-clamp-1">{recExp.name}</h4>
                                    <span className="font-accent text-[9px] text-[#E8711A] font-black">A partir de R$ {recExp.priceFrom}</span>
                                  </div>
                                </div>
                                <span className="text-xs text-[#E8711A] font-bold">&rarr;</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Lado Direito: Formulário de Reserva / Carrinho (5 colunas) */}
                <div className="md:col-span-5 bg-[#FAF8F5] p-6 sm:p-8 border-l border-zinc-200 flex flex-col justify-between text-left rounded-r-3xl">
                  <div className="space-y-6">
                    <div>
                      <span className="font-accent text-[#E8711A] text-[9px] font-extrabold tracking-widest uppercase">Ficha técnica de interesse</span>
                      <h2 className="font-serif text-xl font-black text-[#0D1B2A] mt-2 leading-tight">
                        {activeExperience.name}
                      </h2>
                    </div>

                    <div className="space-y-3 font-sans text-xs text-zinc-650 bg-white p-4.5 rounded-2xl border border-zinc-200 shadow-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                        <span>Preço básico de referência:</span>
                        <span className="font-extrabold text-[#0D1B2A]">R$ {activeExperience.priceFrom} / pessoa</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                        <span>Duração estimada:</span>
                        <span className="font-extrabold text-[#0D1B2A]">{activeExperience.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Lotação de segurança:</span>
                        <span className="font-extrabold text-[#0D1B2A]">até {activeExperience.capacity} pessoas</span>
                      </div>
                    </div>

                    {/* FORM DE FILIAÇÃO DE ROTEIRO */}
                    <form onSubmit={handleAddCartItem} className="space-y-4 border-t border-zinc-200/60 pt-6">
                      
                      {/* Data de preferência */}
                      <div className="space-y-1.5 text-left">
                        <label className="font-accent text-[10px] text-zinc-700 tracking-widest uppercase flex items-center gap-1.5 font-extrabold">
                          <Calendar className="w-3.5 h-3.5 text-[#E8711A]" />
                          Data desejada
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-white border border-zinc-300 p-3 text-xs text-zinc-800 rounded-xl focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A] font-sans shadow-2xs"
                        />
                      </div>

                      {/* Horário (Selected from active available schedules of the experience) */}
                      <div className="space-y-1.5 text-left">
                        <label className="font-accent text-[10px] text-zinc-700 tracking-widest uppercase flex items-center gap-1.5 font-extrabold">
                          <span>⏱</span> Escolha o Horário
                        </label>
                        <select
                          required
                          value={bookingSchedule}
                          onChange={(e) => setBookingSchedule(e.target.value)}
                          className="w-full bg-white border border-zinc-300 p-3 text-xs text-zinc-800 rounded-xl focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A] font-sans shadow-2xs"
                        >
                          {activeExperience.schedules && activeExperience.schedules.length > 0 ? (
                            activeExperience.schedules.map((time) => (
                              <option key={time} value={time} className="bg-white text-zinc-850">
                                {time} {time >= "16:00" ? "(Pôr do sol/Noite)" : "(Manhã/Tarde)"}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="08:00">08:00</option>
                              <option value="11:35">11:35</option>
                              <option value="15:00">15:00</option>
                            </>
                          )}
                        </select>
                      </div>

                      {/* AGE CATEGORIES BLOCK (PRD: ADULTOS, CRIANÇAS, BEBÊS) */}
                      <div className="space-y-3.5 border-y border-zinc-200/60 py-4">
                        <span className="font-accent text-[10px] text-zinc-700 tracking-widest uppercase block mb-1 font-extrabold text-left">
                          👥 Integrantes do Passeio
                        </span>

                        {/* 1. Adultos */}
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-xs font-bold text-zinc-800 block">Adultos</span>
                            <span className="text-[10px] text-zinc-500">Preço regular</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setBookingAdults(Math.max(1, bookingAdults - 1))}
                              className="bg-white border border-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-zinc-700 hover:bg-[#E8711A] hover:text-[#0D1B2A] hover:border-[#E8711A] transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-accent text-xs font-extrabold text-zinc-850">
                              {bookingAdults}
                            </span>
                            <button
                              type="button"
                              onClick={() => setBookingAdults(Math.min(activeExperience.capacity, bookingAdults + 1))}
                              className="bg-white border border-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-zinc-700 hover:bg-[#E8711A] hover:text-[#0D1B2A] hover:border-[#E8711A] transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* 2. Crianças */}
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-xs font-bold text-zinc-800 block">Crianças</span>
                            <span className="text-[10px] text-zinc-500">De 4 a 10 anos (Sugerido 50%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setBookingChildren(Math.max(0, bookingChildren - 1))}
                              className="bg-white border border-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-zinc-700 hover:bg-[#E8711A] hover:text-[#0D1B2A] hover:border-[#E8711A] transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-accent text-xs font-extrabold text-zinc-850">
                              {bookingChildren}
                            </span>
                            <button
                              type="button"
                              onClick={() => setBookingChildren(Math.min(activeExperience.capacity - bookingAdults, bookingChildren + 1))}
                              className="bg-white border border-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-zinc-700 hover:bg-[#E8711A] hover:text-[#0D1B2A] hover:border-[#E8711A] transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* 3. Bebês / Colo */}
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-xs font-bold text-zinc-800 block">Bebês / Colo</span>
                            <span className="text-[10px] text-zinc-500 font-sans">Até 3 anos (Isento)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setBookingInfants(Math.max(0, bookingInfants - 1))}
                              className="bg-white border border-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-zinc-700 hover:bg-[#E8711A] hover:text-[#0D1B2A] hover:border-[#E8711A] transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-accent text-xs font-extrabold text-zinc-850">
                              {bookingInfants}
                            </span>
                            <button
                              type="button"
                              onClick={() => setBookingInfants(Math.min(activeExperience.capacity - (bookingAdults + bookingChildren), bookingInfants + 1))}
                              className="bg-white border border-zinc-300 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-zinc-700 hover:bg-[#E8711A] hover:text-[#0D1B2A] hover:border-[#E8711A] transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total Count Warn */}
                        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                          <span>Total de passageiros:</span>
                          <span className={bookingAdults + bookingChildren + bookingInfants > activeExperience.capacity ? "text-red-500 font-bold" : "text-zinc-800 font-bold"}>
                            {bookingAdults + bookingChildren + bookingInfants} / {activeExperience.capacity} vagas
                          </span>
                        </div>
                      </div>

                      {/* OBSERVATIONS INPUT */}
                      <div className="space-y-1.5 text-left">
                        <label className="font-accent text-[10px] text-zinc-500 tracking-widest uppercase block font-bold">
                          📝 Observações especiais / Alergias / Mimos
                        </label>
                        <textarea
                          placeholder="Ex: Piquenique romântico de aniversário, restrição a queijo azul, ou cadeirinha de bebê..."
                          value={bookingObservations}
                          onChange={(e) => setBookingObservations(e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-zinc-300 p-3.5 text-xs text-zinc-800 focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A] rounded-xl font-sans resize-none shadow-2xs"
                        />
                      </div>

                      {/* ESTIMATED Cost Calculation */}
                      <div className="bg-[#E8711A]/5 p-4 border border-[#E8711A]/15 rounded-2xl space-y-1 mt-6 shadow-2xs">
                        <div className="flex justify-between items-baseline font-sans text-xs">
                          <span className="text-zinc-750 font-medium">Estimativa do Roteiro:</span>
                          <span className="font-extrabold text-xl text-[#E8711A] font-accent">
                            R$ {(activeExperience.priceFrom * bookingAdults) + (activeExperience.priceFrom * 0.5 * bookingChildren)}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                          *Apenas estimativa. Crianças sugerido 50%; bebês isentos. Pagamento acordado no atendimento.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={bookingAdults + bookingChildren + bookingInfants > activeExperience.capacity}
                        className={`w-full py-4 text-xs font-accent font-extrabold tracking-[0.12em] uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          bookingAdults + bookingChildren + bookingInfants > activeExperience.capacity
                            ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                            : "bg-[#E8711A] hover:bg-[#C45E12] text-[#0D1B2A]"
                        }`}
                      >
                        <Plus className="w-4 h-4" /> INCLUIR NO MEU ROTEIRO
                      </button>
                    </form>
                  </div>

                  <p className="font-sans text-[10px] text-zinc-500/80 text-center mt-6 leading-relaxed">
                    A seleção será salva no carrinho para você enviar no WhatsApp simultaneamente de forma agregada!
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
