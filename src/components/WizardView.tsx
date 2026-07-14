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
import { Experience, BookingCartItem, checkSchedulingConflict, getTourScheduleDetails, getBrazilLocalDate, addDaysToBrazilDate, Destination, Accommodation, Lead, ClientReservation, SavedItinerary } from "../types";
import { PricingEngine } from "../lib/pricingEngine";
import { firestoreService } from "../firebase";
import { analytics } from "../lib/analytics";
import { getValidAffiliateRef } from "../lib/utils";
import MediaGallery, { getMediaPhotos } from "./MediaGallery";
import AccommodationDetailModal from "./AccommodationDetailModal";

interface WizardViewProps {
  experiences: Experience[];
  cart: BookingCartItem[];
  stayDays: number;
  clientName: string;
  clientCity: string;
  settings?: any;
  onUpdateStayDays: (days: number) => void;
  onAddToCart: (item: BookingCartItem) => void;
  onRemoveFromCart: (index: number) => void;
  onUpdateCartItem?: (index: number, fields: Partial<BookingCartItem>) => void;
  onSaveItinerary?: (itinerary: SavedItinerary) => void;
  onNavigate: (view: string) => void;
  onSetClientName?: (name: string) => void;
  onSetClientCity?: (city: string) => void;
  selectedHotelId?: string | null;
  onChangeHotelId?: (id: string | null) => void;
  whatsappNumber?: string;
  currentUser?: any;
  onSetCurrentUser?: (user: any) => void;
  onTriggerAuthModal?: (action: { type: string; action: () => void }) => void;
  destinations: Destination[];
  selectedDestinationId: string | null;
  onUpdateSelectedDestinationId: (id: string) => void;
  accommodations: Accommodation[];
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
  onUpdateCartItem,
  onSaveItinerary,
  onNavigate,
  onSetClientName,
  onSetClientCity,
  selectedHotelId = null,
  onChangeHotelId,
  whatsappNumber = "552299887766",
  currentUser,
  onSetCurrentUser,
  onTriggerAuthModal,
  destinations,
  selectedDestinationId,
  onUpdateSelectedDestinationId,
  accommodations,
  settings
}: WizardViewProps) {
  // Master steps of the custom flow:
  // 0 = Escolha do Destino (Destination)
  // 1 = Perfil de Viagem (Profile)
  // 2 = Datas de Chegada/Saída (Dates)
  // 3 = Passageiros / Grupo (Group)
  // 4 = Hospedagem Recomendada (Hotel)
  // 5 = Construção do Roteiro Inteligente Dia a Dia (Day-by-Day planning)
  // 6 = Finalização (Checkout Choice)
  // Read from saved itinerary to restore state if available
  const savedItineraryData = (() => {
    try {
      const stored = localStorage.getItem("guidatrips_saved_itinerary");
      return stored ? JSON.parse(stored) as SavedItinerary : null;
    } catch {
      return null;
    }
  })();

  const [step, setStep] = useState<number>(0);
  const [profile, setProfile] = useState<"casal" | "familia" | "grupo" | "solo">(
    (savedItineraryData?.profile as any) || "casal"
  );

  // Date picker states (Step 2)
  const [arrivalDate, setArrivalDate] = useState<string>(() => {
    return savedItineraryData?.arrivalDate || addDaysToBrazilDate(getBrazilLocalDate(), 1);
  });
  const [departureDate, setDepartureDate] = useState<string>(() => {
    return savedItineraryData?.departureDate || addDaysToBrazilDate(getBrazilLocalDate(), 2);
  });

  // Passenger state counts (Step 3) - Derive from cart items or defaults
  const initialAdults = savedItineraryData?.items?.[0]?.adults ?? 2;
  const initialChildren = savedItineraryData?.items?.[0]?.children ?? 0;
  const initialInfants = savedItineraryData?.items?.[0]?.infants ?? 0;

  const [adults, setAdults] = useState<number>(initialAdults);
  const [children, setChildren] = useState<number>(initialChildren);
  const [infants, setInfants] = useState<number>(initialInfants);

  // Accommodation interest state (Step 4)
  const [hasHotelAnswer, setHasHotelAnswer] = useState<"no" | "yes" | null>(
    savedItineraryData ? (savedItineraryData.selectedHotelId ? "yes" : "no") : null
  );

  // Step 5 progress day state (Day-by-Day Construction)
  const [currentPlanningDay, setCurrentPlanningDay] = useState<number>(1);

  // Detailed Modal states (For catalog item)
  const [selectedExpDetail, setSelectedExpDetail] = useState<Experience | null>(null);
  const [selectedHotelForDetail, setSelectedHotelForDetail] = useState<Accommodation | null>(null);
  const [expandedExpId, setExpandedExpId] = useState<string | null>(null);
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);

  // Experience photo indexes cache (to paginate carousel images inside cards)
  const [expPhotoCache, setExpPhotoCache] = useState<Record<string, number>>({});

  // Dynamic state for passenger configuring during inline booking (Adults, kids inside wizard)
  const [bookingConfigs, setBookingConfigs] = useState<Record<string, {
    adults: number;
    children: number;
    infants: number;
    observations: string;
  }>>({});

  const [cardSchedules, setCardSchedules] = useState<Record<string, string>>({});
  
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string; icon: string; id: number } | null>(null);

  const showToast = (title: string, subtitle: string, icon: string = "✨") => {
    const id = Date.now();
    setToastMessage({ title, subtitle, icon, id });
    setTimeout(() => {
      setToastMessage(prev => prev?.id === id ? null : prev);
    }, 4000);
  };

  // Save Name / City to parent components for CRM leads sync
  const [tempName, setTempName] = useState(clientName || "");
  const [tempCity, setTempCity] = useState(clientCity || "");
  const [tempPhone, setTempPhone] = useState("");
  const [generatedWhatsAppLink, setGeneratedWhatsAppLink] = useState("");
  const [countdown, setCountdown] = useState<number>(5);

  // Rotating Messages for Step 3
  const [passengerMessageIndex, setPassengerMessageIndex] = useState(0);
  const passengerMessagesList = settings?.passengerMessages?.length > 0 
    ? settings.passengerMessages 
    : [
      "A segurança do seu grupo é nossa prioridade número um.",
      "Nossa equipe local garante suporte humanizado 24h.",
      "Flexibilidade total: cancele ou remarque seus passeios se o vento mudar.",
      "Ao informar os passageiros, garantimos o dimensionamento perfeito da embarcação.",
      "Mimos exclusivos garantidos para todos do seu grupo."
    ];

  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => {
      setPassengerMessageIndex(prev => (prev + 1) % passengerMessagesList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [step, passengerMessagesList.length]);

  useEffect(() => {
    if (currentUser) {
      if (!tempName && currentUser.name) setTempName(currentUser.name);
      if (!tempPhone && currentUser.phone) setTempPhone(currentUser.phone);
    }
  }, [currentUser]);

  useEffect(() => {
    if (onSetClientName) onSetClientName(tempName);
  }, [tempName]);

  useEffect(() => {
    if (onSetClientCity) onSetClientCity(tempCity);
  }, [tempCity]);

  // Handle step 7 auto-redirect countdown
  useEffect(() => {
    if (step !== 7) return;

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNavigate("cliente");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, onNavigate]);

  // Scroll to top whenever step or currentPlanningDay changes (Roteiro Inteligente UX improvement)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, currentPlanningDay]);

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

  const selectedDestObj = destinations.find(d => d.id === selectedDestinationId) || destinations[0];

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

  // Lodging Catalog recommended for Cabo Frio / Arraial (Dynamic from database)
  const hotels = accommodations
    .filter(acc => {
      const hasValidTariff = acc.sellRate > 0 || (acc.pricing && acc.pricing.adultPrice > 0) || (acc.calendar && Object.keys(acc.calendar).length > 0) || (acc.roomTypes && acc.roomTypes.length > 0);
      return acc.status === "active" && (!selectedDestinationId || acc.destinationId === selectedDestinationId) && hasValidTariff;
    })
    .slice(0, 6)
    .map(acc => {
      let costDisplay = acc.priceDisplay || `A partir de R$ ${acc.sellRate} / noite`;
      try {
        const arrivalDateStr = arrivalDate;
        const guestsObj = { adults, children, infants };
        const calcResult = PricingEngine.calculateLodging(acc, arrivalDateStr, stayDays, guestsObj);
        if (calcResult && calcResult.totalCost > 0) {
          costDisplay = `Total: R$ ${calcResult.totalCost} (${stayDays} ${stayDays === 1 ? 'diária' : 'diárias'})`;
        }
      } catch (e) {
        console.error("Error calculating lodging price", e);
      }

      return {
        id: acc.id,
        name: acc.name,
        location: acc.location,
        rating: acc.rating || 5.0,
        tag: acc.typeTag,
        priceDisplay: costDisplay,
        description: acc.description?.slice(0, 80) + "...",
        img: (acc.mediaGallery && acc.mediaGallery.length > 0 ? acc.mediaGallery.filter(m => m.type === 'image')[0]?.url : acc.photos?.[0]) || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
        whatsappMessage: `Olá, Guida Trips! Gostaria de consultar tarifas com benefícios na ${acc.name}.`
      };
    });

  // Dynamic filter of experiences sorted according to the profile
  const getFilteredExperiences = () => {
    let list = experiences.filter(exp => exp.status === "active");
    if (selectedDestinationId) {
      list = list.filter(exp => exp.destinationId === selectedDestinationId);
    }
    if (profile === "casal") {
      list = [...list].sort((a, b) => {
        if ((a.id || "").includes("sunset") || (a.name || "").toLowerCase().includes("pôr") || (a.name || "").toLowerCase().includes("sunset")) return -1;
        if ((b.id || "").includes("sunset") || (b.name || "").toLowerCase().includes("pôr") || (b.name || "").toLowerCase().includes("sunset")) return 1;
        return 0;
      });
    } else if (profile === "familia") {
      list = [...list].sort((a, b) => {
        if ((a.name || "").toLowerCase().includes("premium") || (a.name || "").toLowerCase().includes("conforto")) return -1;
        if ((b.name || "").toLowerCase().includes("premium") || (b.name || "").toLowerCase().includes("conforto")) return 1;
        return 0;
      });
    } else if (profile === "grupo") {
      list = [...list].sort((a, b) => {
        if ((a.id || "").includes("buggy") || (a.name || "").toLowerCase().includes("mergulho") || (a.id || "").includes("mergulho")) return -1;
        if ((b.id || "").includes("buggy") || (b.name || "").toLowerCase().includes("mergulho") || (b.id || "").includes("mergulho")) return 1;
        return 0;
      });
    }
    return list;
  };

  const filteredExps = getFilteredExperiences();

  // Smart Collision / Combination recommendations for the current day
  const getSmartRecommendations = (dayNum: number, currentExpId: string, currentSchedule?: string) => {
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

    // Check conflict using our universal scheduling checker!
    const targetExp = experiences.find(e => e.id === currentExpId);
    if (targetExp) {
      const schedule = currentSchedule || (targetExp.schedules && targetExp.schedules[0]) || "08:00";
      const computedDate = addDaysToBrazilDate(arrivalDate, dayNum - 1);

      const tempItem: BookingCartItem = {
        experienceId: currentExpId,
        dayIndex: dayNum,
        date: computedDate,
        schedule,
        adults: 2,
        children: 0,
        infants: 0,
        people: 2,
        observations: ""
      };

      for (const existingItem of dayBookedItems) {
        const conflict = checkSchedulingConflict(tempItem, existingItem, experiences);
        if (conflict.hasConflict && conflict.reason) {
          return {
            allowed: false,
            message: `⚠️ Conflito: ${conflict.reason}`
          };
        }
      }
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
    const selectedAccommodation = selectedHotelId 
      ? accommodations.find(a => a.id === selectedHotelId) 
      : null;

    const result = PricingEngine.calculate({
      cart,
      experiences,
      selectedAccommodation,
      arrivalDate,
      stayDays,
      guests: { adults, children, infants }
    });

    return result.total;
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

      const affiliateRef = getValidAffiliateRef();

      for (const item of cart) {
        const exp = experiences.find(e => e.id === item.experienceId);
        const reservationId = `res-wizard-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newReservation: ClientReservation = {
          id: reservationId,
          userId: userToSave.id,
          experienceId: item.experienceId,
          date: item.date || getBrazilLocalDate(),
          time: item.schedule || "08:00",
          adults: item.adults ?? 2,
          children: item.children ?? 0,
          infants: item.infants ?? 0,
          pax: item.people ?? 2,
          status: "new",
          bringItems: exp?.bringItems || ["Filtro Solar", "Toalha de Banho"],
          avoidItems: exp?.notIncluded || ["Sapatos de Salto"],
          meetingPoint: exp?.meetingPoint || "A combinar",
          ...(affiliateRef ? { affiliateRef } : {})
        };
        await firestoreService.set("reservations", reservationId, newReservation);
      }

      // Save cohesive SavedItinerary document in Firestore under itineraries collection
      const destObj = destinations.find(d => d.id === selectedDestinationId);
      const destName = destObj?.name || "Arraial do Cabo";

      const itineraryId = `itinerary-${userToSave.id}`;
      const itineraryData: SavedItinerary = {
        id: itineraryId,
        userId: userToSave.id,
        clientName: userToSave.name || tempName || clientName || "Explorador",
        clientPhone: userToSave.phone || tempPhone || "Não informado",
        clientCity: tempCity || "Não informado",
        arrivalDate: arrivalDate || getBrazilLocalDate(),
        departureDate: departureDate || getBrazilLocalDate(),
        stayDays,
        budget: "Moderado",
        profile,
        selectedHotelId,
        totalEstimate: calculateEstimatedTotal(),
        createdAt: new Date().toISOString(),
        items: cart,
        destinationName: destName,
        status: "Aguardando atendimento",
        ...(affiliateRef ? { affiliateRef } : {})
      };
      await firestoreService.set("itineraries", itineraryId, itineraryData);
      localStorage.setItem("guidatrips_saved_itinerary", JSON.stringify(itineraryData));
      if (onSaveItinerary) {
        onSaveItinerary(itineraryData);
      }

      // Also ensure a Lead exists for this conversion
      const leadData: Lead = {
        id: `lead-wizard-${userToSave.id}`,
        name: userToSave.name || clientName || "Explorador Cadastrado",
        email: userToSave.email || "Não informado",
        phone: userToSave.phone || "Não informado",
        experienceInterest: cart.map(item => item.experienceId),
        status: "novo",
        origin: "formulario",
        metadata: analytics.getAttributionData().metadata,
        attribution: affiliateRef ? { affiliateRef } : undefined,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [`Checkout via plataforma realizado. Itinerário de ${cart.length} itens. Total estimado: ${formatBRL(calculateEstimatedTotal())}`]
      };
      await firestoreService.set("leads", leadData.id, leadData);

      alert("Parabéns! 🎉 Seu roteiro personalizado foi salvo com sucesso. Você será redirecionado para a Área do Cliente.");
      onNavigate("cliente");
    } catch (err) {
      console.error("Error creating reservations:", err);
      alert("Houve um erro ao processar seu agendamento, mas salvamos o progresso!");
      onNavigate("cliente");
    }
  };

  // Finalize WhatsApp Reservation (No Login required)
  const handleFinalizeWhatsApp = async () => {
    const formattedArrival = arrivalDate ? new Date(arrivalDate + "T00:00:00").toLocaleDateString("pt-BR") : "";
    const formattedDeparture = departureDate ? new Date(departureDate + "T00:00:00").toLocaleDateString("pt-BR") : "";
    
    // 1. Determine active user (or create beautiful guest user in database so they can access their dashboard!)
    let activeUser = currentUser;
    if (!activeUser) {
      const finalName = tempName || clientName || "Explorador";
      const guestId = `user-guest-${Date.now()}`;
      const guestEmail = `guest-${Date.now()}@guidatrips.com.br`;
      const guestUser = {
        id: guestId,
        name: finalName,
        email: guestEmail,
        password: "guest",
        phone: tempPhone || "Não informado",
        photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}`,
        preferences: [],
        favorites: [],
        createdAt: new Date().toISOString()
      };
      
      try {
        await firestoreService.set("users", guestId, guestUser);
        if (onSetCurrentUser) {
          onSetCurrentUser(guestUser);
        }
        localStorage.setItem("guidatrips_logged_in_user", JSON.stringify(guestUser));
        activeUser = guestUser;
      } catch (err) {
        console.error("Erro ao registrar usuário temporário:", err);
      }
    }

    // 2. Automatically save all itinerary cart items as reservations in Firestore under this active user
    if (activeUser) {
      try {
        for (let idx = 0; idx < cart.length; idx++) {
          const item = cart[idx];
          const exp = experiences.find(e => e.id === item.experienceId);
          const reservationId = `res-wizard-wa-${Date.now()}-${idx}-${Math.floor(Math.random() * 100)}`;
          const newReservation: ClientReservation = {
            id: reservationId,
            userId: activeUser.id,
            experienceId: item.experienceId,
            date: item.date || getBrazilLocalDate(),
            time: item.schedule || "08:00",
            adults: item.adults ?? 2,
            children: item.children ?? 0,
            infants: item.infants ?? 0,
            pax: (item.adults ?? 2) + (item.children ?? 0) + (item.infants ?? 0),
            status: "new",
            bringItems: exp?.bringItems || ["Filtro Solar", "Toalha de Banho"],
            avoidItems: exp?.notIncluded || ["Sapatos de Salto"],
            meetingPoint: exp?.meetingPoint || "A combinar"
          };
          await firestoreService.set("reservations", reservationId, newReservation);
        }

        // Save cohesive SavedItinerary document in Firestore under itineraries collection
        const destObj = destinations.find(d => d.id === selectedDestinationId);
        const destName = destObj?.name || "Arraial do Cabo";

        const itineraryId = `itinerary-${activeUser.id}`;
        const itineraryData: SavedItinerary = {
          id: itineraryId,
          userId: activeUser.id,
          clientName: activeUser.name || tempName || clientName || "Explorador",
          clientPhone: activeUser.phone || tempPhone || "Não informado",
          clientCity: tempCity || "Não informado",
          arrivalDate: arrivalDate || getBrazilLocalDate(),
          departureDate: departureDate || getBrazilLocalDate(),
          stayDays,
          budget: "Moderado",
          profile,
          selectedHotelId,
          totalEstimate: calculateEstimatedTotal(),
          createdAt: new Date().toISOString(),
          items: cart,
          destinationName: destName,
          status: "Aguardando atendimento"
        };
        await firestoreService.set("itineraries", itineraryId, itineraryData);
        localStorage.setItem("guidatrips_saved_itinerary", JSON.stringify(itineraryData));
        if (onSaveItinerary) {
          onSaveItinerary(itineraryData);
        }
      } catch (saveErr) {
        console.error("Erro ao salvar reservas ou roteiro de WhatsApp no Firestore:", saveErr);
      }
    }

    // Create detailed Lead BEFORE opening WhatsApp
    const leadId = `lead-wizard-wa-${Date.now()}`;
    const leadData: Lead = {
      id: leadId,
      name: tempName || clientName || "Explorador Anônimo",
      email: "Enviado via WhatsApp",
      phone: tempPhone || "Informado via WhatsApp",
      experienceInterest: cart.map(item => item.experienceId),
      status: "novo",
      origin: "whatsapp",
      metadata: {
        ...analytics.getAttributionData().metadata,
        city: tempCity || undefined
      },
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "status_change",
          description: "Criado via Roteiro Inteligente: O cliente finalizou a montagem de seu Roteiro Inteligente e solicitou atendimento via WhatsApp."
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [
        `Roteiro Inteligente personalizado criado com sucesso!`,
        `Período: ${formattedArrival} - ${formattedDeparture} (${stayDays} dias)`,
        `Grupo: ${adults} Adultos, ${children} Crianças, ${infants} Bebês`,
        `Perfil de Preferências: ${profile.toUpperCase()}`,
        `Hospedagem vinculada: ${selectedHotelId ? (hotels.find(h => h.id === selectedHotelId)?.name || "Sim") : "Não (possui própria)"}`,
        `Total estimado: ${formatBRL(calculateEstimatedTotal())}`,
        `Atividades diárias:\n` + cart.map(item => {
          const exp = experiences.find(e => e.id === item.experienceId);
          return `- Dia ${item.dayIndex}: ${exp?.name || "Passeio"} às ${item.schedule} (${item.adults} adultos, ${item.children} crianças)`;
        }).join('\n')
      ]
    };

    try {
      await firestoreService.set("leads", leadId, leadData);
    } catch (dbErr) {
      console.error("Erro ao salvar lead no banco de dados:", dbErr);
    }

    let text = `Olá Guida Trips! Acabo de planejar meu Roteiro Inteligente no site:\n\n`;
    text += `👤 *Nome:* ${tempName || clientName || "Explorador"}\n`;
    text += `📞 *WhatsApp:* ${tempPhone || "Não informado"}\n`;
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
    
    text += `\n💰 *ESTIMATIVA FINANCEIRA:*`;
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (exp) {
        const adPrice = exp.pricing?.adultPrice || exp.priceFrom || 150;
        const chPrice = exp.pricing?.childPrice ?? (adPrice * 0.7);
        const itemPriceTotal = (item.adults ?? 2) * adPrice + (item.children ?? 0) * chPrice;
        text += `\n  • _${exp.name}_ (${(item.adults ?? 2) + (item.children ?? 0)} pessoas) — ${formatBRL(itemPriceTotal)}`;
      }
    });
    if (selectedHotelId) {
      const hotel = hotels.find(h => h.id === selectedHotelId);
      text += `\n  • _Hospedagem:_ ${hotel?.name || "Pousada Parceira"} (mimos + tarifas especiais)`;
    } else {
      text += `\n  • _Hospedagem:_ Própria (curadoria opcional)`;
    }
    text += `\n\n*TOTAL ESTIMADO DA VIAGEM:* ${formatBRL(calculateEstimatedTotal())}\n\n`;
    text += `Gostaria de fechar este pacote e garantir as minhas vagas e benefícios!`;

    const encoded = encodeURIComponent(text);
    const link = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    
    setGeneratedWhatsAppLink(link);
    setStep(7); // Show confirmation view
    
    // Attempt to open WhatsApp automatically right away
    window.open(link, "_blank");
  };

  const getMotivationalMessage = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return "Excelente escolha para começar! Estamos preparando a curadoria perfeita para você.";
      case 2:
        return "Você já concluiu 25% do planejamento! Datas selecionadas ajudam a alinhar os melhores passeios.";
      case 3:
        return "Seu grupo está quase lá! Cuidado especial com segurança e diversão para todos.";
      case 4:
        return "Você já concluiu metade do planejamento! Vamos garantir seu repouso no paraíso.";
      case 5:
        return "Seu roteiro está quase pronto. Escolha os passeios que farão você vibrar em cada dia!";
      case 6:
        return "Sensacional! Seu plano de viagem premium está desenhado e pronto para se tornar realidade.";
      default:
        return "";
    }
  };

  const renderLiveJourneySummary = (showActivitiesTimeline = false) => {
    const chosenProfile = profiles.find(p => p.id === profile);
    const linkedHotel = hotels.find(h => h.id === selectedHotelId);
    const totalSelectedExperiences = cart.length;
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 border border-zinc-800 relative overflow-hidden select-none"
      >
        {/* Subtle decorative background boarding pass ticket cuts */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#FCFBF9] border-r border-zinc-200" />
        <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#FCFBF9] border-l border-zinc-200" />
        
        <div className="border-b border-zinc-800 pb-3.5 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Map className="w-4.5 h-4.5 text-[#E8711A]" />
              <span>Sua Viagem</span>
            </h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Construída em tempo real</p>
            </div>
          <span className="text-[8px] tracking-widest text-[#E8711A] font-mono border border-[#E8711A]/30 px-2 py-0.5 rounded">
            VIP PASSPORT
          </span>
          </div>

        {/* Dynamic Checklist Checklist Status */}
        <div className="space-y-3 pt-1">
          <p className="text-[9px] text-[#E8711A] font-black uppercase tracking-widest">Etapas de Planejamento</p>
          
          <div className="space-y-2">
            {/* Destino */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black bg-emerald-500 text-white">
                  ✓
                </span>
                <span className="text-zinc-400 font-medium">Destino Principal</span>
                </div>
              <span className="font-bold text-[#E8711A]">
                {selectedDestObj ? selectedDestObj.name : "Arraial do Cabo"}
              </span>
              </div>

            {/* 1. Perfil */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                  profile ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {profile ? "✓" : "1"}
                </span>
                <span className="text-zinc-400">Perfil de Viagem</span>
                </div>
              <span className={`font-bold ${profile ? "text-white" : "text-zinc-500 italic"}`}>
                {chosenProfile ? chosenProfile.label : "Não definido"}
              </span>
              </div>

            {/* 2. Datas */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                  arrivalDate ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {arrivalDate ? "✓" : "2"}
                </span>
                <span className="text-zinc-400">Datas & Período</span>
                </div>
              <span className={`font-bold font-mono text-[11px] ${arrivalDate ? "text-white" : "text-zinc-500 italic"}`}>
                {arrivalDate ? `${stayDays} ${stayDays === 1 ? 'dia' : 'dias'}` : "Não definido"}
              </span>
              </div>

            {/* 3. Grupo */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                  adults > 0 ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {adults > 0 ? "✓" : "3"}
                </span>
                <span className="text-zinc-400">Passageiros</span>
                </div>
              <span className="text-white font-bold">
                {adults + children + infants} {adults + children + infants === 1 ? "pessoa" : "pessoas"}
              </span>
              </div>

            {/* 4. Hospedagem */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                  hasHotelAnswer ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {hasHotelAnswer ? "✓" : "4"}
                </span>
                <span className="text-zinc-400">Hospedagem</span>
                </div>
              <span className={`font-bold text-[11px] truncate max-w-[150px] ${hasHotelAnswer === "yes" && selectedHotelId ? "text-emerald-400" : hasHotelAnswer === "no" ? "text-zinc-450" : "text-zinc-500 italic"}`}>
                {hasHotelAnswer === "yes" && linkedHotel ? linkedHotel.name : hasHotelAnswer === "no" ? "Possuo própria" : "Não definido"}
              </span>
              </div>

            {/* 5. Passeios */}
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                  totalSelectedExperiences > 0 ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {totalSelectedExperiences > 0 ? "✓" : "5"}
                </span>
                <span className="text-zinc-400">Passeios</span>
                </div>
              <span className="text-[#E8711A] font-extrabold">
                {totalSelectedExperiences} {totalSelectedExperiences === 1 ? "selecionado" : "selecionados"}
              </span>
              </div>
            </div>
          </div>

        {/* Traveler details summary box */}
        <div className="text-xs space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
          <p className="text-[10px] text-[#E8711A] font-black uppercase tracking-wider">Passageiro Titular</p>
          <div className="space-y-0.5">
            <p className="font-serif text-xs font-bold text-white truncate">{tempName || "Carolina Mendes"}</p>
            {tempCity && <p className="text-zinc-400 font-mono text-[9px] italic">Origem: {tempCity}</p>}
            <p className="text-zinc-350 text-[10px] pt-1">
              {adults} Adultos {children > 0 && `, ${children} Crianças`} {infants > 0 && `, ${infants} Bebês`}
            </p>
            </div>
          </div>

        {/* Show timeline if requested (especially on step 5) */}
        {showActivitiesTimeline && (
          <div className="space-y-4 pt-1.5 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">Cronograma de Atividades</p>
            <div className="space-y-3">
              {Array.from({ length: stayDays }).map((_, idx) => {
                const d = idx + 1;
                const dayItems = cart.filter(item => item.dayIndex === d);
                const isCurrent = d === currentPlanningDay;

                return (
                  <div 
                    key={d} 
                    onClick={() => setCurrentPlanningDay(d)}
                    className={`text-xs border-l pl-4 py-0.5 space-y-1.5 text-left relative transition-all cursor-pointer ${
                      isCurrent 
                        ? "border-[#E8711A] bg-white/5 rounded-r-xl pr-2" 
                        : "border-white/10 hover:border-white/35"
                    }`}
                  >
                    <span className={`absolute left-[-5px] top-[7px] w-2.5 h-2.5 rounded-full transition-colors ${
                      isCurrent ? "bg-[#E8711A]" : "bg-zinc-600"
                    }`} />
                    
                    <div className="flex items-center justify-between">
                      <p className={`font-bold ${isCurrent ? "text-[#E8711A]" : "text-zinc-300"}`}>Dia {d}</p>
                      {isCurrent && <span className="text-[9px] bg-[#E8711A]/20 text-[#E8711A] font-extrabold px-1.5 py-0.2 rounded uppercase">Planejando</span>}
                      </div>

                    {dayItems.length === 0 ? (
                      <div className="flex items-center gap-1.5 text-zinc-500 font-medium text-[11px] py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" />
                        <span>Aguardando escolha</span>
                        </div>
                    ) : (
                      <div className="space-y-1">
                        {dayItems.map((item, i) => {
                          const exp = experiences.find(e => e.id === item.experienceId);
                          return (
                            <div key={i} className="flex justify-between items-center gap-2">
                              <span className="text-white text-[11px] font-bold flex items-center gap-1">
                                <span className="text-emerald-400">✓</span>
                                <span className="line-clamp-1">{exp?.name}</span>
                              </span>
                              <span className="text-zinc-500 font-mono text-[9px] shrink-0 bg-white/5 px-1.5 py-0.5 rounded">{item.schedule}</span>
                              </div>
                          );
                        })}
                        </div>
                    )}
                    </div>
                );
              })}
              </div>
            </div>
        )}

        {/* Pricing Recap */}
        <div className="border-t border-zinc-800 pt-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">Investimento Estimado</span>
            <span className="font-serif text-lg font-black text-[#E8711A]">
              {formatBRL(calculateEstimatedTotal())}
            </span>
            </div>
          {step < 5 && (
            <div className="text-[10px] text-zinc-400/80 leading-normal text-center italic bg-white/5 py-1 rounded-md border border-white/5">
              Atualizado em tempo real
              </div>
          )}
          </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full bg-[#FCFBF9] text-[#0D1B2A] font-sans pt-24 pb-16 min-h-screen relative overflow-hidden">
      
      {/* Background Decorative Premium Waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.035] select-none z-0">
        <svg className="absolute top-[10%] left-[-10%] w-[50%] h-auto text-[#0D1B2A]" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 C30,40 70,60 100,50 L100,100 L0,100 Z" />
        </svg>
        <svg className="absolute bottom-[5%] right-[-10%] w-[60%] h-auto text-[#E8711A]" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" />
        </svg>
        <div className="absolute top-[40%] right-[5%] w-72 h-72 rounded-full bg-[#E8711A]/20 blur-3xl" />
        <div className="absolute bottom-[20%] left-[5%] w-96 h-96 rounded-full bg-[#0D1B2A]/10 blur-3xl" />
        </div>
      
      {/* Dynamic Sub-header Navigation Stepper */}
      {step > 0 && step < 7 && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 px-4 shadow-xs text-left">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else if (step === 1) {
                  setStep(0);
                } else {
                  onNavigate("home");
                }
              }}
              className="flex items-center gap-1 text-zinc-500 hover:text-[#E8711A] text-xs font-bold uppercase transition-all py-1.5 px-3 hover:bg-zinc-100 rounded-full cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{step === 1 ? "Destino" : "Voltar"}</span>
            </button>

            {/* Selected Destination Context Badge */}
            {selectedDestObj && (
              <div className="flex items-center gap-1.5 bg-[#E8711A]/8 border border-[#E8711A]/20 px-3 py-1 rounded-full text-xs">
                <MapPin className="w-3 h-3 text-[#E8711A]" />
                <span className="font-accent text-[9px] font-black uppercase tracking-wider text-[#0D1B2A]">
                  Destino: <strong className="text-[#E8711A]">{selectedDestObj.name}</strong>
                </span>
                </div>
            )}

            {/* Stepper text and markers */}
            <div className="hidden md:flex items-center gap-3">
              {[
                { num: 1, label: "Perfil" },
                { num: 2, label: "Datas" },
                { num: 3, label: "Viajantes" },
                { num: 4, label: "Hospedagem" },
                { num: 5, label: "Passeios" },
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
      )}

      <div className="max-w-6xl mx-auto px-4 mt-8 sm:mt-12 text-center relative z-10">

        <AnimatePresence mode="wait">
          
          {/* STEP 0: DESTINATION SELECTOR */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 text-left"
            >
              <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa Inicial
                </span>
                <h2 className="font-serif text-3xl sm:text-4.5xl font-extrabold text-[#0D1B2A] leading-tight text-center">
                  Para qual destino você vai viajar?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed text-center">
                  Escolha o destino principal da sua viagem para personalizarmos o seu roteiro.
                </p>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {destinations.filter(d => d.status === "active" || d.id === selectedDestinationId || d.id === "arraial-do-cabo" || d.id === "buzios" || d.id === "cabo-frio").map(dest => (
                  <button
                    key={dest.id}
                    onClick={() => {
                      onUpdateSelectedDestinationId(dest.id);
                      setStep(1);
                    }}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 text-left group ${
                      selectedDestinationId === dest.id
                        ? "border-[#E8711A] shadow-lg shadow-[#E8711A]/20"
                        : "border-zinc-200 hover:border-zinc-300 hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-square w-full relative">
                      <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-3 left-4">
                        <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                        </div>
                      {selectedDestinationId === dest.id && (
                        <div className="absolute top-3 right-3 bg-[#E8711A] rounded-full p-1 shadow-md">
                          <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                      )}
                      </div>
                    <div className="p-4 bg-white">
                      <p className="text-xs text-zinc-600 line-clamp-2">{dest.shortDescription}</p>
                      </div>
                  </button>
                ))}
                </div>
            </motion.div>
          )}

          {/* STEP 1: TRAVEL PROFILE SELECTOR */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 text-left"
            >
              <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 1 de 6: Estilo de Viagem
                </span>
                <h2 className="font-serif text-3xl sm:text-4.5xl font-extrabold text-[#0D1B2A] leading-tight text-center">
                  Como será sua viagem por {selectedDestObj?.name || "Arraial do Cabo"}?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed text-center">
                  Para adaptarmos perfeitamente as experiências sugeridas, o ritmo do passeio, cortesias a bordo e a curadoria de hotéis, selecione o seu perfil.
                </p>
                </div>

              {/* Motivational message banner */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#E8711A]/6 border border-[#E8711A]/12 text-[#E8711A] font-accent text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
                  ✨ {getMotivationalMessage(1)}
                </span>
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                {/* Left Area (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Grid of Profile Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {profiles.map((pOpt) => {
                      const isSelected = profile === pOpt.id;
                      return (
                        <motion.button
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.995 }}
                          key={pOpt.id}
                          type="button"
                          onClick={() => {
                            const newProfile = pOpt.id as any;
                            setProfile(newProfile);
                            if (newProfile === 'solo') {
                              setAdults(1); setChildren(0); setInfants(0);
                            } else if (newProfile === 'casal') {
                              setAdults(2); setChildren(0); setInfants(0);
                            } else if (newProfile === 'familia') {
                              setAdults(2); setChildren(1); setInfants(0);
                            } else if (newProfile === 'grupo') {
                              setAdults(4); setChildren(0); setInfants(0);
                            }
                          }}
                          className={`p-6 rounded-3xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-48 group ${
                            isSelected
                              ? "bg-[#0D1B2A] text-white border-[#0D1B2A] shadow-md ring-2 ring-[#E8711A]/20"
                              : "bg-white text-[#0D1B2A] border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/50 hover:shadow-xs"
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
                        </motion.button>
                      );
                    })}
                    </div>

                  {/* Next Step CTA */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-3.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md hover:scale-102 cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Continuar para as Datas</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    </div>
                  </div>

                {/* Right Area Live Journey summary (4 Columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-28">
                  {renderLiveJourneySummary(false)}
                  </div>
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
              className="space-y-8 text-left"
            >
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 2 de 6: Datas de Estadia
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] leading-tight text-center">
                  Quando você pretende viajar?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 text-center">
                  Defina a data de chegada e saída do paraíso. O sistema calculará o número de diárias e programará suas atividades em dias confortáveis.
                </p>
                </div>

              {/* Motivational message banner */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#E8711A]/6 border border-[#E8711A]/12 text-[#E8711A] font-accent text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
                  ✨ {getMotivationalMessage(2)}
                </span>
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                {/* Left Area (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Card Inputs */}
                  <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-[#0D1B2A] font-bold block">Data de Chegada (Check-in)</label>
                        <div className="relative">
                          <input
                            type="date"
                            min={getBrazilLocalDate()}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white cursor-pointer"
                            value={arrivalDate}
                            onChange={(e) => {
                              setArrivalDate(e.target.value);
                              // Ensure departure is after arrival
                              if (new Date(e.target.value) >= new Date(departureDate)) {
                                setDepartureDate(addDaysToBrazilDate(e.target.value, 3));
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
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-650 hover:text-zinc-800 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-8 py-3 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-102 flex items-center gap-1.5"
                    >
                      <span>Definir Pessoas</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    </div>
                  </div>

                {/* Right Area Live Journey summary (4 Columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-28">
                  {renderLiveJourneySummary(false)}
                  </div>
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
              className="space-y-8 text-left"
            >
              <div className="text-center space-y-2">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 3 de 6: Passageiros
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] leading-tight text-center">
                  Quantas pessoas viajarão com você?
                </h2>
                <p className="text-xs text-zinc-500 max-w-md mx-auto text-center">
                  Ajustamos as capacidades das escunas, mimos e os tamanhos dos barcos para comportar com absoluto conforto todo o seu grupo.
                </p>
                </div>

              {/* Motivational message banner */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#E8711A]/6 border border-[#E8711A]/12 text-[#E8711A] font-accent text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
                  ✨ {getMotivationalMessage(3)}
                </span>
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                {/* Left Area (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
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
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-xs flex gap-3 items-center min-h-[64px] overflow-hidden">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={passengerMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="font-medium"
                      >
                        {passengerMessagesList[passengerMessageIndex]}
                      </motion.div>
                    </AnimatePresence>
                    </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end pt-2">
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
                      <span>Avançar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    </div>
                  </div>

                {/* Right Area Live Journey summary (4 Columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-28">
                  {renderLiveJourneySummary(false)}
                  </div>
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
              className="space-y-8 text-left"
            >
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-3.5 py-1 rounded-full">
                  Etapa 4 de 6: Hospedagens Recomendadas
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-[#0D1B2A] leading-tight text-center">
                  Deseja incluir hospedagem em seu plano?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 text-center">
                  Parcerias exclusivas da Guida Trips garantem mimos de boas-vindas, late check-out e as melhores tarifas garantidas nas pousadas parceiras de {selectedDestObj?.name || "nossos destinos"}.
                </p>
                </div>

              {/* Motivational message banner */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#E8711A]/6 border border-[#E8711A]/12 text-[#E8711A] font-accent text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
                  ✨ {getMotivationalMessage(4)}
                </span>
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                {/* Left Area (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Question triggers */}
                  <div className="flex gap-4 justify-center py-2 max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={() => setHasHotelAnswer("yes")}
                      className={`flex-1 py-3.5 rounded-2xl font-accent text-[11px] font-black tracking-wider uppercase transition-all cursor-pointer border shadow-xs ${
                        hasHotelAnswer === "yes"
                          ? "bg-[#E8711A] text-[#0D1B2A] border-[#E8711A]"
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
                          ? "bg-[#0D1B2A] text-white border-[#0D1B2A]"
                          : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      Não, já tenho pousada ❌
                    </button>
                    </div>

                  {/* Show recommended hotel listings if selected YES */}
                  {hasHotelAnswer === "yes" && (
                    <div className="space-y-5 pt-4 border-t border-zinc-200/60">
                      <div className="flex items-center gap-2">
                        <span className="text-[#E8711A] text-base">🏨</span>
                        <h5 className="font-accent text-[10px] font-black tracking-widest text-[#E8711A] uppercase">
                          Indicações com Benefícios Exclusivos (Guida Trips Club)
                        </h5>
                        </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {hotels.length === 0 ? (
                          <div className="col-span-1 sm:col-span-3 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center space-y-3">
                            <span className="text-3xl block">🏨</span>
                            <h6 className="font-serif text-base font-extrabold text-[#0D1B2A]">Nenhuma pousada parceira listada para {selectedDestObj?.name || 'este destino'} ainda</h6>
                            <p className="text-xs text-zinc-500 max-w-md mx-auto">
                              Nossa equipe de curadoria está credenciando hotéis com vantagens exclusivas para você nesta cidade. Fale conosco pelo WhatsApp caso queira recomendações diretas de hospedagem!
                            </p>
                            </div>
                        ) : (
                          hotels.map((pousada) => {
                            const isSelected = selectedHotelId === pousada.id;

                            return (
                              <div
                                key={pousada.id}
                                className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group ${
                                  isSelected ? "border-[#E8711A] ring-1 ring-[#E8711A]/20" : "border-zinc-200"
                                }`}
                              >
                                <div 
                                  onClick={() => {
                                    const originalAcc = accommodations.find(a => a.id === pousada.id);
                                    if (originalAcc) setSelectedHotelForDetail(originalAcc);
                                  }}
                                  className="aspect-square overflow-hidden relative select-none cursor-pointer"
                                >
                                  <img
                                    src={pousada.img}
                                    alt={pousada.name}
                                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
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
                                    <h6 
                                      onClick={() => {
                                        const originalAcc = accommodations.find(a => a.id === pousada.id);
                                        if (originalAcc) setSelectedHotelForDetail(originalAcc);
                                      }}
                                      className="font-serif text-sm font-extrabold text-[#0D1B2A] leading-tight group-hover:text-[#E8711A] transition-colors line-clamp-1 cursor-pointer"
                                    >
                                      {pousada.name}
                                    </h6>
                                    <p className="font-sans text-[11px] text-zinc-500 leading-relaxed line-clamp-2 mb-2">
                                      {pousada.description}
                                    </p>
                                    <span className="font-sans text-xs font-bold text-[#E8711A] block">
                                      {pousada.priceDisplay}
                                    </span>
                                    </div>

                                  <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-100">
                                    <button
                                      type="button"
                                      onClick={() => setExpandedHotelId(expandedHotelId === pousada.id ? null : pousada.id)}
                                      className="flex-1 py-2 bg-white border border-[#0D1B2A] hover:bg-zinc-50 text-[#0D1B2A] rounded-xl font-accent text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                                    >
                                      {expandedHotelId === pousada.id ? "MENOS" : "DETALHES"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onChangeHotelId) {
                                          onChangeHotelId(isSelected ? null : pousada.id);
                                          if (!isSelected) {
                                            showToast("Hospedagem vinculada", pousada.name, "🏨");
                                          } else {
                                            showToast("Hospedagem removida", pousada.name, "🗑️");
                                          }
                                        }
                                      }}
                                      className={`flex-1 py-2 rounded-xl font-accent text-[9px] font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                        isSelected
                                          ? "bg-[#E8711A] text-[#0D1B2A] font-black"
                                          : "bg-[#0D1B2A] hover:bg-[#E8711A] hover:text-[#0D1B2A] text-white"
                                      }`}
                                    >
                                      {isSelected ? "VINCULADO" : "VINCULAR"}
                                    </button>
                                    </div>
                                  
                                  {/* Inline Expanded Hotel Details */}
                                  <AnimatePresence>
                                    {expandedHotelId === pousada.id && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden col-span-full border-t border-zinc-100 mt-3 pt-3"
                                      >
                                        <div className="space-y-3">
                                          <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{accommodations.find(a => a.id === pousada.id)?.description?.replace(/[#*]/g, "")}</p>
                                          
                                          {accommodations.find(a => a.id === pousada.id)?.amenities && accommodations.find(a => a.id === pousada.id)!.amenities.length > 0 && (
                                            <div>
                                              <span className="text-[9px] text-[#E8711A] font-extrabold tracking-wider uppercase block mb-1">Comodidades</span>
                                              <ul className="text-[10px] text-zinc-500 space-y-0.5">
                                                {accommodations.find(a => a.id === pousada.id)!.amenities.slice(0, 5).map((am, i) => (
                                                  <li key={i} className="flex gap-1.5 items-center">
                                                    <span className="text-emerald-500">✓</span> {am}
                                                  </li>
                                                ))}
                                              </ul>
                                              </div>
                                          )}
                                          </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  </div>
                                </div>
                            );
                          })
                        )}
                        </div>
                      </div>
                  )}

                  {/* Supportive, comforting panel when selecting "No, already have hotel" */}
                  {hasHotelAnswer === "no" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 text-left space-y-3"
                    >
                      <div className="flex items-center gap-2.5 text-emerald-800">
                        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                          </div>
                        <div>
                          <h4 className="font-serif text-base font-extrabold">Entendido perfeitamente!</h4>
                          <p className="text-xs text-emerald-600/90 font-medium">Você já possui hospedagem garantida em {selectedDestObj?.name || "Arraial do Cabo"}.</p>
                          </div>
                        </div>
                      <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed pl-1">
                        Não se preocupe! Nossas recomendações de passeios e cronograma diário serão perfeitamente customizados com base na localização das pousadas centrais para garantir embarques práticos, traslados pontuais e zero preocupações com logística de trânsito.
                      </p>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 justify-end pt-6">
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
                  </div>

                {/* Right Area Live Journey summary (4 Columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-28">
                  {renderLiveJourneySummary(false)}
                  </div>
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
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-8 text-left"
            >
              
              {/* Premium Focused Header */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase bg-[#E8711A]/8 px-4 py-1.5 rounded-full">
                  Etapa 5 de 6: Passeios e Experiências
                </span>
                <h2 className="font-serif text-3xl sm:text-4.5xl font-extrabold text-[#0D1B2A] leading-tight">
                  Planeje seu Dia {currentPlanningDay}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto">
                  {currentPlanningDay === 1
                    ? "Escolha a experiência perfeita que fará parte do primeiro dia da sua viagem."
                    : `Escolha a experiência ideal que fará parte do seu ${currentPlanningDay}º dia de viagem.`}
                </p>

                {/* Travel Profile Elegant Curated Indicator */}
                <div className="flex flex-wrap justify-center items-center gap-2 pt-1">
                  {selectedDestObj && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8711A]/8 border border-[#E8711A]/20 rounded-full text-[10px] text-[#0D1B2A] font-bold">
                      <MapPin className="w-3 h-3 text-[#E8711A]" />
                      <span className="text-zinc-400 font-medium">Destino:</span>
                      <span>{selectedDestObj.name}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-200/50 rounded-full text-[10px] text-[#0D1B2A] font-bold">
                    <Sparkles className="w-3 h-3 text-[#E8711A]" />
                    <span className="text-zinc-400 font-medium">Recomendações para:</span>
                    <span>{profiles.find(p => p.id === profile)?.label || profile}</span>
                  </span>
                  {selectedHotelId && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200/50 rounded-full text-[10px] text-emerald-800 font-bold">
                      <Bed className="w-3 h-3 text-emerald-600" />
                      <span>Hotel Vinculado</span>
                    </span>
                  )}
                  </div>
                </div>

              {/* Elegant Day Navigation Controller with Progress Bar */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-5 max-w-2xl mx-auto shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Previous Day Button */}
                <button
                  type="button"
                  disabled={currentPlanningDay === 1}
                  onClick={() => setCurrentPlanningDay(currentPlanningDay - 1)}
                  className={`p-2.5 rounded-full border border-zinc-200 bg-white transition-all flex items-center justify-center shrink-0 ${
                    currentPlanningDay === 1
                      ? "opacity-20 cursor-not-allowed text-zinc-300"
                      : "hover:bg-zinc-50 hover:text-[#E8711A] text-zinc-600 hover:border-zinc-300 active:scale-95 cursor-pointer"
                  }`}
                  title="Dia Anterior"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Progressive Bar Details */}
                {(() => {
                  const percentComplete = Math.round((currentPlanningDay / stayDays) * 100);
                  return (
                    <div className="flex-grow text-center px-2 sm:px-6 space-y-2 w-full">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-zinc-400 font-accent uppercase tracking-wider text-[9px]">Evolução do Roteiro</span>
                        <span className="text-[#0D1B2A] font-serif font-black text-sm">Dia {currentPlanningDay} de {stayDays}</span>
                        </div>
                      
                      {/* Smooth Progress Bar */}
                      <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/40 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-[#E8711A] to-[#F18F43] rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentComplete}%` }}
                        />
                        </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                        <span className="text-[#E8711A]">{percentComplete}% concluído</span>
                        <span>{stayDays - currentPlanningDay} {stayDays - currentPlanningDay === 1 ? 'dia restante' : 'dias restantes'}</span>
                        </div>
                      </div>
                  );
                })()}

                {/* Next Day / Checkout Button */}
                {currentPlanningDay < stayDays ? (
                  <button
                    type="button"
                    onClick={() => setCurrentPlanningDay(currentPlanningDay + 1)}
                    className="p-2.5 rounded-full bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                    title="Próximo Dia"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                    title="Ir para o Resumo e Finalização"
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </button>
                )}
                </div>

              {/* Grid split: Left is experiences catalogue, right is the smart summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                
                {/* Experiences List (8 Columns) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Human Curated Greeting */}
                  <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
                    <p className="text-xs text-zinc-500 font-medium italic">
                      Selecione uma atividade principal para preencher o dia com o melhor de {selectedDestObj?.name || "Arraial"}.
                    </p>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-150 px-2.5 py-0.5 rounded">
                      {filteredExps.length} opções
                    </span>
                    </div>

                  <div className="space-y-6">
                    {filteredExps.length === 0 && (
                      <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center space-y-4">
                        <MapPin className="w-12 h-12 text-[#E8711A] mx-auto opacity-60 animate-bounce" />
                        <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">Nenhum passeio ativo cadastrado para {selectedDestObj?.name}</h3>
                        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                          Nossos especialistas em turismo estão mapeando as melhores experiências locais para esta região. Em breve teremos passeios incríveis aqui!
                        </p>
                        </div>
                    )}
                    {filteredExps.map((exp) => {
                      const activePhotoIndex = expPhotoCache[exp.id] || 0;
                      const config = getBookingConfig(exp.id);
                      
                      // Check if already in cart on this specific day
                      const indexInCart = cart.findIndex(item => item.experienceId === exp.id && item.dayIndex === currentPlanningDay);
                      const isAlreadyInCart = indexInCart !== -1;
                      const cartItem = isAlreadyInCart ? cart[indexInCart] : null;
                      
                      const currentAdults = cartItem ? (cartItem.adults ?? 2) : config.adults;
                      const currentChildren = cartItem ? (cartItem.children ?? 0) : config.children;
                      
                      const chosenSchedule = cardSchedules[exp.id] || (exp.schedules && exp.schedules.length > 0 ? exp.schedules[0] : "08:00");

                      // Collision check feedback message
                      const feedback = getSmartRecommendations(currentPlanningDay, exp.id, chosenSchedule);

                      // Date matching calculation
                      const targetDateStr = addDaysToBrazilDate(arrivalDate, currentPlanningDay - 1);

                      // Stable dynamic rating hash
                      let hash = 0;
                      for (let i = 0; i < exp.id.length; i++) {
                        hash = exp.id.charCodeAt(i) + ((hash << 5) - hash);
                      }
                      const stableRating = (4.7 + (Math.abs(hash) % 4) / 10).toFixed(1);
                      const reviewsCount = 48 + (Math.abs(hash) % 150);

                      // Curated custom badges based on rules
                      const curatedTags: string[] = [];
                      if (exp.badge === "mais-vendido") curatedTags.push("Mais vendido 🔥");
                      if (exp.featured) curatedTags.push("Passeio exclusivo ✨");
                      if (exp.category === "nautico") { curatedTags.push("Mar & Sol ⛵"); curatedTags.push("Natureza 🌿"); }
                      else if (exp.category === "off-road") { curatedTags.push("Aventura 🛞"); curatedTags.push("Dunas 🌵"); }
                      else if (exp.category === "cultura") { curatedTags.push("História 🏛️"); }
                      else if (exp.category === "gastronomia") { curatedTags.push("Culinária 🥂"); }
                      
                      if (profile === "casal") curatedTags.push("Ideal para Casais 👩‍❤️‍👨");
                      else if (profile === "familia") curatedTags.push("Recomendado para Família 👨‍👩‍👧‍👦");
                      else if (profile === "grupo") curatedTags.push("Aventura em Grupo 🥳");
                      else if (profile === "solo") curatedTags.push("Explorador Solo 🧭");

                      const finalTags = Array.from(new Set(curatedTags)).slice(0, 3);

                      return (
                        <motion.div 
                          key={exp.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-5 p-4.5 md:p-5 ${
                            isAlreadyInCart ? "border-emerald-500/85 ring-1 ring-emerald-500/10" : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          {/* Left Column: Elegant Large Experience Image */}
                          <div className="md:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200/50 bg-zinc-100 group select-none">
                            <MediaGallery item={exp} className="w-full h-full" />

                            {exp.badge && (
                              <span className="absolute top-3 left-3 bg-[#E8711A] text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm z-10">
                                {exp.badge === "mais-vendido" ? "🏆 Campeão de Vendas" : exp.badge}
                              </span>
                            )}
                            </div>

                          {/* Right Column: Premium Details & Plan CTA */}
                          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              {/* Tags Row */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {finalTags.map((t, idx) => (
                                  <span key={idx} className="bg-zinc-50 border border-zinc-200/50 text-[10px] text-zinc-500 px-2 py-0.5 rounded-full font-bold">
                                    {t}
                                  </span>
                                ))}
                                </div>

                              <div className="flex items-center justify-between gap-1 flex-wrap pt-1">
                                {/* Rating Star */}
                                <div className="flex items-center gap-1 text-xs text-zinc-500 font-bold">
                                  <span className="text-amber-500">★</span>
                                  <span className="text-[#0D1B2A]">{stableRating}</span>
                                  <span className="text-zinc-300 font-normal">({reviewsCount} avaliações)</span>
                                  </div>
                                <span className="text-[#0D1B2A] font-extrabold text-[11px] bg-amber-50 text-amber-900 border border-amber-200/20 py-0.5 px-2.5 rounded-full font-mono">
                                  A partir de {formatBRL(exp.priceFrom)}
                                </span>
                                </div>

                              <h4 className="font-serif text-lg sm:text-xl font-extrabold text-[#0D1B2A] leading-tight">
                                {exp.name}
                              </h4>
                              
                              <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed font-sans line-clamp-2">
                                {exp.shortDescription}
                              </p>

                              {/* Beautiful trigger for Details Accordion */}
                              <button
                                type="button"
                                onClick={() => setExpandedExpId(expandedExpId === exp.id ? null : exp.id)}
                                className="inline-flex items-center gap-1 text-[#E8711A] hover:text-[#C45E12] font-black text-[10px] uppercase tracking-wider block pt-1 cursor-pointer hover:underline"
                              >
                                <span>{expandedExpId === exp.id ? "Menos detalhes" : "Ver detalhes da experiência"}</span>
                                <motion.div animate={{ rotate: expandedExpId === exp.id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </motion.div>
                              </button>
                              </div>

                            {/* Expanded Details Section */}
                            <AnimatePresence>
                              {expandedExpId === exp.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-2 pb-4 space-y-4 border-t border-zinc-100 mt-2">
                                    <div className="space-y-1">
                                      <h4 className="font-serif text-[11px] font-bold text-[#0D1B2A] uppercase tracking-wider">Sobre</h4>
                                      <p className="text-zinc-500 text-xs leading-relaxed">{exp.fullDescription.replace(/[#*]/g, "")}</p>
                                      </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {exp.included && exp.included.length > 0 && (
                                        <div className="space-y-1.5">
                                          <span className="text-[9px] text-[#E8711A] font-extrabold tracking-wider uppercase block">Incluso</span>
                                          <ul className="space-y-1 text-xs text-zinc-500">
                                            {exp.included.map((inc, i) => (
                                              <li key={i} className="flex gap-1.5 items-start">
                                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                <span className="leading-tight">{inc}</span>
                                              </li>
                                            ))}
                                          </ul>
                                          </div>
                                      )}
                                      {exp.notIncluded && exp.notIncluded.length > 0 && (
                                        <div className="space-y-1.5">
                                          <span className="text-[9px] text-zinc-400 font-extrabold tracking-wider uppercase block">Não Incluso</span>
                                          <ul className="space-y-1 text-xs text-zinc-400">
                                            {exp.notIncluded.map((nInc, i) => (
                                              <li key={i} className="flex gap-1.5 items-start">
                                                <X className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                                                <span className="leading-tight">{nInc}</span>
                                              </li>
                                            ))}
                                          </ul>
                                          </div>
                                      )}
                                      </div>
                                    </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Booking Action / Selection Box inside Card */}
                            <div className="bg-zinc-50/80 rounded-2xl p-3 border border-zinc-200/60 space-y-3 text-[11px]">
                              
                              {/* Schedule Selector */}
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                  Horário de Saída
                                </span>
                                <select
                                  value={chosenSchedule}
                                  onChange={(e) => {
                                    const newTime = e.target.value;
                                    setCardSchedules(prev => ({ ...prev, [exp.id]: newTime }));
                                    if (isAlreadyInCart && onUpdateCartItem) {
                                      onUpdateCartItem(indexInCart, { schedule: newTime });
                                    }
                                  }}
                                  className="bg-white border border-zinc-200 rounded-lg p-1.5 text-[11px] text-zinc-800 font-bold cursor-pointer focus:outline-none focus:border-[#E8711A]"
                                >
                                  {(exp.schedules && exp.schedules.length > 0 ? exp.schedules : ["08:00", "13:30"]).map(time => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                                </div>

                              {/* Quantity of People Selector */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-zinc-150/40 pt-2.5">
                                <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                                  Participantes
                                </span>
                                <div className="flex items-center gap-2">
                                  {/* Adults */}
                                  <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg px-2 py-0.5">
                                    <span className="text-zinc-400 text-[9px]">Adultos:</span>
                                    <select
                                      value={currentAdults}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (isAlreadyInCart && onUpdateCartItem) {
                                          onUpdateCartItem(indexInCart, { adults: val });
                                        } else {
                                          updateBookingConfig(exp.id, { adults: val });
                                        }
                                      }}
                                      className="bg-transparent text-[11px] text-zinc-800 font-bold cursor-pointer focus:outline-none"
                                    >
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                      ))}
                                    </select>
                                    </div>
                                  
                                  {/* Children */}
                                  <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg px-2 py-0.5">
                                    <span className="text-zinc-400 text-[9px]">Crianças:</span>
                                    <select
                                      value={currentChildren}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (isAlreadyInCart && onUpdateCartItem) {
                                          onUpdateCartItem(indexInCart, { children: val });
                                        } else {
                                          updateBookingConfig(exp.id, { children: val });
                                        }
                                      }}
                                      className="bg-transparent text-[11px] text-zinc-800 font-bold cursor-pointer focus:outline-none"
                                    >
                                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                      ))}
                                    </select>
                                    </div>
                                  </div>
                                </div>

                              {/* Dynamic Price Preview */}
                              <div className="flex items-center justify-between border-t border-zinc-150/40 pt-2 text-[10px]">
                                <span className="text-zinc-400 font-medium">Subtotal do Passeio:</span>
                                <span className="font-mono font-black text-[#0D1B2A] text-xs">
                                  {formatBRL(currentAdults * (exp.pricing?.adultPrice || exp.priceFrom || 150) + currentChildren * (exp.pricing?.childPrice ?? ((exp.pricing?.adultPrice || exp.priceFrom || 150) * 0.7)))}
                                </span>
                                </div>

                              {/* Alert / Validator Box */}
                              <div className={`p-2.5 rounded-xl flex items-start gap-2 border text-[10px] leading-relaxed ${
                                feedback.allowed 
                                  ? "bg-zinc-100/60 border-zinc-200/40 text-zinc-550" 
                                  : "bg-amber-50 border-amber-200/60 text-amber-900 font-semibold"
                              }`}>
                                <Info className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${feedback.allowed ? "text-zinc-400" : "text-[#E8711A]"}`} />
                                <div>{feedback.message}</div>
                                </div>

                              {/* Primary Add/Remove Button with animations */}
                              <button
                                type="button"
                                disabled={!feedback.allowed && !isAlreadyInCart}
                                onClick={() => {
                                  if (isAlreadyInCart) {
                                    const indexInCart = cart.findIndex(item => item.experienceId === exp.id && item.dayIndex === currentPlanningDay);
                                    if (indexInCart !== -1) {
                                      onRemoveFromCart(indexInCart);
                                      showToast("Passeio removido", `Removido do Dia ${currentPlanningDay}`, "🗑️");
                                    }
                                  } else {
                                    onAddToCart({
                                      experienceId: exp.id,
                                      date: targetDateStr,
                                      schedule: chosenSchedule,
                                      adults: config.adults,
                                      children: config.children,
                                      infants: config.infants,
                                      people: config.adults + config.children + config.infants,
                                      observations: "Agendado via Roteiro Inteligente!",
                                      dayIndex: currentPlanningDay
                                    });
                                    showToast("Passeio adicionado", `${exp.name} no Dia ${currentPlanningDay}`, "🚤");
                                  }
                                }}
                                className={`w-full text-center py-2.5 rounded-xl text-[10px] font-accent font-black uppercase tracking-wider transition-all duration-200 ${
                                  isAlreadyInCart
                                    ? "bg-emerald-600 text-white hover:bg-rose-600 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                                    : !feedback.allowed
                                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed opacity-60"
                                      : "bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] shadow-xs active:scale-99 cursor-pointer"
                                }`}
                              >
                                {isAlreadyInCart ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    <span>Adicionado ao Dia {currentPlanningDay} • Clique para remover</span>
                                  </>
                                ) : (
                                  <span>Adicionar ao Dia {currentPlanningDay}</span>
                                )}
                              </button>

                              </div>
                            </div>
                        </motion.div>
                      );
                    })}
                    </div>
                  </div>

                {/* Premium Smart Summary Sidebar (4 Columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
                  {renderLiveJourneySummary(true)}
                  
                  {/* Immediate finalization shortcut directly from Step 5 */}
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="w-full text-center py-3.5 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white font-accent text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 hover:scale-102"
                  >
                    <span>Concluir Roteiro</span>
                    <Check className="w-4 h-4 stroke-[3]" />
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
                  Seu Cartão de Embarque está pronto!
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto">
                  A mágica está feita. Abaixo está o resumo oficial da sua experiência com a Guida Trips. Escolha como gostaria de finalizar sua reserva.
                </p>
                </div>

              {/* CARTÃO FINAL DA VIAGEM */}
              <div className="bg-[#0D1B2A] text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden max-w-3xl mx-auto">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8711A] opacity-20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Header Ticket */}
                <div className="relative z-10 border-b border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-widest font-extrabold uppercase flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> ROTEIRO INTELIGENTE
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      Guida Trips Pass
                    </h3>
                    </div>
                  <div className="text-left sm:text-right">
                     <span className="font-accent text-[9px] text-zinc-400 uppercase tracking-widest block mb-1">Estimativa Total</span>
                     <span className="font-serif text-3xl font-extrabold text-emerald-400 leading-none">
                       {formatBRL(calculateEstimatedTotal())}
                     </span>
                    </div>
                  </div>

                {/* Details Grid */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="space-y-1.5">
                     <span className="font-accent text-[9px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-[#E8711A]" /> Destino</span>
                     <span className="font-serif text-base font-bold text-white">{selectedDestObj?.name || "Arraial do Cabo"}</span>
                     </div>
                   <div className="space-y-1.5">
                     <span className="font-accent text-[9px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1"><Calendar className="w-3 h-3 text-[#E8711A]" /> Dias</span>
                     <span className="font-serif text-base font-bold text-white">{stayDays} Dias Inesquecíveis</span>
                     </div>
                   <div className="space-y-1.5">
                     <span className="font-accent text-[9px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1"><Info className="w-3 h-3 text-[#E8711A]" /> Pessoas</span>
                     <span className="font-serif text-base font-bold text-white">{adults} Ad. {children > 0 && `, ${children} Cr.`}</span>
                     </div>
                   <div className="space-y-1.5">
                     <span className="font-accent text-[9px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1"><Bed className="w-3 h-3 text-[#E8711A]" /> Hospedagem</span>
                     <span className="font-serif text-base font-bold text-white leading-snug">
                       {selectedHotelId ? hotels.find(h => h.id === selectedHotelId)?.name : "Conta Própria"}
                     </span>
                     </div>
                  </div>

                {/* Passeios & Cortesias */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                   {/* Passeios */}
                   <div>
                     <span className="font-accent text-[9px] text-[#E8711A] uppercase tracking-widest font-bold mb-3 block">🚤 Sua Timeline</span>
                     <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-1.5 before:w-px before:bg-white/20 pl-6">
                        {Array.from({ length: stayDays }).map((_, idx) => {
                          const d = idx + 1;
                          const dayItems = cart.filter(item => item.dayIndex === d);
                          return (
                            <div key={d} className="relative">
                              <div className="absolute -left-[22px] top-1.5 w-2 h-2 rounded-full bg-[#E8711A] shadow-[0_0_8px_rgba(232,113,26,0.6)]"></div>
                              <span className="text-[10px] font-accent text-white/50 tracking-wider block mb-0.5">DIA {d}</span>
                              {dayItems.length === 0 ? (
                                <span className="text-xs text-white/70 italic">Dia Livre</span>
                              ) : (
                                dayItems.map((item, i) => {
                                  const exp = experiences.find(e => e.id === item.experienceId);
                                  return (
                                    <div key={i} className="text-sm font-bold text-white">
                                      {exp?.name} <span className="text-white/40 font-normal text-xs ml-1">({item.schedule})</span>
                                      </div>
                                  )
                                })
                              )}
                              </div>
                          )
                        })}
                       </div>
                     </div>

                   {/* Cortesias */}
                   <div>
                     <span className="font-accent text-[9px] text-[#E8711A] uppercase tracking-widest font-bold mb-3 block">🎁 Suas Cortesias Exclusivas</span>
                     <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-2">
                           <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                             <Check className="w-3 h-3" />
                             </div>
                           <p className="text-xs text-white leading-relaxed">
                             <strong className="block text-emerald-400">Consultoria WhatsApp</strong>
                             Equipe local de Arraial do Cabo acompanhando você em tempo real.
                           </p>
                          </div>
                        <div className="flex items-start gap-2">
                           <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                             <Check className="w-3 h-3" />
                             </div>
                           <p className="text-xs text-white leading-relaxed">
                             <strong className="block text-emerald-400">Flexibilidade Garantida</strong>
                             Reajuste de roteiro grátis caso o vento mude a rota.
                           </p>
                          </div>
                        {selectedHotelId && (
                           <div className="flex items-start gap-2">
                             <div className="w-5 h-5 rounded-full bg-[#E8711A]/20 text-[#E8711A] flex items-center justify-center shrink-0 mt-0.5">
                               <Sparkles className="w-3 h-3" />
                               </div>
                             <p className="text-xs text-white leading-relaxed">
                               <strong className="block text-[#E8711A]">Mimo na Pousada</strong>
                               Early check-in ou Welcome Drink (conforme disponibilidade).
                             </p>
                            </div>
                        )}
                       </div>
                     </div>
                  </div>
                </div>

              {/* Client Info Inputs before Checkout */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm max-w-3xl mx-auto mt-6 text-left">
                <h4 className="font-serif text-lg font-bold text-[#0D1B2A] mb-2">Quem vai viajar?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <label className="text-xs text-[#0D1B2A] font-bold block">Seu WhatsApp / Telefone *</label>
                    <input
                      type="tel"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                      placeholder="Ex: (21) 99999-9999"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
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

          {/* STEP 7: INTERMEDIATE WHATSAPP REDIRECT & CONFIRMATION */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8 max-w-xl mx-auto text-center py-8"
            >
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 shadow-md space-y-8 relative overflow-hidden">
                {/* Visual Glow */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#E8711A]" />

                {/* Animated Pulsing Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#E8711A]/10 rounded-full animate-ping scale-125" />
                    <div className="bg-[#E8711A]/8 border border-[#E8711A]/20 p-5 rounded-full relative z-10 text-[#E8711A]">
                      <CheckCircle2 className="w-12 h-12" />
                      </div>
                    </div>
                  </div>

                {/* Confirmations Messages */}
                <div className="space-y-3">
                  <h2 className="font-serif text-3.5xl font-extrabold text-[#0D1B2A] leading-tight">
                    🎉 Seu roteiro foi enviado com sucesso!
                  </h2>
                  <p className="text-sm text-zinc-500 font-sans leading-relaxed">
                    Estamos preparando seu atendimento e liberando seu acesso ao painel.
                  </p>
                  </div>

                {/* Loading Indicator */}
                <div className="space-y-4 py-2">
                  <div className="flex justify-between items-center text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    <span>Progresso do Envio</span>
                    <span>{countdown > 0 ? `Acessando painel em ${countdown}s...` : "Pronto!"}</span>
                    </div>
                  
                  {/* Progress bar loader */}
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" }}
                      className="h-full bg-[#E8711A]"
                    />
                    </div>
                  </div>

                {/* Call to Action Button */}
                <div className="space-y-4">
                  <a
                    href={generatedWhatsAppLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 bg-[#E8711A] hover:bg-[#C45E12] text-[#0D1B2A] hover:text-white font-accent text-sm font-black tracking-wider uppercase rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-102 cursor-pointer"
                  >
                    Abrir WhatsApp 💬
                  </a>
                  
                  <button
                    onClick={() => onNavigate("cliente")}
                    className="w-full py-4 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-accent text-sm font-black tracking-wider uppercase rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-102 cursor-pointer"
                  >
                    Acessar meu painel 🚀
                  </button>

                  <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                    No painel, você poderá ver seu roteiro, acompanhar suas informações e acessar tudo o que foi preparado para sua viagem.
                  </p>
                  </div>

                {/* Expert Info Box */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-zinc-150 text-xs text-left space-y-1.5 leading-relaxed text-[#0D1B2A]">
                  <p className="font-bold">✨ O que acontece agora?</p>
                  <p className="text-zinc-500">
                    Nossos especialistas em turismo na <strong>Guida Trips</strong> já receberam o cronograma completo de {cart.length} passeio(s) no valor total de {formatBRL(calculateEstimatedTotal())} para o cliente <strong>{tempName || clientName}</strong>. 
                  </p>
                  <p className="text-zinc-500">
                    No WhatsApp, finalizaremos os horários, confirmaremos a disponibilidade e aplicaremos todos os seus mimos e benefícios exclusivos!
                  </p>
                  </div>
                </div>

              {/* Back to Home Button */}
              <div className="text-center">
                <button
                  onClick={() => onNavigate("home")}
                  className="text-zinc-500 hover:text-[#0D1B2A] text-xs font-bold underline cursor-pointer"
                >
                  Voltar para a Página Inicial
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
              <div className="relative aspect-video w-full bg-zinc-100">
                <MediaGallery item={selectedExpDetail} className="w-full h-full brightness-[0.7]" />
                <button
                  type="button"
                  onClick={() => setSelectedExpDetail(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white hover:text-[#E8711A] rounded-full shadow transition-all cursor-pointer z-20"
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

                {selectedExpDetail.policies && selectedExpDetail.policies.length > 0 && (
                  <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4.5 space-y-2 mt-4">
                    <span className="text-[10px] text-zinc-800 font-extrabold tracking-wider uppercase block font-accent">📜 Políticas (Pagamento e Cancelamento)</span>
                    <ul className="space-y-1 list-none text-xs text-zinc-650">
                      {selectedExpDetail.policies.map((pol, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="w-4 h-4 bg-zinc-200 text-zinc-600 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold">•</span>
                          <span>{pol}</span>
                        </li>
                      ))}
                    </ul>
                    </div>
                )}

                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4.5 space-y-1 mt-4">
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

      {/* Accommodation Detail Modal Overlay */}
      {selectedHotelForDetail && (
        <AccommodationDetailModal
          accommodation={selectedHotelForDetail}
          isOpen={!!selectedHotelForDetail}
          onClose={() => setSelectedHotelForDetail(null)}
          isSelectionContext={true}
          isSelected={selectedHotelId === selectedHotelForDetail.id}
          onSelectToggle={() => {
            if (onChangeHotelId) {
              onChangeHotelId(selectedHotelId === selectedHotelForDetail.id ? null : selectedHotelForDetail.id);
            }
          }}
          onWhatsAppContact={(msg) => {
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
          }}
        />
      )}

      </div>
  );
}
