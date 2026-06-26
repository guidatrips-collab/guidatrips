/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, Trash2, Calendar, Clock, ArrowLeft, 
  Send, Compass, Heart, MapPin, 
  ChevronDown, ChevronUp, Star, Gift, Coffee, Sparkles, Users, Info, ArrowUpRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { BookingCartItem, Experience, checkSchedulingConflict, getTourScheduleDetails, getBrazilLocalDate, addDaysToBrazilDate } from "../types";

interface RoteiroViewProps {
  cart: BookingCartItem[];
  experiences: Experience[];
  stayDays: number;
  clientName: string;
  clientCity: string;
  whatsappNumber: string;
  onUpdateStayDays: (days: number) => void;
  onRemoveFromCart: (index: number) => void;
  onChangeItemDay: (index: number, day: number) => void;
  onSaveEdit: (index: number, updatedItem: BookingCartItem) => void;
  onAddToCart: (item: BookingCartItem) => void;
  onSetClientName: (name: string) => void;
  onSetClientCity: (city: string) => void;
  onTriggerWhatsapp: () => void;
  onNavigate: (view: string) => void;
  selectedHotelId?: string | null;
  onChangeHotelId?: (id: string | null) => void;
}

export default function RoteiroView({
  cart,
  experiences,
  stayDays,
  clientName,
  clientCity,
  whatsappNumber,
  onUpdateStayDays,
  onRemoveFromCart,
  onChangeItemDay,
  onSaveEdit,
  onAddToCart,
  onSetClientName,
  onSetClientCity,
  onTriggerWhatsapp,
  onNavigate,
  selectedHotelId = null,
  onChangeHotelId
}: RoteiroViewProps) {
  const [expandedIntercuso, setExpandedIntercuso] = useState<Record<string, boolean>>({});
  const [expandedPhotos, setExpandedPhotos] = useState<Record<string, boolean>>({});

  // Guided wizard step states
  const [isStepMode, setIsStepMode] = useState(() => {
    // If some day is empty, start in step mode by default to guide the user.
    // If all days have items, show the complete view directly.
    const hasEmptyDay = Array.from({ length: stayDays }).some((_, i) => {
      const dayNum = i + 1;
      return cart.filter(item => item.dayIndex === dayNum).length === 0;
    });
    return hasEmptyDay;
  });

  const [activeStepDay, setActiveStepDay] = useState<number>(() => {
    const saved = localStorage.getItem("guidatrips_current_planning_day");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= 1 && parsed <= stayDays) {
        return parsed;
      }
    }
    return 1;
  });

  useEffect(() => {
    if (activeStepDay > stayDays) {
      setActiveStepDay(stayDays > 0 ? stayDays : 1);
    }
  }, [stayDays, activeStepDay]);

  const changeStepDay = (dayNum: number) => {
    setActiveStepDay(dayNum);
    localStorage.setItem("guidatrips_current_planning_day", dayNum.toString());
  };

  const handleAddPasseio = (dayNum: number) => {
    localStorage.setItem("guidatrips_current_planning_day", dayNum.toString());
    onNavigate("experiencias");
  };

  // Inline editing state for passengers
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editSchedule, setEditSchedule] = useState("");
  const [editAdults, setEditAdults] = useState(2);
  const [editChildren, setEditChildren] = useState(0);
  const [editInfants, setEditInfants] = useState(0);
  const [editConflictError, setEditConflictError] = useState<string | null>(null);

  // Day Selection Modal for suggestions
  const [showDaySelectionModal, setShowDaySelectionModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<Partial<BookingCartItem> | null>(null);
  const [modalConflictError, setModalConflictError] = useState<string | null>(null);

  useEffect(() => {
    if (!showDaySelectionModal) {
      setModalConflictError(null);
    }
  }, [showDaySelectionModal]);

  const toggleIntercurso = (id: string) => {
    setExpandedIntercuso(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePhotos = (id: string) => {
    setExpandedPhotos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Find conflicts
  const findConflicts = () => {
    const conflictsList: string[] = [];
    for (let i = 0; i < cart.length; i++) {
      for (let j = i + 1; j < cart.length; j++) {
        const conflict = checkSchedulingConflict(cart[i], cart[j], experiences);
        if (conflict.hasConflict && conflict.reason) {
          conflictsList.push(conflict.reason);
        }
      }
    }
    return conflictsList;
  };

  const conflicts = findConflicts();

  // Recommendations logic
  const getRecommendations = () => {
    const bookedIds = new Set(cart.map(item => item.experienceId));
    const recIds = new Set<string>();
    
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (exp && exp.recommendations) {
        exp.recommendations.forEach(rId => {
          if (!bookedIds.has(rId)) {
            recIds.add(rId);
          }
        });
      }
    });

    const recommendedList: Experience[] = [];
    recIds.forEach(id => {
      const found = experiences.find(e => e.id === id);
      if (found) recommendedList.push(found);
    });

    // If empty, suggest some featured ones
    if (recommendedList.length === 0) {
      experiences.filter(e => e.featured && !bookedIds.has(e.id)).forEach(e => recommendedList.push(e));
    }
    
    return recommendedList.slice(0, 3);
  };

  const recommendations = getRecommendations();

  // Helper to determine the pricing and availability of a cart item based on its selected date
  const getCartItemTariff = (exp: Experience, dateStr: string) => {
    const baseAdult = exp.pricing?.adultPrice ?? exp.priceFrom;
    const baseChild = exp.pricing?.childPrice ?? (exp.promotionalPrice || exp.priceFrom) * 0.5;
    const baseBaby = exp.pricing?.babyPrice ?? 0;

    if (!dateStr) {
      return { adultPrice: baseAdult, childPrice: baseChild, babyPrice: baseBaby, isClosed: true, hasNoTariff: true };
    }

    const customData = exp.calendar?.[dateStr];
    if (customData) {
      return {
        adultPrice: customData.adultPrice,
        childPrice: customData.childPrice,
        babyPrice: customData.babyPrice,
        isClosed: customData.status === "closed",
        hasNoTariff: false
      };
    }

    return { adultPrice: baseAdult, childPrice: baseChild, babyPrice: baseBaby, isClosed: true, hasNoTariff: true };
  };

  // Pricing details summary
  const computeTotalCost = () => {
    return cart.reduce((total, item) => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (!exp) return total;
      const tariff = getCartItemTariff(exp, item.date);
      const adultsCost = tariff.adultPrice * (item.adults || 2);
      const kidsCost = tariff.childPrice * (item.children || 0);
      const babiesCost = tariff.babyPrice * (item.infants || 0);
      return total + adultsCost + kidsCost + babiesCost;
    }, 0);
  };

  const totalEstimate = computeTotalCost();
  const hasUnavailableItems = cart.some(item => {
    const exp = experiences.find(e => e.id === item.experienceId);
    if (!exp) return false;
    const tariff = getCartItemTariff(exp, item.date);
    return tariff.isClosed || tariff.hasNoTariff;
  });
  const hasItems = cart.length > 0 || selectedHotelId !== null;

  // Helpler to format date elegantly in Portuguese
  const formatFriendlyDate = (dateString: string) => {
    try {
      if (!dateString) return "";
      const [year, month, day] = dateString.split("-");
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      
      const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ];
      
      const weekday = weekdays[date.getDay()];
      const mText = months[date.getMonth()];
      return `${weekday}, ${Number(day)} de ${mText}`;
    } catch {
      return dateString.split("-").reverse().join("/");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FCFBF9] text-[#0D1B2A] font-sans">
      
      {/* Immersive Frosted Topbar Header with Rounded Details */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-150 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate("experiencias")}
            className="group flex items-center gap-2.5 text-zinc-650 hover:text-[#E8711A] font-medium text-sm transition-all py-2 px-3.5 hover:bg-zinc-100 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-[#E8711A] transition-colors" />
            <span>Voltar para Explorar</span>
          </button>
          
          <div className="flex items-center gap-2 bg-[#E8711A]/8 text-[#E8711A] px-4 py-1.5 rounded-full border border-[#E8711A]/20">
            <span className="w-2 h-2 rounded-full bg-[#E8711A] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase font-accent">
              Roteiro Personalizado Ativo
            </span>
          </div>

          <button
            onClick={() => onNavigate("experiencias")}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#E8711A] hover:bg-[#E8711A]/10 px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Adicionar Mais +
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Editorial Premium Welcome Heading - Well-composed & high contrast */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14 space-y-4">
          <div className="inline-flex items-center justify-center gap-2 bg-[#E8711A]/8 px-4 py-1.5 rounded-full text-[#E8711A]">
            <Heart className="w-4 h-4 fill-[#E8711A]" />
            <span className="font-accent text-[10px] font-extrabold tracking-widest uppercase">Curadoria com Puro Afeto</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#0D1B2A] tracking-tight leading-tight">
            {clientName.trim() ? `O Roteiro dos Seus Sonhos, ${clientName.split(" ")[0]}!` : "O Roteiro dos Seus Sonhos em Arraial"}
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Nós acreditamos em conexões reais. Criamos dias leves, fugindo das multidões do turismo comum para viver Arraial da forma mais bela e sossegada possível. Ajuste abaixo e confirme com nossa equipe local!
          </p>
        </div>

        {!hasItems ? (
          /* Welcoming and Friendly Empty State */
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-14 text-center max-w-xl mx-auto shadow-sm space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-amber-500/5 text-[#E8711A] rounded-full flex items-center justify-center mx-auto border border-[#E8711A]/10">
              <Compass className="w-10 h-10 stroke-[1.5]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D1B2A]">Seu roteiro ainda está em branco</h3>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                Navegue pelas nossas expedições e inclua passeios de barco privativos com petiscos frescos, trilhas de buggy deslumbrantes pelas dunas ou mergulhos mágicos na água límpida.
              </p>
            </div>
            
            <button
              onClick={() => onNavigate("experiencias")}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] font-bold rounded-2xl shadow-md transition-all duration-300 cursor-pointer text-sm"
            >
              Escolher Primeiras Atividades &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: Visual timeline itinerary (7 columns) - HIGHLY VISUAL AND ROUNDED */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Conflict Warnings with pleasant, clean layout */}
              {conflicts.length > 0 && (
                <div className="bg-white border border-zinc-150 rounded-2xl p-5 sm:p-6 shadow-sm">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 text-xs sm:text-sm text-amber-900 space-y-2 leading-relaxed text-left">
                    <div className="font-bold flex items-center gap-2 text-amber-800">
                      <Info className="w-4 h-4 shrink-0 text-amber-600 font-bold animate-bounce" />
                      <span>Sugestão de Organização</span>
                    </div>
                    {conflicts.map((str, idx) => (
                      <div key={idx} className="pl-6 text-zinc-650 text-xs sm:text-sm">{str}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-by-Day Timeline Itinerary */}
              <div className="space-y-6">
                {selectedHotelId && (() => {
                  const hotelData = [
                    {
                      id: "pousada-timoneiro",
                      name: "Pousada do Timoneiro",
                      location: "Praia Grande",
                      rating: 4.9,
                      desc: "Acolhimento tátil excepcional, a poucos metros do pico para ver o pôr do sol nos Anjos.",
                      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                      id: "pousada-caminho-mar",
                      name: "Pousada Caminho do Mar",
                      location: "Praia dos Anjos",
                      rating: 4.8,
                      desc: "Conectividade estratégica de embarque. Perfeito para noites sossegadas ao som de mar.",
                      img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
                    },
                    {
                      id: "ohana-pousada",
                      name: "Ohana Pousada Boutique",
                      location: "Pontal do Atalaia",
                      rating: 5.0,
                      desc: "Erguida nos despenhadeiros míticos com jacuzzi e bar flutuante olhando a imensidão costeira.",
                      img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80"
                    }
                  ].find(h => h.id === selectedHotelId);

                  if (!hotelData) return null;

                  return (
                    <div className="bg-white border-2 border-[#E8711A] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative h-48 md:h-auto min-h-[160px]">
                        <img 
                          src={hotelData.img} 
                          alt={hotelData.name} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-3 left-3 bg-[#E8711A] text-white text-[9px] font-accent tracking-widest uppercase px-2.5 py-1 rounded-sm font-extrabold">
                          🏨 HOSPEDAGEM VINCULADA
                        </span>
                      </div>
                      <div className="p-6 md:w-2/3 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#E8711A] font-bold uppercase tracking-wider font-accent">
                            <span>⭐ {hotelData.rating}</span>
                            <span>•</span>
                            <span>📍 {hotelData.location}</span>
                          </div>
                          <h3 className="font-serif text-xl font-bold text-[#0D1B2A] leading-tight">
                            {hotelData.name}
                          </h3>
                          <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                            {hotelData.desc}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <span className="font-sans text-[11px] text-zinc-500 italic">
                            Benefícios exclusivos Guida Trips inclusos para a sua reserva!
                          </span>
                          <button
                            onClick={() => onChangeHotelId && onChangeHotelId(null)}
                            className="px-3 py-1.5 border border-zinc-200 hover:border-red-200 text-zinc-500 hover:text-red-500 rounded text-[10px] font-accent uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            Remover ×
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Dynamic Day Tabs Selector */}
                {isStepMode ? (
                  <div className="space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFBF9] border border-zinc-150 p-4 sm:p-5 rounded-3xl">
                      <div>
                        <span className="font-accent text-[9px] text-[#E8711A] font-black tracking-widest uppercase block mb-0.5">ROTEIRO PASSO A PASSO</span>
                        <h3 className="font-serif text-base font-bold text-[#0D1B2A]">Dia Ativo: Dia {activeStepDay} de {stayDays}</h3>
                      </div>
                    </div>

                    {/* Premium horizontal scrollable/flexible dynamic tabs */}
                    <div className="flex items-center overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 scrollbar-none">
                      {Array.from({ length: stayDays }).map((_, i) => {
                        const dayNum = i + 1;
                        const isCurrent = activeStepDay === dayNum;
                        const dayItems = cart.filter(item => item.dayIndex === dayNum);
                        const isPlanned = dayItems.length > 0;
                        
                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => changeStepDay(dayNum)}
                            className={`flex-1 min-w-[100px] sm:min-w-[120px] py-3.5 px-4 rounded-2xl font-sans text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border ${
                              isCurrent
                                ? "bg-[#0D1B2A] text-[#FCFBF9] border-[#0D1B2A] shadow-md scale-[1.02]"
                                : isPlanned
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80"
                                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                            }`}
                          >
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-accent font-black leading-none">DIA</span>
                            <span className="text-xl font-black mt-1 leading-none">{dayNum}</span>
                            <span className={`text-[9px] mt-1.5 font-medium leading-none ${isCurrent ? "text-[#E8711A]" : isPlanned ? "text-emerald-600" : "text-zinc-400"}`}>
                              {isPlanned ? "Planejado ✓" : "Livre 🌴"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Info bar for complete view */
                  <div className="bg-[#FCFBF9] border border-zinc-150 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#0D1B2A]">🎉 Roteiro Completo Ativado!</h4>
                      <p className="text-xs text-zinc-500">Você está visualizando o cronograma unificado de todos os dias da sua viagem.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsStepMode(true);
                        setActiveStepDay(1);
                      }}
                      className="px-4 py-2 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-[#FCFBF9] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center shadow-xs"
                    >
                      <span>Voltar para Passo a Passo</span>
                    </button>
                  </div>
                )}

                {Array.from({ length: stayDays })
                  .map((_, idx) => idx + 1)
                  .filter((dayNum) => !isStepMode || activeStepDay === dayNum)
                  .map((dayNum) => {
                    const dayItems = cart.filter(item => item.dayIndex === dayNum);

                    return (
                      <div key={dayNum} className="space-y-6">
                        <div 
                          className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left"
                        >
                      {/* Premium Accent Day Bar */}
                      <div className="bg-[#0D1B2A] text-[#FCFBF9] px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#E8711A] font-extrabold tracking-widest block uppercase font-accent font-black">CRONOGRAMA DO DIA</span>
                          <h3 className="font-serif text-lg sm:text-xl font-bold flex items-baseline gap-2">
                            Dia {dayNum} <span className="font-sans text-xs text-zinc-400 font-normal">({dayItems.length === 0 ? "reservado para relaxar" : `${dayItems.length} atividade`}{dayItems.length > 1 ? "s" : ""})</span>
                          </h3>
                        </div>

                        {dayItems.length === 0 && (
                          <span className="text-xs text-zinc-400 bg-white/5 py-1.5 px-3 rounded-full border border-white/10 font-medium">Praias livres e descanso 🌴</span>
                        )}
                      </div>

                      {/* Day Experiences */}
                      {dayItems.length === 0 ? (
                        isStepMode ? (
                          /* Guided Step empty state with big button */
                          <div className="p-8 sm:p-14 text-center text-zinc-400 font-sans text-sm flex flex-col items-center justify-center gap-4 border-t border-zinc-100 bg-zinc-50/20">
                            <div className="p-4 bg-[#E8711A]/8 text-[#E8711A] rounded-full">
                              <Compass className="w-8 h-8 animate-spin-slow" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-zinc-800 font-bold text-sm sm:text-base">Adicione um passeio para o Dia {dayNum}</p>
                              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                                Escolha uma aventura náutica, um tour de buggy ou mergulho autêntico para preencher este dia de forma extraordinária!
                              </p>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleAddPasseio(dayNum)}
                              className="w-full sm:w-auto px-8 py-4 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-[#FCFBF9] font-accent font-black tracking-widest uppercase rounded-2xl shadow-md transition-all duration-300 cursor-pointer text-xs"
                            >
                              + Adicionar passeio ao Dia {dayNum}
                            </button>
                          </div>
                        ) : (
                          /* Normal view empty state */
                          <div className="p-8 sm:p-12 text-center text-zinc-400 font-sans text-sm flex flex-col items-center justify-center gap-2 border-t border-zinc-100 bg-zinc-50/20">
                            <Coffee className="w-7 h-7 text-zinc-300" />
                            <p className="text-zinc-500 font-medium text-xs sm:text-sm">Nenhuma atividade agendada para este dia.</p>
                            <p className="text-[11px] text-zinc-400">Um ótimo momento para explorar restaurantes tradicionais ou caminhar na areia.</p>
                            <button
                              type="button"
                              onClick={() => handleAddPasseio(dayNum)}
                              className="text-[#E8711A] hover:text-[#0D1B2A] font-semibold text-xs mt-3 inline-flex items-center gap-1.5 bg-[#E8711A]/5 px-4.5 py-2 rounded-full border border-[#E8711A]/10 cursor-pointer hover:bg-[#E8711A]/10 transition-colors"
                            >
                              + Escolher um Passeio para o Dia {dayNum}
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="divide-y divide-zinc-100 bg-white">
                          {dayItems.map((item, localIdx) => {
                            const actualCartIdx = cart.findIndex(c => c.experienceId === item.experienceId && c.date === item.date && c.schedule === item.schedule);
                            const exp = experiences.find(e => e.id === item.experienceId);
                            const isEditing = editingIndex === actualCartIdx;

                            const tariff = exp ? getCartItemTariff(exp, item.date) : null;
                            const isUnavailable = tariff ? (tariff.isClosed || tariff.hasNoTariff) : false;

                            const extimateCosts = (exp && tariff)
                              ? ((tariff.adultPrice * item.adults) + (tariff.childPrice * (item.children || 0)))
                              : 0;

                            const isIntercursoOpen = expandedIntercuso[`${dayNum}-${localIdx}`] !== false; // Pre-expanded for great reading
                            const isPhotosOpen = expandedPhotos[`${dayNum}-${localIdx}`] || false;

                            return (
                              <div key={`${item.experienceId}-${localIdx}`} className="p-5 sm:p-7 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
                                  
                                  {/* Left section: Visual card with photo, delete and day transfer */}
                                  <div className="md:col-span-4 space-y-4">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/50 shadow-inner group">
                                      {exp && exp.photos && exp.photos.length > 0 ? (
                                        <img 
                                          src={exp.photos[0]} 
                                          alt={exp.name} 
                                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xs uppercase text-[#0D1B2A]">Imagem da Orla</div>
                                      )}
                                      
                                      <span className="absolute bottom-3 left-3 bg-[#0D1B2A]/85 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-sm">
                                        ⏱ {exp?.duration || "Duração"}
                                      </span>
                                    </div>

                                    {/* Small actions with high usability - very clean */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                                      <button
                                        onClick={() => onRemoveFromCart(actualCartIdx)}
                                        className="text-red-500 hover:text-red-700 font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-red-50 py-1.5 px-3.5 rounded-full border border-transparent hover:border-red-100 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 shrink-0" /> Excluir do plano
                                      </button>

                                      <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full">
                                        <span className="text-[10px] text-zinc-500 font-medium">Trocar Dia:</span>
                                        <select
                                          value={item.dayIndex}
                                          onChange={(e) => onChangeItemDay(actualCartIdx, parseInt(e.target.value, 10))}
                                          className="text-xs bg-transparent border-none py-0 focus:outline-none font-bold text-[#0D1B2A] cursor-pointer"
                                        >
                                          {Array.from({ length: stayDays }).map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                              Dia {i + 1}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right section: Beautiful experiences card with no technical jargon */}
                                  <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3.5 text-left">
                                      <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0D1B2A] leading-tight">
                                        {exp?.name || "Passeio Selecionado"}
                                      </h4>
                                      
                                      {/* Micro matching badge grid - no messy colors */}
                                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                        <span className="bg-amber-100/60 border border-amber-200/50 text-amber-950 font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                          ⛵ Partida {item.schedule}
                                        </span>
                                        <span className="bg-zinc-100 text-zinc-700 font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                          📆 {formatFriendlyDate(item.date)}
                                        </span>
                                        <span className="bg-[#E8711A]/6 border border-[#E8711A]/10 text-[#E8711A] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                          👤 {item.adults} {item.adults === 1 ? "Ad" : "Ads"} {item.children > 0 && ` • ${item.children} Crianças`}
                                        </span>
                                      </div>

                                      <p className="text-xs sm:text-sm text-zinc-500 italic leading-relaxed border-l-2 border-[#E8711A]/40 pl-3">
                                        "{exp?.shortDescription}"
                                      </p>

                                      {isUnavailable && (
                                        <div className="bg-red-50 border border-red-200/60 p-4 rounded-xl flex items-start gap-2.5 text-left mt-3">
                                          <span className="text-sm shrink-0">⚠️</span>
                                          <div className="space-y-1 text-xs">
                                            <h5 className="font-bold text-red-950 uppercase tracking-wide">Sem Disponibilidade Online nesta Data</h5>
                                            <p className="text-red-900 leading-relaxed">
                                              Não possuímos tarifas cadastradas ou vagas liberadas no site para o dia <strong>{formatFriendlyDate(item.date)}</strong>. Para não perder o passeio, solicite-o diretamente aos nossos atendentes no WhatsApp.
                                            </p>
                                            <a
                                              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                                `Olá! Vi que o passeio *${exp?.name}* não tem tarifas configuradas no site para o dia ${item.date} às ${item.schedule}. Gostaria de verificar disponibilidade manual com vocês.`
                                              )}`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="inline-flex items-center gap-1 font-bold text-xs text-[#E8711A] hover:underline pt-1"
                                            >
                                              Consultar Atendentes no WhatsApp &rarr;
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Humanized collapsible lists - Round, soft and clean */}
                                    <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
                                      
                                      {/* Collapsible 1: stops descriptions and inclusions */}
                                      <div>
                                        <button
                                          type="button"
                                          onClick={() => toggleIntercurso(`${dayNum}-${localIdx}`)}
                                          className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left text-xs font-semibold text-[#0D1B2A] bg-zinc-50 hover:bg-zinc-100 transition-colors"
                                        >
                                          <span className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-[#E8711A]" />
                                            <span>Paradas encantadoras e o que está incluído</span>
                                          </span>
                                          {isIntercursoOpen ? <ChevronUp className="w-4 h-4 text-[#E8711A]" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                        </button>

                                        {isIntercursoOpen && (
                                          <div className="p-4 sm:p-5 text-xs sm:text-sm text-zinc-650 bg-white text-left space-y-3.5 border-t border-zinc-100">
                                            <ul className="space-y-3 list-none">
                                              <li className="flex gap-2.5 items-start">
                                                <span className="w-5 h-5 bg-emerald-50 text-emerald-700 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                                                <span><strong>Sossego garantido:</strong> Nós navegamos em horários alternativos. Assim você curte as águas mais límpidas e as praias calmas, fugindo das grandes embarcações barulhentas da multidão.</span>
                                              </li>
                                              <li className="flex gap-2.5 items-start">
                                                <span className="w-5 h-5 bg-orange-50 text-[#E8711A] shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                                                <span><strong>Drinks & Petiscos cortesia:</strong> Frutas selecionadas cortadinhas na hora, uma deliciosa tábua com frios locais e espumante bem geladinho para comemorar à beira-mar.</span>
                                              </li>
                                              <li className="flex gap-2.5 items-start">
                                                <span className="w-5 h-5 bg-blue-50 text-sky-800 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                                                <span><strong>Apoio especial para fotos:</strong> Nossa dedicada tripulação é mestre em encontrar as melhores luzes e as poses perfeitas para guardar recordações fantásticas de vocês.</span>
                                              </li>
                                            </ul>
                                          </div>
                                        )}
                                      </div>

                                      {/* Collapsible 2: special requests and observations */}
                                      <div>
                                        <button
                                          type="button"
                                          onClick={() => togglePhotos(`${dayNum}-${localIdx}`)}
                                          className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left text-xs font-semibold text-[#0D1B2A] bg-zinc-50 hover:bg-zinc-100 transition-colors"
                                        >
                                          <span className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-[#E8711A]" />
                                            <span>Pedidos especiais, surpresas ou celebrações</span>
                                          </span>
                                          {isPhotosOpen ? <ChevronUp className="w-4 h-4 text-[#E8711A]" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                        </button>

                                        {isPhotosOpen && (
                                          <div className="p-4 sm:p-5 bg-white space-y-3.5 text-left border-t border-zinc-100">
                                            <div className="space-y-2">
                                              <label className="text-xs text-zinc-500 block leading-relaxed font-medium">
                                                Conte para a equipe se houver algum aniversário, se deseja surpreender alguém com flores, ou se prefere uma playlist musical específica:
                                              </label>
                                              <textarea
                                                className="w-full bg-zinc-50 border border-zinc-200 text-sm p-3 rounded-2xl focus:outline-none focus:border-[#E8711A] focus:bg-white resize-none text-[#0D1B2A] transition-colors"
                                                rows={3}
                                                maxLength={300}
                                                placeholder="Ex: É aniversário de casamento de meus pais, se puderem preparar um brinde especial..."
                                                defaultValue={item.observations}
                                                onBlur={(e) => {
                                                  onSaveEdit(actualCartIdx, {
                                                    ...item,
                                                    observations: e.target.value
                                                  });
                                                }}
                                              />
                                              <span className="text-[11px] text-zinc-450 block">Essa observação será incluída automaticamente com carinho no seu bilhete que daremos ao marinheiro no WhatsApp.</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Cost Summary Info & Toggle button */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-zinc-100 text-xs text-left">
                                      <div>
                                        <span className="text-zinc-500 font-medium">Estimado para as pessoas selecionadas: </span>
                                        {isUnavailable ? (
                                          <span className="font-bold text-amber-600 ml-1 bg-amber-50 py-1.5 px-3 rounded-full font-sans text-xs border border-amber-200">
                                            Sob Consulta 💬
                                          </span>
                                        ) : (
                                          <span className="font-bold text-[#0D1B2A] ml-1 bg-zinc-100 py-1.5 px-3 rounded-full font-mono text-sm">
                                            R$ {extimateCosts}
                                          </span>
                                        )}
                                      </div>
                                      
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (editingIndex === actualCartIdx) {
                                            setEditingIndex(null);
                                            setEditConflictError(null);
                                          } else {
                                            setEditingIndex(actualCartIdx);
                                            setEditDate(item.date);
                                            setEditSchedule(item.schedule);
                                            setEditAdults(item.adults);
                                            setEditChildren(item.children || 0);
                                            setEditInfants(item.infants || 0);
                                            setEditConflictError(null);
                                          }
                                        }}
                                        className="text-[#E8711A] hover:bg-[#E8711A]/5 border border-[#E8711A]/20 hover:border-[#E8711A] text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer font-accent self-start sm:self-center"
                                      >
                                        {isEditing ? "Fechar Edição" : "Editar Pessoas ou Horário ✏️"}
                                      </button>
                                    </div>

                                    {/* Friendly Edit Dialog with large tactile buttons */}
                                    {isEditing && (
                                      <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 sm:p-5 space-y-4 text-left animate-fadeIn">
                                        <h5 className="text-xs font-bold text-[#0D1B2A] tracking-wider uppercase block border-b border-zinc-200 pb-2">Ajustar Detalhes do Seu Grupo</h5>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Ajustar Data Desejada *</label>
                                            <input
                                              type="date"
                                              value={editDate}
                                              onChange={(e) => setEditDate(e.target.value)}
                                              className="w-full bg-white border border-zinc-200 text-sm p-3 p-y-2.5 text-zinc-800 rounded-xl focus:ring-1 focus:ring-[#E8711A] focus:outline-none"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Janela de Horário</label>
                                            <select
                                              value={editSchedule}
                                              onChange={(e) => setEditSchedule(e.target.value)}
                                              className="w-full bg-white border border-zinc-200 text-sm p-3 p-y-2.5 text-zinc-800 rounded-xl focus:outline-none cursor-pointer"
                                            >
                                              {exp && exp.schedules && exp.schedules.length > 0 ? (
                                                exp.schedules.map((t) => (
                                                  <option key={t} value={t}>{t}</option>
                                                ))
                                              ) : (
                                                <>
                                                  <option value="08:00">08:00 (Manhã Exclusiva)</option>
                                                  <option value="11:30">11:30 (Horário Intermediário)</option>
                                                  <option value="15:00">15:00 (Romance do Pôr do sol)</option>
                                                </>
                                              )}
                                            </select>
                                          </div>
                                        </div>

                                        {/* Tactile Counter Rows */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                          <div className="flex items-center justify-between sm:flex-col bg-white p-3 rounded-xl border border-zinc-200">
                                            <div className="text-left sm:text-center space-y-0.5">
                                              <span className="text-xs font-bold block text-[#0D1B2A]">Adultos</span>
                                              <span className="text-[10px] text-zinc-400 block font-medium">Inteira</span>
                                            </div>
                                            <div className="flex items-center gap-3.5 mt-2">
                                              <button
                                                type="button"
                                                onClick={() => setEditAdults(Math.max(1, editAdults - 1))}
                                                className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-full border border-zinc-300 flex items-center justify-center text-sm cursor-pointer"
                                              >-</button>
                                              <span className="text-sm font-sans font-bold w-4 text-center">{editAdults}</span>
                                              <button
                                                type="button"
                                                onClick={() => setEditAdults(editAdults + 1)}
                                                className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-full border border-zinc-300 flex items-center justify-center text-sm cursor-pointer"
                                              >+</button>
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between sm:flex-col bg-white p-3 rounded-xl border border-zinc-200">
                                            <div className="text-left sm:text-center space-y-0.5">
                                              <span className="text-xs font-bold block text-[#0D1B2A]">Crianças</span>
                                              <span className="text-[10px] text-zinc-400 block font-medium">Meia Entrada</span>
                                            </div>
                                            <div className="flex items-center gap-3.5 mt-2">
                                              <button
                                                type="button"
                                                onClick={() => setEditChildren(Math.max(0, editChildren - 1))}
                                                className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-full border border-zinc-300 flex items-center justify-center text-sm cursor-pointer"
                                              >-</button>
                                              <span className="text-sm font-sans font-bold w-4 text-center">{editChildren}</span>
                                              <button
                                                type="button"
                                                onClick={() => setEditChildren(editChildren + 1)}
                                                className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-full border border-zinc-300 flex items-center justify-center text-sm cursor-pointer"
                                              >+</button>
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between sm:flex-col p-3 rounded-xl border border-[#E8711A]/20 bg-[#E8711A]/4">
                                            <div className="text-left sm:text-center space-y-0.5">
                                              <span className="text-xs font-bold block text-[#0D1B2A]">Bebês</span>
                                              <span className="text-[10px] text-zinc-400 block font-medium">(Colo) Grátis</span>
                                            </div>
                                            <div className="flex items-center gap-3.5 mt-2">
                                              <button
                                                type="button"
                                                onClick={() => setEditInfants(Math.max(0, editInfants - 1))}
                                                className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-full border border-zinc-300 flex items-center justify-center text-sm cursor-pointer"
                                              >-</button>
                                              <span className="text-sm font-sans font-bold w-4 text-center">{editInfants}</span>
                                              <button
                                                type="button"
                                                onClick={() => setEditInfants(editInfants + 1)}
                                                className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-full border border-zinc-300 flex items-center justify-center text-sm cursor-pointer"
                                              >+</button>
                                            </div>
                                          </div>
                                        </div>

                                        {editConflictError && (
                                          <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-800 rounded-xl font-medium leading-relaxed">
                                            {editConflictError}
                                          </div>
                                        )}

                                        <div className="flex gap-2 justify-end pt-2 text-xs">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingIndex(null);
                                              setEditConflictError(null);
                                            }}
                                            className="px-4 py-2 font-semibold text-zinc-500 bg-white border rounded-xl hover:bg-zinc-50 cursor-pointer"
                                          >Cancelar</button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedItem = {
                                                ...item,
                                                date: editDate,
                                                schedule: editSchedule,
                                                adults: editAdults,
                                                children: editChildren,
                                                infants: editInfants,
                                                people: editAdults + editChildren + editInfants,
                                              };

                                              // Check if this updated item conflicts with any other items
                                              let conflictReason = "";
                                              for (let i = 0; i < cart.length; i++) {
                                                if (i === actualCartIdx) continue;
                                                const conflict = checkSchedulingConflict(updatedItem, cart[i], experiences);
                                                if (conflict.hasConflict && conflict.reason) {
                                                  conflictReason = conflict.reason;
                                                  break;
                                                }
                                              }

                                              if (conflictReason) {
                                                setEditConflictError(conflictReason);
                                                return;
                                              }

                                              onSaveEdit(actualCartIdx, updatedItem);
                                              setEditingIndex(null);
                                              setEditConflictError(null);
                                            }}
                                            className="px-5 py-2 font-bold text-white bg-[#0D1B2A] hover:bg-[#E8711A] hover:text-[#0D1B2A] rounded-xl transition-all cursor-pointer"
                                          >Confirmar Mudanças</button>
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Post-addition CTA Box (only in step-by-step mode when this day has items) */}
                    {isStepMode && dayItems.length > 0 && (
                      <div className="bg-[#FCFBF9] border border-zinc-150 rounded-3xl p-6 shadow-sm text-center space-y-4 animate-fadeIn">
                        <div className="space-y-1">
                          <h4 className="font-serif text-base font-bold text-zinc-800">Dia {dayNum} preenchido com sucesso! 🎉</h4>
                          <p className="text-xs text-zinc-500">Continue construindo sua jornada perfeita dia a dia ou preencha o formulário para finalizar.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          {dayNum < stayDays ? (
                            <button
                              type="button"
                              onClick={() => changeStepDay(dayNum + 1)}
                              className="w-full sm:w-auto px-8 py-4 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white font-accent font-black tracking-widest uppercase rounded-2xl shadow-md transition-all duration-300 cursor-pointer text-xs flex items-center justify-center gap-2 font-bold"
                            >
                              <span>{cart.filter(item => item.dayIndex === dayNum + 1).length > 0 ? `Continuar para o Dia ${dayNum + 1}` : `Escolher passeio para o Dia ${dayNum + 1}`}</span>
                              <span>&rarr;</span>
                            </button>
                          ) : (
                            <div className="text-zinc-500 text-xs font-semibold p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/50">
                              🎉 Roteiro de {stayDays} dias planejado! Preencha seus dados ao lado para finalizar o envio pelo WhatsApp.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RECOMMENDED CROSS SELL - MODERN SLIDER BENTO CARD */}
              {recommendations.length > 0 && (
                <div className="bg-white border border-zinc-150 rounded-3xl p-6 sm:p-8 text-left shadow-sm space-y-6">
                  <div className="space-y-1">
                    <span className="font-accent text-[10px] text-[#E8711A] font-extrabold tracking-widest uppercase block bg-[#E8711A]/8 px-3.5 py-1 rounded-full w-max">
                      💎 Recomendação Prática da Guida
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0D1B2A] pt-1">Quer completar seu dia livre?</h3>
                    <p className="text-xs sm:text-sm text-zinc-500">Adicione estes complementos ideais muito apreciados pelos casais e famílias:</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendations.map((recExp) => (
                      <div 
                        key={recExp.id}
                        className="border border-zinc-200/70 p-4 rounded-2xl bg-zinc-50/50 flex flex-col justify-between space-y-4 hover:border-[#E8711A] hover:bg-white transition-all duration-300"
                      >
                        <div className="space-y-2.5">
                          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-inner border border-zinc-100">
                            <img 
                              src={recExp.photos && recExp.photos.length > 0 ? recExp.photos[0] : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"} 
                              alt={recExp.name} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div>
                            <h4 className="font-sans text-xs font-bold text-[#0D1B2A] line-clamp-1 h-4">{recExp.name}</h4>
                            <span className="text-[11px] text-[#E8711A] font-semibold block mt-1">Sob consulta • R$ {recExp.priceFrom}/pes</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const defaultSchedule = recExp.schedules && recExp.schedules.length > 0 ? recExp.schedules[0] : "08:00";
                            setPendingCartItem({
                              experienceId: recExp.id,
                              schedule: defaultSchedule,
                              adults: 2,
                              children: 0,
                              infants: 0,
                              people: 2,
                              observations: "Adicionado por indicação do roteiro!"
                            });
                            setShowDaySelectionModal(true);
                          }}
                          className="w-full text-center py-2 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] text-[11px] font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          + Incluir no meu Roteiro
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Friendly checkout & concierge validation card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Bespoke high-contrast concierge card */}
              <div className="bg-[#0D1B2A] text-[#FCFBF9] rounded-3xl p-6 sm:p-7 text-left space-y-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8711A]/10 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤝</span>
                  <div className="text-left">
                    <h3 className="font-serif text-lg font-bold text-white">Nossa Experiência é Diferente</h3>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold font-accent">Sem Perrengues ou Mentiras</p>
                  </div>
                </div>
                
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3.5">
                  <p>
                    Somos nativos focados em <strong>conectar pessoas e o mar</strong> sem agitação. Nosso piloto acolhe seu grupo com as seguintes vantagens exclusivas inclusas:
                  </p>
                  
                  <div className="space-y-2.5 pt-1.5 text-xs text-zinc-200">
                    <div className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[#E8711A] shrink-0 font-bold text-[10px]">✓</span>
                      <p><strong>Bebidas deliciosas de cortesia:</strong> Espumante gelado fino, petisquinhos saudáveis e água fresca.</p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[#E8711A] shrink-0 font-bold text-[10px]">✓</span>
                      <p><strong>Cancelamento humanizado:</strong> Sem custos extras caso o tempo não colabore com as marés.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONCIERGE DATA CAPTURE - HIGHLY FRIENDLY AND COMPACT BILLING */}
              <div className="bg-white border border-zinc-150 rounded-3xl p-6 sm:p-7 text-left shadow-sm space-y-6">
                <div className="space-y-1 p-4 bg-[#FBF9F6] rounded-2xl border border-zinc-100">
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">Validar com a Equipe no Cabo</h3>
                  <p className="text-xs text-zinc-500">Nosso marinheiro analisará o roteiro para garantir vagas e embarcações adequadas para seu grupo.</p>
                </div>

                <div className="space-y-4">
                  {/* Name Input - Large and bold */}
                  <div className="space-y-1">
                    <label className="text-xs text-[#0D1B2A] block font-bold">Quem está solicitando? *</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome e sobrenome"
                      value={clientName}
                      onChange={(e) => onSetClientName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-sm text-[#0D1B2A] rounded-2xl focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors h-12"
                    />
                  </div>

                  {/* City Input - Large and bold */}
                  <div className="space-y-1">
                    <label className="text-xs text-[#0D1B2A] block font-bold">De qual cidade você vem? *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Belo Horizonte - MG"
                      value={clientCity}
                      onChange={(e) => onSetClientCity(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-sm text-[#0D1B2A] rounded-2xl focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors h-12"
                    />
                  </div>
                </div>

                {/* Highly readable, humanized price breakdown - Rounded visual ticket */}
                <div className="bg-[#FAF8F5] border border-zinc-200 p-5 rounded-2xl space-y-3.5 text-xs">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Taxas de porto inclusas?</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold text-[10px]">Sim, inclusas no barco</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Frutas frescas & espumante de cortesia:</span>
                    <span className="text-[#E8711A] bg-[#E8711A]/8 px-2.5 py-1 rounded-full font-bold text-[10px]">Sim, cortesia</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Ajuda para fotos e dicas nativas:</span>
                    <span className="text-zinc-700 bg-zinc-150 px-2.5 py-1 rounded-full font-bold text-[10px]">Incluso com carinho</span>
                  </div>

                  <div className="border-t border-dashed border-zinc-200 pt-3.5 flex justify-between items-baseline">
                    <div className="text-left space-y-0.5">
                      <span className="text-zinc-500 block font-semibold">Valor Estimado do Roteiro</span>
                      <span className="text-[10px] text-zinc-400 italic">Preço base dos passeios adicionados</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-[#E8711A]">R$ {totalEstimate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Highlight text notice */}
                {hasUnavailableItems ? (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed font-medium text-left flex gap-2">
                    <span className="text-base shrink-0">⚠️</span>
                    <div>
                      <strong className="text-amber-950 font-bold block mb-1">Solicitação Manual via WhatsApp Necessária</strong>
                      Seu roteiro possui passeios sem tarifas automáticas configuradas para as datas selecionadas.
                      <p className="mt-1 text-zinc-650">
                        Não se preocupe! Ao clicar abaixo para enviar no WhatsApp, nossos atendentes verificarão as vagas e tarifas sob demanda manualmente e retornarão com o orçamento personalizado para você em poucos minutos.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200/50 p-4 text-xs sm:text-sm text-zinc-650 leading-relaxed font-medium text-left flex gap-2">
                    <span className="text-base shrink-0">💡</span>
                    <p>
                      <strong>Como funciona agora:</strong> Nós criaremos um link no seu WhatsApp com as dunas, barcos e horários organizados. O piloto enviará fotos reais do barco preservado para o seu grupo para confirmar sua reserva!
                    </p>
                  </div>
                )}

                {/* Primary CTA Action Button with prominent layout - very rounded */}
                <div className="space-y-3.5">
                  <button
                    onClick={onTriggerWhatsapp}
                    disabled={!clientName.trim() || !clientCity.trim()}
                    className={`w-full py-4 text-center font-bold tracking-wide rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 h-14 cursor-pointer text-sm ${
                      clientName.trim() && clientCity.trim()
                        ? "bg-[#E8711A] hover:bg-[#0D1B2A] text-[#0D1B2A] hover:text-white"
                        : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <Send className="w-4 h-4" /> 
                    <span>Solicitar Esse Plano no WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate("experiencias")}
                    className="w-full text-center text-xs font-bold text-zinc-500 hover:text-[#0D1B2A] tracking-wide py-1.5 cursor-pointer hover:underline"
                  >
                    ← Voltar a escolher passeios
                  </button>
                </div>

                {/* Direct values highlights */}
                <div className="border-t border-zinc-150 pt-4.5 grid grid-cols-2 gap-3.5 text-left text-[11px] text-zinc-450">
                  <div className="flex gap-2 items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Embarcações aprovadas</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Marinheiros formados</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Cancelamento amigável</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Quem vive aqui te guiará</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* Day Selection Modal */}
      <AnimatePresence>
        {showDaySelectionModal && pendingCartItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white border border-zinc-200 rounded-3xl w-full max-w-md p-6 sm:p-7 space-y-5 text-left shadow-2xl relative"
            >
              <div className="space-y-1">
                <span className="font-accent text-[9px] text-[#E8711A] font-black tracking-widest uppercase bg-[#E8711A]/8 px-2.5 py-1 rounded-full">
                  Agendamento do Dia
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#0D1B2A] pt-1.5 leading-snug">
                  Em qual dia da viagem deseja incluir este passeio?
                </h3>
                <p className="text-xs text-zinc-500">
                  Qualquer passeio selecionado respeitará o limite de 1 hora de margem de segurança entre programações:
                </p>
              </div>

              {/* Alert Error Message in Red only after trying to confirm */}
              {modalConflictError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 flex flex-col gap-1.5 leading-relaxed text-left animate-pulse">
                  <div className="font-bold flex items-center gap-1.5 text-red-800">
                    <span className="text-sm">🔴</span>
                    <span>Inclusão Impedida</span>
                  </div>
                  <div className="whitespace-pre-line pl-5 text-red-700 font-medium">
                    {modalConflictError}
                  </div>
                </div>
              )}

              <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                {Array.from({ length: stayDays }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dayItems = cart.filter(item => item.dayIndex === dayNum);
                  const isPlanned = dayItems.length > 0;

                  // Create the temporary item to check for conflicts
                  const computedDate = addDaysToBrazilDate(getBrazilLocalDate(), dayNum);

                  const tempItem: BookingCartItem = {
                    ...pendingCartItem as BookingCartItem,
                    dayIndex: dayNum,
                    date: computedDate,
                  };

                  // Check conflict against existing items of that day
                  let conflictReason = "";
                  for (const existingItem of dayItems) {
                    const conflict = checkSchedulingConflict(tempItem, existingItem, experiences);
                    if (conflict.hasConflict && conflict.reason) {
                      conflictReason = conflict.reason;
                      break;
                    }
                  }

                  const hasConflict = !!conflictReason;

                  return (
                    <div key={dayNum} className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (hasConflict) {
                            setModalConflictError(
                              `Não foi possível adicionar este passeio ao Dia ${dayNum}.\nO horário deste passeio entra em conflito com outro passeio já programado para este mesmo dia.\nEscolha outro dia para continuar.`
                            );
                          } else {
                            onAddToCart(tempItem);
                            setShowDaySelectionModal(false);
                            setPendingCartItem(null);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-3.5 border rounded-xl transition-all duration-250 text-left focus:outline-none cursor-pointer ${
                          hasConflict
                            ? "bg-purple-50/10 border-purple-200/60 hover:bg-purple-50/20 hover:border-purple-300 focus:ring-2 focus:ring-purple-400/30"
                            : "bg-[#FAF8F5] border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/10 hover:shadow-sm focus:ring-2 focus:ring-emerald-500/30"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-serif text-sm font-extrabold text-[#0D1B2A]">
                            Dia {dayNum}
                          </span>
                          <span className="text-[10px] text-zinc-500 block">
                            {isPlanned 
                              ? `${dayItems.length} passeio${dayItems.length > 1 ? "s" : ""} planejado${dayItems.length > 1 ? "s" : ""}` 
                              : "Sem passeios agendados"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasConflict ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-150 px-2.5 py-1 rounded-full">
                              🟣 Atenção
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                              🟢 Disponível
                            </span>
                          )}
                        </div>
                      </button>
                      
                      {hasConflict && (
                        <p className="text-[10px] text-purple-600 font-medium pl-3 pr-1 leading-normal flex items-start gap-1">
                          <span className="shrink-0 text-[10px]">🟣</span>
                          <span>Este passeio não é recomendado para este dia, pois há outro passeio programado em horário conflitante.</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDaySelectionModal(false);
                    setPendingCartItem(null);
                  }}
                  className="w-full py-3 bg-zinc-150 hover:bg-zinc-250 text-[#0D1B2A] font-accent font-black tracking-widest uppercase rounded-xl text-[10px] transition-colors cursor-pointer border border-zinc-200"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
