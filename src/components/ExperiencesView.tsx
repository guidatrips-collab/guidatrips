import React, { useState, useMemo, useEffect } from "react";
import { 
  Compass, Calendar, Users, MapPin, Check, X, ArrowRight, Share2, 
  Search, Info, Plus, ChevronLeft, ChevronRight, CreditCard, Shield, 
  Send, Sparkles, CheckCircle, Smartphone, Trash2 
} from "lucide-react";
import { Experience, ExperienceCategory, BookingCartItem, GlobalSettings, ClientReservation, ClientUser, checkSchedulingConflict, getBrazilLocalDate, addDaysToBrazilDate, Destination } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { firestoreService } from "../firebase";
import ExperienceMediaGallery from "./ExperienceMediaGallery";

interface ExperiencesViewProps {
  experiences: Experience[];
  cart: BookingCartItem[];
  onAddToCart: (item: BookingCartItem) => void;
  onRemoveFromCart: (idx: number) => void;
  onOpenCart: () => void;
  whatsappNumber: string;
  settings?: GlobalSettings;
  onUpdateSettings?: (settings: GlobalSettings) => void;
  onNavigate?: (view: string) => void;
  currentUser: ClientUser | null;
  onTriggerAuthModal?: (action: { type: string; action: () => void }) => void;
  stayDays?: number;
  destinations: Destination[];
  selectedDestinationId: string | null;
  onUpdateSelectedDestinationId: (id: string) => void;
}

export default function ExperiencesView({
  experiences,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onOpenCart,
  whatsappNumber,
  settings,
  onUpdateSettings,
  onNavigate,
  currentUser,
  onTriggerAuthModal,
  stayDays = 4,
  destinations,
  selectedDestinationId,
  onUpdateSelectedDestinationId
}: ExperiencesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedLocation, setSelectedLocation] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null);

  // Day selection modal states
  const [showDaySelectionModal, setShowDaySelectionModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<Partial<BookingCartItem> | null>(null);
  const [modalConflictError, setModalConflictError] = useState<string | null>(null);

  useEffect(() => {
    if (!showDaySelectionModal) {
      setModalConflictError(null);
    }
  }, [showDaySelectionModal]);

  // Form states inside details modal
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSchedule, setBookingSchedule] = useState("");
  const [bookingAdults, setBookingAdults] = useState<number>(2);
  const [bookingChildren, setBookingChildren] = useState<number>(0);
  const [bookingInfants, setBookingInfants] = useState<number>(0);
  const [bookingObservations, setBookingObservations] = useState("");

  // Booking process states
  const [bookingMethod, setBookingMethod] = useState<"whatsapp" | "online">("whatsapp");
  const [onlineStep, setOnlineStep] = useState<"details" | "payment" | "success">("details");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  
  // Simulated Card Info
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Client Details for Direct Checkout
  const [clientFormName, setClientFormName] = useState("");
  const [clientFormPhone, setClientFormPhone] = useState("");
  const [clientFormEmail, setClientFormEmail] = useState("");

  // Sync with logged-in user details
  React.useEffect(() => {
    if (currentUser) {
      setClientFormName(currentUser.name || "");
      setClientFormEmail(currentUser.email || "");
      setClientFormPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  // Interactive calendar active month
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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
    ...(destinations || []).filter(d => d.status === "active" || d.id === selectedDestinationId).map(d => ({
      id: d.id, label: `📍 ${d.name}`
    }))
  ];

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = selectedCategory === "todos" || exp.category === selectedCategory;
    const matchesLocation = selectedLocation === "todos" || exp.destinationId === selectedLocation || (exp.location && exp.location === selectedLocation);
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Default to only showing the globally selected destination unless "todos" or another destination is actively chosen in this view
    const globalDestMatch = selectedLocation === "todos" ? (exp.destinationId === selectedDestinationId) : true;
    
    return matchesCategory && matchesLocation && matchesSearch && exp.status === "active" && globalDestMatch;
  });

  // Calculate dynamic price and blocked state based on admin-defined calendar settings
  const getPriceForDate = (exp: Experience, dateStr: string) => {
    const baseAdult = exp.pricing?.adultPrice ?? exp.priceFrom;
    const baseChild = exp.pricing?.childPrice ?? (exp.promotionalPrice || exp.priceFrom) * 0.5;
    const baseBaby = exp.pricing?.babyPrice ?? 0;

    if (!dateStr) {
      return { adultPrice: baseAdult, childPrice: baseChild, babyPrice: baseBaby, isClosed: true, hasNoTariff: true };
    }

    // Direct match from Admin Pricing Calendar
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

    // If there is no custom calendar tariff defined for this date, default to closed/blocked.
    return { adultPrice: baseAdult, childPrice: baseChild, babyPrice: baseBaby, isClosed: true, hasNoTariff: true };
  };

  const handleOpenDetails = (exp: Experience) => {
    setActiveExperience(exp);
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const defaultDate = `${yyyy}-${mm}-${dd}`;
    
    setBookingDate(defaultDate);
    setBookingSchedule(exp.schedules && exp.schedules.length > 0 ? exp.schedules[0] : "08:00");
    setBookingAdults(2);
    setBookingChildren(0);
    setBookingInfants(0);
    setBookingObservations("");
    setBookingMethod("whatsapp");
    setOnlineStep("details");
    setClientFormName("");
    setClientFormPhone("");
    setClientFormEmail("");
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvv("");
    setOpenFaqIndex(null);
    setCalendarMonth(new Date());
  };

  // Dynamic Prices for the selected booking date
  const selectedDateRates = useMemo(() => {
    if (!activeExperience) return { adultPrice: 0, childPrice: 0, babyPrice: 0, isClosed: false };
    return getPriceForDate(activeExperience, bookingDate);
  }, [activeExperience, bookingDate]);

  // Total Cost calculation using selected date rates
  const totalCost = useMemo(() => {
    const adultsVal = bookingAdults * selectedDateRates.adultPrice;
    const childrenVal = bookingChildren * selectedDateRates.childPrice;
    const infantsVal = bookingInfants * selectedDateRates.babyPrice;
    return adultsVal + childrenVal + infantsVal;
  }, [bookingAdults, bookingChildren, bookingInfants, selectedDateRates]);

  const handleAddCartItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExperience) return;

    setPendingCartItem({
      experienceId: activeExperience.id,
      date: bookingDate,
      schedule: bookingSchedule || (activeExperience.schedules && activeExperience.schedules.length > 0 ? activeExperience.schedules[0] : "08:00"),
      adults: bookingAdults,
      children: bookingChildren,
      infants: bookingInfants,
      people: bookingAdults + bookingChildren + bookingInfants,
      observations: bookingObservations,
    });
    setShowDaySelectionModal(true);
  };

  // Perform Simulated Online Booking
  const handleConfirmOnlineBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExperience || !onUpdateSettings || !settings) return;

    setIsPaying(true);

    // Simulate Payment Gateway processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Append newly created reservation to Global Settings
    const newReservation: ClientReservation = {
      id: `res-${Date.now()}`,
      userId: currentUser ? currentUser.id : "user-1", // Carolina Mendes (Default profile fallback)
      experienceId: activeExperience.id,
      date: bookingDate,
      time: bookingSchedule,
      status: "confirmed",
      pax: bookingAdults + bookingChildren + bookingInfants,
      voucherCode: `GDT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      meetingPoint: activeExperience.meetingPoint || "Cais da Praia dos Anjos",
      rules: activeExperience.included || [
        "Chegue com 20 minutos de antecedência.",
        "Uso de colete salva-vidas obrigatório durante a navegação."
      ],
      bringItems: activeExperience.bringItems || ["Filtro solar", "Toalha de banho"],
      avoidItems: activeExperience.notIncluded || ["Sacos plásticos", "Salto alto"]
    };

    // Safely write to Firestore reservations collection for authenticated users
    try {
      await firestoreService.set("reservations", newReservation.id, newReservation);
    } catch (err) {
      console.error("Error persisting reservation to Firestore:", err);
    }

    const updatedReservations = [newReservation, ...(settings.clientReservations || [])];
    
    // Update settings permanently
    onUpdateSettings({
      ...settings,
      clientReservations: updatedReservations
    });

    setIsPaying(false);
    setOnlineStep("success");
  };

  // Interactive Calendar Grid helpers for client-facing selector
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  return (
    <div id="experiences-view" className="pt-28 pb-24 bg-[#FBF9F6] min-h-screen text-[#0D1B2A] selection:bg-[#E8711A] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* EDITORIAL HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8711A]/10 border border-[#E8711A]/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8711A]" />
            <span className="font-accent text-[#E8711A] text-[10px] font-bold tracking-widest uppercase">
              Roteiros de Alta Curadoria
            </span>
          </motion.div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Cada passeio é o começo de uma história memorável.
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
            Consulte calendários reais de tarifas e garanta sua vaga diretamente. Selecione passeios exclusivos projetados por quem ama o mar.
          </p>
        </div>

        {/* CONTROLS: FILTERS & SEARCH */}
        <div className="space-y-6 mb-12 border-b border-zinc-200 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Destinos */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-accent text-[9px] text-zinc-500 uppercase tracking-wider mr-2 font-bold">Destino:</span>
              {availableLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`px-3.5 py-1.5 rounded-lg font-accent text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    selectedLocation === loc.id
                      ? "bg-[#0D1B2A] text-white shadow-md"
                      : "bg-white text-zinc-500 border border-zinc-200 hover:border-[#0D1B2A] hover:text-[#0D1B2A]"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar aventura ideal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-[#0D1B2A] placeholder-zinc-400 focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A] shadow-xs"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-accent text-[9px] text-zinc-500 uppercase tracking-wider mr-2 font-bold">Categoria:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full font-accent text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0D1B2A] text-white shadow-sm"
                    : "bg-white text-zinc-500 border border-zinc-200 hover:border-[#0D1B2A] hover:text-[#0D1B2A]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* EXPERIENCES CARDS GRID */}
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((exp) => {
              const lowestPrice = exp.promotionalPrice || exp.priceFrom;
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={exp.id}
                  className="group flex flex-col justify-between bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-[#E8711A]/50 transition-all duration-300 shadow-sm h-full hover:shadow-md"
                >
                  {/* Card Cover */}
                  <div className="relative h-60 overflow-hidden select-none">
                    <ExperienceMediaGallery experience={exp} className="w-full h-full" />
                    
                    {/* Badge */}
                    {exp.badge && (
                      <span className="absolute top-4 left-4 font-accent text-[8px] font-black tracking-widest text-white bg-[#E8711A] px-3 py-1 uppercase rounded-md shadow-md z-10">
                        {exp.badge === "mais-vendido" && "🔥 MAIS VENDIDO"}
                        {exp.badge === "novidade" && "✨ NOVIDADE"}
                        {exp.badge === "temporada" && "🐋 TEMPORADA"}
                      </span>
                    )}

                    {/* Location Tag */}
                    <span className="absolute bottom-4 right-4 font-accent text-[9px] font-bold tracking-widest text-zinc-800 bg-white/95 border border-zinc-200 px-2.5 py-1 uppercase rounded-md shadow-sm z-10">
                      📍 {exp.location || "Arraial"}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[#E8711A] font-accent text-[9px] font-bold tracking-widest uppercase">
                        {exp.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#0D1B2A] group-hover:text-[#E8711A] transition-colors leading-snug line-clamp-1">
                        {exp.name}
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed line-clamp-3">
                        {exp.shortDescription}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-150">
                      {/* Pricing and duration */}
                      <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-1 text-zinc-500">
                          <span>⏱</span>
                          <span className="font-accent text-[10px] uppercase font-bold tracking-wider">{exp.duration}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-zinc-400 uppercase tracking-wider font-accent font-semibold">Tarifa base</span>
                          <div className="flex items-center gap-2">
                            {exp.promotionalPrice ? (
                              <>
                                <span className="line-through text-zinc-400 text-xs">R${exp.priceFrom}</span>
                                <span className="text-emerald-600 font-black font-serif text-base">R${exp.promotionalPrice}</span>
                              </>
                            ) : (
                              <span className="text-[#0D1B2A] font-black font-serif text-base">R$ {exp.priceFrom}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Detail CTA */}
                      <button
                        onClick={() => handleOpenDetails(exp)}
                        className="w-full text-center bg-zinc-100 hover:bg-[#E8711A] text-[#0D1B2A] hover:text-white border border-zinc-200 hover:border-[#E8711A] p-3 text-xs font-accent font-bold uppercase tracking-widest transition-all rounded-xl cursor-pointer"
                      >
                        Ver Detalhes & Disponibilidade &rarr;
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-zinc-200 rounded-2xl shadow-sm text-zinc-500">
            <p className="font-sans text-xs text-zinc-500 mb-4">Nenhum passeio encontrado para as seleções atuais.</p>
            <button
              onClick={() => { setSelectedCategory("todos"); setSelectedLocation("todos"); setSearchQuery(""); }}
              className="px-6 py-2.5 bg-transparent border border-[#E8711A] text-[#E8711A] hover:bg-[#E8711A] hover:text-white font-accent text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Exibir Tudo
            </button>
          </div>
        )}

      </div>

      {/* LUXURY SLIDEOVER/LIGHTBOX DETAILED VIEW */}
      <AnimatePresence>
        {activeExperience && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              id="details-modal"
              className="bg-white border border-zinc-200 rounded-3xl w-full max-w-5xl max-h-[94vh] overflow-y-auto shadow-2xl relative text-[#0D1B2A]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveExperience(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-100 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-all font-bold text-sm cursor-pointer border border-zinc-200"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* LEFT COLUMN: Gallery, Video, Desc (7/12 cols) */}
                <div className="lg:col-span-7 p-4 sm:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-zinc-200 text-left">
                  
                  {/* Hero image of the Tour */}
                  <div className="relative h-64 sm:h-[400px] overflow-hidden rounded-2xl border border-zinc-200 select-none">
                    <img 
                      src={activeExperience.photos && activeExperience.photos.length > 0 ? activeExperience.photos[0] : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"} 
                      alt={activeExperience.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 font-accent text-[9px] font-black tracking-widest text-[#E8711A] bg-white border border-[#E8711A]/20 shadow-md px-3 py-1 uppercase rounded-md">
                      ⛵ {activeExperience.category.toUpperCase()}
                    </div>
                  </div>

                  {/* Gallery Thumbs */}
                  {activeExperience.photos && activeExperience.photos.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {activeExperience.photos.slice(1).map((pic, i) => (
                        <div key={i} className="h-16 sm:h-20 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                          <img src={pic} className="w-full h-full object-cover" alt="Galeria" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Highlights */}
                  {activeExperience.highlights && activeExperience.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activeExperience.highlights.map((hlt, idx) => (
                        <span key={idx} className="bg-[#E8711A]/10 text-[#E8711A] px-3.5 py-1.5 rounded-full font-accent text-[8px] sm:text-[9px] font-bold uppercase tracking-widest border border-[#E8711A]/20">
                          ✨ {hlt}
                        </span>
                      ))}
                    </div>
                  )}

                  {activeExperience.videoEmbed && (
                    <div className="space-y-2">
                      <span className="font-accent text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">Registro em Vídeo</span>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-zinc-50">
                        <iframe 
                          src={activeExperience.videoEmbed.replace("watch?v=", "embed/")} 
                          title="Vídeo do passeio" 
                          className="w-full h-full" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {/* Tour Metadata Specs (Departure City, Age limits, Duration) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-zinc-50 border border-zinc-200 p-4 rounded-2xl pt-4">
                    {activeExperience.departureCity && (
                      <div className="text-left">
                        <span className="font-accent text-[8px] sm:text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">Partida</span>
                        <span className="font-sans text-xs sm:text-sm text-[#0D1B2A] font-semibold">{activeExperience.departureCity}</span>
                      </div>
                    )}
                    {(activeExperience.minAge || activeExperience.maxAge) && (
                      <div className="text-left">
                        <span className="font-accent text-[8px] sm:text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">Faixa Etária</span>
                        <span className="font-sans text-xs sm:text-sm text-[#0D1B2A] font-semibold">
                          {activeExperience.minAge ? `${activeExperience.minAge}` : "Livre"}
                          {activeExperience.maxAge ? ` até ${activeExperience.maxAge}` : ""}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <span className="font-accent text-[8px] sm:text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">Duração</span>
                      <span className="font-sans text-xs sm:text-sm text-[#0D1B2A] font-semibold">{activeExperience.duration}</span>
                    </div>
                  </div>

                  {/* Full Description text */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-serif text-xl font-bold text-[#0D1B2A] border-b border-zinc-200 pb-2">Sobre este passeio</h3>
                    <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                      {activeExperience.fullDescription}
                    </p>
                  </div>

                  {/* Itinerary (Roteiro) section */}
                  {activeExperience.itinerary && activeExperience.itinerary.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-zinc-200">
                      <h3 className="font-serif text-lg font-bold text-[#0D1B2A] pb-1">📍 Roteiro Completo</h3>
                      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8711A]/20">
                        {activeExperience.itinerary.map((step, idx) => {
                          const [title, ...descParts] = step.split(":");
                          const desc = descParts.join(":");
                          return (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[20px] top-1 w-3 h-3 rounded-full bg-[#E8711A] border-4 border-white z-10" />
                              <div className="text-left">
                                <h4 className="font-sans text-xs sm:text-sm font-bold text-[#0D1B2A]">{title || step}</h4>
                                {desc && <p className="font-sans text-xs text-zinc-500 mt-1">{desc.trim()}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Inclusions / Exclusions Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl space-y-3">
                      <span className="font-accent text-[10px] text-emerald-700 font-black tracking-widest uppercase flex items-center gap-1.5">
                        ✓ O Que Inclui
                      </span>
                      <ul className="space-y-2 font-sans text-xs text-zinc-600">
                        {activeExperience.included?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 select-none mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl space-y-3">
                      <span className="font-accent text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                        ✕ Não Inclui
                      </span>
                      <ul className="space-y-2 font-sans text-xs text-zinc-500">
                        {activeExperience.notIncluded?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-zinc-400 select-none mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bring items */}
                  {activeExperience.bringItems && activeExperience.bringItems.length > 0 && (
                    <div className="bg-[#E8711A]/5 p-5 border border-[#E8711A]/20 rounded-2xl space-y-2">
                      <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase block">
                        🎒 O Que Levar / Recomendações
                      </span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {activeExperience.bringItems.map((item, idx) => (
                          <span key={idx} className="bg-zinc-100 border border-zinc-200 text-zinc-600 px-3 py-1 rounded-lg text-xs font-sans">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meeting Point and Interactive Google Maps */}
                  <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-3 text-xs font-sans text-zinc-600">
                      <MapPin className="w-5 h-5 text-[#E8711A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#0D1B2A] block text-sm mb-1">Ponto de Encontro</span>
                        {activeExperience.meetingPoint}
                      </div>
                    </div>
                    {activeExperience.googleMapsUrl && (
                      <a 
                        href={activeExperience.googleMapsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-[#E8711A] hover:bg-[#D45F12] text-white font-accent text-[10px] uppercase tracking-widest font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shrink-0 text-center"
                      >
                        Como Chegar &rarr;
                      </a>
                    )}
                  </div>

                  {/* FAQ Accordion */}
                  {activeExperience.faqs && activeExperience.faqs.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <h3 className="font-serif text-lg font-bold text-[#0D1B2A] flex items-center gap-1.5">
                        ❓ Dúvidas Comuns
                      </h3>
                      <div className="space-y-2">
                        {activeExperience.faqs.map((faq, idx) => {
                          const isOpen = openFaqIndex === idx;
                          return (
                            <div key={idx} className="border border-zinc-200 bg-zinc-50/50 rounded-xl overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                className="w-full p-4 text-left font-serif text-xs sm:text-sm font-bold text-[#0D1B2A] hover:text-[#E8711A] transition-colors flex justify-between items-center bg-zinc-100/70"
                              >
                                <span>{faq.question}</span>
                                <span className="text-[#E8711A]">{isOpen ? "▲" : "▼"}</span>
                              </button>
                              {isOpen && (
                                <div className="p-4 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200 bg-white">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Curated Recommendations */}
                  {activeExperience.recommendations && activeExperience.recommendations.length > 0 && (
                    <div className="space-y-4 border-t border-zinc-200 pt-6">
                      <h3 className="font-serif text-base font-bold text-[#0D1B2A]">
                        💡 Complete sua Viagem:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeExperience.recommendations.map((recId) => {
                          const recExp = experiences.find(e => e.id === recId);
                          if (!recExp) return null;
                          return (
                            <div 
                              key={recId}
                              onClick={() => handleOpenDetails(recExp)}
                              className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex gap-3 hover:border-[#E8711A] hover:bg-zinc-100 transition-all cursor-pointer items-center justify-between"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-12 w-12 shrink-0 bg-white rounded-xl overflow-hidden border border-zinc-200">
                                  <img 
                                    src={recExp.photos && recExp.photos.length > 0 ? recExp.photos[0] : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80"} 
                                    alt={recExp.name} 
                                    className="h-full w-full object-cover" 
                                  />
                                </div>
                                <div className="text-left min-w-0">
                                  <h4 className="font-serif text-xs font-bold text-[#0D1B2A] line-clamp-1">{recExp.name}</h4>
                                  <span className="font-accent text-[9px] text-[#E8711A] font-black">A partir de R$ {recExp.priceFrom}</span>
                                </div>
                              </div>
                              <span className="text-xs text-[#E8711A] font-bold pr-2">&rarr;</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* RIGHT COLUMN: BOOKING CONTROLLER (5/12 cols) */}
                <div className="lg:col-span-5 bg-zinc-50/80 p-4 sm:p-8 border-t lg:border-t-0 lg:border-l border-zinc-200 flex flex-col justify-between text-left rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl sticky top-0 max-h-[94vh] overflow-y-auto">
                  <div className="space-y-6">
                    
                    {/* Header */}
                    <div>
                      <span className="font-accent text-[#E8711A] text-[9px] font-black tracking-widest uppercase">Motor de Reservas</span>
                      <h2 className="font-serif text-xl font-bold text-[#0D1B2A] mt-1">
                        {activeExperience.name}
                      </h2>
                    </div>

                    {/* Booking Method Header */}
                    <div className="bg-[#E8711A]/8 border border-[#E8711A]/10 p-3.5 rounded-xl">
                      <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase block mb-0.5">PLANEJAMENTO</span>
                      <p className="text-xs text-zinc-650 leading-normal">Configure os participantes e observações abaixo para incluir este passeio no seu roteiro.</p>
                    </div>

                    {/* DYNAMIC CONTENT SWITCH BASED ON TAB & STEP */}
                    {bookingMethod === "online" && onlineStep === "success" ? (
                      /* SIMULATED SUCCESS VIEW */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10 space-y-6"
                      >
                        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">Pagamento Confirmado!</h3>
                          <p className="font-sans text-xs text-zinc-500">Sua reserva para o passeio <strong>{activeExperience.name}</strong> está garantida e registrada com sucesso.</p>
                        </div>

                        <div className="p-4 bg-white border border-zinc-200 rounded-2xl space-y-2 text-left font-sans text-xs shadow-xs">
                          <div className="flex justify-between"><span className="text-zinc-500">Data:</span> <span className="text-[#0D1B2A] font-bold">{bookingDate}</span></div>
                          <div className="flex justify-between"><span className="text-zinc-500">Horário:</span> <span className="text-[#0D1B2A] font-bold">{bookingSchedule}</span></div>
                          <div className="flex justify-between"><span className="text-zinc-500">Total Pago:</span> <span className="text-emerald-600 font-bold">R$ {totalCost}</span></div>
                        </div>

                        <div className="space-y-3 pt-4">
                          {onNavigate && (
                            <button
                              onClick={() => {
                                setActiveExperience(null);
                                onNavigate("cliente");
                              }}
                              className="w-full py-4 bg-[#0D1B2A] hover:bg-[#152a41] text-white font-accent font-black tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              Ver meu Voucher na Área Cliente
                            </button>
                          )}
                          <button
                            onClick={() => setActiveExperience(null)}
                            className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-accent font-bold text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                          >
                            Voltar para Passeios
                          </button>
                        </div>
                      </motion.div>

                    ) : bookingMethod === "online" && onlineStep === "payment" ? (
                      /* SIMULATED ONLINE CHECKOUT (PIX or Credit Card) */
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => setOnlineStep("details")}
                            className="text-xs text-zinc-500 hover:text-[#0D1B2A] font-accent uppercase font-bold flex items-center gap-1 cursor-pointer"
                          >
                            &larr; Voltar
                          </button>
                          <span className="text-[10px] bg-[#E8711A]/10 text-[#E8711A] font-bold font-accent px-2.5 py-1 rounded">Etapa 2 de 2</span>
                        </div>

                        <h3 className="font-serif text-sm font-bold text-[#0D1B2A] uppercase tracking-wider">Método de Pagamento</h3>
                        
                        {/* Selector */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("pix")}
                            className={`p-3 border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              paymentMethod === "pix"
                                ? "border-[#E8711A] bg-[#E8711A]/5 text-[#0D1B2A]"
                                : "border-zinc-200 bg-white text-zinc-500 hover:text-[#0D1B2A]"
                            }`}
                          >
                            <Smartphone className="w-4 h-4" />
                            <span className="text-xs font-bold font-accent uppercase">Pix Instantâneo</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`p-3 border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              paymentMethod === "card"
                                ? "border-[#E8711A] bg-[#E8711A]/5 text-[#0D1B2A]"
                                : "border-zinc-200 bg-white text-zinc-500 hover:text-[#0D1B2A]"
                            }`}
                          >
                            <CreditCard className="w-4 h-4" />
                            <span className="text-xs font-bold font-accent uppercase">Cartão Crédito</span>
                          </button>
                        </div>

                        {paymentMethod === "pix" ? (
                          /* PIX INTERACTIVE SCREEN */
                          <div className="p-5 bg-white border border-zinc-200 rounded-2xl text-center space-y-4 shadow-sm">
                            <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto border-2 border-[#E8711A]">
                              {/* Clean generated QR Code */}
                              <svg className="w-full h-full text-[#0D1B2A]" viewBox="0 0 100 100">
                                <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                                <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                                <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                                <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                                <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                                <rect x="80" y="80" width="10" height="10" fill="currentColor" />
                                <rect x="40" y="70" width="10" height="20" fill="currentColor" />
                                <rect x="70" y="40" width="20" height="10" fill="currentColor" />
                              </svg>
                            </div>
                            
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 block uppercase font-accent">Chave Copia e Cola Pix</span>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  readOnly
                                  value="00020126580014BR.GOV.BCB.PIX0114pix@guidatrips"
                                  className="w-full bg-zinc-50 border border-zinc-200 p-2 text-[10px] font-mono rounded text-zinc-650"
                                />
                                <button
                                  type="button"
                                  onClick={() => alert("Chave Pix Copiada!")}
                                  className="px-3 bg-[#0D1B2A] text-white text-xs font-bold rounded hover:bg-[#1a2d42] transition-colors cursor-pointer"
                                >
                                  Copiar
                                </button>
                              </div>
                            </div>

                            <p className="text-[10px] text-zinc-500 font-sans">Abra o app do seu banco, escolha "Pagar com Pix" e cole o código ou escaneie o QR Code acima.</p>

                            <button
                              type="button"
                              onClick={handleConfirmOnlineBooking}
                              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-accent font-black tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {isPaying ? "Processando..." : "Confirmar Pagamento"}
                            </button>
                          </div>
                        ) : (
                          /* CREDIT CARD LUXURY INTERACTIVE SCREEN */
                          <form onSubmit={handleConfirmOnlineBooking} className="space-y-4">
                            
                            {/* Realistic physical card representation */}
                            <div className="w-full aspect-[1.6/1] bg-[#0D1B2A] border border-zinc-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden select-none font-mono text-white">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8711A]/10 rounded-full blur-2xl"></div>
                              <div className="flex justify-between items-start">
                                <div className="w-10 h-8 bg-amber-500/25 rounded-md border border-amber-400/20 flex items-center justify-center text-[10px] text-amber-300">Chip</div>
                                <span className="font-serif text-sm font-bold text-[#E8711A] tracking-wider italic">GUIDATRIPS</span>
                              </div>
                              
                              <div className="text-base sm:text-lg tracking-widest py-2 text-zinc-100">
                                {cardNumber || "••••  ••••  ••••  ••••"}
                              </div>

                              <div className="flex justify-between items-end text-xs">
                                <div>
                                  <span className="block text-[8px] text-zinc-400 font-accent">Titular</span>
                                  <span className="uppercase text-[11px] block text-zinc-100 truncate max-w-40">{cardName || "Nome do Titular"}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] text-zinc-400 font-accent">Validade</span>
                                  <span className="text-[11px] block text-zinc-100">{cardExpiry || "MM/AA"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Form Inputs */}
                            <div className="space-y-3.5 pt-2">
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 font-accent uppercase">Número do Cartão *</label>
                                <input
                                  type="text"
                                  required
                                  maxLength={19}
                                  placeholder="0000 0000 0000 0000"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                                  className="w-full bg-white border border-zinc-200 p-3 text-xs text-[#0D1B2A] rounded-xl focus:outline-none focus:border-[#E8711A] placeholder-zinc-400"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 font-accent uppercase">Nome Impresso no Cartão *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="EX: CLARA SILVA"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                  className="w-full bg-white border border-zinc-200 p-3 text-xs text-[#0D1B2A] rounded-xl focus:outline-none focus:border-[#E8711A] placeholder-zinc-400"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-500 font-accent uppercase">Validade *</label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={5}
                                    placeholder="MM/AA"
                                    value={cardExpiry}
                                    onChange={(e) => {
                                      let val = e.target.value.replace(/\D/g, "");
                                      if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                                      setCardExpiry(val);
                                    }}
                                    className="w-full bg-white border border-zinc-200 p-3 text-xs text-[#0D1B2A] rounded-xl focus:outline-none focus:border-[#E8711A] text-center placeholder-zinc-400"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-500 font-accent uppercase">CVV / Seg *</label>
                                  <input
                                    type="password"
                                    required
                                    maxLength={4}
                                    placeholder="•••"
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                    className="w-full bg-white border border-zinc-200 p-3 text-xs text-[#0D1B2A] rounded-xl focus:outline-none focus:border-[#E8711A] text-center placeholder-zinc-400"
                                  />
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={isPaying}
                              className="w-full py-4 bg-[#0D1B2A] hover:bg-[#1a2d42] text-white font-accent font-black tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                            >
                              {isPaying ? "Processando Compra Segura..." : `Pagar R$ ${totalCost} com Cartão`}
                            </button>

                            <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-500 font-sans">
                              <Shield className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Pagamento 100% criptografado e seguro.</span>
                            </div>
                          </form>
                        )}
                      </motion.div>
                    ) : (
                      /* PRIMARY CONFIGURATION STEP & OMNIBEES TARIFÁRIO CALENDAR */
                      <div className="space-y-6">
                        
                        {/* Interactive Client-facing Calendar Grid */}
                        <div className="p-4 bg-white border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
                          
                          {/* Calendar Navigation header */}
                          <div className="flex justify-between items-center">
                            <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-zinc-100 rounded transition text-[#E8711A] cursor-pointer">
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#0D1B2A]">
                              {calendarMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                            </h4>
                            <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-zinc-100 rounded transition text-[#E8711A] cursor-pointer">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Week headers */}
                          <div className="grid grid-cols-7 gap-1 text-center font-accent text-[9px] uppercase text-zinc-400 tracking-wider font-bold">
                            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                              <div key={day} className="py-1">{day}</div>
                            ))}
                          </div>

                          {/* Grid cells */}
                          <div className="grid grid-cols-7 gap-1">
                            {/* blanks */}
                            {Array.from({ length: firstDayOfMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, idx) => (
                              <div key={`blank-${idx}`} className="h-10 bg-transparent"></div>
                            ))}
                            
                            {/* actual days */}
                            {Array.from({ length: daysInMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()) }).map((_, idx) => {
                              const day = idx + 1;
                              const cellDateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                              
                              const isSelected = bookingDate === cellDateStr;
                              const rateData = getPriceForDate(activeExperience, cellDateStr);

                              return (
                                <button
                                  key={day}
                                  type="button"
                                  disabled={rateData.isClosed}
                                  onClick={() => setBookingDate(cellDateStr)}
                                  className={`h-11 sm:h-12 rounded-lg border flex flex-col justify-between p-1 text-left transition-all relative ${
                                    isSelected 
                                      ? "bg-[#E8711A]/10 border-[#E8711A]" 
                                      : "bg-zinc-50 border-zinc-200 hover:border-[#0D1B2A]"
                                  } ${rateData.isClosed ? "opacity-30 cursor-not-allowed bg-zinc-100 border-zinc-200 line-through text-zinc-400" : "cursor-pointer"}`}
                                >
                                  <span className={`text-[10px] font-bold block ${isSelected ? "text-[#E8711A]" : "text-[#0D1B2A]"}`}>{day}</span>
                                  
                                  {!rateData.isClosed ? (
                                    <span className="text-[8px] text-zinc-500 block font-accent text-right">R${rateData.adultPrice}</span>
                                  ) : (
                                    <span className="text-[7px] text-red-600 font-bold uppercase tracking-tighter">Bloq</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Selected Date indicator */}
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-200 font-sans text-xs">
                            <span className="text-zinc-500">Dia Selecionado:</span>
                            <span className="font-bold text-[#E8711A] bg-[#E8711A]/5 border border-[#E8711A]/10 px-2.5 py-1 rounded">
                              {bookingDate ? new Date(bookingDate + "T00:00:00").toLocaleDateString("pt-BR") : "Escolha no calendário"}
                            </span>
                          </div>

                        </div>

                        {/* Booking inputs form */}
                        <div className="space-y-4">
                          
                          {/* Schedule selector */}
                          <div className="space-y-1.5 text-left">
                            <label className="font-accent text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">⏱ Escolha o Horário de Saída</label>
                            <select
                              value={bookingSchedule}
                              onChange={(e) => setBookingSchedule(e.target.value)}
                              className="w-full bg-white border border-zinc-200 p-3 text-xs text-[#0D1B2A] rounded-xl focus:outline-none focus:border-[#E8711A] cursor-pointer"
                            >
                              {activeExperience.schedules && activeExperience.schedules.length > 0 ? (
                                activeExperience.schedules.map((time) => (
                                  <option key={time} value={time}>
                                    {time} {time >= "16:00" ? "(Pôr do Sol)" : "(Regular)"}
                                  </option>
                                ))
                              ) : (
                                <option value="08:00">08:00 (Saída única)</option>
                              )}
                            </select>
                          </div>

                          {/* Group configuration */}
                          <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-3.5 shadow-xs">
                            <span className="font-accent text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">👥 Passageiros & Integrantes</span>
                            
                            {/* Adults */}
                            <div className="flex items-center justify-between text-xs font-sans">
                              <div>
                                <span className="font-bold text-[#0D1B2A] block">Adultos</span>
                                <span className="text-[9px] text-zinc-400">Preço por pessoa: R$ {selectedDateRates.adultPrice}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  type="button" 
                                  onClick={() => setBookingAdults(Math.max(1, bookingAdults - 1))}
                                  className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 flex items-center justify-center font-bold text-[#0D1B2A] cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-bold font-accent text-[#0D1B2A]">{bookingAdults}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setBookingAdults(bookingAdults + 1)}
                                  className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 flex items-center justify-center font-bold text-[#0D1B2A] cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between text-xs font-sans border-t border-zinc-200 pt-2">
                              <div>
                                <span className="font-bold text-[#0D1B2A] block">Crianças (4 a 10 anos)</span>
                                <span className="text-[9px] text-zinc-400">Preço por criança: R$ {selectedDateRates.childPrice}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  type="button" 
                                  onClick={() => setBookingChildren(Math.max(0, bookingChildren - 1))}
                                  className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 flex items-center justify-center font-bold text-[#0D1B2A] cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-bold font-accent text-[#0D1B2A]">{bookingChildren}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setBookingChildren(bookingChildren + 1)}
                                  className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 flex items-center justify-center font-bold text-[#0D1B2A] cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Infants */}
                            <div className="flex items-center justify-between text-xs font-sans border-t border-zinc-200 pt-2">
                              <div>
                                <span className="font-bold text-[#0D1B2A] block">Bebês / Colo (0 a 3 anos)</span>
                                <span className="text-[9px] text-zinc-400">Preço por bebê: R$ {selectedDateRates.babyPrice}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  type="button" 
                                  onClick={() => setBookingInfants(Math.max(0, bookingInfants - 1))}
                                  className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 flex items-center justify-center font-bold text-[#0D1B2A] cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-bold font-accent text-[#0D1B2A]">{bookingInfants}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setBookingInfants(bookingInfants + 1)}
                                  className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 flex items-center justify-center font-bold text-[#0D1B2A] cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                          </div>

                          {/* Observations */}
                          <div className="space-y-1.5 text-left">
                            <label className="font-accent text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">📝 Observações / Pedidos Especiais</label>
                            <textarea
                              placeholder="Fale se possui alergias ou restrições alimentares..."
                              value={bookingObservations}
                              onChange={(e) => setBookingObservations(e.target.value)}
                              rows={2}
                              className="w-full bg-white border border-zinc-200 p-3 text-xs text-[#0D1B2A] rounded-xl focus:outline-none focus:border-[#E8711A] resize-none placeholder-zinc-400"
                            />
                          </div>

                          {/* Interactive Summary Cost Banner */}
                          <div className="p-4 bg-[#E8711A]/5 border border-[#E8711A]/10 rounded-xl space-y-1">
                            <div className="flex justify-between items-baseline text-xs font-sans">
                              <span className="text-zinc-500">Valor Total do Roteiro:</span>
                              <span className="font-serif text-lg font-black text-[#E8711A]">R$ {totalCost}</span>
                            </div>
                            <p className="text-[9px] text-zinc-400 font-sans leading-tight">
                              Tarifas em vigor válidas exclusivamente para a data selecionada acima.
                            </p>
                          </div>

                        </div>

                        {/* CTA Flow Switches */}
                        {selectedDateRates.isClosed || selectedDateRates.hasNoTariff ? (
                          /* BLOCKED DATE - WHATSAPP CONSULTATION ONLY */
                          <div className="space-y-4 pt-2">
                            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl space-y-2 text-left font-sans text-xs text-amber-800">
                              <div className="flex items-center gap-1.5 font-bold text-amber-700">
                                <span className="text-sm">⚠️</span>
                                <span>Sem Disponibilidade Online</span>
                              </div>
                              <p className="text-zinc-600 leading-relaxed">
                                Não possuímos tarifas online publicadas ou vagas automáticas liberadas para o dia <strong>{bookingDate ? new Date(bookingDate + "T00:00:00").toLocaleDateString("pt-BR") : ""}</strong>.
                              </p>
                              <p className="text-zinc-500 font-medium">
                                Por favor, consulte nossos atendentes para verificar vagas alternativas ou agendamentos sob demanda.
                              </p>
                            </div>

                            <a
                              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                `Olá! Gostaria de consultar se há disponibilidade sob demanda para o passeio *${activeExperience.name}* no dia ${bookingDate} às ${bookingSchedule}.\n\n` +
                                `👤 Detalhes do Grupo:\n` +
                                `- Adultos: ${bookingAdults}\n` +
                                `${bookingChildren > 0 ? `- Crianças: ${bookingChildren}\n` : ""}` +
                                `${bookingInfants > 0 ? `- Bebês: ${bookingInfants}\n` : ""}` +
                                `\nComo não encontrei tarifas online para esta data, gostaria de ver se é possível reservar diretamente com vocês. Obrigado!`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-accent font-black tracking-widest uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-center block text-xs"
                            >
                              <Send className="w-4 h-4 inline" /> Consultar Disponibilidade no WhatsApp
                            </a>
                          </div>
                        ) : bookingMethod === "whatsapp" ? (
                          /* WHATSAPP CTA BLOCK */
                          <div className="space-y-3 pt-2">
                            <button
                              type="button"
                              onClick={handleAddCartItem}
                              className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-[#0D1B2A] font-accent font-black tracking-widest uppercase rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-300"
                            >
                              <Plus className="w-4 h-4" /> Incluir No Meu Roteiro
                            </button>
                            
                            <a
                              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                `Olá! Gostaria de reservar o passeio *${activeExperience.name}* para o dia ${bookingDate} às ${bookingSchedule}.\n\n` +
                                `👤 Detalhes do Grupo:\n` +
                                `- Adultos: ${bookingAdults} (Tarifa: R$${selectedDateRates.adultPrice})\n` +
                                `${bookingChildren > 0 ? `- Crianças: ${bookingChildren} (Tarifa: R$${selectedDateRates.childPrice})\n` : ""}` +
                                `${bookingInfants > 0 ? `- Bebês: ${bookingInfants} (Tarifa: R$${selectedDateRates.babyPrice})\n` : ""}` +
                                `\n💵 Valor estimado: *R$ ${totalCost}*\n` +
                                `📝 Observações: ${bookingObservations || "Nenhuma."}\n\n` +
                                `Aguardando confirmação!`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-accent font-black tracking-widest uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
                            >
                              <Send className="w-4 h-4" /> Enviar para WhatsApp
                            </a>
                          </div>
                        ) : (
                          /* DIRECT SECURE BILLING PROMPT STEP 1 */
                          <div className="space-y-4 pt-2 text-left">
                            <div className="p-4 bg-white border border-zinc-200 rounded-xl space-y-3 text-xs shadow-sm">
                              <span className="font-accent text-[9px] text-[#E8711A] font-bold uppercase tracking-wider block">Dados Cadastrais Obrigatórios</span>
                              
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  required
                                  placeholder="Seu Nome Completo"
                                  value={clientFormName}
                                  onChange={(e) => setClientFormName(e.target.value)}
                                  className="w-full bg-white border border-zinc-200 p-2.5 text-xs text-[#0D1B2A] rounded-lg focus:outline-none focus:border-[#E8711A] placeholder-zinc-400"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="tel"
                                  required
                                  placeholder="WhatsApp"
                                  value={clientFormPhone}
                                  onChange={(e) => setClientFormPhone(e.target.value)}
                                  className="w-full bg-white border border-zinc-200 p-2.5 text-xs text-[#0D1B2A] rounded-lg focus:outline-none focus:border-[#E8711A] placeholder-zinc-400"
                                />
                                <input
                                  type="email"
                                  required
                                  placeholder="Seu E-mail"
                                  value={clientFormEmail}
                                  onChange={(e) => setClientFormEmail(e.target.value)}
                                  className="w-full bg-white border border-zinc-200 p-2.5 text-xs text-[#0D1B2A] rounded-lg focus:outline-none focus:border-[#E8711A] placeholder-zinc-400"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={!clientFormName.trim() || !clientFormPhone.trim() || !clientFormEmail.trim()}
                              onClick={() => setOnlineStep("payment")}
                              className={`w-full py-4 text-center font-accent font-black tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 ${
                                clientFormName.trim() && clientFormPhone.trim() && clientFormEmail.trim()
                                  ? "bg-[#0D1B2A] hover:bg-[#1a2d42] text-white cursor-pointer"
                                  : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                              }`}
                            >
                              Prosseguir para o Pagamento &rarr;
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                  {/* Safety stamp */}
                  <div className="flex items-center justify-center gap-2 border-t border-zinc-200 pt-4 mt-6 text-zinc-400 text-[10px] select-none font-sans">
                    <Shield className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Conexão Segura e Vagas Confirmadas no Sistema.</span>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  Etapa 2: Agendamento do Dia
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
                            setActiveExperience(null);
                            onOpenCart();
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
                  Voltar aos Detalhes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
