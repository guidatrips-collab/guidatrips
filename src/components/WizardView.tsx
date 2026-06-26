/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Calendar, Clock, Smile, Sparkles, MapPin, 
  ChevronLeft, ChevronRight, Check, Info, Star, Heart, 
  Compass, X, ArrowRight, Home, MessageSquare, Hotel, Trash2, 
  CheckCircle2, Bed, Baby, User, ShieldCheck, Map
} from "lucide-react";
import { Experience, BookingCartItem } from "../types";
import { firestoreService } from "../firebase";

interface WizardViewProps {
  experiences: Experience[];
  cart: BookingCartItem[];
  stayDays: number;
  clientName: string;
  clientCity: string;
  onUpdateStayDays: (days: number) => void;
  onAddToCart: (item: BookingCartItem) => void;
  onRemoveFromCart: (index: number) => void;
  onNavigate: (view: string) => void;
  onSetClientName?: (name: string) => void;
  onSetClientCity?: (city: string) => void;
  selectedHotelId?: string | null;
  onChangeHotelId?: (id: string | null) => void;
  whatsappNumber?: string;
  currentUser?: any;
  onTriggerAuthModal?: (action: { type: string; action: () => void }) => void;
}

interface DestinationHub {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  image: string;
}

export default function WizardView({
  experiences,
  cart,
  stayDays,
  clientName,
  clientCity,
  onUpdateStayDays,
  onAddToCart,
  onRemoveFromCart,
  onNavigate,
  onSetClientName,
  onSetClientCity,
  selectedHotelId = null,
  onChangeHotelId,
  whatsappNumber = "552299887766",
  currentUser,
  onTriggerAuthModal
}: WizardViewProps) {
  // Master steps of the custom flow:
  // 1 = Perfil de Viagem (Profile)
  // 2 = Datas de Chegada/Saída (Dates)
  // 3 = Passageiros / Grupo (Group)
  // 4 = Hospedagem Recomendada (Hotel)
  // 5 = Construção do Roteiro Inteligente Dia a Dia (Day-by-Day planning)
  // 6 = Finalização (Checkout Choice)
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<"casal" | "familia" | "grupo" | "solo">("casal");

  // Date picker states (Step 2)
  const [arrivalDate, setArrivalDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    return future.toISOString().split("T")[0];
  });

  // Passenger state counts (Step 3)
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  // Accommodation interest state (Step 4)
  const [hasHotelAnswer, setHasHotelAnswer] = useState<"no" | "yes" | null>(null);

  // Step 5 progress day state (Day-by-Day Construction)
  const [currentPlanningDay, setCurrentPlanningDay] = useState<number>(1);

  // Detailed Modal states (For catalog item)
  const [selectedExpDetail, setSelectedExpDetail] = useState<Experience | null>(null);

  // Experience photo indexes cache (to paginate carousel images inside cards)
  const [expPhotoCache, setExpPhotoCache] = useState<Record<string, number>>({});

  // Dynamic state for passenger configuring during inline booking (Adults, kids inside wizard)
  const [bookingConfigs, setBookingConfigs] = useState<Record<string, {
    adults: number;
    children: number;
    infants: number;
    observations: string;
  }>>({});

  // Save Name / City to parent components for CRM leads sync
  const [tempName, setTempName] = useState(clientName || "");
  const [tempCity, setTempCity] = useState(clientCity || "");

  useEffect(() => {
    if (currentUser) {
      if (!tempName && currentUser.name) setTempName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (onSetClientName) onSetClientName(tempName);
  }, [tempName]);

  useEffect(() => {
    if (onSetClientCity) onSetClientCity(tempCity);
  }, [tempCity]);

  // Synchronize computed stay days when dates change
  useEffect(() => {
    if (arrivalDate && departureDate) {
      const arr = new Date(arrivalDate + "T00:00:00");
      const dep = new Date(departureDate + "T00:00:00");
      const diffTime = dep.getTime() - arr.getTime();
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      onUpdateStayDays(diffDays);
    }
  }, [arrivalDate, departureDate]);

  // Switch photo inside experiences row cards
  const nextExpPhoto = (expId: string, maxPhotos: number) => {
    setExpPhotoCache(prev => {
      const current = prev[expId] || 0;
      return { ...prev, [expId]: (current + 1) % maxPhotos };
    });
  };

  const prevExpPhoto = (expId: string, maxPhotos: number) => {
    setExpPhotoCache(prev => {
      const current = prev[expId] || 0;
      return { ...prev, [expId]: (current - 1 + maxPhotos) % maxPhotos };
    });
  };

  // Get configuration values for specific experience index
  const getBookingConfig = (expId: string) => {
    if (bookingConfigs[expId]) return bookingConfigs[expId];
    return {
      adults: adults,
      children: children,
      infants: infants,
      observations: ""
    };
  };

  const updateBookingConfig = (expId: string, fields: Partial<typeof bookingConfigs[string]>) => {
    setBookingConfigs(prev => {
      const current = prev[expId] || {
        adults: adults,
        children: children,
        infants: infants,
        observations: ""
      };
      return {
        ...prev,
        [expId]: { ...current, ...fields }
      };
    });
  };

  // Profile Definitions with Copy/Description
  const profiles = [
    {
      id: "casal",
      label: "Casal Romântico 👩‍❤️‍👨",
      desc: "Brindes finos de espumante e piqueniques privativos ao pôr do sol em falésias secretas.",
      info: "Ideal para lua de mel, aniversários de namoro ou simplesmente para desfrutar da calmaria do mar caribenho a dois com total privacidade."
    },
    {
      id: "familia",
      label: "Em Família 👨‍👩‍👧‍👦",
      desc: "Barco limpo, água e frutas cortadas, boias divertidas e suporte absoluto para crianças brincarem rindo.",
      info: "Embarcações seguras equipadas com coletes especiais. Ritmo desacelerado e foco no conforto das crianças e dos avós."
    },
    {
      id: "grupo",
      label: "Em Grupo / Amigos 🥳",
      desc: "Rotas ágeis off-road de buggy pelas dunas, trilhas desafiadoras e mergulhos animados.",
      info: "Passeios cheios de energia, paradas com música de bordo e pontos estratégicos para fotos icônicas e saltos no mar de Arraial."
    },
    {
      id: "solo",
      label: "Explorador Solo 🧭",
      desc: "Liberdade total para trilhas selvagens, mergulho técnico e conexão autêntica com nativos.",
      info: "Para quem quer desbravar cada recanto no seu próprio tempo, aprender sobre a história do descobrimento e interagir com biólogos locais."
    }
  ];

  // Lodging Catalog recommended for Cabo Frio / Arraial
  const hotels = [
    {
      id: "ohana-pousada",
      name: "Ohana Pousada Boutique",
      location: "Pontal do Atalaia",
      rating: 5.0,
      tag: "VISTA LENDÁRIA",
      desc: "Jacuzzi infinita debruçada sobre as encostas místicas.",
      img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80",
      whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios na Ohana Pousada Boutique."
    },
    {
      id: "pousada-timoneiro",
      name: "Pousada do Timoneiro",
      location: "Praia Grande",
      rating: 4.9,
      tag: "CONFORTO CLÁSSICO",
      desc: "Piscina climatizada perto da beira da Praia Grande.",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios exclusivos para a Pousada do Timoneiro."
    },
    {
      id: "pousada-caminho-mar",
      name: "Pousada Caminho do Mar",
      location: "Praia dos Anjos",
      rating: 4.8,
      tag: "EMBARQUE PRÁTICO",
      desc: "Conforto moderno pertinho do cais de embarque.",
      img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
      whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios para a Pousada Caminho do Mar."
    }
  ];

  // Dynamic filter of experiences sorted according to the profile
  const getFilteredExperiences = () => {
    let list = experiences.filter(exp => exp.status === "active");
    if (profile === "casal") {
      list = [...list].sort((a, b) => {
        if (a.id.includes("sunset") || a.name.toLowerCase().includes("pôr") || a.name.toLowerCase().includes("sunset")) return -1;
        if (b.id.includes("sunset") || b.name.toLowerCase().includes("pôr") || b.name.toLowerCase().includes("sunset")) return 1;
        return 0;
      });
    } else if (profile === "familia") {
      list = [...list].sort((a, b) => {
        if (a.name.toLowerCase().includes("premium") || a.name.toLowerCase().includes("conforto")) return -1;
        if (b.name.toLowerCase().includes("premium") || b.name.toLowerCase().includes("conforto")) return 1;
        return 0;
      });
    } else if (profile === "grupo") {
      list = [...list].sort((a, b) => {
        if (a.id.includes("buggy") || a.name.toLowerCase().includes("mergulho") || a.id.includes("mergulho")) return -1;
        if (b.id.includes("buggy") || b.name.toLowerCase().includes("mergulho") || b.id.includes("mergulho")) return 1;
        return 0;
      });
    }
    return list;
  };

  const filteredExps = getFilteredExperiences();

  // Smart Collision / Combination recommendations for the current day
  const getSmartRecommendations = (dayNum: number, currentExpId: string) => {
    const dayBookedItems = cart.filter(item => item.dayIndex === dayNum);
    if (dayBookedItems.length === 0) {
      return {
        allowed: true,
        message: "O dia selecionado está inteiramente livre para este incrível passeio!"
      };
    }

    if (dayBookedItems.some(item => item.experienceId === currentExpId)) {
      return {
        allowed: false,
        message: `Você já agendou esta atividade para o Dia ${dayNum}.`
      };
    }

    if (dayBookedItems.length >= 2) {
      return {
        allowed: false,
        message: `Sugestão: Você já possui ${dayBookedItems.length} passeios no Dia ${dayNum}. Agende para outro dia para curtir com calma!`
      };
    }

    const firstItem = dayBookedItems[0];
    const firstExp = experiences.find(e => e.id === firstItem.experienceId);
    return {
      allowed: true,
      message: `Excelente combinação! Você já tem o "${firstExp?.name}" no Dia ${dayNum}. Ambas atividades cabem no mesmo dia (manhã e tarde).`
    };
  };

  // Helper to format currency
  const formatBRL = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Calculate Itinerary Estimated Cost
  const calculateEstimatedTotal = () => {
    let total = 0;
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (exp) {
        const adPrice = exp.pricing?.adultPrice || exp.priceFrom || 150;
        const chPrice = exp.pricing?.childPrice ?? (adPrice * 0.7);
        total += (item.adults ?? 2) * adPrice + (item.children ?? 0) * chPrice;
      }
    });
    return total;
  };

  // Finalize Online Reservation (Platform Auth Flow)
  const handleFinalizePlatform = async () => {
    if (!currentUser) {
      if (onTriggerAuthModal) {
        onTriggerAuthModal({
          type: "online_booking",
          action: () => {
            persistCartToFirestore();
          }
        });
      }
      return;
    }
    await persistCartToFirestore();
  };

  const persistCartToFirestore = async () => {
    if (cart.length === 0) {
      alert("Seu roteiro está vazio! Por favor adicione passeios antes de finalizar.");
      return;
    }

    try {
      // Save all cart items as persistent reservations under the current user in Firestore
      const userToSave = currentUser || JSON.parse(localStorage.getItem("guidatrips_logged_in_user") || "{}");
      if (!userToSave.id) {
        alert("Ocorreu um erro ao recuperar seu cadastro. Por favor, faça login.");
        return;
      }

      for (const item of cart) {
        const exp = experiences.find(e => e.id === item.experienceId);
        const reservationId = `res-wizard-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newReservation = {
          id: reservationId,
          userId: userToSave.id,
          experienceId: item.experienceId,
          date: item.date || new Date().toISOString().split("T")[0],
          time: item.schedule || "08:00",
          adults: item.adults ?? 2,
          children: item.children ?? 0,
          infants: item.infants ?? 0,
          people: item.people ?? 2,
          notes: item.observations || "Agendado via Roteiro Inteligente!",
          status: "novo",
          createdAt: new Date().toISOString(),
          bringItems: exp?.bringItems || ["Filtro Solar", "Toalha de Banho"],
          avoidItems: exp?.notIncluded || ["Sapatos de Salto"]
        };
        await firestoreService.set("reservations", reservationId, newReservation);
      }

      alert("Parabéns! 🎉 Seu roteiro personalizado foi salvo com sucesso. Você será redirecionado para a Área do Cliente.");
      onNavigate("cliente");
    } catch (err) {
      console.error("Error creating reservations:", err);
      alert("Houve um erro ao processar seu agendamento, mas salvamos o progresso!");
      onNavigate("cliente");
    }
  };

  // Finalize WhatsApp Reservation (No Login required)
  const handleFinalizeWhatsApp = () => {
    const formattedArrival = arrivalDate ? new Date(arrivalDate + "T00:00:00").toLocaleDateString("pt-BR") : "";
    const formattedDeparture = departureDate ? new Date(departureDate + "T00:00:00").toLocaleDateString("pt-BR") : "";
    
    let text = `Olá Guida Trips! Acabo de planejar meu Roteiro Inteligente no site:\n\n`;
    text += `👤 *Nome:* ${tempName || "Explorador"}\n`;
    text += `📍 *Origem:* ${tempCity || "Não informado"}\n`;
    text += `🗓 *Período:* ${formattedArrival} até ${formattedDeparture} (${stayDays} dias)\n`;
    text += `👥 *Passageiros:* ${adults} Adultos, ${children} Crianças, ${infants} Bebês\n`;
    text += `⛺ *Perfil Escolhido:* ${profile.toUpperCase()}\n`;
    
    if (selectedHotelId) {
      const hotel = hotels.find(h => h.id === selectedHotelId);
      text += `🏨 *Hospedagem:* Sim, vinculado a ${hotel?.name}\n`;
    } else {
      text += `🏨 *Hospedagem:* Não, já possui hospedagem própria\n`;
    }
    
    text += `\n⛵ *PASSEIOS PROGRAMADOS:*\n`;
    
    // Group by day index
    for (let d = 1; d <= stayDays; d++) {
      const dayItems = cart.filter(item => item.dayIndex === d);
      if (dayItems.length > 0) {
        text += `\n*Dia ${d}:*\n`;
        dayItems.forEach(item => {
          const exp = experiences.find(e => e.id === item.experienceId);
          text += `  • _${exp?.name}_ (${item.adults} adultos, ${item.children} crianças, às ${item.schedule})\n`;
        });
      }
    }
    
    text += `\n💰 *Valor Estimado:* ${formatBRL(calculateEstimatedTotal())}\n\n`;
    text += `Gostaria de fechar este pacote e garantir as minhas vagas e benefícios!`;

    const encoded = encodeURIComponent(text);
    const link = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(link, "_blank");
  };

  return (
    <div className="w-full bg-[#FCFBF9] text-[#0D1B2A] font-sans pt-24 pb-16 min-h-screen">
      
      {/* Dynamic Sub-header Navigation Stepper */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 px-4 shadow-xs text-left">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                onNavigate("home");
              }
            }}
            className="flex items-center gap-1 text-zinc-500 hover:text-[#E8711A] text-xs font-bold uppercase transition-all py-1.5 px-3 hover:bg-zinc-100 rounded-full cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{step === 1 ? "Início" : "Voltar"}</span>
          </button>

          {/* Stepper text and markers */}
          <div className="hidden md:flex items-center gap-3">
            {[
              { num: 1, label: "Perfil" },
              { num: 2, label: "Datas" },
              { num: 3, label: "Grupo" },
              { num: 4, label: "Hospedagem" },
              { num: 5, label: "Montar Roteiro" },
              { num: 6, label: "Finalização" }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                  step === s.num
                    ? "bg-[#0D1B2A] text-white ring-2 ring-[#0D1B2A]/10 scale-105 font-bold"
                    : step > s.num
                      ? "bg-emerald-500 text-white font-bold"
                      : "bg-zinc-200 text-zinc-500"
                }`}>
                  {step > s.num ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
                </span>
                <span className={`text-[11px] font-bold ${
                  step === s.num ? "text-[#0D1B2A]" : "text-zinc-400"
                }`}>{s.label}</span>
                {s.num < 6 && <span className="w-4 h-px bg-zinc-200" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 md:hidden font-bold">Etapa {step} de 6</span>
            {step < 5 ? (
              <button 
                onClick={() => {
                  if (step === 2 && !tempName.trim()) {
                    alert("Por favor, informe seu nome para prosseguirmos com seu roteiro personalizado!");
                    return;
                  }
                  setStep(step + 1);
                }}
                className="bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] px-4.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Avançar
              </button>
            ) : step === 5 ? (
              <button
                onClick={() => setStep(6)}
                className="bg-[#E8711A] hover:bg-[#C45E12] text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase transition-all shadow cursor-pointer flex items-center gap-1"
              >
                <span>Concluir Roteiro ({cart.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-zinc-400 font-bold uppercase">Resumo Pronto</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 sm:mt-12 text-center">

        <AnimatePresence mode="wait">
          
          {/* STEP 1: TRAVEL PROFILE SELECTOR */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 1 de 6: Estilo de Viagem
                </span>
                <h2 className="font-serif text-3xl sm:text-4.5xl font-extrabold text-[#0D1B2A] leading-tight">
                  Como será sua viagem por Arraial do Cabo?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Para adaptarmos perfeitamente as experiências sugeridas, o ritmo do passeio, cortesias a bordo e a curadoria de hotéis, selecione o seu perfil.
                </p>
              </div>

              {/* Grid of Profile Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {profiles.map((pOpt) => {
                  const isSelected = profile === pOpt.id;
                  return (
                    <button
                      key={pOpt.id}
                      type="button"
                      onClick={() => setProfile(pOpt.id as any)}
                      className={`p-6 rounded-3xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-48 group ${
                        isSelected
                          ? "bg-[#0D1B2A] text-white border-[#0D1B2A] shadow-md scale-[1.01]"
                          : "bg-white text-[#0D1B2A] border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-lg sm:text-xl font-extrabold">
                            {pOpt.label}
                          </h3>
                          {isSelected && (
                            <span className="bg-[#E8711A] text-white p-1 rounded-full">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${isSelected ? "text-zinc-300" : "text-zinc-500"} leading-relaxed font-semibold`}>
                          {pOpt.desc}
                        </p>
                        <p className={`text-[11px] leading-relaxed pt-1 border-t ${isSelected ? "border-white/10 text-zinc-400" : "border-zinc-100 text-zinc-400"} font-normal`}>
                          {pOpt.info}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Next Step CTA */}
              <div className="pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md hover:scale-102 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Continuar para as Datas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DATES SELECTOR */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-2xl mx-auto text-left"
            >
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 2 de 6: Datas de Estadia
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] leading-tight">
                  Quando você pretende viajar?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Defina a data de chegada e saída do paraíso. O sistema calculará o número de diárias e programará suas atividades em dias confortáveis.
                </p>
              </div>

              {/* Card Inputs */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                
                {/* Fast Name and City inputs as CRM details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0D1B2A] font-bold block">Seu Nome *</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                      placeholder="Ex: Carolina Mendes"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0D1B2A] font-bold block">Sua Cidade de Origem</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                      placeholder="Ex: Belo Horizonte - MG"
                      value={tempCity}
                      onChange={(e) => setTempCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0D1B2A] font-bold block">Data de Chegada (Check-in)</label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white cursor-pointer"
                        value={arrivalDate}
                        onChange={(e) => {
                          setArrivalDate(e.target.value);
                          // Ensure departure is after arrival
                          if (new Date(e.target.value) >= new Date(departureDate)) {
                            const newDep = new Date(e.target.value);
                            newDep.setDate(newDep.getDate() + 3);
                            setDepartureDate(newDep.toISOString().split("T")[0]);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0D1B2A] font-bold block">Data de Saída (Check-out)</label>
                    <input
                      type="date"
                      min={arrivalDate}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white cursor-pointer"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Stay Days Counter Badge */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Calendar className="w-5 h-5 text-[#E8711A]" />
                    <span className="text-xs font-semibold">Duração calculada da sua estadia:</span>
                  </div>
                  <span className="bg-[#E8711A] text-white px-3.5 py-1 rounded-full text-xs font-extrabold font-mono">
                    {stayDays} {stayDays === 1 ? "DIA" : "DIAS"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-650 hover:text-zinc-800 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  onClick={() => {
                    if (!tempName.trim()) {
                      alert("Por favor, informe seu nome para prosseguirmos com seu roteiro personalizado!");
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-8 py-3 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-102 flex items-center gap-1.5"
                >
                  <span>Definir Pessoas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PASSENGER COUNTS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-xl mx-auto text-left"
            >
              <div className="text-center space-y-2">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 3 de 6: Passageiros
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] leading-tight">
                  Quantas pessoas viajarão com você?
                </h2>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Ajustamos as capacidades das escunas, mimos e os tamanhos dos barcos para comportar com absoluto conforto todo o seu grupo.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-5 shadow-sm">
                
                {/* Adults Counter */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-50 rounded-xl">
                      <User className="w-5 h-5 text-[#0D1B2A]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0D1B2A]">Adultos</h4>
                      <p className="text-[10px] text-zinc-400">Idade acima de 12 anos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-center font-bold text-sm cursor-pointer flex items-center justify-center text-[#0D1B2A]"
                    >-</button>
                    <span className="w-6 text-center text-sm font-extrabold font-mono text-[#0D1B2A]">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-center font-bold text-sm cursor-pointer flex items-center justify-center text-[#0D1B2A]"
                    >+</button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-50 rounded-xl">
                      <Smile className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0D1B2A]">Crianças</h4>
                      <p className="text-[10px] text-zinc-400">Idade entre 2 e 12 anos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-center font-bold text-sm cursor-pointer flex items-center justify-center text-[#0D1B2A]"
                    >-</button>
                    <span className="w-6 text-center text-sm font-extrabold font-mono text-[#0D1B2A]">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-center font-bold text-sm cursor-pointer flex items-center justify-center text-[#0D1B2A]"
                    >+</button>
                  </div>
                </div>

                {/* Infants Counter */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-50 rounded-xl">
                      <Baby className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0D1B2A]">Bebês de Colo</h4>
                      <p className="text-[10px] text-zinc-400">Menores de 2 anos (Cortesia)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-center font-bold text-sm cursor-pointer flex items-center justify-center text-[#0D1B2A]"
                    >-</button>
                    <span className="w-6 text-center text-sm font-extrabold font-mono text-[#0D1B2A]">{infants}</span>
                    <button
                      type="button"
                      onClick={() => setInfants(infants + 1)}
                      className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-center font-bold text-sm cursor-pointer flex items-center justify-center text-[#0D1B2A]"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Security / Safety Tip Box */}
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-xs flex gap-3 items-start leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>Segurança em Primeiro Lugar:</strong> Possuímos coletes salva-vidas homologados pela Marinha adaptados para bebês e crianças de todas as idades em nossas lanchas e barcos parceiros.
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-zinc-300 text-zinc-650 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-8 py-3 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-102 flex items-center gap-1.5"
                >
                  <span>Escolher Hospedagem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ACCOMMODATION / HOTEL SELECTION */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-4xl mx-auto text-left"
            >
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 4 de 6: Hospedagens Recomendadas
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] leading-tight">
                  Deseja incluir hospedagem em seu plano?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Parcerias exclusivas da Guida Trips garantem mimos de boas-vindas, late check-out e as melhores tarifas garantidas nas pousadas parceiras de Arraial e Cabo Frio.
                </p>
              </div>

              {/* Question triggers */}
              <div className="flex gap-4 justify-center py-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setHasHotelAnswer("yes")}
                  className={`flex-1 py-3.5 rounded-2xl font-accent text-[11px] font-black tracking-wider uppercase transition-all cursor-pointer border shadow-xs ${
                    hasHotelAnswer === "yes"
                      ? "bg-[#E8711A] text-[#0D1B2A] border-[#E8711A] font-black scale-102"
                      : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                  }`}
                >
                  Sim, ver opções 👍
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasHotelAnswer("no");
                    if (onChangeHotelId) onChangeHotelId(null);
                  }}
                  className={`flex-1 py-3.5 rounded-2xl font-accent text-[11px] font-black tracking-wider uppercase transition-all cursor-pointer border shadow-xs ${
                    hasHotelAnswer === "no"
                      ? "bg-[#0D1B2A] text-white border-[#0D1B2A] scale-102"
                      : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                  }`}
                >
                  Não, já tenho pousada ❌
                </button>
              </div>

              {/* Show recommended hotel listings if selected YES */}
              {hasHotelAnswer === "yes" && (
                <div className="space-y-5 pt-4 border-t border-zinc-200/60 max-w-4xl mx-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E8711A] text-base">🏨</span>
                    <h5 className="font-accent text-[10px] font-black tracking-widest text-[#E8711A] uppercase">
                      Indicações com Benefícios Exclusivos (Guida Trips Club)
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {hotels.map((pousada) => {
                      const isSelected = selectedHotelId === pousada.id;

                      return (
                        <div
                          key={pousada.id}
                          className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group ${
                            isSelected ? "border-[#E8711A] ring-1 ring-[#E8711A]/20" : "border-zinc-200"
                          }`}
                        >
                          <div className="h-32 overflow-hidden relative select-none">
                            <img
                              src={pousada.img}
                              alt={pousada.name}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            />
                            <span className="absolute bottom-2 left-2 bg-[#0D1B2A]/90 text-white text-[8px] font-accent tracking-widest px-2.5 py-1 rounded-sm">
                              {pousada.tag}
                            </span>
                            <div className="absolute top-2 right-2 bg-white/95 text-[#0D1B2A] text-[9px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                              <span className="text-yellow-500">★</span>
                              <span>{pousada.rating}</span>
                            </div>
                          </div>

                          <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
                            <div className="space-y-1 text-left">
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">{pousada.location}</span>
                              <h6 className="font-serif text-sm font-extrabold text-[#0D1B2A] leading-tight group-hover:text-[#E8711A] transition-colors line-clamp-1">
                                {pousada.name}
                              </h6>
                              <p className="font-sans text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                                {pousada.desc}
                              </p>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onChangeHotelId) {
                                    onChangeHotelId(isSelected ? null : pousada.id);
                                  }
                                }}
                                className={`w-full py-2 rounded-xl font-accent text-[9px] font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                  isSelected
                                    ? "bg-[#E8711A] text-[#0D1B2A] font-black"
                                    : "bg-[#0D1B2A] hover:bg-[#E8711A] hover:text-[#0D1B2A] text-white"
                                }`}
                              >
                                {isSelected ? "✨ SELECIONADO" : "VINCULAR POUSADA"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center pt-6 max-w-md mx-auto">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-zinc-300 text-zinc-650 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-8 py-3 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-102 flex items-center gap-1.5"
                >
                  <span>Montar Cronograma</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: DAY-BY-DAY BUILDING (CONSTRUÇÃO DO ROTEIRO) */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-wider bg-[#E8711A]/8 px-3.5 py-1.5 rounded-full">
                  Etapa 5 de 6: Planejador Inteligente
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] pt-2">
                  Monte sua programação dia a dia
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Planeje um dia por vez sem sobrecarga visual. Adicione as atividades ao <strong className="text-[#0D1B2A]">Dia {currentPlanningDay}</strong> e avance conforme sua preferência!
                </p>
              </div>

              {/* Day-by-day navigation steps bubble */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-4 max-w-4xl mx-auto flex items-center justify-between shadow-xs">
                <button
                  disabled={currentPlanningDay === 1}
                  onClick={() => setCurrentPlanningDay(currentPlanningDay - 1)}
                  className={`px-3.5 py-2 text-[10px] font-extrabold uppercase rounded-full transition-all flex items-center gap-1 border border-zinc-200 bg-white shadow-xs ${
                    currentPlanningDay === 1 ? "opacity-30 cursor-not-allowed" : "hover:text-[#E8711A] cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Dia Anterior</span>
                </button>

                <div className="flex items-center gap-1.5 font-serif font-black text-sm">
                  <span className="text-[#E8711A]">Dia {currentPlanningDay}</span>
                  <span className="text-zinc-300 font-normal">de</span>
                  <span className="text-[#0D1B2A]">{stayDays}</span>
                </div>

                {currentPlanningDay < stayDays ? (
                  <button
                    onClick={() => setCurrentPlanningDay(currentPlanningDay + 1)}
                    className="px-3.5 py-2 text-[10px] font-extrabold uppercase rounded-full transition-all flex items-center gap-1 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] cursor-pointer shadow-xs"
                  >
                    <span>Próximo Dia</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(6)}
                    className="px-4.5 py-2 text-[10px] font-extrabold uppercase rounded-full transition-all flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    <span>Ir para Resumo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grid split: Left is experiences catalogue for the current day, right is the smart summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
                
                {/* Experiences List (9 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
                    <h3 className="font-serif text-lg font-bold text-[#0D1B2A] flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#E8711A]" />
                      <span>Catálogo Recomendado para o Dia {currentPlanningDay}</span>
                    </h3>
                    <span className="text-[10px] font-bold text-[#E8711A] tracking-wider uppercase bg-[#E8711A]/8 px-2.5 py-1 rounded-full">
                      Perfil: {profile}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {filteredExps.map((exp) => {
                      const activePhotoIndex = expPhotoCache[exp.id] || 0;
                      const config = getBookingConfig(exp.id);
                      
                      // Check if already in cart *on this specific day*
                      const isAlreadyInCart = cart.some(item => item.experienceId === exp.id && item.dayIndex === currentPlanningDay);
                      
                      // Collision check feedback message
                      const feedback = getSmartRecommendations(currentPlanningDay, exp.id);

                      // Date matching calculation
                      const targetDate = new Date(arrivalDate + "T00:00:00");
                      targetDate.setDate(targetDate.getDate() + (currentPlanningDay - 1));
                      const targetDateStr = targetDate.toISOString().split("T")[0];

                      return (
                        <div 
                          key={exp.id}
                          className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow grid grid-cols-1 md:grid-cols-12 gap-5 p-4.5 md:p-5"
                        >
                          {/* Left column: image slider */}
                          <div className="md:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200/50 bg-zinc-100 group">
                            {exp.photos && exp.photos.length > 0 ? (
                              <img 
                                src={exp.photos[activePhotoIndex]} 
                                alt={exp.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xs">Sem Fotos</div>
                            )}

                            {exp.badge && (
                              <span className="absolute top-2.5 left-2.5 bg-[#E8711A] text-[#0D1B2A] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                                {exp.badge === "mais-vendido" ? "🏆 MAIS VENDIDO" : exp.badge}
                              </span>
                            )}

                            {/* Carousel pagination */}
                            {exp.photos && exp.photos.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => prevExpPhoto(exp.id, exp.photos.length)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/90 text-zinc-700 hover:text-[#E8711A] rounded-full shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => nextExpPhoto(exp.id, exp.photos.length)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/90 text-zinc-700 hover:text-[#E8711A] rounded-full shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>

                          {/* Right column: Details and quick planning */}
                          <div className="md:col-span-7 flex flex-col justify-between space-y-3.5">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1 flex-wrap">
                                <span className="text-[9px] uppercase font-bold text-zinc-400">⏱ Duração: {exp.duration}</span>
                                <span className="text-[#0D1B2A] font-extrabold text-[11px] bg-zinc-100 py-0.5 px-2 rounded-full font-mono">
                                  A partir de {formatBRL(exp.priceFrom)} / pessoa
                                </span>
                              </div>

                              <h4 className="font-serif text-base sm:text-lg font-extrabold text-[#0D1B2A] leading-tight leading-snug">
                                {exp.name}
                              </h4>
                              
                              <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed font-sans line-clamp-2">
                                {exp.shortDescription}
                              </p>

                              {/* Details Trigger without losing progress */}
                              <button
                                type="button"
                                onClick={() => setSelectedExpDetail(exp)}
                                className="text-[#E8711A] hover:text-[#0D1B2A] font-extrabold text-[10px] uppercase tracking-wider block pt-0.5 hover:underline cursor-pointer"
                              >
                                Ver Detalhes do Passeio +
                              </button>
                            </div>

                            {/* Tactile config segment inside the card */}
                            <div className="bg-zinc-50/80 rounded-2xl p-3 border border-zinc-200/50 space-y-3 text-[11px]">
                              
                              {/* Schedule/Time selection */}
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider">Horário Sugerido</span>
                                <select
                                  className="bg-white border border-zinc-200 rounded-lg p-1.5 text-[11px] text-zinc-800 font-bold cursor-pointer focus:outline-none focus:border-[#E8711A]"
                                  defaultValue={exp.schedules && exp.schedules.length > 0 ? exp.schedules[0] : "08:00"}
                                >
                                  {(exp.schedules && exp.schedules.length > 0 ? exp.schedules : ["08:00", "13:30"]).map(time => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Collision validator feedback block */}
                              <div className={`p-2 rounded-xl flex items-start gap-1.5 border text-[10px] leading-relaxed ${
                                feedback.allowed 
                                  ? "bg-zinc-100/60 border-zinc-150 text-zinc-550" 
                                  : "bg-amber-50 border-amber-150 text-amber-900 font-semibold"
                              }`}>
                                <Info className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${feedback.allowed ? "text-zinc-400" : "text-[#E8711A]"}`} />
                                <div>{feedback.message}</div>
                              </div>

                              {/* Add / Toggle Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (isAlreadyInCart) {
                                    const indexInCart = cart.findIndex(item => item.experienceId === exp.id && item.dayIndex === currentPlanningDay);
                                    if (indexInCart !== -1) {
                                      onRemoveFromCart(indexInCart);
                                    }
                                  } else {
                                    onAddToCart({
                                      experienceId: exp.id,
                                      date: targetDateStr,
                                      schedule: exp.schedules && exp.schedules.length > 0 ? exp.schedules[0] : "08:00",
                                      adults: config.adults,
                                      children: config.children,
                                      infants: config.infants,
                                      people: config.adults + config.children + config.infants,
                                      observations: "Agendado via Assistente Inteligente!",
                                      dayIndex: currentPlanningDay
                                    });
                                  }
                                }}
                                className={`w-full text-center py-2 rounded-xl text-[10px] font-accent font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                  isAlreadyInCart
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1"
                                    : "bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] shadow-xs"
                                }`}
                              >
                                {isAlreadyInCart ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>Adicionado ao Dia {currentPlanningDay} (Clique para remover)</span>
                                  </>
                                ) : (
                                  <span>Adicionar ao Dia {currentPlanningDay}</span>
                                )}
                              </button>

                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Smart Summary Sidebar (4 Columns) */}
                <div className="lg:col-span-4 bg-zinc-900 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-5 lg:sticky lg:top-28">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Map className="w-5 h-5 text-[#E8711A]" />
                      <span>Resumo do Roteiro</span>
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-1">Este resumo cresce conforme você escolhe as experiências</p>
                  </div>

                  {/* Traveler Summary */}
                  <div className="text-xs space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-[#E8711A] font-black uppercase tracking-wider">Membros & Viagem</p>
                    <p className="font-serif text-xs font-bold">{tempName || "Explorador"}</p>
                    <p className="text-zinc-350">{stayDays} {stayDays === 1 ? "dia" : "dias"} em Cabo • {adults} Adultos {children > 0 && `, ${children} Crianças`} {infants > 0 && `, ${infants} Bebês`}</p>
                    <p className="text-zinc-400 font-mono text-[10px] italic">Origem: {tempCity || "Geral"}</p>
                  </div>

                  {/* Linked Pousada */}
                  {selectedHotelId ? (() => {
                    const hotel = hotels.find(h => h.id === selectedHotelId);
                    return (
                      <div className="text-xs space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/5 relative">
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          Hospedagem Vinculada
                        </p>
                        <p className="font-serif text-xs font-bold">{hotel?.name}</p>
                        <p className="text-zinc-400 text-[10px]">{hotel?.location}</p>
                      </div>
                    );
                  })() : null}

                  {/* Day-by-Day timeline of chosen items */}
                  <div className="space-y-3.5">
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">Cronograma de Atividades</p>

                    {Array.from({ length: stayDays }).map((_, idx) => {
                      const d = idx + 1;
                      const dayItems = cart.filter(item => item.dayIndex === d);

                      return (
                        <div key={d} className="text-xs border-l border-white/10 pl-3.5 py-0.5 space-y-1 text-left relative">
                          <span className="absolute left-[-4.5px] top-[5px] w-2.5 h-2.5 rounded-full bg-[#E8711A]" />
                          <p className="font-bold text-zinc-300">Dia {d}</p>
                          {dayItems.length === 0 ? (
                            <p className="text-zinc-500 italic text-[10px]">Sem passeios neste dia</p>
                          ) : (
                            dayItems.map((item, i) => {
                              const exp = experiences.find(e => e.id === item.experienceId);
                              return (
                                <div key={i} className="flex justify-between items-center gap-2">
                                  <span className="text-white text-[11px] font-medium line-clamp-1">✓ {exp?.name}</span>
                                  <span className="text-zinc-500 font-mono text-[9px] shrink-0">{item.schedule}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing recap */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400">Total Estimado</span>
                      <span className="font-serif text-base font-extrabold text-[#E8711A]">
                        {formatBRL(calculateEstimatedTotal())}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(6)}
                    className="w-full text-center py-3 bg-[#E8711A] text-[#0D1B2A] font-accent text-xs font-black uppercase tracking-wider rounded-xl hover:bg-white hover:text-[#0D1B2A] transition-all cursor-pointer shadow-md"
                  >
                    Concluir Cronograma 🍾
                  </button>

                </div>

              </div>

            </motion.div>
          )}

          {/* STEP 6: FINAL CHECKOUT CHOICE (FINALIZAÇÃO) */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8 max-w-4xl mx-auto text-left"
            >
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa Final: Resgatar Planejamento
                </span>
                <h2 className="font-serif text-3xl sm:text-4.5xl font-extrabold text-[#0D1B2A] leading-tight">
                  Seu roteiro personalizado está concluído!
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Tudo pronto para que você viva as melhores memórias. Escolha como gostaria de finalizar sua reserva e garantir seus mimos e benefícios exclusivos!
                </p>
              </div>

              {/* Master Recap Box */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-extrabold text-[#0D1B2A]">Resumo Consolidado</h3>
                    <p className="text-xs text-zinc-500">Roteiro para <strong className="text-zinc-800 font-extrabold">{tempName || "Explorador"}</strong> • {stayDays} dias sintonizados</p>
                  </div>
                  <div className="bg-[#E8711A]/10 border border-[#E8711A]/25 px-4.5 py-2 rounded-2xl text-right">
                    <p className="text-[8px] text-[#E8711A] font-black uppercase tracking-wider">Investimento Estimado</p>
                    <p className="font-serif text-lg font-black text-[#E8711A]">{formatBRL(calculateEstimatedTotal())}</p>
                  </div>
                </div>

                {/* Timeline Recap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-accent text-[10px] text-zinc-400 font-extrabold tracking-wider uppercase">— ATIVIDADES DIÁRIAS —</h4>
                    <div className="space-y-4">
                      {Array.from({ length: stayDays }).map((_, idx) => {
                        const d = idx + 1;
                        const dayItems = cart.filter(item => item.dayIndex === d);
                        return (
                          <div key={d} className="flex gap-4 text-xs items-start">
                            <span className="w-8 h-8 rounded-full bg-zinc-100 font-mono font-extrabold text-[#0D1B2A] flex items-center justify-center shrink-0">D{d}</span>
                            <div className="space-y-1 pt-1.5 text-left">
                              {dayItems.length === 0 ? (
                                <p className="text-zinc-400 italic">Dia livre para relaxar ou curtir praias vizinhas.</p>
                              ) : (
                                dayItems.map((item, i) => {
                                  const exp = experiences.find(e => e.id === item.experienceId);
                                  return (
                                    <div key={i} className="flex flex-col">
                                      <strong className="text-zinc-800 font-bold">{exp?.name}</strong>
                                      <span className="text-zinc-400 font-mono text-[10px]">Saída às {item.schedule} • {item.adults} adultos, {item.children} crianças</span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h4 className="font-accent text-[10px] text-zinc-400 font-extrabold tracking-wider uppercase">— DETALHES DE EMBARQUE —</h4>
                    <div className="p-4 bg-[#FBF9F7] rounded-2xl border border-zinc-150 space-y-3 text-xs leading-relaxed">
                      <p>👥 <strong>Grupo:</strong> {adults} Adultos, {children} Crianças, {infants} Bebês</p>
                      <p>🏖 <strong>Perfil:</strong> {profile.charAt(0).toUpperCase() + profile.slice(1)}</p>
                      <p>🏨 <strong>Hospedagem:</strong> {selectedHotelId ? hotels.find(h => h.id === selectedHotelId)?.name : "Já possui própria"}</p>
                      <p>📅 <strong>Período:</strong> {arrivalDate ? new Date(arrivalDate + "T00:00:00").toLocaleDateString("pt-BR") : ""} até {departureDate ? new Date(departureDate + "T00:00:00").toLocaleDateString("pt-BR") : ""}</p>
                    </div>

                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-150 text-xs flex gap-2.5 items-start">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <strong>Garantia Guida Trips:</strong> Cuidado humanizado, marinheiros credenciados, assistência 24h e suporte total ao cliente.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Choice Checkout buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 max-w-3xl mx-auto">
                
                {/* 1. Finalize on Platform */}
                <div className="bg-white border border-zinc-200 hover:border-[#E8711A] rounded-3xl p-6 shadow-xs hover:shadow-sm transition-all text-center flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xl">💳</span>
                    <h4 className="font-serif text-base font-extrabold text-[#0D1B2A]">Finalizar pela Plataforma</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                      Seu roteiro será salvo em sua conta. Você terá acesso aos bilhetes eletrônicos, cronograma detalhado, canais de suporte e faturamento online pelo painel.
                    </p>
                  </div>
                  <button
                    onClick={handleFinalizePlatform}
                    className="w-full py-3 bg-[#0D1B2A] hover:bg-[#E8711A] hover:text-[#0D1B2A] text-white text-xs font-accent font-extrabold tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    {currentUser ? "Salvar meu Roteiro" : "Entrar / Cadastrar e Salvar 🚀"}
                  </button>
                </div>

                {/* 2. Finalize on WhatsApp */}
                <div className="bg-[#FAF8F5] border border-zinc-200 hover:border-[#E8711A] rounded-3xl p-6 shadow-xs hover:shadow-sm transition-all text-center flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xl">💬</span>
                    <h4 className="font-serif text-base font-extrabold text-[#0D1B2A]">Finalizar pelo WhatsApp</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                      Não exige criação de conta! Geramos uma mensagem formatada com o resumo e total estimado. Nosso consultor fechará as reservas e as vagas diretamente com você.
                    </p>
                  </div>
                  <button
                    onClick={handleFinalizeWhatsApp}
                    className="w-full py-3 bg-[#E8711A] hover:bg-[#C45E12] text-[#0D1B2A] hover:text-white font-accent text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Reservar via WhatsApp 💬
                  </button>
                </div>

              </div>

              {/* Adjust button */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setStep(5)}
                  className="text-zinc-400 hover:text-zinc-600 text-xs font-bold underline cursor-pointer"
                >
                  &larr; Voltar e ajustar passeios
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* DETAILED EXPERIENCE DESCRIPTIVE POPUP (Ver mais detalhes sobre o passeio popup) */}
      <AnimatePresence>
        {selectedExpDetail && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-zinc-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-left text-[#0D1B2A]"
            >
              <div className="relative h-48 bg-zinc-100">
                {selectedExpDetail.photos && selectedExpDetail.photos.length > 0 ? (
                  <img src={selectedExpDetail.photos[0]} alt={selectedExpDetail.name} className="w-full h-full object-cover filter brightness-[0.7]" />
                ) : (
                  <div className="w-full h-full bg-[#0D1B2A] text-white flex items-center justify-center">Fundo</div>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedExpDetail(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white hover:text-[#E8711A] rounded-full shadow transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] bg-[#E8711A] text-[#0D1B2A] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg">CUPOM PREPARADO</span>
                  <h3 className="font-serif text-lg sm:text-2xl font-extrabold text-white mt-1 leading-tight">{selectedExpDetail.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto text-xs sm:text-sm leading-relaxed text-left">
                
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Peculiaridades do Roteiro Curado</h4>
                  <p className="text-zinc-650 leading-relaxed">{selectedExpDetail.fullDescription.replace(/[#*]/g, "")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-zinc-100">
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-[#E8711A] font-extrabold tracking-wider uppercase block">O que está INCLUSO:</span>
                    <ul className="space-y-1 list-none text-xs text-zinc-650">
                      {selectedExpDetail.included.map((inc, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="w-4 h-4 bg-emerald-50 text-emerald-700 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] text-zinc-400 font-extrabold tracking-wider uppercase block">Não incluso:</span>
                    <ul className="space-y-1 list-none text-xs text-zinc-550">
                      {selectedExpDetail.notIncluded.map((nInc, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="w-4 h-4 bg-zinc-100 text-zinc-500 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold">✕</span>
                          <span>{nInc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4.5 space-y-1">
                  <span className="text-[9px] text-[#E8711A] font-bold uppercase tracking-wider block font-accent">📍 PONTO DE ENCONTRO</span>
                  <p className="text-xs text-amber-950 font-medium">{selectedExpDetail.meetingPoint}</p>
                </div>

                <div className="flex gap-2 justify-end pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedExpDetail(null)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Fechar Detalhes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
