import React, { useState } from "react";
import { 
  MapPin, Compass, Calendar, MessageCircle, Heart, Star, Check, ArrowRight, Sparkles, Plus, X
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
}

export default function HomeView({ 
  onNavigate, 
  onAddToCart, 
  settings, 
  experiences = [], 
  stayDays = 3,
  destinations,
  selectedDestinationId,
  onUpdateSelectedDestinationId
}: HomeViewProps) {

  // States of the micro-itinerary configurator drawer inside the homepage cards
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [configDay, setConfigDay] = useState<number>(1);
  const [configSchedule, setConfigSchedule] = useState<string>("");
  const [configAdults, setConfigAdults] = useState<number>(2);
  const [successNotifId, setSuccessNotifId] = useState<string | null>(null);

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
                Seu Planejador de Viagens
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Planeje e reserve experiências de viagem de forma inteligente.
            </h1>
            <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg">
              Monte seu roteiro perfeito, reserve passeios exclusivos em poucos minutos e receba atendimento personalizado pelo WhatsApp. A Guida Trips é a plataforma que organiza a sua viagem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => onNavigate("wizard")} className="px-6 py-4 bg-[#E8711A] hover:bg-white text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase transition-all rounded shadow-lg flex items-center justify-center gap-2.5 hover:scale-[1.02] cursor-pointer">
                Monte seu Roteiro
              </button>
              <button onClick={() => {
                  const number = settings?.whatsappNumber?.replace(/\D/g, "") || "552299887766";
                  const text = encodeURIComponent("Olá, Guida Trips! Gostaria de ajuda para planejar minha viagem.");
                  window.open(`https://wa.me/${number}?text=${text}`, "_blank");
                }} className="px-6 py-4 border border-white/20 hover:border-[#E8711A] text-white hover:text-[#E8711A] font-accent text-xs font-bold tracking-widest uppercase bg-transparent transition-colors rounded hover:bg-white/5 cursor-pointer">
                Falar no WhatsApp
              </button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-lg overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] group">
              <img 
                src={"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=850&q=80"} 
                alt="Travel Planning" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded text-left space-y-1.5 shadow-xl">
                <div className="flex gap-1 text-[#E8711A]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="font-sans text-xs italic text-white line-clamp-2">
                  "Planejar nossa viagem pela Guida Trips tirou todo o nosso estresse. Foi mágico!"
                </p>
                <span className="font-accent text-[9px] text-zinc-300 uppercase tracking-widest block font-bold">- MARIANA LIMA, SP</span>
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
                                      <button key={dNum} type="button" onClick={() => setConfigDay(dNum)} className={`w-6 h-6 rounded font-sans text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${configDay === dNum ? "bg-[#0D1B2A] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
                                        D{dNum}
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
      <section className="py-24 bg-[#0D1B2A] text-white border-b border-[#1A2C42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
              O SEU GRANDE DIFERENCIAL
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Roteiro Inteligente
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A]"></div>
            <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
              Não perca horas pesquisando o que fazer. Nosso sistema de Roteiro Inteligente permite que você estruture seus dias de viagem, escolha experiências compatíveis com a sua agenda e evite sobreposição de horários. Um planejamento sem estresse, desenhado para o seu tempo.
            </p>
            <button onClick={() => onNavigate("wizard")} className="mt-4 px-6 py-4 bg-[#E8711A] hover:bg-white text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase transition-colors rounded cursor-pointer inline-flex items-center gap-2">
              Experimentar Agora <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80" alt="Planejamento de Viagem" className="w-full h-full object-cover filter brightness-90" />
              <div className="absolute inset-0 bg-[#0D1B2A]/40"></div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-xl text-left">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                   <span className="font-accent text-[10px] text-white uppercase tracking-wider font-bold">Sem Conflitos de Agenda</span>
                </div>
                <div className="space-y-3">
                  <div className="h-12 w-full bg-white/20 rounded-lg flex items-center px-4 gap-3">
                     <Calendar className="w-4 h-4 text-emerald-400" />
                     <div className="h-2 w-1/2 bg-white/40 rounded"></div>
                  </div>
                  <div className="h-12 w-4/5 bg-white/10 rounded-lg flex items-center px-4 gap-3">
                     <Compass className="w-4 h-4 text-white/50" />
                     <div className="h-2 w-1/3 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOBRE A GUIDA TRIPS */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
            SOBRE NÓS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Nossa Missão
          </h2>
          <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
          <p className="font-sans text-base sm:text-lg text-[#5C6874] leading-relaxed">
            A Guida Trips nasceu com um propósito claro: simplificar a forma como você planeja suas viagens e conectá-lo a experiências inesquecíveis. Acreditamos que viajar deve ser sobre viver momentos reais, sem o estresse da organização fragmentada.
          </p>
          <p className="font-sans text-base sm:text-lg text-[#5C6874] leading-relaxed">
            Nosso atendimento é pessoal e caloroso. Não somos apenas uma plataforma automatizada, somos sua equipe de suporte antes, durante e depois da sua aventura.
          </p>
          
          <div className="pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-zinc-100 pt-12">
               <div>
                  <h4 className="font-serif font-bold text-lg text-[#0D1B2A] mb-2">Curadoria</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Selecionamos apenas fornecedores e parceiros que entregam alto padrão e compromisso com o bem-estar dos nossos viajantes.</p>
               </div>
               <div>
                  <h4 className="font-serif font-bold text-lg text-[#0D1B2A] mb-2">Segurança</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Plataforma transparente. Todo o seu roteiro e pagamentos são protegidos, garantindo paz de espírito.</p>
               </div>
               <div>
                  <h4 className="font-serif font-bold text-lg text-[#0D1B2A] mb-2">Suporte Real</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">Fale com pessoas de verdade. Nossa equipe está sempre no WhatsApp para tirar dúvidas e realizar ajustes.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
