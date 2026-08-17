/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  X, Star, MapPin, Coffee, Wifi, Shield, ArrowRight, Sparkles, Phone, Compass, 
  Waves, Car, Dumbbell, Wind, Eye, Heart, Calendar, Clock, ChevronLeft, ChevronRight, 
  CheckCircle, HelpCircle, Gift, ArrowLeft, Maximize2, Users, Bed
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Accommodation, Courtesy, RoomType, SelectedRoomBooking } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { getTranslatedAccommodation } from "../utils/dataTranslator";

interface AccommodationDetailModalProps {
  accommodation: Accommodation;
  isOpen: boolean;
  onClose: () => void;
  // If provided, we are in "Wizard / Itinerary Selection" context
  isSelectionContext?: boolean;
  isSelected?: boolean;
  selectedRoomId?: string | null;
  selectedRooms?: SelectedRoomBooking[];
  onSelectToggle?: () => void;
  onSelectRoom?: (accommodation: Accommodation, room: RoomType) => void;
  onSelectRooms?: (accommodation: Accommodation, selectedRooms: SelectedRoomBooking[]) => void;
  // External WhatsApp trigger
  onWhatsAppContact?: (message: string) => void;
  // Navigation for catalog context
  onNavigateToWizard?: (hotelId: string, roomId?: string) => void;
  guestCount?: { adults: number; children: number; infants: number };
}

export default function AccommodationDetailModal({
  accommodation: rawAccommodation,
  isOpen,
  onClose,
  isSelectionContext = false,
  isSelected = false,
  selectedRoomId = null,
  selectedRooms = [],
  onSelectToggle,
  onSelectRoom,
  onSelectRooms,
  onWhatsAppContact,
  onNavigateToWizard,
  guestCount
}: AccommodationDetailModalProps) {
  const { language, t } = useLanguage();
  const accommodation = getTranslatedAccommodation(rawAccommodation, language);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isFullScreenGallery, setIsFullScreenGallery] = useState(false);
  const [selectedRoomsMap, setSelectedRoomsMap] = useState<Record<string, number>>({});

  // Sync internal selected rooms whenever modal opens or props change
  useEffect(() => {
    if (selectedRooms && selectedRooms.length > 0) {
      const initialMap: Record<string, number> = {};
      selectedRooms.forEach(r => {
        initialMap[r.roomId] = r.quantity || 1;
      });
      setSelectedRoomsMap(initialMap);
    } else if (selectedRoomId) {
      setSelectedRoomsMap({ [selectedRoomId]: 1 });
    } else {
      setSelectedRoomsMap({});
    }
  }, [selectedRooms, selectedRoomId, isOpen, rawAccommodation]);

  const totalGuests = (guestCount?.adults ?? 2) + (guestCount?.children ?? 0);

  // Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullScreenGallery) {
          setIsFullScreenGallery(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreenGallery, onClose]);

  if (!isOpen) return null;

  // Ensure photos exist
  const photosExtended = accommodation.mediaGallery && accommodation.mediaGallery.length > 0
    ? accommodation.mediaGallery.filter(m => m.type === 'image').map(m => ({ url: m.url, originalUrl: m.originalUrl || m.url }))
    : accommodation.photos && accommodation.photos.length > 0
    ? accommodation.photos.map(p => ({ url: p, originalUrl: p }))
    : [{ url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80", originalUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" }];
  const photos = photosExtended.map(p => p.url);

  // Mapping standard amenities to icons
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("piscina")) return <Waves className="w-4 h-4 text-[#E8711A]" />;
    if (lower.includes("café") || lower.includes("cafe")) return <Coffee className="w-4 h-4 text-[#E8711A]" />;
    if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("internet")) return <Wifi className="w-4 h-4 text-[#E8711A]" />;
    if (lower.includes("estacionamento") || lower.includes("vaga")) return <Car className="w-4 h-4 text-[#E8711A]" />;
    if (lower.includes("academia") || lower.includes("fitness")) return <Dumbbell className="w-4 h-4 text-[#E8711A]" />;
    if (lower.includes("ar-condicionado") || lower.includes("split") || lower.includes("ar condicionado")) return <Wind className="w-4 h-4 text-[#E8711A]" />;
    if (lower.includes("vista") || lower.includes("mar") || lower.includes("panorâmica")) return <Eye className="w-4 h-4 text-[#E8711A]" />;
    if (lower.includes("pet") || lower.includes("animal")) return <Heart className="w-4 h-4 text-[#E8711A]" />;
    return <CheckCircle className="w-4 h-4 text-[#E8711A]" />;
  };

  // Curated policies if not provided
  const policiesList = accommodation.policies && accommodation.policies.length > 0
    ? accommodation.policies
    : [
        "Check-in: Das 14:00 às 22:00 (Check-in antecipado sob consulta e disponibilidade)",
        "Check-out: Até às 12:00 (Late Check-out garantido de 1 hora para clientes Guida Trips)",
        "Cancelamento gratuito: Até 7 dias antes da data de chegada sem custos adicionais",
        "Crianças: Grátis até 5 anos na mesma cama com os pais",
        "Pets: Aceitos sob consulta e taxa de higienização de R$ 50/diária"
      ];

  const restrictionsList = accommodation.restrictions && accommodation.restrictions.length > 0
    ? accommodation.restrictions
    : [
        "Não é permitido fumar dentro das suítes e áreas internas fechadas",
        "Lei do silêncio das 22:00 às 08:00 para preservação da harmonia local",
        "Uso de copos e garrafas de vidro proibido na área da piscina"
      ];

  // Curated list of benefits/cortesias guaranteed for Guida Trips Club
  const defaultCourtesies: Courtesy[] = [
    { id: "c1", name: "🥂 Espumante de boas-vindas", description: "Uma garrafa de frisante ou espumante nacional servida gelada no seu check-in" },
    { id: "c2", name: "🍉 Frutas tropicais sazonais", description: "Uma travessa de frutas frescas e higienizadas aguardando na suíte" },
    { id: "c3", name: "⏱️ Late check-out estendido", description: "Garantia de saída estendida em 1 hora para aproveitar o último mergulho" },
    { id: "c4", name: "🎁 Mimos de Boas-Vindas", description: "Guia físico exclusivo da cidade e descontos em parceiros locais" }
  ];

  const courtesiesToShow = accommodation.courtesies && accommodation.courtesies.length > 0
    ? accommodation.courtesies
    : defaultCourtesies;

  // Curated points of interest near each location type
  const getPointsOfInterest = () => {
    const loc = accommodation.location.toLowerCase();
    if (loc.includes("anjos")) {
      return [
        { name: "Cais da Praia dos Anjos (Embarque)", distance: "150m • 2 min de caminhada" },
        { name: "Praia do Forno (Início da trilha)", distance: "400m • 5 min de caminhada" },
        { name: "Praça do Covas (Restaurantes e Bares)", distance: "500m • 6 min de caminhada" },
        { name: "Farol Velho / Centro Histórico", distance: "600m • 7 min de caminhada" }
      ];
    } else if (loc.includes("grande")) {
      return [
        { name: "Orla da Praia Grande (Calçadão)", distance: "100m • 1 min de caminhada" },
        { name: "Mirante da Praia Grande (Pôr do Sol)", distance: "300m • 4 min de caminhada" },
        { name: "Restaurante Flutuante e Quiosques", distance: "200m • 3 min de caminhada" },
        { name: "Centro Comercial / Supermercados", distance: "800m • 10 min de caminhada" }
      ];
    } else if (loc.includes("pontal")) {
      return [
        { name: "Prainhas do Pontal do Atalaia", distance: "1.2km • Trilha panorâmica ou carro" },
        { name: "Mirante do Pôr do Sol Pontal", distance: "400m • 5 min de caminhada" },
        { name: "Gruta do Amor", distance: "1.5km • Acesso pelas prainhas" },
        { name: "Centro de Arraial do Cabo", distance: "2.5km • 8 min de carro" }
      ];
    } else {
      return [
        { name: "Praias mais próximas", distance: "A poucos minutos de caminhada" },
        { name: "Centro gastronômico e cultural", distance: "Acesso super rápido e seguro" },
        { name: "Pontos de embarque de passeios", distance: "Facilidade de locomoção com a Guida" },
        { name: "Comércios, farmácias e conveniência", distance: "Bem localizado no coração do destino" }
      ];
    }
  };

  const pointsOfInterest = getPointsOfInterest();

  const handleBookViaWhatsApp = () => {
    const customMsg = accommodation.whatsappMessage || `Olá, Guida Trips! Gostaria de consultar tarifas com benefícios exclusivos para a hospedagem ${accommodation.name}.`;
    if (onWhatsAppContact) {
      onWhatsAppContact(customMsg);
    } else {
      window.open(`https://wa.me/5522998887766?text=${encodeURIComponent(customMsg)}`, "_blank");
    }
  };

  const handleSelectAndGo = () => {
    if (onNavigateToWizard) {
      onNavigateToWizard(accommodation.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {/* Immersive Modal Backdrop */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-md flex justify-center items-start sm:items-center p-0 sm:p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-[#FCFBF9] text-[#0D1B2A] w-full max-w-5xl rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full sm:max-h-[90vh] border border-zinc-200"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200/60 bg-white sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#E8711A]/10 text-[#E8711A] rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-accent font-black tracking-widest text-[#E8711A] block">
                  Ficha da Hospedagem
                </span>
                <span className="text-xs text-zinc-500 font-sans">Curadoria Especial Guida Trips</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-[#0D1B2A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Contents */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            
            {/* Title Block & Primary Attributes */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200/50 pb-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 bg-[#0D1B2A] text-white text-[9px] font-accent font-bold tracking-widest uppercase rounded-sm">
                    {accommodation.category.toUpperCase()} • {accommodation.tag || "CURADORIA"}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{accommodation.rating || "5.0"}</span>
                    <span className="text-zinc-400 font-normal">({accommodation.reviews || "120"} avaliações)</span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3.5xl font-extrabold tracking-tight text-[#0D1B2A]">
                  {accommodation.name}
                </h1>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="w-4 h-4 text-[#E8711A]" />
                  <span>{accommodation.location} • <strong className="text-zinc-700">{accommodation.address}</strong></span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="bg-[#FAF8F5] border border-zinc-200 rounded-2xl p-4 min-w-[200px] text-left sm:text-right shrink-0">
                <span className="text-[9px] font-accent font-black text-zinc-400 block tracking-widest uppercase">Melhor Tarifa</span>
                <span className="font-serif text-lg font-black text-[#E8711A] block mt-0.5">
                  {accommodation.priceDisplay || `A partir de R$ ${accommodation.sellRate} / diária`}
                </span>
                <span className="text-[10px] text-zinc-400 italic block mt-0.5">Preço base garantido via Guida Trips</span>
              </div>
            </div>

            {/* Layout: Gallery and Core Info Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Media Gallery (8 Columns) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Main Photo Slider Card */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner group">
                  <img
                    src={photos[activePhotoIdx]}
                    alt={`${accommodation.name} - Foto ${activePhotoIdx + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Image Navigation Arrows */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-[#0D1B2A] rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 stroke-[3]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-[#0D1B2A] rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    </>
                  )}

                  {/* Top Right Zoom Trigger */}
                  <button
                    onClick={() => setIsFullScreenGallery(true)}
                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors cursor-pointer"
                    title="Visualizar em Tela Cheia"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Indicator Pill */}
                  <span className="absolute bottom-3 right-3 bg-black/65 text-white text-[10px] font-mono px-2.5 py-1 rounded-full">
                    {activePhotoIdx + 1} de {photos.length}
                  </span>
                </div>

                {/* Thumbnails Row */}
                {photos.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`relative w-20 aspect-[4/3] rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                          activePhotoIdx === idx 
                            ? "border-[#E8711A] ring-2 ring-[#E8711A]/10 scale-95" 
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <img
                          src={photo}
                          alt="Miniatura"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Full Description */}
                <div className="space-y-4 text-left pt-2">
                  <h3 className="font-serif text-lg font-extrabold text-[#0D1B2A]">Sobre a Pousada</h3>
                  <p className="font-sans text-xs sm:text-sm text-zinc-650 leading-relaxed whitespace-pre-wrap">
                    {accommodation.description}
                  </p>
                  
                  {/* Ideal Profile */}
                  <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl text-xs font-sans text-zinc-700">
                    <strong className="text-[#0D1B2A] block mb-1">🎯 Perfil Ideal:</strong>
                    {accommodation.idealProfile || "Perfeito para casais e famílias em busca de conforto e praticidade no centro de Arraial do Cabo."}
                  </div>

                  {/* Special Features */}
                  <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl text-xs font-sans text-zinc-700">
                    <strong className="text-[#0D1B2A] block mb-1">✨ O que torna este lugar especial:</strong>
                    <ul className="list-disc pl-4 space-y-1 mt-1 text-zinc-600">
                      {accommodation.specialFeatures ? (
                        accommodation.specialFeatures.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))
                      ) : (
                        <>
                          <li>Localização estratégica, perto do cais e praias centrais.</li>
                          <li>Atendimento acolhedor e humanizado.</li>
                          <li>Estrutura moderna recém-reformada.</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {accommodation.highlight && (
                    <div className="bg-[#FAF8F5] border-l-4 border-[#E8711A] p-4 rounded-r-2xl text-xs font-sans text-zinc-700 italic">
                      💡 <strong>Destaque da Curadoria:</strong> {accommodation.highlight}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Features, Courtesies, and Policies (5 Columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Highlight: Cortesias & Beneficios */}
                <div className="bg-gradient-to-br from-[#E8711A]/8 to-[#E8711A]/2 border border-[#E8711A]/20 rounded-3xl p-5 text-left space-y-4">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-[#E8711A]" />
                    <h3 className="font-serif text-base font-extrabold text-[#0D1B2A]">
                      Mimos Exclusivos Guida Trips
                    </h3>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Reservando sua hospedagem pelo nosso ecossistema oficial, você garante esses benefícios adicionais sem pagar nada a mais por isso:
                  </p>
                  <div className="space-y-3 pt-1">
                    {courtesiesToShow.map((courtesy, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start bg-white/60 p-2.5 rounded-xl border border-white/80">
                        <span className="text-base shrink-0">🎁</span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-zinc-800 block leading-tight">{courtesy.name}</span>
                          {courtesy.description && (
                            <span className="text-[10px] text-zinc-500 block leading-normal">{courtesy.description}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Permanent Features / Características */}
                <div className="space-y-3.5 text-left bg-white border border-zinc-200 p-5 rounded-3xl">
                  <h3 className="font-serif text-sm font-bold text-[#0D1B2A] uppercase tracking-wider text-[11px] text-zinc-400">
                    Características & Estrutura
                  </h3>
                  <div className="grid grid-cols-2 gap-3.5">
                    {accommodation.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-sans text-zinc-700">
                        <span className="p-1.5 bg-zinc-100 rounded-lg shrink-0">
                          {getAmenityIcon(item)}
                        </span>
                        <span className="font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby Locations / Localização Prática */}
                <div className="space-y-3.5 text-left bg-white border border-zinc-200 p-5 rounded-3xl">
                  <h3 className="font-serif text-sm font-bold text-[#0D1B2A] uppercase tracking-wider text-[11px] text-zinc-400">
                    Pontos & Distâncias Próximas
                  </h3>
                  <div className="space-y-2.5">
                    {pointsOfInterest.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-zinc-700">{p.name}</span>
                        <span className="text-[11px] font-mono text-zinc-400 shrink-0">{p.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Room Types Section & Capacity Intelligence */}
            {(() => {
              const roomsToRender: RoomType[] = accommodation.roomTypes && accommodation.roomTypes.length > 0
                ? accommodation.roomTypes
                : [
                    {
                      id: `room-${accommodation.id}-standard`,
                      name: "Suíte Standard Classic",
                      description: "Suíte equipada com ar-condicionado, TV, frigobar, banheiro privativo e café da manhã incluso.",
                      minGuests: 1,
                      maxGuests: 2,
                      beds: "1 Cama de Casal Queen",
                      amenities: accommodation.amenities || ["Ar-condicionado", "Wi-Fi Fibra", "Café da Manhã"],
                      breakfastIncluded: true,
                      basePrice: accommodation.sellRate || accommodation.netRate || 250
                    }
                  ];

              const maxSingleRoomCapacity = Math.max(...roomsToRender.map(r => r.maxGuests), 2);
              const hasSingleRoomForGroup = roomsToRender.some(r => r.maxGuests >= totalGuests);
              
              const totalSelectedCapacity = roomsToRender.reduce((sum, r) => sum + (r.maxGuests * (selectedRoomsMap[r.id] || 0)), 0);
              const totalRoomsCount = (Object.values(selectedRoomsMap) as number[]).reduce((a, b) => a + b, 0);
              const totalNightlyRate = roomsToRender.reduce((sum, r) => sum + ((r.basePrice ?? 0) * (selectedRoomsMap[r.id] || 0)), 0);
              const isCapacitySatisfied = totalSelectedCapacity >= totalGuests && totalRoomsCount > 0;

              const handleQuantityChange = (roomId: string, change: number) => {
                setSelectedRoomsMap(prev => {
                  const currentQty = prev[roomId] || 0;
                  const newQty = Math.max(0, currentQty + change);
                  const updated = { ...prev };
                  if (newQty <= 0) {
                    delete updated[roomId];
                  } else {
                    updated[roomId] = newQty;
                  }
                  return updated;
                });
              };

              const handleQuickToggleRoom = (roomId: string) => {
                setSelectedRoomsMap(prev => {
                  const currentQty = prev[roomId] || 0;
                  if (currentQty > 0) {
                    const updated = { ...prev };
                    delete updated[roomId];
                    return updated;
                  } else {
                    // If no rooms are currently selected, add 1 or enough to meet capacity
                    return { ...prev, [roomId]: 1 };
                  }
                });
              };

              return (
                <div className="border-t border-zinc-200 pt-8 pb-4 text-left space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 flex items-center gap-2">
                        <span className="text-[#E8711A]">✦</span> Opções de Quartos & Capacidade
                      </h4>
                      <p className="text-xs text-zinc-500 font-sans mt-0.5">
                        {isSelectionContext 
                          ? `Selecione os quartos necessários para acomodar seu grupo de ${totalGuests} ${totalGuests === 1 ? 'pessoa' : 'pessoas'}:` 
                          : "Escolha a categoria ideal para sua estadia:"}
                      </p>
                    </div>

                    {isSelectionContext && (
                      <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                        {totalGuests} {totalGuests === 1 ? 'Hóspede' : 'Hóspedes no Grupo'}
                      </span>
                    )}
                  </div>

                  {/* Informative Alert when Hotel DOES NOT have a single room for the group capacity */}
                  {isSelectionContext && !hasSingleRoomForGroup && totalGuests > 1 && (
                    <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-amber-950 shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-200/80 p-2.5 rounded-xl text-amber-900 shrink-0 mt-0.5">
                          <Users className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <h5 className="font-serif font-extrabold text-sm sm:text-base text-amber-950 leading-tight">
                            Sem quarto individual para {totalGuests} pessoas nesta pousada
                          </h5>
                          <p className="text-xs sm:text-[13px] text-amber-900 leading-relaxed font-medium">
                            A maior categoria individual desta pousada acomoda até <strong>{maxSingleRoomCapacity} hóspedes</strong>. Não se preocupe: você pode selecionar <strong>2 ou mais quartos</strong> abaixo para atender com total conforto a capacidade de <strong>{totalGuests} pessoas</strong> da sua viagem.
                          </p>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 border border-amber-300/80 rounded-lg text-[11px] font-bold text-amber-950 mt-1">
                            <span>👉 Dica: Adicione 2 quartos da mesma suíte ou combine diferentes categorias.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Capacity Tracker Bar */}
                  {isSelectionContext && (
                    <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                      isCapacitySatisfied
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                        : totalRoomsCount > 0
                        ? "bg-amber-50/80 border-amber-300 text-amber-950"
                        : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    }`}>
                      <div className="flex items-center gap-3.5 w-full sm:w-auto">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 shadow-xs ${
                          isCapacitySatisfied
                            ? "bg-emerald-600 text-white"
                            : totalRoomsCount > 0
                            ? "bg-amber-500 text-white"
                            : "bg-zinc-200 text-zinc-600"
                        }`}>
                          <span className="text-xs leading-none">Capacidade</span>
                          <span className="text-base font-extrabold">{totalSelectedCapacity}/{totalGuests}</span>
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            {isCapacitySatisfied ? (
                              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                                <CheckCircle className="w-4 h-4 text-emerald-600" /> Capacidade Atendida para todo o Grupo!
                              </span>
                            ) : totalRoomsCount > 0 ? (
                              <span className="text-amber-800 flex items-center gap-1 font-bold">
                                ⚠️ Faltam acomodar {totalGuests - totalSelectedCapacity} {totalGuests - totalSelectedCapacity === 1 ? 'pessoa' : 'pessoas'}
                              </span>
                            ) : (
                              <span className="text-zinc-600">Nenhum quarto selecionado</span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 font-medium mt-0.5">
                            {totalRoomsCount} {totalRoomsCount === 1 ? 'quarto selecionado' : 'quartos selecionados'} • Capacidade total: {totalSelectedCapacity} hóspedes
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-200/60">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Diária Total</span>
                          <span className="font-serif font-extrabold text-lg sm:text-xl text-[#0D1B2A]">
                            R$ {totalNightlyRate.toFixed(2)}
                            <span className="text-xs text-zinc-500 font-sans font-normal"> /noite</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rooms Cards List */}
                  <div className="grid grid-cols-1 gap-6">
                    {roomsToRender.map(room => {
                      const qty = selectedRoomsMap[room.id] || 0;
                      const isSelected = qty > 0;
                      const fitsSingleGroup = room.maxGuests >= totalGuests;

                      return (
                        <div 
                          key={room.id} 
                          className={`bg-white border-2 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xs transition-all ${
                            isSelected 
                              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/15" 
                              : !fitsSingleGroup && totalGuests > 1
                              ? "border-zinc-200 hover:border-amber-300"
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          {(room.photos && room.photos.length > 0) || (room.mediaGallery && room.mediaGallery.length > 0) || photos.length > 0 ? (
                            <div className="w-full md:w-1/3 h-48 md:h-auto bg-zinc-100 relative shrink-0">
                              <img 
                                src={room.photos?.[0] || room.mediaGallery?.[0]?.url || photos[0]} 
                                alt={room.name} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                              {isSelected && (
                                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> {qty}x SELECIONADO
                                </div>
                              )}
                              <div className="absolute bottom-2 left-2 bg-[#0D1B2A]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                                Até {room.maxGuests} {room.maxGuests === 1 ? 'pessoa' : 'pessoas'}
                              </div>
                            </div>
                          ) : null}

                          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                <div>
                                  <h5 className="font-serif font-bold text-zinc-900 text-lg leading-snug">{room.name}</h5>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                                  fitsSingleGroup ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                                }`}>
                                  👤 Acomoda até {room.maxGuests} {room.maxGuests === 1 ? 'pessoa' : 'pessoas'}
                                </span>
                              </div>

                              <p className="text-xs text-zinc-600 mb-3 leading-relaxed">{room.description}</p>

                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {room.amenities.slice(0, 5).map(am => (
                                  <span key={am} className="text-[10px] bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-zinc-600 font-medium">
                                    {am}
                                  </span>
                                ))}
                                {room.amenities.length > 5 && (
                                  <span className="text-[10px] bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded text-zinc-500 font-medium">
                                    +{room.amenities.length - 5}
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-zinc-500 font-medium pt-1">
                                {room.area && <div>• {room.area}m²</div>}
                                {room.beds && <div className="truncate" title={room.beds}>• {room.beds}</div>}
                                {room.hasAirConditioning && <div>• Ar Condicionado</div>}
                                {room.breakfastIncluded && <div className="text-emerald-700 font-bold">• Café Incluso</div>}
                              </div>

                              {/* Capacity Warning Badge if single room is under group size */}
                              {!fitsSingleGroup && totalGuests > 1 && (
                                <div className="mt-3 p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                                  <span className="text-sm shrink-0">💡</span>
                                  <p className="text-[11px] leading-tight">
                                    Acomoda até {room.maxGuests} pessoas. Para seu grupo de {totalGuests} pessoas, selecione <strong>{Math.ceil(totalGuests / room.maxGuests)} quartos</strong> desta categoria ou combine com outro quarto.
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-zinc-150 flex flex-wrap justify-between items-center gap-4">
                              <div>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Valor da Diária</span>
                                {room.basePrice !== undefined && room.basePrice !== null ? (
                                  <>
                                    <span className="font-serif font-extrabold text-xl text-[#0D1B2A]">R$ {room.basePrice.toFixed(2)}</span>
                                    <span className="text-xs text-zinc-500"> /noite por quarto</span>
                                  </>
                                ) : (
                                  <span className="font-serif font-extrabold text-lg text-zinc-400">Sem Tarifa</span>
                                )}
                              </div>

                              {isSelectionContext ? (
                                <div className="flex items-center gap-3">
                                  {room.basePrice !== undefined && room.basePrice !== null ? (
                                    <>
                                      {/* Quantity Controls */}
                                      <div className="flex items-center bg-zinc-100 border border-zinc-300 rounded-xl p-1 shadow-xs">
                                        <button
                                          type="button"
                                          onClick={() => handleQuantityChange(room.id, -1)}
                                          disabled={qty <= 0}
                                          className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                                          title="Diminuir quantidade de quartos"
                                        >
                                          -
                                        </button>
                                        <span className="w-16 text-center text-xs font-black text-zinc-900">
                                          {qty} {qty === 1 ? 'quarto' : 'quartos'}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleQuantityChange(room.id, 1)}
                                          className="w-8 h-8 rounded-lg bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-bold flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                                          title="Adicionar mais um quarto desta categoria"
                                        >
                                          +
                                        </button>
                                      </div>

                                      {qty === 0 ? (
                                        <button
                                          type="button"
                                          onClick={() => handleQuantityChange(room.id, 1)}
                                          className="px-4 py-2.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] rounded-xl font-accent text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer"
                                        >
                                          Selecionar
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleQuickToggleRoom(room.id)}
                                          className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-accent text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
                                          title="Remover este quarto da seleção"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <div className="px-4 py-2 bg-zinc-100 border border-zinc-200 text-zinc-400 rounded-xl font-accent text-[10px] font-bold tracking-wider uppercase">
                                      Indisponível
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(room.id, 1)}
                                  className="px-5 py-2.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] rounded-xl font-accent text-xs font-extrabold tracking-wider uppercase transition-all shadow-xs cursor-pointer"
                                >
                                  ESCOLHER ESTE QUARTO
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Full-width Section: Policies and Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-200 pt-8 text-left">
              {/* Policies */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <h4 className="font-serif text-sm font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Políticas de Hospedagem</h4>
                </div>
                <ul className="space-y-2 text-xs text-zinc-650 leading-relaxed pl-1">
                  {policiesList.map((policy, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#E8711A]">•</span>
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Restrictions */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-500" />
                  <h4 className="font-serif text-sm font-bold text-zinc-800 uppercase tracking-wider text-[11px]">Regras de Convivência & Restrições</h4>
                </div>
                <ul className="space-y-2 text-xs text-zinc-650 leading-relaxed pl-1">
                  {restrictionsList.map((rest, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-zinc-400">•</span>
                      <span>{rest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Modal Action Footer */}
          <div className="border-t border-zinc-200 bg-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0 z-20 shrink-0 shadow-lg">
            {isSelectionContext ? (
              /* Wizard selection view mode */
              (() => {
                const roomTypesList: RoomType[] = accommodation.roomTypes && accommodation.roomTypes.length > 0 
                  ? accommodation.roomTypes 
                  : [{
                      id: `room-${accommodation.id}-standard`,
                      name: "Suíte Standard Classic",
                      description: "Suíte aconchegante com ar-condicionado, TV, frigobar e café da manhã incluso.",
                      minGuests: 1,
                      maxGuests: 2,
                      basePrice: accommodation.sellRate || accommodation.netRate || 250,
                      amenities: accommodation.amenities || ["Ar-condicionado", "Wi-Fi Fibra", "Café da Manhã"],
                      breakfastIncluded: true
                    }];

                const selectedRoomsArray: SelectedRoomBooking[] = roomTypesList
                  .filter(r => (selectedRoomsMap[r.id] || 0) > 0)
                  .map(r => ({
                    roomId: r.id,
                    roomName: r.name,
                    basePrice: r.basePrice ?? 0,
                    quantity: selectedRoomsMap[r.id] || 1,
                    maxGuests: r.maxGuests
                  }));

                const totalCapacity = selectedRoomsArray.reduce((sum, r) => sum + (r.maxGuests * r.quantity), 0);
                const isReadyToConfirm = totalCapacity >= totalGuests && selectedRoomsArray.length > 0;

                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                    <div className="text-center sm:text-left">
                      {selectedRoomsArray.length > 0 ? (
                        <>
                          <span className={`text-[10px] font-black uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1 ${
                            isReadyToConfirm ? 'text-emerald-600' : 'text-amber-700'
                          }`}>
                            {isReadyToConfirm ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Capacidade Completa ({totalCapacity}/{totalGuests} pessoas)</span>
                              </>
                            ) : (
                              <>
                                <span>⚠️ Capacidade Parcial ({totalCapacity}/{totalGuests} pessoas)</span>
                              </>
                            )}
                          </span>
                          <span className="font-serif text-sm font-extrabold text-[#0D1B2A] block">
                            {selectedRoomsArray.map(r => `${r.quantity}x ${r.roomName}`).join(" + ")}
                          </span>
                          <span className="text-xs text-zinc-500 font-medium">
                            Diária Total: R$ {selectedRoomsArray.reduce((sum, r) => sum + (r.basePrice * r.quantity), 0).toFixed(2)} / noite
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-[#E8711A] font-black uppercase tracking-widest block">
                            ⚠️ Seleção Obrigatória de Quarto
                          </span>
                          <span className="font-serif text-xs sm:text-sm font-bold text-zinc-700">
                            Por favor, selecione os quartos necessários para atender {totalGuests} hóspedes
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {isReadyToConfirm ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectRooms) {
                              onSelectRooms(accommodation, selectedRoomsArray);
                            }
                            if (onSelectRoom && selectedRoomsArray.length > 0) {
                              const primaryRoom = roomTypesList.find(r => r.id === selectedRoomsArray[0].roomId);
                              if (primaryRoom) onSelectRoom(accommodation, primaryRoom);
                            } else if (onSelectToggle) {
                              onSelectToggle();
                            }
                            onClose();
                          }}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#E8711A] hover:bg-[#0D1B2A] text-[#0D1B2A] hover:text-white rounded-full font-accent text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-102"
                        >
                          <span>ADICIONAR AO ROTEIRO ({selectedRoomsArray.reduce((sum, r) => sum + r.quantity, 0)} {selectedRoomsArray.reduce((sum, r) => sum + r.quantity, 0) === 1 ? 'QUARTO' : 'QUARTOS'}) 🚀</span>
                        </button>
                      ) : selectedRoomsArray.length > 0 ? (
                        <button
                          type="button"
                          disabled
                          className="w-full sm:w-auto px-6 py-3.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-accent text-xs font-black tracking-wider uppercase cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <span>ADICIONE MAIS UM QUARTO (FALTAM {totalGuests - totalCapacity} PESSOAS)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full sm:w-auto px-8 py-3.5 bg-zinc-200 text-zinc-400 rounded-full font-accent text-xs font-black tracking-wider uppercase cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <span>SELECIONE OS QUARTOS ACIMA</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Public Catalog / Detail view mode */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-accent uppercase text-zinc-400 tracking-widest font-black block">Reserva Garantida</span>
                  <span className="font-serif text-sm font-extrabold text-[#0D1B2A]">
                    {accommodation.name} • {accommodation.priceDisplay || `R$ ${accommodation.sellRate}/diária`}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleBookViaWhatsApp}
                    className="flex-1 sm:flex-initial px-6 py-3.5 border border-[#0D1B2A] text-[#0D1B2A] hover:bg-zinc-100 rounded-full font-accent text-xs font-black tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-center"
                  >
                    <Phone className="w-3.5 h-3.5" /> Fale Conosco
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const roomTypesList = accommodation.roomTypes && accommodation.roomTypes.length > 0 
                        ? accommodation.roomTypes 
                        : [{ id: `room-${accommodation.id}-standard` }];
                      const firstSelectedId = Object.keys(selectedRoomsMap)[0] || roomTypesList[0].id;
                      if (onNavigateToWizard) {
                        onNavigateToWizard(accommodation.id, firstSelectedId);
                        onClose();
                      }
                    }}
                    className="flex-1 sm:flex-initial px-8 py-3.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] rounded-full font-accent text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer hover:scale-102 flex items-center justify-center gap-1.5 text-center"
                  >
                    <span>VINCULAR E MONTAR ROTEIRO 🚀</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* FULL SCREEN GALLERY OVERLAY LIGHTBOX */}
      <AnimatePresence>
        {isFullScreenGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col justify-between items-center p-4 sm:p-8"
          >
            {/* Top Bar inside Fullscreen */}
            <div className="w-full flex justify-between items-center text-white shrink-0">
              <span className="font-serif text-sm font-semibold truncate max-w-[80%]">{accommodation.name} — Galeria</span>
              <button
                onClick={() => setIsFullScreenGallery(false)}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-colors cursor-pointer"
                title="Fechar Galeria"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Main Image Center */}
            <div className="flex-1 w-full max-w-5xl flex items-center justify-between relative">
              {/* Prev Arrow */}
              {photos.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                  className="absolute left-2 sm:left-4 z-10 p-3 bg-zinc-900/80 hover:bg-zinc-800 hover:scale-105 active:scale-95 text-white rounded-full shadow-lg transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[3]" />
                </button>
              )}

              {/* Img Container */}
              <div className="w-full h-full max-h-[75vh] flex items-center justify-center overflow-hidden">
                <img
                  src={photosExtended[activePhotoIdx].originalUrl}
                  alt={`${accommodation.name} - Imersiva`}
                  className="max-w-full max-h-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Next Arrow */}
              {photos.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 sm:right-4 z-10 p-3 bg-zinc-900/80 hover:bg-zinc-800 hover:scale-105 active:scale-95 text-white rounded-full shadow-lg transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 stroke-[3]" />
                </button>
              )}
            </div>

            {/* Bottom bar with Thumbnails & Caption */}
            <div className="w-full max-w-4xl text-center space-y-4 shrink-0">
              <span className="text-xs text-zinc-400 font-mono">
                Foto {activePhotoIdx + 1} de {photos.length}
              </span>

              {/* Thumbnails list */}
              {photos.length > 1 && (
                <div className="flex gap-2.5 justify-center overflow-x-auto py-1 max-w-full">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-16 aspect-[4/3] rounded-md overflow-hidden shrink-0 border transition-all cursor-pointer ${
                        activePhotoIdx === idx 
                          ? "border-[#E8711A] ring-2 ring-[#E8711A]/30 scale-95" 
                          : "border-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      <img
                        src={photo}
                        alt="Miniatura"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
