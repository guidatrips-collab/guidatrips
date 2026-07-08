import React, { useEffect } from 'react';
import { 
  Compass, MapPin, Calendar, Users, DollarSign, Clock, Share2, 
  Heart, ArrowRight, MessageCircle, Info, BookmarkPlus
} from 'lucide-react';
import { Destination, Experience, Accommodation, Partner, ThematicItinerary, BookingCartItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface ThematicItineraryViewProps {
  pathname: string;
  thematicItineraries: ThematicItinerary[];
  destinations: Destination[];
  experiences: Experience[];
  accommodations: Accommodation[];
  partners: Partner[];
  onNavigate: (view: string) => void;
  onAddToCart: (item: BookingCartItem) => void;
  onWhatsAppContact: (message?: string) => void;
}

export default function ThematicItineraryView({
  pathname,
  thematicItineraries,
  destinations,
  experiences,
  accommodations,
  partners,
  onNavigate,
  onAddToCart,
  onWhatsAppContact
}: ThematicItineraryViewProps) {
  const navigate = useNavigate();

  // Parse URL: /lugares/:destinationSlug/:thematicSlug
  const parts = pathname.split('/');
  const destinationSlug = parts[2];
  const thematicSlug = parts[3];

  const destination = destinations.find(d => d.slug === destinationSlug);
  const itinerary = thematicItineraries.find(i => i.slug === thematicSlug && (destination ? i.destinationId === destination.id : true));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  if (!itinerary) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen bg-[#FBF9F6]">
        <h2 className="text-2xl font-bold text-[#0D1B2A]">Roteiro não encontrado</h2>
        <p className="text-zinc-500 mt-2">O roteiro que você está procurando não existe ou foi removido.</p>
        <button onClick={() => navigate('/blog')} className="mt-6 px-6 py-2 bg-[#E8711A] text-white rounded-lg font-bold">Voltar</button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link do roteiro copiado!');
  };

  const handleCreateSmartItinerary = () => {
    // In a full implementation, this would populate the Wizard with this itinerary's items.
    // For now, we redirect to wizard and optionally pass a ref.
    onNavigate("wizard");
  };

  const handleRequestQuote = () => {
    const msg = `Olá! Tenho interesse no roteiro "${itinerary.name}" em ${destination?.name || 'seu destino'} e gostaria de um orçamento completo.`;
    onWhatsAppContact(msg);
  };

  return (
    <div className="pt-28 pb-24 bg-[#FBF9F6] min-h-screen selection:bg-[#E8711A] selection:text-white">
      {/* HEADER HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden mb-8 group">
          {itinerary.coverImage ? (
            <img src={itinerary.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={itinerary.name} />
          ) : (
            <div className="w-full h-full bg-[#0D1B2A] flex items-center justify-center text-white/20">
              <Compass size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 sm:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {destination && (
                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {destination.name}
                </span>
              )}
              <span className="bg-[#E8711A] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {itinerary.days} Dias
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-4">{itinerary.name}</h1>
            <p className="text-white/80 font-sans text-sm sm:text-base max-w-2xl">{itinerary.description}</p>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {itinerary.audience && itinerary.audience.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col items-center justify-center text-center">
              <Users className="w-5 h-5 text-[#E8711A] mb-2" />
              <span className="text-[10px] font-accent text-zinc-500 uppercase tracking-widest font-bold">Ideal para</span>
              <span className="text-sm font-bold text-[#0D1B2A]">{itinerary.audience.join(", ")}</span>
            </div>
          )}
          {itinerary.priceRange && (
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col items-center justify-center text-center">
              <DollarSign className="w-5 h-5 text-[#E8711A] mb-2" />
              <span className="text-[10px] font-accent text-zinc-500 uppercase tracking-widest font-bold">Investimento</span>
              <span className="text-sm font-bold text-[#0D1B2A]">{itinerary.priceRange}</span>
            </div>
          )}
          {itinerary.bestSeason && (
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col items-center justify-center text-center">
              <Calendar className="w-5 h-5 text-[#E8711A] mb-2" />
              <span className="text-[10px] font-accent text-zinc-500 uppercase tracking-widest font-bold">Melhor Época</span>
              <span className="text-sm font-bold text-[#0D1B2A]">{itinerary.bestSeason}</span>
            </div>
          )}
          {itinerary.difficulty && (
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col items-center justify-center text-center">
              <Compass className="w-5 h-5 text-[#E8711A] mb-2" />
              <span className="text-[10px] font-accent text-zinc-500 uppercase tracking-widest font-bold">Dificuldade</span>
              <span className="text-sm font-bold text-[#0D1B2A]">{itinerary.difficulty}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* MAIN SCHEDULE */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] mb-8 flex items-center gap-3">
                <MapPin className="text-[#E8711A]" /> Cronograma Detalhado
              </h2>

              <div className="space-y-8">
                {(itinerary.schedule || []).map((day, idx) => (
                  <div key={idx} className="relative pl-8 sm:pl-10">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#E8711A]/20"></div>
                    <div className="absolute left-[-8px] top-1 w-4 h-4 rounded-full bg-[#E8711A] border-4 border-[#FBF9F6]"></div>
                    
                    <h3 className="font-sans font-bold text-xl text-[#0D1B2A] mb-4">{day.title}</h3>
                    
                    <div className="space-y-4">
                      {day.items.map((item, iIdx) => {
                        let icon = <Info size={16} className="text-zinc-400" />;
                        let title = item.customName || "Atividade";
                        let canAdd = false;
                        let linkedItem: any = null;

                        if (item.type === 'experience') {
                          icon = <Compass size={16} className="text-blue-500" />;
                          linkedItem = experiences.find(e => e.id === item.refId);
                          if (linkedItem) {
                            title = linkedItem.name;
                            canAdd = true;
                          }
                        } else if (item.type === 'accommodation') {
                          icon = <Hotel size={16} className="text-emerald-500" />;
                          linkedItem = accommodations.find(a => a.id === item.refId);
                          if (linkedItem) title = linkedItem.name;
                        } else if (item.type === 'partner') {
                          icon = <Users size={16} className="text-purple-500" />;
                          linkedItem = partners.find(p => p.id === item.refId);
                          if (linkedItem) title = linkedItem.tradingName || linkedItem.companyName;
                        }

                        return (
                          <div key={iIdx} className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-[#E8711A]/50 transition-colors shadow-sm">
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center shrink-0">
                                {icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {item.timeOfDay && (
                                    <span className="text-[10px] font-accent font-bold uppercase tracking-widest text-[#E8711A] bg-[#E8711A]/10 px-2 py-0.5 rounded">
                                      {item.timeOfDay}
                                    </span>
                                  )}
                                  <span className="text-xs text-zinc-500 capitalize">{item.type === 'experience' ? 'Passeio' : item.type === 'accommodation' ? 'Hospedagem' : item.type === 'partner' ? 'Parceiro' : 'Dica Editorial'}</span>
                                </div>
                                <h4 className="font-bold text-[#0D1B2A]">{title}</h4>
                                {linkedItem?.description && (
                                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1 max-w-lg">{linkedItem.description}</p>
                                )}
                              </div>
                            </div>

                            {canAdd && linkedItem && (
                              <button 
                                onClick={() => onAddToCart({
                                  experienceId: linkedItem.id,
                                  adults: 2,
                                  children: 0,
                                  infants: 0,
                                  people: 2,
                                  date: "",
                                  schedule: "",
                                  observations: ""
                                })}
                                className="w-full sm:w-auto px-4 py-2 bg-[#0D1B2A] hover:bg-[#E8711A] text-white rounded-xl text-xs font-bold transition-colors shrink-0 whitespace-nowrap"
                              >
                                Adicionar ao Roteiro
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR CONVERSION */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-[#0D1B2A] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E8711A] rounded-full blur-3xl opacity-20"></div>
                
                <h3 className="font-serif text-2xl font-bold mb-4 relative z-10">Gostou deste roteiro?</h3>
                <p className="text-white/80 text-sm mb-8 relative z-10">Use esta sugestão como base e deixe nossa inteligência personalizar os detalhes, datas e orçamento para você.</p>
                
                <button 
                  onClick={handleCreateSmartItinerary}
                  className="w-full py-4 bg-[#E8711A] hover:bg-white hover:text-[#0D1B2A] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 relative z-10 mb-3"
                >
                  <BrainCircuit className="w-5 h-5" /> Fazer Este Roteiro
                </button>

                <button 
                  onClick={handleRequestQuote}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 relative z-10"
                >
                  <MessageCircle className="w-4 h-4" /> Solicitar Orçamento
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => alert("Roteiro salvo nos seus favoritos!")}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-zinc-200 rounded-2xl hover:border-[#E8711A] hover:text-[#E8711A] transition-colors text-zinc-500 cursor-pointer"
                >
                  <BookmarkPlus className="w-6 h-6" />
                  <span className="text-[10px] font-accent font-bold uppercase tracking-widest">Salvar</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-zinc-200 rounded-2xl hover:border-[#E8711A] hover:text-[#E8711A] transition-colors text-zinc-500 cursor-pointer"
                >
                  <Share2 className="w-6 h-6" />
                  <span className="text-[10px] font-accent font-bold uppercase tracking-widest">Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal missing icons
function Hotel({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/>
    </svg>
  );
}

function BrainCircuit({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/>
    </svg>
  );
}
