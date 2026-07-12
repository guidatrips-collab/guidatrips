import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Calendar, MapPin, Users, Check, Trash2, 
  Send, Compass, Heart, ArrowRight, Bed, Coffee, Gift
} from "lucide-react";
import { BookingCartItem, Experience, Accommodation, getBrazilLocalDate, addDaysToBrazilDate } from "../types";
import { PricingEngine } from "../lib/pricingEngine";

interface ClientDashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: BookingCartItem[];
  experiences: Experience[];
  accommodations: Accommodation[];
  stayDays: number;
  clientName: string;
  clientCity: string;
  onSetClientName: (name: string) => void;
  onSetClientCity: (city: string) => void;
  onTriggerWhatsapp: () => void;
  onRemoveFromCart: (index: number) => void;
  selectedHotelId?: string | null;
  arrivalDate: string;
  adults: number;
  children: number;
  destName?: string;
  onChangeItemDay: (index: number, day: number) => void;
  onNavigate: (view: string) => void;
}

export default function ClientDashboardDrawer({
  isOpen, onClose, cart, experiences, accommodations, stayDays,
  clientName, clientCity, onSetClientName, onSetClientCity, onTriggerWhatsapp,
  onRemoveFromCart, selectedHotelId, arrivalDate, adults, children, destName,
  onChangeItemDay, onNavigate
}: ClientDashboardDrawerProps) {
  
  const [activeDayTab, setActiveDayTab] = useState<number | 'all'>('all');
  const [showCheckout, setShowCheckout] = useState(false);

  // Reset checkout view when drawer closes or opens
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setShowCheckout(false), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPax = adults + children;
  const departureDate = arrivalDate ? addDaysToBrazilDate(arrivalDate, stayDays) : "";

  // Calculate pricing
  const pricingResult = PricingEngine.calculate({
    cart,
    experiences,
    selectedAccommodation: accommodations.find(a => a.id === selectedHotelId) || null,
    arrivalDate,
    stayDays,
    guests: { adults, children, infants: 0 },
    selectedRoomId: null
  });
  const { experiencesCost, lodgingCost, lodgingDetail, total: totalCost } = pricingResult;

  const selectedHotel = selectedHotelId ? accommodations.find(a => a.id === selectedHotelId) : null;

  // Format date helper
  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#FCFBF9] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {!showCheckout ? (
              <>
                {/* 1. Dashboard Header (Minha Viagem) */}
                <div className="bg-[#0D1B2A] text-white p-6 sm:p-8 shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8711A] opacity-20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[#E8711A] font-accent text-[10px] font-black tracking-widest uppercase mb-1 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" /> Dashboard da Viagem
                      </span>
                      <h2 className="font-serif text-3xl font-extrabold text-white">Minha Viagem</h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Trip Summary Stats */}
                  <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
                    <div>
                      <span className="block text-[9px] font-accent text-white/50 uppercase tracking-widest mb-1 font-bold">Destino</span>
                      <span className="font-serif text-sm sm:text-base font-bold line-clamp-1">{destName || "Arraial do Cabo"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-accent text-white/50 uppercase tracking-widest mb-1 font-bold">Período</span>
                      <span className="font-serif text-sm sm:text-base font-bold">{formatFriendlyDate(arrivalDate)} a {formatFriendlyDate(departureDate)}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-accent text-white/50 uppercase tracking-widest mb-1 font-bold">Passageiros</span>
                      <span className="font-serif text-sm sm:text-base font-bold">{totalPax} {totalPax === 1 ? 'Pessoa' : 'Pessoas'}</span>
                    </div>
                  </div>
                </div>

                {/* Sticky Days Selector (Premium timeline/slider) */}
                <div className="bg-white border-b border-zinc-200 sticky top-0 z-20 px-6 sm:px-8 py-4 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
                  <button 
                    onClick={() => setActiveDayTab('all')}
                    className={`shrink-0 px-5 py-2.5 rounded-full font-accent text-[10px] font-bold tracking-widest uppercase transition-all ${
                      activeDayTab === 'all' 
                        ? "bg-[#0D1B2A] text-white shadow-md" 
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                    }`}
                  >
                    Visão Geral
                  </button>
                  
                  {Array.from({ length: stayDays }).map((_, i) => {
                    const dayNum = i + 1;
                    return (
                      <button 
                        key={dayNum}
                        onClick={() => setActiveDayTab(dayNum)}
                        className={`shrink-0 px-5 py-2.5 rounded-full font-accent text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 ${
                          activeDayTab === dayNum 
                            ? "bg-[#0D1B2A] text-white shadow-md" 
                            : "bg-white border border-zinc-200 text-zinc-600 hover:border-[#E8711A] hover:text-[#E8711A]"
                        }`}
                      >
                        Dia {dayNum}
                      </button>
                    )
                  })}
                </div>

                {/* Dashboard Content (Days, Hotels, Tours) */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 pb-32">
                  
                  {Array.from({ length: stayDays }).map((_, i) => {
                    const dayNum = i + 1;
                    
                    // Filter if not "all"
                    if (activeDayTab !== 'all' && activeDayTab !== dayNum) return null;

                    const dayItems = cart.filter(c => c.dayIndex === dayNum);
                    const dayDate = addDaysToBrazilDate(arrivalDate, i);

                    return (
                      <div key={dayNum} className="relative">
                        {/* Day Header */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="bg-[#E8711A]/10 text-[#E8711A] w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-accent font-black tracking-wider uppercase leading-none">Dia</span>
                            <span className="font-serif text-xl font-bold leading-none mt-0.5">{dayNum}</span>
                          </div>
                          <div>
                            <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">
                              {formatFriendlyDate(dayDate)}
                            </h3>
                            <p className="text-xs text-zinc-500 font-medium">Programação do dia</p>
                          </div>
                          <div className="h-px bg-zinc-200 flex-1 ml-2"></div>
                        </div>

                        <div className="pl-6 space-y-5 relative before:absolute before:inset-y-0 before:left-[23px] before:w-px before:bg-zinc-200 before:-z-10">
                          
                          {/* Hospedagem Node */}
                          {selectedHotel && (
                            <div className="relative">
                              <div className="absolute left-[-27px] top-4 w-2 h-2 rounded-full bg-[#0D1B2A] border-2 border-[#FCFBF9]"></div>
                              <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex gap-4 overflow-hidden group hover:border-[#0D1B2A] transition-all">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                                  <img 
                                    src={selectedHotel.photos?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80"} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Hotel" 
                                  />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <span className="flex items-center gap-1 text-[9px] font-accent font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                    <Bed className="w-3 h-3" /> Hospedagem
                                  </span>
                                  <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">{selectedHotel.name}</h4>
                                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{selectedHotel.description}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tours Node */}
                          {dayItems.length > 0 ? (
                            dayItems.map((item, idx) => {
                              const exp = experiences.find(e => e.id === item.experienceId);
                              if (!exp) return null;
                              
                              // Find index in cart to pass to onRemoveFromCart
                              const cartIdx = cart.findIndex(c => c === item);

                              return (
                                <div key={idx} className="relative">
                                  <div className="absolute left-[-27px] top-4 w-2 h-2 rounded-full bg-[#E8711A] border-2 border-[#FCFBF9]"></div>
                                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex gap-4 overflow-hidden group hover:border-[#E8711A] transition-all">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-100 relative">
                                      <img 
                                        src={exp.photos?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80"} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={exp.name}
                                      />
                                      <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-accent font-bold px-1.5 py-0.5 rounded uppercase">
                                        {item.schedule}
                                      </div>
                                    </div>
                                    <div className="flex flex-col justify-between flex-1">
                                      <div>
                                        <span className="flex items-center gap-1 text-[9px] font-accent font-bold uppercase tracking-widest text-[#E8711A] mb-1">
                                          <Compass className="w-3 h-3" /> Passeio Confirmado
                                        </span>
                                        <h4 className="font-serif text-sm font-bold text-[#0D1B2A] leading-tight">{exp.name}</h4>
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="text-[10px] font-bold text-zinc-500">
                                          👤 {item.adults} Ad. {item.children ? `, ${item.children} Cr.` : ''}
                                        </div>
                                        <button 
                                          onClick={() => onRemoveFromCart(cartIdx)}
                                          className="text-[10px] font-accent font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
                                        >
                                          Remover
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            /* Free Time Node */
                            <div className="relative opacity-60 hover:opacity-100 transition-opacity">
                              <div className="absolute left-[-27px] top-4 w-2 h-2 rounded-full bg-zinc-300 border-2 border-[#FCFBF9]"></div>
                              <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl p-6 text-center">
                                <Coffee className="w-5 h-5 text-zinc-400 mx-auto mb-2" />
                                <h4 className="font-serif text-xs font-bold text-zinc-600">Tempo Livre</h4>
                                <p className="text-[10px] text-zinc-400 mt-1 max-w-[200px] mx-auto">Explore a cidade, descanse ou adicione mais experiências a este dia.</p>
                                <button 
                                  onClick={() => { onClose(); onNavigate("experiencias"); }}
                                  className="mt-3 text-[10px] font-accent font-bold text-[#E8711A] uppercase tracking-widest hover:underline"
                                >
                                  + Explorar Passeios
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Summary / Total Section at bottom of scroll */}
                  {activeDayTab === 'all' && (
                    <div className="mt-8 bg-[#0D1B2A] text-white rounded-3xl p-6 relative overflow-hidden">
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                          <span className="font-accent text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Estimativa Total da Viagem</span>
                          <div className="font-serif text-3xl font-extrabold text-emerald-400">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
                          </div>
                        </div>
                        <ul className="space-y-2 text-[11px] font-medium text-zinc-300">
                          <li className="flex justify-between gap-4">
                            <span>Hospedagem ({stayDays} diárias)</span>
                            <span className="text-white">R$ {lodgingCost.toFixed(2)}</span>
                          </li>
                          <li className="flex justify-between gap-4">
                            <span>Passeios ({cart.length})</span>
                            <span className="text-white">R$ {experiencesCost.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                </div>

                {/* Sticky Bottom Bar */}
                <div className="bg-white border-t border-zinc-200 p-4 sm:p-6 absolute bottom-0 left-0 right-0 z-30">
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-[#E8711A] hover:bg-[#FF8A3F] text-[#0D1B2A] py-4 rounded-xl font-accent text-xs font-black tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(232,113,26,0.25)] flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <Check className="w-4 h-4" /> Finalizar e Solicitar Roteiro
                  </button>
                </div>
              </>
            ) : (
              /* 2. Checkout Modal / Validation Form (No noise in main dashboard) */
              <div className="flex flex-col h-full bg-white">
                <div className="border-b border-zinc-200 p-6 flex items-center gap-4">
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-[#0D1B2A]" />
                  </button>
                  <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">Último passo!</h3>
                </div>

                <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-center space-y-3">
                    <Send className="w-8 h-8 text-[#E8711A] mx-auto" />
                    <h4 className="font-serif text-base font-bold text-[#0D1B2A]">Para quem é esta viagem?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                      Preencha apenas seu nome e cidade para que nossa equipe humana receba seu roteiro no WhatsApp e valide as disponibilidades reais para você.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[10px] text-zinc-500 tracking-widest uppercase font-bold block">Seu Nome Completo</label>
                      <input 
                        type="text"
                        value={clientName}
                        onChange={(e) => onSetClientName(e.target.value)}
                        placeholder="Ex: Ana Clara"
                        className="w-full bg-white border border-zinc-300 p-4 rounded-xl text-sm text-[#0D1B2A] focus:outline-none focus:border-[#0D1B2A] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[10px] text-zinc-500 tracking-widest uppercase font-bold block">Cidade de Origem</label>
                      <input 
                        type="text"
                        value={clientCity}
                        onChange={(e) => onSetClientCity(e.target.value)}
                        placeholder="Ex: São Paulo - SP"
                        className="w-full bg-white border border-zinc-300 p-4 rounded-xl text-sm text-[#0D1B2A] focus:outline-none focus:border-[#0D1B2A] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-zinc-200">
                  <button 
                    onClick={() => {
                      onClose();
                      onTriggerWhatsapp();
                    }}
                    disabled={!clientName.trim() || !clientCity.trim()}
                    className={`w-full py-4 rounded-xl font-accent text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                      clientName.trim() && clientCity.trim()
                        ? "bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] shadow-xl hover:scale-[1.02]"
                        : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" /> Enviar para WhatsApp
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
