import React, { useState } from "react";
import { 
  MapPin, Compass, Calendar, MessageCircle, Heart, Star, Check, ArrowRight, Sparkles, Plus, X,
  Wind, Waves, Activity, Info, AlertTriangle, Sun, CloudRain
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Experience, BookingCartItem, GlobalSettings, getBrazilLocalDate, addDaysToBrazilDate, Destination } from "../types";

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onAddToCart?: (item: BookingCartItem) => void;
  settings?: GlobalSettings;
  experiences?: Experience[];
  selectedHotelId?: string | null;
  onChangeHotelId?: (id: string | null) => void;
  stayDays?: number;
  destinations: Destination[];
  selectedDestinationId: string | null;
  onUpdateSelectedDestinationId: (id: string) => void;
  onWhatsAppContact?: (message?: string) => void;
}

export default function HomeView({ 
  onNavigate, 
  onAddToCart, 
  settings, 
  experiences = [], 
  stayDays = 3,
  destinations,
  selectedDestinationId,
  onUpdateSelectedDestinationId,
  onWhatsAppContact
}: HomeViewProps) {

  // States of the micro-itinerary configurator drawer inside the homepage cards
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [configDay, setConfigDay] = useState<number>(1);
  const [configSchedule, setConfigSchedule] = useState<string>("");
  const [configAdults, setConfigAdults] = useState<number>(2);
  const [successNotifId, setSuccessNotifId] = useState<string | null>(null);

  // Nautical Weather & Wind Forecast Panel States
  const [selectedForecastDay, setSelectedForecastDay] = useState<number>(1);
  const [showUpwellingModal, setShowUpwellingModal] = useState<boolean>(false);

  // Marine Forecast Data representing highly realistic conditions for Arraial do Cabo
  const forecastDays = [
    {
      day: 1,
      label: "Hoje",
      windSpeed: "8 kt",
      windDir: "Nordeste (NE)",
      waves: "0.7 m",
      temp: "21°C",
      condition: "Perfeito",
      icon: Sun,
      color: "text-emerald-500",
      bgBadge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      description: "O vento Nordeste sopra suave. Condições ideais para o Passeio de Barco Premium e mergulho. O mar de dentro está calmo como uma lagoa cristalina.",
      recommendation: "Dia ideal para reservar atividades marinhas ao ar livre!"
    },
    {
      day: 2,
      label: "Amanhã",
      windSpeed: "16 kt",
      windDir: "Nordeste (NE)",
      waves: "0.9 m",
      temp: "20°C",
      condition: "Firme",
      icon: Wind,
      color: "text-amber-500",
      bgBadge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      description: "Vento Nordeste moderado a forte. A navegação no mar de dentro (Prainhas e Farol) continua segura, mas o mar de fora pode balançar um pouco mais.",
      recommendation: "Recomendamos o Passeio de Barco Premium em embarcações maiores ou focar em curtir a Pousada."
    },
    {
      day: 3,
      label: "Depois de Amanhã",
      windSpeed: "22 kt",
      windDir: "Sudoeste (SW)",
      waves: "1.8 m",
      temp: "19°C",
      condition: "Agitado",
      icon: CloudRain,
      color: "text-red-500",
      bgBadge: "bg-red-500/10 text-red-500 border-red-500/20",
      description: "Frente fria trazendo vento Sudoeste forte e swell elevado. A Marinha poderá restringir ou fechar a saída do porto de Praia dos Anjos.",
      recommendation: "Excelente dia para uma aventura terrestre! Agende a Expedição de Buggy Off-Road e conheça as dunas e praias secretas por terra."
    },
    {
      day: 4,
      label: "Em 3 Dias",
      windSpeed: "6 kt",
      windDir: "Leste (E)",
      waves: "0.6 m",
      temp: "22°C",
      condition: "Espetacular",
      icon: Sun,
      color: "text-emerald-500",
      bgBadge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      description: "Mar de Almirante. Vento quase nulo e visibilidade excepcional sob a água. Condição perfeita para o Batismo de Mergulho ou lanchas privativas.",
      recommendation: "Não perca a chance de mergulhar ou fazer um tour privativo exclusivo."
    }
  ];

  const activeExps = experiences && experiences.length > 0
    ? experiences.filter((e) => e.status === "active").slice(0, 3)
    : [];

  return (
    <div id="home-view" className="relative bg-[#FBF9F6]">
      {/* 1. HERO PRINCIPAL */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#0D1B2A] text-[#FBF9F6] overflow-hidden px-4 pt-28 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#E8711A]/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8711A]/10 border border-[#E8711A]/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#E8711A] animate-pulse" />
              <span className="font-accent text-[#E8711A] text-[9px] font-extrabold tracking-widest uppercase">
                O Primeiro Roteiro Inteligente do Brasil
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
              Sua viagem <span className="text-[#E8711A] italic">inteira</span>,<br />organizada em 2 minutos.
            </h1>
            <p className="font-sans text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Esqueça planilhas, orçamentos espalhados e horas de pesquisa. Nossa inteligência conecta as melhores experiências, horários, hospedagens e restaurantes no seu ritmo. Você só precisa arrumar as malas.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6">
              <button onClick={() => onNavigate("wizard")} className="px-8 py-5 bg-[#E8711A] hover:bg-[#FF8A3F] text-[#0D1B2A] font-accent text-xs font-black tracking-widest uppercase transition-all rounded-lg shadow-[0_10px_30px_rgba(232,113,26,0.35)] flex items-center justify-center gap-2.5 hover:scale-[1.03] active:scale-[0.98] cursor-pointer">
                Montar meu Roteiro Agora <Compass className="w-4 h-4" />
              </button>
            </div>
            <div className="pt-4 flex items-center gap-3 text-xs text-white/50 font-sans">
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#E8711A]" /> Totalmente Gratuito</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#E8711A]" /> Personalizado pra você</span>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <img 
                src={"https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=850&q=80"} 
                alt="Paraíso em Arraial do Cabo" 
                className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110 filter contrast-[1.15] brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-[#0D1B2A]/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 bg-[#0D1B2A]/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-left space-y-4 shadow-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 text-[#E8711A]">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="px-2.5 py-1 bg-[#E8711A]/20 text-[#E8711A] text-[9px] font-accent font-bold uppercase rounded border border-[#E8711A]/30">
                    Guia IA
                  </span>
                </div>
                <p className="font-sans text-[13px] sm:text-sm text-white/90 line-clamp-3 leading-relaxed">
                  "Eu não precisei me preocupar com absolutamente nada. A Guida Trips montou meu cronograma, alinhou os horários dos passeios e encontrou a pousada perfeita."
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-600 overflow-hidden border border-white/20">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Mariana Lima" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-accent text-[9px] text-zinc-300 uppercase tracking-widest block font-bold">MARIANA LIMA, SP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
              COMO FUNCIONA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
              Sua viagem organizada em 5 passos
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Escolha seu destino", icon: MapPin },
              { step: "02", title: "Monte seu roteiro", icon: Calendar },
              { step: "03", title: "Selecione experiências", icon: Compass },
              { step: "04", title: "Receba atendimento", icon: MessageCircle },
              { step: "05", title: "Aproveite a viagem", icon: Heart },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-zinc-200 flex items-center justify-center text-[#0D1B2A] relative">
                  <item.icon className="w-6 h-6 stroke-[1.5]" />
                  <div className="absolute -top-2 -right-2 bg-[#E8711A] text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 3. DESTINOS */}
      <section className="py-24 bg-[#FBF9F6] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
              DESTINOS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
              Para onde você quer ir?
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => {
              const isActive = dest.status === "active" || dest.id === "arraial-do-cabo"; // Temporary fallback
              return (
                <div 
                  key={dest.id}
                  className={`group relative rounded-2xl overflow-hidden transition-all ${
                    isActive 
                      ? "bg-white border border-zinc-200 cursor-pointer hover:border-[#E8711A] hover:shadow-lg" 
                      : "bg-zinc-100 border border-zinc-200 opacity-70 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (isActive) {
                      onUpdateSelectedDestinationId(dest.id);
                      onNavigate("experiencias");
                    }
                  }}
                >
                  <div className={`h-48 relative overflow-hidden ${!isActive ? "grayscale" : ""}`}>
                    <img src={dest.heroImage} alt={dest.name} className={`w-full h-full object-cover ${isActive ? "transition-transform duration-700 group-hover:scale-110" : ""}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    {isActive ? (
                      <span className="absolute top-4 right-4 bg-emerald-500 text-white font-accent text-[9px] font-bold uppercase px-2.5 py-1 rounded shadow">Ativo</span>
                    ) : (
                      <span className="absolute top-4 right-4 bg-zinc-600 text-white font-accent text-[9px] font-bold uppercase px-2.5 py-1 rounded shadow">Em Breve</span>
                    )}
                  </div>
                  <div className={`p-6 text-left ${isActive ? "bg-white" : "bg-zinc-50"}`}>
                    <h3 className={`font-serif text-xl font-bold mb-1 ${isActive ? "text-[#0D1B2A]" : "text-zinc-600"}`}>{dest.name}</h3>
                    <p className="font-sans text-sm text-zinc-500">{isActive ? dest.shortDescription : "Novas experiências chegando."}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. EXPERIÊNCIAS EM DESTAQUE */}
      {activeExps.length > 0 && (
        <section className="py-24 bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
              <div className="text-left space-y-3">
                <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
                  EXPERIÊNCIAS EM DESTAQUE
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                  Descubra passeios incríveis
                </h2>
                <div className="h-0.5 w-16 bg-[#E8711A]"></div>
              </div>
              <button
                onClick={() => onNavigate("experiencias")}
                className="px-5 py-3 border border-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase transition-colors rounded cursor-pointer"
              >
                Ver Todas as Experiências &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeExps.map((item) => {
                const isConfiguring = activeConfigId === item.id;
                const showSuccess = successNotifId === item.id;
                const itemSchedules = item.schedules && item.schedules.length > 0 ? item.schedules : ["08:00", "14:00"];
                const itemPhoto = item.photos && item.photos.length > 0 ? item.photos[0] : "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80";

                return (
                  <div key={item.id} className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative text-left">
                    <div>
                      <div className="h-60 relative overflow-hidden">
                        <img src={itemPhoto} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95" />
                        <span className="absolute bottom-4 left-4 bg-[#0D1B2A]/90 backdrop-blur-xs text-white font-accent text-[9px] px-2.5 py-1.5 rounded-sm font-bold shadow">
                          📍 {item.location || "Arraial do Cabo"}
                        </span>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#0D1B2A] font-accent text-[10px] font-bold px-2.5 py-1.5 rounded-sm flex items-center gap-1 shadow">
                          <Star className="w-3.5 h-3.5 fill-[#E8711A] text-[#E8711A]" />
                          <span>5.0</span>
                        </div>
                      </div>

                      <div className="p-6 text-left min-h-[160px] relative">
                        <AnimatePresence mode="wait">
                          {showSuccess ? (
                            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 py-2 text-center">
                              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 flex items-center justify-center mx-auto">
                                <Check className="w-5 h-5 stroke-[3]" />
                              </div>
                              <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Sua felicidade está agendada!</h4>
                              <p className="font-sans text-[11px] text-[#5C6874]">O roteiro inteligente reservou a experiência com sucesso.</p>
                              <div className="flex gap-2 pt-1 justify-center">
                                <button onClick={() => onNavigate("roteiro")} className="px-3 py-1.5 bg-[#0D1B2A] text-white text-[9px] font-accent font-extrabold tracking-wider uppercase rounded-sm cursor-pointer hover:bg-[#E8711A]">Ver Meu Roteiro</button>
                                <button onClick={() => setSuccessNotifId(null)} className="px-3 py-1.5 bg-zinc-100 text-zinc-500 text-[9px] font-accent font-extrabold tracking-wider uppercase rounded-sm cursor-pointer hover:bg-zinc-200">Fechar</button>
                              </div>
                            </motion.div>
                          ) : isConfiguring ? (
                            <motion.div key="config" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3 py-1 text-left">
                              <span className="font-accent text-[8px] text-[#E8711A] font-extrabold tracking-widest uppercase block mb-1">
                                📝 CONFIGURAÇÃO DETALHADA NO ROTEIRO:
                              </span>
                              <div>
                                <label className="font-accent text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Qual Dia Curado?</label>
                                <div className="flex flex-wrap gap-1.5">
                                  {Array.from({ length: stayDays }).map((_, i) => {
                                    const dNum = i + 1;
                                    return (
                                      <button 
                                        key={dNum} 
                                        type="button" 
                                        onClick={() => setConfigDay(dNum)} 
                                        className={`px-3 py-1.5 rounded-full font-accent text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                          configDay === dNum 
                                            ? "bg-[#0D1B2A] text-white shadow-sm" 
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        }`}
                                      >
                                        Dia {dNum}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                  <label className="font-accent text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Horário:</label>
                                  <select value={configSchedule || itemSchedules[0]} onChange={(e) => setConfigSchedule(e.target.value)} className="w-full bg-zinc-50 border border-zinc-250 p-1.5 text-[11px] font-sans font-medium text-[#0D1B2A] rounded focus:outline-none">
                                    {itemSchedules.map((sch) => <option key={sch} value={sch}>{sch}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="font-accent text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Pessoas:</label>
                                  <div className="flex items-center gap-2 border border-zinc-250 rounded bg-zinc-50 p-1">
                                    <button type="button" onClick={() => setConfigAdults(Math.max(1, configAdults - 1))} className="px-1.5 py-0.5 bg-white border border-zinc-200 font-bold hover:bg-zinc-100 text-[#0D1B2A] rounded-sm text-xs cursor-pointer">-</button>
                                    <span className="text-xs font-sans font-bold text-[#0D1B2A] flex-grow text-center">{configAdults}</span>
                                    <button type="button" onClick={() => setConfigAdults(configAdults + 1)} className="px-1.5 py-0.5 bg-white border border-zinc-200 font-bold hover:bg-zinc-100 text-[#0D1B2A] rounded-sm text-xs cursor-pointer">+</button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => {
                                  const dateStr = addDaysToBrazilDate(getBrazilLocalDate(), configDay);
                                  onAddToCart?.({
                                    experienceId: item.id,
                                    date: dateStr,
                                    schedule: configSchedule || itemSchedules[0],
                                    adults: configAdults,
                                    children: 0,
                                    infants: 0,
                                    people: configAdults,
                                    observations: "Adicionado pela Home",
                                    dayIndex: configDay
                                  });
                                  setActiveConfigId(null);
                                  setSuccessNotifId(item.id);
                                }} className="flex-1 bg-[#0D1B2A] text-white py-2 rounded-sm text-[10px] font-accent font-extrabold uppercase tracking-widest hover:bg-[#E8711A] transition-colors cursor-pointer">Confirmar</button>
                                <button type="button" onClick={() => setActiveConfigId(null)} className="px-3 bg-zinc-100 text-zinc-50 py-2 rounded-sm hover:bg-zinc-200 cursor-pointer text-zinc-600"><X className="w-3.5 h-3.5" /></button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full justify-between">
                              <div className="space-y-2">
                                <h3 className="font-serif text-lg font-bold text-[#0D1B2A] leading-tight line-clamp-2">{item.name}</h3>
                                <p className="font-sans text-[11px] text-[#5C6874] line-clamp-2 leading-relaxed">{item.shortDescription}</p>
                              </div>
                              <div className="flex items-end justify-between border-t border-zinc-100 pt-4 mt-4">
                                <div>
                                  <span className="font-sans text-[10px] text-zinc-400 block uppercase tracking-wider mb-0.5">A partir de</span>
                                  <div className="flex items-baseline gap-1">
                                    <span className="font-serif text-[#E8711A] text-lg font-bold">R$ {item.priceFrom}</span>
                                    <span className="font-sans text-[10px] text-zinc-500">/pessoa</span>
                                  </div>
                                </div>
                                <button onClick={() => {
                                  setActiveConfigId(item.id);
                                  setConfigDay(1);
                                  setConfigSchedule(itemSchedules[0]);
                                  setConfigAdults(2);
                                }} className="px-4 py-2 bg-[#FAF8F5] border border-zinc-200 hover:border-[#E8711A] text-[#0D1B2A] hover:text-[#E8711A] rounded text-[10px] font-accent font-bold uppercase tracking-widest transition-all shadow-sm cursor-pointer flex items-center gap-1.5">
                                  <Plus className="w-3 h-3" /> Incluir
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. ROTEIRO INTELIGENTE */}
      <section className="py-24 bg-[#0D1B2A] text-white border-b border-[#1A2C42] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#E8711A]/10 blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6 text-left">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> TECNOLOGIA & CURADORIA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              O seu roteiro perfeito, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#E8711A]">gerado como mágica.</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg">
              Esqueça as planilhas complexas e o estresse de organizar horários. Nossa inteligência analisa o clima, a logística da cidade e a duração dos passeios para criar uma linha do tempo impecável da sua viagem. 
            </p>
            
            <ul className="space-y-3 pt-2">
              {[
                "Sugestões automáticas baseadas no seu perfil",
                "Prevenção de conflito de horários (Alertas Inteligentes)",
                "Estimativa clara de custos separados e total geral"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8711A]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#E8711A]" />
                  </div>
                  <span className="font-sans text-sm text-zinc-300 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <button onClick={() => onNavigate("wizard")} className="px-8 py-4 bg-[#E8711A] hover:bg-white text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase transition-all rounded shadow-[0_0_20px_rgba(232,113,26,0.3)] flex items-center gap-2.5 hover:scale-[1.02] cursor-pointer">
                Criar Roteiro Inteligente <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] sm:aspect-square bg-[#0F2033] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Seu Roteiro</h3>
                  <span className="font-sans text-xs text-zinc-400">Arraial do Cabo • 3 Dias</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#0F2033] bg-zinc-700">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" alt="User" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#0F2033] bg-[#E8711A] flex items-center justify-center text-[10px] font-bold text-[#0D1B2A]">
                    +1
                  </div>
                </div>
              </div>

              {/* Timeline Mockup */}
              <div className="flex-1 space-y-6 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-[#E8711A] before:to-transparent">
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#0F2033] bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 md:ml-auto md:mr-auto"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <span className="font-accent text-[9px] text-emerald-400 font-bold uppercase tracking-widest block mb-1">08:00 - Dia 1</span>
                    <h4 className="font-serif text-sm font-bold text-white mb-1">Passeio de Barco Premium</h4>
                    <p className="font-sans text-[10px] text-zinc-400">Embarque na Praia dos Anjos</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#0F2033] bg-[#E8711A] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 md:ml-auto md:mr-auto"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <span className="font-accent text-[9px] text-[#E8711A] font-bold uppercase tracking-widest block mb-1">14:00 - Dia 1</span>
                    <h4 className="font-serif text-sm font-bold text-white mb-1">Check-in na Pousada</h4>
                    <p className="font-sans text-[10px] text-zinc-400">Pousada Caminho do Sol</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#0F2033] bg-zinc-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 md:ml-auto md:mr-auto"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm opacity-50">
                    <span className="font-accent text-[9px] text-zinc-400 font-bold uppercase tracking-widest block mb-1">10:00 - Dia 2</span>
                    <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
                    <div className="h-2 w-1/2 bg-white/5 rounded"></div>
                  </div>
                </motion.div>

              </div>
              
              <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-end">
                 <div>
                   <span className="font-accent text-[9px] text-zinc-400 uppercase tracking-widest block mb-1">Estimativa Total</span>
                   <span className="font-serif text-xl font-bold text-white">R$ 1.250,00</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-4 h-4" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.1 PROVA SOCIAL */}
      <section className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-100 text-center">
            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0D1B2A]">+2.500</div>
              <div className="font-accent text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Roteiros Criados</div>
            </div>
            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0D1B2A]">+15k</div>
              <div className="font-accent text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Viajantes Felizes</div>
            </div>
            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0D1B2A]">4.9</div>
              <div className="flex justify-center gap-0.5 text-[#E8711A] mb-1">
                <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
              </div>
              <div className="font-accent text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Nota Média</div>
            </div>
            <div className="space-y-2">
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0D1B2A]">100%</div>
              <div className="font-accent text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Curadoria Local</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STORYTELLING - SOBRE A GUIDA TRIPS */}
      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1596422846543-74c6ca60a4f1?auto=format&fit=crop&w=800&q=80" alt="Arraial do Cabo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 aspect-square rounded-2xl overflow-hidden border-8 border-[#FAF8F5] shadow-xl hidden md:block">
                <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80" alt="Experiência" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="text-left space-y-6">
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
                Nossa Essência
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                Somos especialistas na nossa própria casa.
              </h2>
              <div className="h-0.5 w-16 bg-[#E8711A]"></div>
              <p className="font-sans text-base text-[#5C6874] leading-relaxed">
                A Guida Trips não é apenas um software frio. Nós somos moradores apaixonados por Arraial do Cabo. Conhecemos cada vento, cada maré e o tempo exato em que o sol se põe no Pontal do Atalaia.
              </p>
              <p className="font-sans text-base text-[#5C6874] leading-relaxed">
                Aliamos tecnologia de ponta com o calor humano do atendimento local para garantir que a sua viagem não seja apenas uma visita, mas uma experiência imersiva e impecável. Cuidamos de você desde o primeiro clique até o seu retorno seguro para casa.
              </p>
              
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-zinc-100 text-[#0D1B2A]">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0D1B2A] mb-1">Cuidado Genuíno</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">Acompanhamos sua viagem pelo WhatsApp como se fôssemos seus guias particulares.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-zinc-100 text-[#0D1B2A]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0D1B2A] mb-1">Raízes Locais</h4>
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">Nossos parceiros são rigorosamente selecionados para garantir o mais alto padrão da região.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
