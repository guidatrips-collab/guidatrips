/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Calendar, Clock, Smile, Sparkles, MapPin, 
  ChevronLeft, ChevronRight, Check, Info, Star, Heart, 
  HelpCircle, Gift, Compass, X, ArrowRight, UserPlus, Info as InfoIcon 
} from "lucide-react";
import { Experience, BookingCartItem } from "../types";

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
}

interface DestinationHub {
  id: string;
  name: string;
  desc: string;
  tagline: string;
  bestTime: string;
  highlight: string;
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
  onSetClientCity
}: WizardViewProps) {
  // Wizard master steps: 1 = Profile, 2 = Destination & Days, 3 = Experiences Selection
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<"casal" | "familia" | "amigos">("casal");
  
  // Destination carousel state
  const [activeDestIdx, setActiveDestIdx] = useState(0);
  const [selectedDestDetail, setSelectedDestDetail] = useState<DestinationHub | null>(null);

  // Experience details state
  const [selectedExpDetail, setSelectedExpDetail] = useState<Experience | null>(null);

  // Experience photo indexes (dynamic cache by experience ID)
  const [expPhotoCache, setExpPhotoCache] = useState<Record<string, number>>({});

  // Dynamic state for passenger configuring during inline booking
  const [bookingConfigs, setBookingConfigs] = useState<Record<string, {
    dayIndex: number;
    adults: number;
    children: number;
    infants: number;
    observations: string;
  }>>({});

  // Form states for local validation
  const [tempName, setTempName] = useState(clientName);
  const [tempCity, setTempCity] = useState(clientCity);

  // Destination Hub list
  const destinations: DestinationHub[] = [
    {
      id: "ilha-farol",
      name: "Ilha do Farol",
      tagline: "O ápice do Caribe Brasileiro",
      desc: "Com acesso estritamente restrito pela Marinha, possui as areias mais brancas e puras da América do Sul e uma transparência de água estonteante.",
      bestTime: "No amanhecer (saídas prioritárias às 08:00)",
      highlight: "Navegação calma sem ventos fortes e tartarugas marinhas flutuando ao redor.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "prainhas-pontal",
      name: "Prainhas do Pontal do Atalaia",
      tagline: "A famosa escadaria de madeira",
      desc: "O cenário dos seus melhores retratos. Desgua em um mar azul-marinho de extrema serenidade onde montanhas abraçam a areia fria.",
      bestTime: "Antes das 09h30 ou após as 16h00",
      highlight: "Subir a escadaria no fim do dia com o reflexo dourado do sol quebrando no Atlântico.",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "praia-forno",
      name: "Praia do Forno",
      tagline: "Mergulho de snorkel selvagem",
      desc: "Aninhada por mata verde de preservação ambiental. Oferece um berço natural de águas ricas onde crustáceos e peixes ornamentais prosperam.",
      bestTime: "Meio-dia, quando os raios iluminam os bancos de coral",
      highlight: "Caminhar pela trilha interpretativa e ver a enseada perfeita do mirante.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "dunas-massambaba",
      name: "Dunas de Massambaba",
      tagline: "Deserto e dunas sob buggy",
      desc: "Estrada cênica cercada por dunas móveis esculpidas continuamente pelo vento leste de Arraial, margeando lagoas limpas minerais.",
      bestTime: "Final da tarde (sunset tours)",
      highlight: "Cena off-road cruzando quilômetros de praias selvagens e lagoas azuis cristalinas.",
      image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Map user data to parent state
  useEffect(() => {
    if (onSetClientName) onSetClientName(tempName);
  }, [tempName, onSetClientName]);

  useEffect(() => {
    if (onSetClientCity) onSetClientCity(tempCity);
  }, [tempCity, onSetClientCity]);

  // Helpers for carousel triggers
  const nextDest = () => {
    setActiveDestIdx((prev) => (prev + 1) % destinations.length);
  };
  const prevDest = () => {
    setActiveDestIdx((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

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
      dayIndex: 1,
      adults: 2,
      children: 0,
      infants: 0,
      observations: ""
    };
  };

  const updateBookingConfig = (expId: string, fields: Partial<typeof bookingConfigs[string]>) => {
    setBookingConfigs(prev => {
      const current = prev[expId] || {
        dayIndex: 1,
        adults: 2,
        children: 0,
        infants: 0,
        observations: ""
      };
      return {
        ...prev,
        [expId]: { ...current, ...fields }
      };
    });
  };

  // Intelligent schedule collision checks
  const getSmartRecommendations = (dayNum: number, currentExpId: string) => {
    const dayBookedItems = cart.filter(item => item.dayIndex === dayNum);
    if (dayBookedItems.length === 0) {
      return {
        allowed: true,
        message: "Perfeito! O dia selecionado está livre e pronto para receber este passeio."
      };
    }

    // Is there already something booked?
    if (dayBookedItems.length >= 2) {
      return {
        allowed: false,
        message: `Aviso: Você já agendou ${dayBookedItems.length} atividades no Dia ${dayNum}. Sugerimos transferir esta nova para o Dia ${dayNum === stayDays ? dayNum - 1 : dayNum + 1} para garantir conforto.`
      };
    }

    const firstItem = dayBookedItems[0];
    const firstExp = experiences.find(e => e.id === firstItem.experienceId);
    const incomingExp = experiences.find(e => e.id === currentExpId);

    if (firstItem.experienceId === currentExpId) {
      return {
        allowed: false,
        message: `Você já agendou o passeio "${incomingExp?.name}" neste Dia ${dayNum}.`
      };
    }

    return {
      allowed: true,
      message: `Você já tem "${firstExp?.name}" agendado no Dia ${dayNum}. Ambos encaixam muito bem pois um acontece de manhã e outro à tarde!`
    };
  };

  // Filter experiences based on selected user profiles dynamically (curation!)
  const getFilteredExperiences = () => {
    let filtered = experiences.filter(exp => exp.status === "active");

    if (profile === "casal") {
      // Prioritize maritime, picnics, dinners, wine/champagne
      filtered = filtered.sort((a, b) => {
        if (a.id.includes("sunset") || a.id.includes("dinner") || a.id.includes("gourmet")) return -1;
        if (b.id.includes("sunset") || b.id.includes("dinner") || b.id.includes("gourmet")) return 1;
        return 0;
      });
    } else if (profile === "familia") {
      // Prioritize safety, comfort, fruit boats, boat premium
      filtered = filtered.sort((a, b) => {
        if (a.id.includes("premium")) return -1;
        if (b.id.includes("premium")) return 1;
        return 0;
      });
    } else if (profile === "amigos") {
      // Prioritize off-road buggy, high speed, diving
      filtered = filtered.sort((a, b) => {
        if (a.id.includes("buggy") || a.id.includes("mergulho")) return -1;
        if (b.id.includes("buggy") || b.id.includes("mergulho")) return 1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredExps = getFilteredExperiences();

  return (
    <div className="w-full bg-[#FCFBF9] text-[#0D1B2A] font-sans pb-16">
      
      {/* Immersive Top Steps Tracker Menu Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-150 py-3.5 px-4 shadow-sm text-left">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onNavigate("home");
            }}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-[#E8711A] text-xs font-bold uppercase transition-all py-1.5 px-3 hover:bg-zinc-100 rounded-full cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{step === 1 ? "Início" : "Voltar"}</span>
          </button>

          {/* Stepper Bubble Indicators */}
          <div className="flex items-center gap-3">
            {[
              { num: 1, label: "Perfil" },
              { num: 2, label: "Destino & Dias" },
              { num: 3, label: "Experiências" }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  step === s.num
                    ? "bg-[#0D1B2A] text-[#FCFBF9] ring-4 ring-[#0D1B2A]/10 scale-105 font-bold"
                    : step > s.num
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-200 text-zinc-500"
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : s.num}
                </span>
                <span className={`hidden sm:inline text-xs font-bold ${
                  step === s.num ? "text-[#0D1B2A]" : "text-zinc-400"
                }`}>{s.label}</span>
                {s.num < 3 && <span className="hidden sm:inline w-8 h-px bg-zinc-200" />}
              </div>
            ))}
          </div>

          <div>
            {step === 3 ? (
              <button
                onClick={() => onNavigate("roteiro")}
                className="bg-[#E8711A] hover:bg-[#C45E12] text-white px-4 py-2 rounded-full text-xs font-bold uppercase transition-all shadow cursor-pointer flex items-center gap-1.5"
              >
                <span>Revisar ({cart.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button 
                onClick={() => setStep(step + 1)}
                className="bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] px-4.5 py-2 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 text-center">

        <AnimatePresence mode="wait">
          
          {/* STEP 1: TRAVEL PROFILE SELECTOR */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              {/* Premium Happy People Photo with editorial badge */}
              <div className="relative w-full h-[52vh] sm:h-[42vh] rounded-3xl overflow-hidden shadow-md border border-zinc-200">
                <img 
                  src="https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&w=1200&q=80" 
                  alt="Pessoas felizes celebrando em Arraial" 
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.02]"
                />
                
                {/* Beautiful gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10 text-left space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-[#E8711A] text-white px-3.5 py-1.5 rounded-full w-max text-[10px] font-black uppercase tracking-wider font-accent shadow">
                    <Sparkles className="w-3.5 h-3.5" />
                    Experiência Exclusiva Sob Medida
                  </div>
                  
                  <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#FCFBF9] tracking-tight leading-tight max-w-2xl">
                    Sua viagem perfeita começa escolhendo quem vai com você
                  </h2>
                  
                  <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed">
                    Personalizamos o catering de bordo, o ritmo das paradas e os segredos do passeio com base no seu grupo para evitar as multidões de forma inteligente.
                  </p>
                </div>
              </div>

              {/* Explanatory text box detailing why profile is crucial */}
              <div className="bg-amber-50/60 rounded-2xl border border-amber-200/50 p-4.5 sm:p-6 text-left space-y-2.5 max-w-2xl mx-auto">
                <h4 className="text-xs sm:text-sm font-bold text-[#E8711A] uppercase tracking-wide flex items-center gap-2">
                  <InfoIcon className="w-4 h-4" />
                  Por que escolher a sua categoria?
                </h4>
                <p className="text-xs text-zinc-650 leading-relaxed">
                  Para casais, organizamos piqueniques íntimos com espumantes finos nos mirantes desabitados. Para famílias, preparamos embarcações estáveis com cortes de frutas frescas e boias seguras. Para amigos, focamos na emoção do buggy nas dunas e paradas ideais para belos saltos no mar. Crie seu dia do jeito certo!
                </p>
              </div>

              {/* Tilted High-contrast Profile cards */}
              <div className="space-y-4 max-w-2xl mx-auto text-left">
                <span className="font-accent text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase block text-center">
                  Escolha o seu perfil de aventura abaixo:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
                  {[
                    {
                      id: "casal",
                      label: "Casal Romântico 👩‍❤️‍👨",
                      desc: "Brindes finos de espumante e piqueniques ao pôr do sol em falésias exclusivas.",
                      color: "border-pink-200 hover:border-pink-400 focus:ring-pink-100"
                    },
                    {
                      id: "familia",
                      label: "Em Família 👨‍👩‍👧‍👦",
                      desc: "Barco limpo, água e frutas cortadas, boias e suporte absoluto para crianças brincarem rindo.",
                      color: "border-sky-200 hover:border-sky-400 focus:ring-sky-100"
                    },
                    {
                      id: "amigos",
                      label: "Com Amigos 🥳",
                      desc: "Rotas ágeis off-road de buggy pelas dunas e trilhas, seguidas de mergulhos livres animados.",
                      color: "border-amber-200 hover:border-amber-400 focus:ring-amber-100"
                    }
                  ].map((pOpt) => {
                    const isSelected = profile === pOpt.id;
                    return (
                      <button
                        key={pOpt.id}
                        type="button"
                        onClick={() => {
                          setProfile(pOpt.id as any);
                        }}
                        className={`p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-44 ${
                          isSelected
                            ? "bg-[#0D1B2A] text-[#FCFBF9] border-[#0D1B2A] shadow-md scale-[1.02]"
                            : "bg-white text-[#0D1B2A] hover:bg-zinc-50 " + pOpt.color
                        }`}
                      >
                        <div className="space-y-1.5">
                          <h3 className="font-serif text-lg font-bold">
                            {pOpt.label}
                          </h3>
                          <p className={`text-xs ${
                            isSelected ? "text-zinc-300" : "text-zinc-500"
                          } leading-relaxed`}>
                            {pOpt.desc}
                          </p>
                        </div>

                        {isSelected && (
                          <span className="absolute bottom-4 right-4 bg-[#E8711A] text-white p-1 rounded-full">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Action Trigger to step 2 */}
              <div className="pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-8 py-4 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md hover:scale-103 cursor-pointer"
                >
                  Salvar Perfil e Avançar &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CHOOSE PLACE & STAY DURATION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-10 text-left"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="font-accent text-[10px] text-[#E8711A] tracking-wider uppercase font-bold">PASSO 02 DE 03</span>
                <h2 className="font-serif text-2xl sm:text-4.5xl font-extrabold text-[#0D1B2A]">Sintonize as Praias e Tempo de Estadia</h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Deslize no carrossel de fotos para conferir nossos pontos icônicos em Arraial e determine quantos dias maravilhosos você passará em Cabo.
                </p>
              </div>

              {/* DESTINATIONS IMAGE CAROUSEL SLIDER - Beautifully curated with "Ver mais detalhes do lugar" overlay */}
              <div className="relative max-w-2xl mx-auto">
                <div className="overflow-hidden rounded-3xl border border-zinc-200/50 shadow-md aspect-[16/9] relative group">
                  <img 
                    src={destinations[activeDestIdx].image} 
                    alt={destinations[activeDestIdx].name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
                  />
                  
                  {/* Frosted details band */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <span className="text-xs text-[#E8711A] font-bold tracking-wider uppercase">{destinations[activeDestIdx].tagline}</span>
                    <h3 className="font-serif text-xl sm:text-3xl font-extrabold text-white mt-1">{destinations[activeDestIdx].name}</h3>
                    
                    {/* Centered Overlay Trigger for more details */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <button
                        onClick={() => setSelectedDestDetail(destinations[activeDestIdx])}
                        className="pointer-events-auto bg-white/90 backdrop-blur-md text-[#0D1B2A] hover:bg-[#E8711A] hover:text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-all duration-300 shadow shadow-black/10 select-none hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                        <span>Ver mais detalhes do lugar</span>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-300 mt-2 max-w-lg line-clamp-2 md:line-clamp-none">
                      {destinations[activeDestIdx].desc}
                    </p>
                  </div>

                  {/* Manual Carousel controls */}
                  <button
                    onClick={prevDest}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-[#0D1B2A] hover:text-[#E8711A] rounded-full shadow transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextDest}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-[#0D1B2A] hover:text-[#E8711A] rounded-full shadow transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Dot Slider indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {destinations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDestIdx(idx)}
                      className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                        activeDestIdx === idx ? "w-7 bg-[#E8711A]" : "w-2.5 bg-zinc-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* TACTILE DURATION CHOOSE PANEL */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto text-left space-y-6 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <span className="p-2 bg-[#E8711A]/8 text-[#E8711A] rounded-2xl block border border-[#E8711A]/10">
                    <Calendar className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">Selecione a Duração Ideal de Estadia</h3>
                    <p className="text-xs text-zinc-500">Iremos estruturar e distribuir suas atividades ao longo destes dias de forma bem confortável.</p>
                  </div>
                </div>

                {/* Elegant Preset Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { days: 2, label: "Fim de Semana / Express", subtitle: "2 Dias", desc: "Perfeito para um vislumbre rápido e charmoso das praias clássicas e pôr do sol.", icon: "⚡" },
                    { days: 4, label: "Estadia Recomendada", subtitle: "4 Dias", desc: "Tempo ideal para explorar sem pressa. Combina mar, dunas móveis e ótimos restaurantes.", icon: "⭐" },
                    { days: 6, label: "Imersão no Território", subtitle: "6 Dias", desc: "Desacelere de verdade. Conheça trilhas de nativos, praias desertas e recantos ecológicos.", icon: "🧭" },
                  ].map((preset) => {
                    const isPresetSelected = stayDays === preset.days;
                    return (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => onUpdateStayDays(preset.days)}
                        className={`p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative flex flex-col justify-between h-[155px] ${
                          isPresetSelected 
                            ? "border-[#E8711A] bg-[#E8711A]/5 shadow-sm ring-2 ring-[#E8711A]/13 scale-[1.01]"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-lg">{preset.icon}</span>
                            <span className={`text-[9px] font-sans font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              isPresetSelected ? "bg-[#E8711A] text-white" : "bg-zinc-100 text-zinc-500"
                            }`}>{preset.subtitle}</span>
                          </div>
                          <h4 className="font-serif text-xs font-extrabold text-[#0D1B2A]">{preset.label}</h4>
                          <p className="text-[10px] text-zinc-400 font-sans leading-relaxed line-clamp-3">{preset.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fine Pill Segment controller for precise day selection */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                  <span className="text-[9px] text-zinc-400 block font-bold text-center uppercase tracking-widest">— OU ESCOLHA A QUANTIDADE EXATA DE DIAS —</span>
                  
                  <div className="flex flex-wrap sm:flex-nowrap bg-zinc-100 p-1 rounded-2xl border border-zinc-200/40 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                      const isSelected = stayDays === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => onUpdateStayDays(num)}
                          className={`flex-1 py-2.5 text-center rounded-xl transition-all text-xs font-bold font-sans cursor-pointer whitespace-nowrap min-w-[50px] ${
                            isSelected 
                              ? "bg-[#0D1B2A] text-white shadow-sm scale-102"
                              : "text-zinc-500 hover:text-[#0D1B2A] hover:bg-zinc-200/70"
                          }`}
                        >
                          {num} {num === 1 ? "Dia" : "Dias"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fast Leads Personal Data capture directly mapped so parent can read client details */}
                <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[#0D1B2A] font-bold block">Seu Nome e Sobrenome *</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                      placeholder="Ex: Ana Luiza"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#0D1B2A] font-bold block">Sua Cidade de Origem *</label>
                    <input
                      type="text"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                      placeholder="Ex: São Paulo - SP"
                      value={tempCity}
                      onChange={(e) => setTempCity(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit navigation */}
              <div className="flex gap-4 justify-center pt-4 max-w-2xl mx-auto">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 border border-zinc-300 text-zinc-650 hover:border-[#0D1B2A] hover:text-[#0D1B2A] rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  &larr; Voltar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!tempName.trim()) {
                      alert("Por favor, preencha seu nome para prosseguir.");
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-8 py-3.5 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer hover:scale-102 flex items-center gap-1.5"
                >
                  <span>Ver Passeios Sugeridos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT AND CUSTOMISE EXPERIENCES */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-left"
            >
              
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-wider bg-[#E8711A]/8 px-3.5 py-1.5 rounded-full">
                  ⚓ CURADORIA DE PASSEIOS ATIVA
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0D1B2A] pt-2">
                  Escolha Seus Passeios dos Sonhos
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Fizemos uma seleção baseada no perfil <strong className="text-[#0D1B2A] capitalize font-bold">"{profile}"</strong>. Siga programando cada atividade para o dia mais confortável e com as pessoas que viajarão com você!
                </p>
              </div>

              {/* Premium Selected Summary Card */}
              <div className="bg-[#E8711A]/5 border border-[#E8711A]/10 rounded-2xl p-5 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1">
                  <p className="font-accent text-[8px] text-[#E8711A] font-extrabold tracking-widest uppercase">ROTEIRO IDEAL SINTONIZADO</p>
                  <h3 className="font-serif text-base font-extrabold text-[#0D1B2A]">
                    Sua Estadia: <span className="text-[#E8711A]">{stayDays} {stayDays === 1 ? "Dia" : "Dias"}</span> em Arraial do Cabo
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-sans">
                    Roteiro para <strong className="text-zinc-700 font-bold">{tempName || "Explorador"}</strong>{tempCity ? ` vindo de ${tempCity}` : ""} • Perfil: <span className="capitalize font-bold text-[#E8711A]">{profile}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-zinc-200 hover:border-[#E8711A] text-zinc-650 hover:text-[#E8711A] rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer select-none bg-white shadow-xs"
                >
                  ⚙️ Alterar Estadia
                </button>
              </div>

              {/* EXPERIENCES LIST GRID - Rounded aesthetics, responsive */}
              <div className="space-y-8">
                {filteredExps.map((exp) => {
                  const activePhotoIndex = expPhotoCache[exp.id] || 0;
                  const config = getBookingConfig(exp.id);
                  const isAlreadyInCart = cart.some(item => item.experienceId === exp.id && item.dayIndex === config.dayIndex);
                  
                  // smart conflict validator calculations
                  const feedback = getSmartRecommendations(config.dayIndex, exp.id);

                  return (
                    <div 
                      key={exp.id}
                      className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-5 p-5 md:p-6"
                    >
                      {/* Left side: Premium photo carousel slider */}
                      <div className="md:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200/50 bg-zinc-100 shadow-inner group">
                        
                        {exp.photos && exp.photos.length > 0 ? (
                          <img 
                            src={exp.photos[activePhotoIndex]} 
                            alt={exp.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xs text-[#0D1B2A]">Sem Fotos</div>
                        )}

                        {exp.badge && (
                          <span className="absolute top-3 left-3 bg-[#E8711A] text-[#0D1B2A] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                            {exp.badge === "mais-vendido" ? "🏆 MAIS PROCURADO" : exp.badge}
                          </span>
                        )}

                        {/* Slide photo togglers */}
                        {exp.photos && exp.photos.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => prevExpPhoto(exp.id, exp.photos.length)}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 text-zinc-700 hover:text-[#E8711A] rounded-full shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => nextExpPhoto(exp.id, exp.photos.length)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 text-zinc-700 hover:text-[#E8711A] rounded-full shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Carousel photo count dots */}
                            <div className="absolute bottom-3 right-3 bg-[#0D1B2A]/75 backdrop-blur-sm text-[#FCFBF9] text-[9px] font-bold px-2 py-0.5 rounded-lg">
                              {activePhotoIndex + 1} / {exp.photos.length}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Right side: Information curation & instant configuration panel */}
                      <div className="md:col-span-7 flex flex-col justify-between space-y-4 text-left">
                        
                        {/* Title, brief description, "ver mais detalhes" */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider">⏱ Duração: {exp.duration}</span>
                            <span className="text-zinc-600 font-bold text-xs bg-zinc-100 py-1 px-2.5 rounded-full font-mono">R$ {exp.priceFrom} / Pess</span>
                          </div>

                          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0D1B2A] leading-tight hover:text-[#E8711A] transition-colors">{exp.name}</h3>
                          
                          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed italic">
                            "{exp.shortDescription}"
                          </p>

                          {/* Detail pop trigger */}
                          <button
                            type="button"
                            onClick={() => setSelectedExpDetail(exp)}
                            className="text-[#E8711A] hover:text-[#0D1B2A] font-extrabold text-xs uppercase tracking-wider block pt-1 hover:underline cursor-pointer"
                          >
                            Ver mais detalhes sobre o passeio +
                          </button>
                        </div>

                        {/* INSTANT CONFIGURATION SHEETS PANEL - VERY TACTILE AND INTUITIVE */}
                        <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/60 text-xs text-left space-y-4">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Schedule Day Selector */}
                            <div className="space-y-1 text-left">
                              <label className="text-[10px] text-zinc-500 font-extrabold uppercase block tracking-wider">Qual Dia da Viagem?</label>
                              <select
                                value={config.dayIndex}
                                onChange={(e) => updateBookingConfig(exp.id, { dayIndex: parseInt(e.target.value, 10) })}
                                className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-[#E8711A] font-bold text-zinc-800 cursor-pointer"
                              >
                                {Array.from({ length: stayDays }).map((_, idx) => (
                                  <option key={idx + 1} value={idx + 1}>
                                    Dia {idx + 1} da Minha Viagem
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Passenger counts with age references inside labels */}
                            <div className="space-y-1 text-left">
                              <label className="text-[10px] text-zinc-500 font-extrabold uppercase block tracking-wider">Sua Idade / Grupo</label>
                              <div className="flex items-center border border-zinc-200 bg-white p-1 rounded-xl h-[38px] justify-between px-3">
                                <span className="text-zinc-500 text-[10px] font-medium font-accent">PASAGEIROS</span>
                                <div className="flex items-center gap-2 font-bold text-zinc-800">
                                  <button
                                    type="button"
                                    onClick={() => updateBookingConfig(exp.id, { adults: Math.max(1, config.adults - 1) })}
                                    className="w-5.5 h-5.5 bg-zinc-100 hover:bg-zinc-200 rounded text-center font-bold font-sans cursor-pointer flex items-center justify-center text-xs"
                                  >-</button>
                                  <span className="w-4 text-center text-xs">{config.adults}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateBookingConfig(exp.id, { adults: config.adults + 1 })}
                                    className="w-5.5 h-5.5 bg-zinc-100 hover:bg-zinc-200 rounded text-center font-bold font-sans cursor-pointer flex items-center justify-center text-xs"
                                  >+</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Extra passenger rows for kids & babies */}
                          <div className="grid grid-cols-2 gap-3.5 pt-1">
                            <div className="flex justify-between items-center bg-white border border-zinc-200 rounded-xl py-1 px-3">
                              <div className="text-left">
                                <span className="text-[10px] font-bold block text-[#0D1B2A]">Crianças</span>
                                <span className="text-[9px] text-zinc-400 block">(2-12 anos)</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-bold">
                                <button
                                  type="button"
                                  onClick={() => updateBookingConfig(exp.id, { children: Math.max(0, config.children - 1) })}
                                  className="w-5 h-5 bg-zinc-150 hover:bg-zinc-200 rounded text-center cursor-pointer text-xs"
                                >-</button>
                                <span className="w-3 text-center text-xs">{config.children}</span>
                                <button
                                  type="button"
                                  onClick={() => updateBookingConfig(exp.id, { children: config.children + 1 })}
                                  className="w-5 h-5 bg-zinc-150 hover:bg-zinc-200 rounded text-center cursor-pointer text-xs"
                                >+</button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center bg-white border border-zinc-200 rounded-xl py-1 px-3">
                              <div className="text-left">
                                <span className="text-[10px] font-bold block text-[#0D1B2A]">Bebês</span>
                                <span className="text-[9px] text-zinc-400 block">(Colo) Grátis</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-bold">
                                <button
                                  type="button"
                                  onClick={() => updateBookingConfig(exp.id, { infants: Math.max(0, config.infants - 1) })}
                                  className="w-5 h-5 bg-zinc-150 hover:bg-zinc-200 rounded text-center cursor-pointer text-xs"
                                >-</button>
                                <span className="w-3 text-center text-xs">{config.infants}</span>
                                <button
                                  type="button"
                                  onClick={() => updateBookingConfig(exp.id, { infants: config.infants + 1 })}
                                  className="w-5 h-5 bg-zinc-150 hover:bg-zinc-200 rounded text-center cursor-pointer text-xs"
                                >+</button>
                              </div>
                            </div>
                          </div>

                          {/* COLLISION VERIFIER FEEDBACK */}
                          <div className={`p-2 rounded-xl flex items-start gap-2 border text-[11px] leading-relaxed font-sans ${
                            feedback.allowed 
                              ? "bg-zinc-100 border-zinc-200 text-zinc-650" 
                              : "bg-amber-50 border-amber-200 text-amber-900 font-medium"
                          }`}>
                            <Info className={`w-4 h-4 shrink-0 mt-0.5 ${feedback.allowed ? "text-zinc-500" : "text-amber-600 animate-pulse"}`} />
                            <div className="text-left">{feedback.message}</div>
                          </div>

                          {/* Booking/Add CTA button with smart checkmark inside */}
                          <button
                            type="button"
                            onClick={() => {
                              // If already in cart, remove it first to act as a toggle or prevent duplication
                              if (isAlreadyInCart) {
                                const idxToRemove = cart.findIndex(item => item.experienceId === exp.id && item.dayIndex === config.dayIndex);
                                if (idxToRemove !== -1) {
                                  onRemoveFromCart(idxToRemove);
                                }
                              } else {
                                // Add to cart with progressive dynamic sequence date matching dayIndex
                                const today = new Date();
                                const targetDate = new Date(today);
                                targetDate.setDate(today.getDate() + (config.dayIndex - 1));
                                const dateStr = targetDate.toISOString().split("T")[0];
                                onAddToCart({
                                  experienceId: exp.id,
                                  date: dateStr,
                                  schedule: exp.schedules && exp.schedules.length > 0 ? exp.schedules[0] : "08:00",
                                  adults: config.adults,
                                  children: config.children,
                                  infants: config.infants,
                                  people: config.adults + config.children + config.infants,
                                  observations: config.observations || "Configurado pelo Wizard Intuitivo!",
                                  dayIndex: config.dayIndex
                                });
                              }
                            }}
                            className={`w-full text-center py-3 rounded-xl text-xs font-accent font-extrabold uppercase tracking-wider transition-all duration-300 shadow cursor-pointer ${
                              isAlreadyInCart
                                ? "bg-emerald-600 text-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 hover:bg-red-50/10 flex items-center justify-center gap-1.5"
                                : "bg-[#0D1B2A] text-[#FCFBF9] hover:bg-[#E8711A] hover:text-[#0D1B2A] hover:scale-[1.01]"
                            }`}
                          >
                            {isAlreadyInCart ? (
                              <>
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>Adicionado ao Dia {config.dayIndex} (Remover?)</span>
                              </>
                            ) : (
                              <span>Adicionar este Passeio ao Dia {config.dayIndex} ⛵</span>
                            )}
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FINALIZE CHECKOUT WIZARD CALL ACTION */}
              <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#E8711A]/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">Seu Cronograma está pronto para o Concierge!</h3>
                <p className="text-xs sm:text-sm text-zinc-350 max-w-md mx-auto leading-relaxed">
                  Você já selecionou <strong className="text-white bg-white/10 px-2 py-0.5 rounded font-mono text-xs">{cart.length} experiências</strong>. Vamos gerar os vouchers personalizados, coordenar marinheiros e garantir as cortesias do seu brinde.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 py-2 justify-center">
                  <button
                    onClick={() => {
                      setStep(2);
                    }}
                    className="px-6 py-3.5 border border-white/20 hover:border-[#E8711A] text-white hover:text-[#E8711A] text-xs font-bold uppercase transition-colors rounded-full cursor-pointer"
                  >
                    &larr; Alterar Dias
                  </button>
                  
                  <button
                    onClick={() => onNavigate("roteiro")}
                    className="px-8 py-3.5 bg-[#E8711A] hover:bg-white text-[#0D1B2A] text-xs font-accent font-extrabold tracking-widest uppercase rounded-full transition-all duration-300 shadow-md hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Confirmar Roteiro Concluído! 🍾</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* DETAILED DESTINATION PORTFOLIO MODAL (Ver mais detalhes do lugar popup) */}
      <AnimatePresence>
        {selectedDestDetail && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-zinc-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-left text-[#0D1B2A]"
            >
              <div className="relative aspect-[16/10] bg-zinc-100">
                <img 
                  src={selectedDestDetail.image} 
                  alt={selectedDestDetail.name} 
                  className="w-full h-full object-cover filter brightness-[0.9]"
                />
                <button
                  type="button"
                  onClick={() => setSelectedDestDetail(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white hover:text-[#E8711A] rounded-full shadow transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold text-[#E8711A] bg-[#0D1B2A]/80 px-3 py-1 rounded-full">{selectedDestDetail.tagline}</span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-1.5 shadow-sm">{selectedDestDetail.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-5 text-xs sm:text-sm leading-relaxed">
                <div className="space-y-2">
                  <span className="font-accent text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">SOBRE O LOCAL</span>
                  <p className="text-zinc-650 leading-relaxed font-sans">{selectedDestDetail.desc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#FBF9F7] p-4 rounded-2xl border border-zinc-100 text-left">
                    <span className="text-[10px] text-[#E8711A] font-bold block uppercase tracking-wider">🌟 MELHOR HORÁRIO</span>
                    <p className="text-xs mt-1 text-[#0D1B2A] font-medium leading-relaxed">{selectedDestDetail.bestTime}</p>
                  </div>
                  <div className="bg-[#FBF9F7] p-4 rounded-2xl border border-zinc-100 text-left">
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">💡 DICA DO MARINHEIRO</span>
                    <p className="text-xs mt-1 text-zinc-600 leading-relaxed font-medium">{selectedDestDetail.highlight}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDestDetail(null)}
                  className="w-full text-center py-3.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] text-xs font-accent font-extrabold tracking-widest uppercase rounded-2xl transition-all cursor-pointer"
                >
                  Fechar Detalhes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              {/* Header and banner image */}
              <div className="relative h-48 bg-zinc-100">
                {selectedExpDetail.photos && selectedExpDetail.photos.length > 0 ? (
                  <img src={selectedExpDetail.photos[0]} alt={selectedExpDetail.name} className="w-full h-full object-cover filter brightness-[0.7]" />
                ) : (
                  <div className="w-full h-full bg-[#0D1B2A] text-white flex items-center justify-center text-center">Fundo</div>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedExpDetail(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white hover:text-[#E8711A] rounded-full shadow transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white hover:text-white/90">
                  <span className="text-[10px] bg-[#E8711A] text-[#0D1B2A] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg">CUPOM PREPARADO</span>
                  <h3 className="font-serif text-lg sm:text-2xl font-extrabold text-white mt-1 leading-tight">{selectedExpDetail.name}</h3>
                </div>
              </div>

              {/* Complete Stops & descriptive logic */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto text-xs sm:text-sm leading-relaxed text-left">
                
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Peculiaridades do Roteiro Curado</h4>
                  <p className="text-zinc-650 leading-relaxed">{selectedExpDetail.fullDescription.replace(/[#*]/g, "")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-zinc-100">
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-[#E8711A] font-extrabold tracking-wider uppercase block">O que está INCORPORADO:</span>
                    <ul className="space-y-11/12 list-none text-xs text-zinc-650">
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
                    <ul className="space-y-11/12 list-none text-xs text-zinc-550">
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
                  <span className="text-[9px] text-[#E8711A] font-bold uppercase tracking-wider block">📍 PONTO DE ENCONTRO</span>
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
