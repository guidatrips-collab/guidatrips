/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Check, Star, MapPin, Coffee, Wifi, Shield, ArrowRight, Sparkles, Phone, Compass, Waves
} from "lucide-react";
import { motion } from "motion/react";

import { Accommodation } from "../types";
import AccommodationDetailModal from "./AccommodationDetailModal";

interface HospedagensViewProps {
  whatsappNumber: string;
  accommodations: Accommodation[];
  onWhatsAppContact?: (message?: string) => void;
  onNavigate?: (view: string) => void;
  onChangeHotelId?: (id: string | null) => void;
  selectedAccommodationSlug?: string | null;
  onSelectAccommodation?: (slug: string | null) => void;
}

export default function HospedagensView({ 
  whatsappNumber, 
  accommodations, 
  onWhatsAppContact,
  onNavigate,
  onChangeHotelId,
  selectedAccommodationSlug,
  onSelectAccommodation
}: HospedagensViewProps) {
  const [activeFilter, setActiveFilter] = useState<"todas" | "boutique" | "vista" | "pe-na-areia">("todas");
  const [selectedPousadaForDetail, setSelectedPousadaForDetail] = useState<Accommodation | null>(null);

  useEffect(() => {
    if (selectedAccommodationSlug) {
      const originalAcc = accommodations.find(a => a.slug === selectedAccommodationSlug);
      if (originalAcc) {
        setSelectedPousadaForDetail(originalAcc);
      }
    } else {
      setSelectedPousadaForDetail(null);
    }
  }, [selectedAccommodationSlug, accommodations]);

  const handleOpenDetail = (acc: Accommodation) => {
    if (onSelectAccommodation) {
      onSelectAccommodation(acc.slug);
    } else {
      setSelectedPousadaForDetail(acc);
    }
  };

  const handleCloseDetail = () => {
    if (onSelectAccommodation) {
      onSelectAccommodation(null);
    } else {
      setSelectedPousadaForDetail(null);
    }
  };

  // Map database accommodations to the local format if needed, or just use them directly
  const pousadas = accommodations.map(acc => ({
    id: acc.id,
    name: acc.name,
    category: acc.typeTag || "todas",
    location: acc.location,
    rating: acc.rating || 5.0,
    reviews: acc.reviews || 0,
    tag: acc.tag || "CURADORIA EXCLUSIVA",
    price: acc.priceDisplay || `A partir de R$ ${acc.sellRate} / noite`,
    description: acc.description,
    highlight: acc.highlight || "",
    amenities: acc.amenities,
    courtesies: acc.courtesies || [],
    img: acc.photos?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    whatsappMessage: acc.whatsappMessage || `Olá, Guida Trips! Gostaria de consultar tarifas com benefícios exclusivos para a ${acc.name}.`
  }));

  const filteredPousadas = pousadas.filter(
    (p) => activeFilter === "todas" || p.category === activeFilter
  );

  const handleBookNow = (msg: string) => {
    onWhatsAppContact?.(msg);
  };

  const handleNavigateToWizardWithHotel = (hotelId: string) => {
    if (onChangeHotelId) {
      onChangeHotelId(hotelId);
    }
    if (onNavigate) {
      onNavigate("wizard");
    }
  };

  return (
    <div id="hospedagens-view" className="pt-24 pb-20 bg-[#FBF9F6]">
      {/* Editorial Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8711A]/5 rounded-full border border-[#E8711A]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#E8711A]" />
            <span className="font-accent text-[#0d1b2a] text-[9px] font-extrabold tracking-widest uppercase">
              Curadoria Exclusiva Guida Trips
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Paraísos de repouso no fim do dia.
          </h1>
          <div className="h-0.5 w-16 bg-[#E8711A] mx-auto my-2"></div>
          <p className="font-sans text-sm text-[#5C6874] leading-relaxed">
            Selecionamos apenas as pousadas que compartilham da nossa filosofia de acolhimento humano, serviço impecável e carinho nos detalhes. Ao reservar pelo canal oficial da Guida Trips, você garante tarifas sob medida, check-in estendido e mimos de boas-vindas.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {[
            { id: "todas", label: "TODAS" },
            { id: "boutique", label: "BOUTIQUE / CHARME" },
            { id: "pe-na-areia", label: "PÉ NA AREIA & EMBARQUE" },
            { id: "vista", label: "VISTAS PANORÂMICAS" }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-5 py-2.5 rounded-sm font-accent text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                activeFilter === filter.id
                  ? "bg-[#0D1B2A] text-white shadow-md border border-[#0D1B2A]"
                  : "bg-white text-zinc-500 border border-zinc-200 hover:border-[#0D1B2A] hover:text-[#0D1B2A]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Pousadas Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredPousadas.map((pousada) => (
            <motion.div
              layout
              key={pousada.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#0D1B2A]/30 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(13,27,42,0.04)]"
            >
              {/* Photo Area with Tag - Clickable */}
              <div 
                onClick={() => {
                  const originalAcc = accommodations.find(a => a.id === pousada.id);
                  if (originalAcc) setSelectedPousadaForDetail(originalAcc);
                }}
                className="h-64 relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={pousada.img}
                  alt={pousada.name}
                  className="w-full h-full object-cover group-hover:scale-102 duration-300 transition-transform filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#0D1B2A] text-white text-[9px] font-accent font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-sm">
                  {pousada.tag}
                </span>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#0D1B2A] font-accent text-[10px] font-bold px-2.5 py-1.5 rounded-sm shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#E8711A] text-[#E8711A]" />
                  <span>{pousada.rating}</span>
                  <span className="text-zinc-400 font-normal">({pousada.reviews})</span>
                </div>
              </div>

              {/* Informative Area */}
              <div className="p-6 sm:p-8 flex-grow space-y-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-sans text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-[#E8711A]" />
                    <span>{pousada.location}</span>
                  </div>
                  <h3 
                    onClick={() => {
                      const originalAcc = accommodations.find(a => a.id === pousada.id);
                      if (originalAcc) handleOpenDetail(originalAcc);
                    }}
                    className="font-serif text-xl font-bold text-[#0D1B2A] hover:text-[#E8711A] transition-colors leading-snug cursor-pointer"
                  >
                    {pousada.name}
                  </h3>
                </div>

                <p className="font-sans text-xs text-[#5C6874] leading-relaxed line-clamp-3">
                  {pousada.description}
                </p>

                <div className="bg-[#FBF9F7] p-3 border-l-2 border-[#E8711A] rounded-r text-xs font-sans text-[#0D1B2A] font-semibold italic line-clamp-1">
                  ⭐ Destaque: {pousada.highlight}
                </div>

                {/* Amenities pills */}
                <div className="pt-2">
                  <span className="font-accent text-[8px] text-zinc-400 tracking-wider uppercase font-bold block mb-2">Características (Estrutura):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pousada.amenities.slice(0, 4).map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-zinc-100 text-[#0c1a26] font-sans text-[10px] rounded-sm flex items-center gap-1">
                        {item.includes("Café") && <Coffee className="w-2.5 h-2.5 text-[#E8711A]" />}
                        {item.includes("Wi-Fi") && <Wifi className="w-2.5 h-2.5 text-[#E8711A]" />}
                        {item.includes("Piscina") && <Waves className="w-2.5 h-2.5 text-[#E8711A]" />}
                        <span className="font-medium">{item}</span>
                      </span>
                    ))}
                    {pousada.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-500 font-sans text-[10px] rounded-sm font-semibold">
                        +{pousada.amenities.length - 4} mais
                      </span>
                    )}
                  </div>
                </div>

                {/* Cortesias */}
                {pousada.courtesies && pousada.courtesies.length > 0 && (
                  <div className="pt-3 border-t border-zinc-100">
                    <span className="font-accent text-[8px] text-[#E8711A] tracking-wider uppercase font-bold block mb-2">🎁 Cortesias Guida Trips:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pousada.courtesies.map((item, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#E8711A]/10 text-[#E8711A] font-sans text-[10px] font-bold rounded-sm flex items-center gap-1">
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cost & Booking CTA */}
              <div className="p-5 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <span className="font-accent text-[8px] text-zinc-400 tracking-wider uppercase block">MELHOR TARIFA</span>
                  <span className="font-serif text-xs sm:text-sm font-bold text-[#0D1B2A]">{pousada.price}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const originalAcc = accommodations.find(a => a.id === pousada.id);
                      if (originalAcc) handleOpenDetail(originalAcc);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 border border-[#0D1B2A] hover:bg-zinc-100 text-[#0D1B2A] font-accent text-[10px] font-bold tracking-wider uppercase transition-colors rounded cursor-pointer text-center"
                  >
                    DETALHES
                  </button>
                  <button
                    onClick={() => handleBookNow(pousada.whatsappMessage)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-accent text-[10px] font-bold tracking-wider uppercase transition-colors rounded shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3 h-3" /> RESERVAR
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-zinc-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <span className="p-3.5 bg-[#E8711A]/5 rounded-sm border border-[#E8711A]/20 text-[#E8711A]">
                <Shield className="w-6 h-6" />
              </span>
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Parcerias Diretas & Homologadas</h4>
                <p className="font-sans text-[11px] text-zinc-500">Garantimos contato direto com os gerentes de cada acomodação, prevenindo contratempos ou reservas fantasma.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <span className="p-3.5 bg-[#E8711A]/5 rounded-sm border border-[#E8711A]/20 text-[#E8711A]">
                <Sparkles className="w-6 h-6" />
              </span>
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Mimos de Boas-Vindas Inclusos</h4>
                <p className="font-sans text-[11px] text-zinc-500">Ao reservar pela Guida, encontre uma garrafa cortesia de águas ou frisante e frutas tropicais de boas-vindas no quarto.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <span className="p-3.5 bg-[#E8711A]/5 rounded-sm border border-[#E8711A]/20 text-[#E8711A]">
                <Compass className="w-6 h-6" />
              </span>
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Suporte Concierge 24/7</h4>
                <p className="font-sans text-[11px] text-zinc-500">Se precisar de uma troca de travesseiro, check-out estendido ou indicação de jantar, nosso time atua imediatamente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Detail Modal Overlay */}
      {selectedPousadaForDetail && (
        <AccommodationDetailModal
          accommodation={selectedPousadaForDetail}
          isOpen={!!selectedPousadaForDetail}
          onClose={handleCloseDetail}
          isSelectionContext={false}
          onWhatsAppContact={handleBookNow}
          onNavigateToWizard={handleNavigateToWizardWithHotel}
        />
      )}
    </div>
  );
}
