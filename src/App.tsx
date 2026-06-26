/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ExperiencesView from "./components/ExperiencesView";
import DestinoView from "./components/DestinoView";
import AboutView from "./components/AboutView";
import BlogView from "./components/BlogView";
import ContactView from "./components/ContactView";
import AdminView from "./components/AdminView";
import HospedagensView from "./components/HospedagensView";
import RoteiroView from "./components/RoteiroView";
import WizardView from "./components/WizardView";
import ClientPanelView from "./components/ClientPanelView";
import ClientAuthModal from "./components/ClientAuthModal";

import { 
  Experience, BlogPost, Lead, GlobalSettings, BookingCartItem, ClientUser, ClientReservation 
} from "./types";
import { 
  INITIAL_EXPERIENCES, INITIAL_BLOG_POSTS, INITIAL_LEADS, INITIAL_SETTINGS 
} from "./data";
import { 
  X, ShoppingBag, Send, ChevronRight, MessageSquare, AlertTriangle 
} from "lucide-react";
import { firestoreService } from "./firebase";

export default function App() {
  // Client Authentication & Active Session State
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(() => {
    try {
      const stored = localStorage.getItem("guidatrips_logged_in_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [userReservations, setUserReservations] = useState<ClientReservation[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<
    | { type: "navigate"; view: string }
    | { type: "add_to_cart"; item: BookingCartItem }
    | { type: "online_booking"; callback: () => void }
    | null
  >(null);

  // Sync load of reservations from Firestore
  useEffect(() => {
    const fetchReservations = async () => {
      if (!currentUser) {
        setUserReservations([]);
        return;
      }
      try {
        const allRes = await firestoreService.getAll<ClientReservation>("reservations");
        const filtered = allRes.filter(r => r.userId === currentUser.id);
        setUserReservations(filtered);
      } catch (err) {
        console.error("Error loading user reservations from Firestore:", err);
      }
    };
    fetchReservations();
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("guidatrips_logged_in_user");
    setUserReservations([]);
    setCurrentView("home");
  };

  const handleAuthSuccess = (user: ClientUser) => {
    setCurrentUser(user);
    localStorage.setItem("guidatrips_logged_in_user", JSON.stringify(user));

    // Resolve any pending protected actions
    if (pendingAuthAction) {
      if (pendingAuthAction.type === "navigate") {
        setCurrentView(pendingAuthAction.view);
      } else if (pendingAuthAction.type === "add_to_cart") {
        const item = pendingAuthAction.item;
        const normalizedItem: BookingCartItem = {
          ...item,
          adults: item.adults ?? 2,
          children: item.children ?? 0,
          infants: item.infants ?? 0,
          people: (item.adults ?? 2) + (item.children ?? 0) + (item.infants ?? 0),
          schedule: item.schedule ?? "08:00",
          observations: item.observations || "Adicionado automaticamente pós cadastro/login",
          dayIndex: item.dayIndex ?? 1,
        };
        const updated = [...cart, normalizedItem];
        setCart(updated);
        localStorage.setItem("guidatrips_cart", JSON.stringify(updated));
        
        // Redirect to Client Dashboard (Dashboard do Cliente)
        setCurrentView("cliente");
      } else if (pendingAuthAction.type === "online_booking") {
        pendingAuthAction.callback();
      }
      setPendingAuthAction(null);
    } else {
      // If no specific action was pending, just direct to client panel dashboard
      setCurrentView("cliente");
    }
  };

  const handleNavigate = (view: string) => {
    if (view === "cliente" || view === "wizard") {
      if (!currentUser) {
        setPendingAuthAction({ type: "navigate", view });
        setIsAuthModalOpen(true);
        return;
      }
    }
    setCurrentView(view);
    setSelectedPostSlug(null);
  };

  const handleTriggerAuthModalForCheckout = (action: { type: string; action: () => void }) => {
    setPendingAuthAction({ type: "online_booking", callback: action.action });
    setIsAuthModalOpen(true);
  };

  // Navigation & State Routing
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);

  // Core CRM / Experiential Data loaded initially or from LocalStorage
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);

  // Roteiro (Shopping Cart) Drawer States
  const [cart, setCart] = useState<BookingCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientCity, setClientCity] = useState("");

  // Selected hotel in the itinerary
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("guidatrips_selected_hotel_id") || null;
    } catch {
      return null;
    }
  });

  const handleUpdateHotelId = (id: string | null) => {
    setSelectedHotelId(id);
    if (id) {
      localStorage.setItem("guidatrips_selected_hotel_id", id);
    } else {
      localStorage.removeItem("guidatrips_selected_hotel_id");
    }
  };

  // Stay duration persistence (default to 3 days)
  const [stayDays, setStayDays] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("guidatrips_stay_days");
      return stored ? parseInt(stored, 10) : 3;
    } catch {
      return 3;
    }
  });

  const updateStayDays = (days: number) => {
    setStayDays(days);
    localStorage.setItem("guidatrips_stay_days", days.toString());
  };

  // Inline editing state for items inside the cart
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editSchedule, setEditSchedule] = useState("");
  const [editAdults, setEditAdults] = useState<number>(2);
  const [editChildren, setEditChildren] = useState<number>(0);
  const [editInfants, setEditInfants] = useState<number>(0);
  const [editObservations, setEditObservations] = useState("");

  // Initialize data safely
  useEffect(() => {
    // 1. Sync load of local storage first to prevent UI flickering/delays
    try {
      const storedExps = localStorage.getItem("guidatrips_experiences");
      if (storedExps) setExperiences(JSON.parse(storedExps));
      
      const storedPosts = localStorage.getItem("guidatrips_posts");
      if (storedPosts) setPosts(JSON.parse(storedPosts));

      const storedLeads = localStorage.getItem("guidatrips_leads");
      if (storedLeads) setLeads(JSON.parse(storedLeads));

      const storedSettings = localStorage.getItem("guidatrips_settings");
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedCart = localStorage.getItem("guidatrips_cart");
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (e) {
      console.warn("Local Storage read error:", e);
    }

    // 2. Async Cloud Firestore Sync (Seed & Load)
    const syncFirestore = async () => {
      try {
        // A. Check for old default experiences to perform a automatic migration/reset
        let dbExps = await firestoreService.getAll<Experience>("experiences");
        const containsOld = dbExps.some(e => e.id === "passeio-barco-premium");
        if (containsOld) {
          console.log("Old experiences detected. Migrating database to the new 7 tours...");
          // Delete all old ones
          for (const exp of dbExps) {
            await firestoreService.delete("experiences", exp.id);
          }
          // Seed the new ones
          for (const newExp of INITIAL_EXPERIENCES) {
            await firestoreService.set("experiences", newExp.id, newExp);
          }
          // Re-fetch
          dbExps = await firestoreService.getAll<Experience>("experiences");
        }

        // B. Seed collections if empty
        await firestoreService.seedCollection("experiences", INITIAL_EXPERIENCES);
        await firestoreService.seedCollection("posts", INITIAL_BLOG_POSTS);
        await firestoreService.seedCollection("leads", INITIAL_LEADS);

        // C. Fetch real database items
        if (dbExps.length === 0) {
          dbExps = await firestoreService.getAll<Experience>("experiences");
        }

        // D. Auto-populate availability for all tours from day 25 to 30 (for client testing)
        let hasUpdatedCalendars = false;
        const testDates = ["2026-06-25", "2026-06-26", "2026-06-27", "2026-06-28", "2026-06-29", "2026-06-30"];
        for (const exp of dbExps) {
          let updatedThisExp = false;
          const cal = exp.calendar ? { ...exp.calendar } : {};
          for (const d of testDates) {
            const dateVal = cal[d];
            if (!dateVal || dateVal.adultPrice !== 100 || dateVal.childPrice !== 50 || dateVal.babyPrice !== 0 || dateVal.status !== "open") {
              cal[d] = {
                status: "open",
                adultPrice: 100,
                childPrice: 50,
                babyPrice: 0
              };
              updatedThisExp = true;
            }
          }
          if (updatedThisExp) {
            exp.calendar = cal;
            // Also ensure fallback properties reflect R$ 100
            exp.priceFrom = 100;
            if (!exp.pricing) {
              exp.pricing = { adultPrice: 100, childPrice: 50, babyPrice: 0 };
            } else {
              exp.pricing.adultPrice = 100;
              exp.pricing.childPrice = 50;
              exp.pricing.babyPrice = 0;
            }
            await firestoreService.set("experiences", exp.id, exp);
            hasUpdatedCalendars = true;
          }
        }
        if (hasUpdatedCalendars) {
          console.log("Automatically synchronized testing calendars to 100/50/0 BRL for days 25 to 30");
          dbExps = await firestoreService.getAll<Experience>("experiences");
        }

        if (dbExps && dbExps.length > 0) {
          setExperiences(dbExps);
          localStorage.setItem("guidatrips_experiences", JSON.stringify(dbExps));
        } else if (!localStorage.getItem("guidatrips_experiences")) {
          setExperiences(INITIAL_EXPERIENCES);
        }

        const dbPosts = await firestoreService.getAll<BlogPost>("posts");
        if (dbPosts && dbPosts.length > 0) {
          setPosts(dbPosts);
          localStorage.setItem("guidatrips_posts", JSON.stringify(dbPosts));
        } else if (!localStorage.getItem("guidatrips_posts")) {
          setPosts(INITIAL_BLOG_POSTS);
        }

        const dbLeads = await firestoreService.getAll<Lead>("leads");
        if (dbLeads && dbLeads.length > 0) {
          // Sort leads descending by default
          const sortedLeads = dbLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLeads(sortedLeads);
          localStorage.setItem("guidatrips_leads", JSON.stringify(sortedLeads));
        } else if (!localStorage.getItem("guidatrips_leads")) {
          setLeads(INITIAL_LEADS);
        }

        // C. Fetch/Seed Global Settings
        const dbSettings = await firestoreService.getAll<GlobalSettings & { id?: string }>("settings");
        const docGlobal = dbSettings.find(s => s.id === "global");
        if (docGlobal) {
          setSettings(docGlobal);
          localStorage.setItem("guidatrips_settings", JSON.stringify(docGlobal));
        } else {
          await firestoreService.set("settings", "global", INITIAL_SETTINGS);
          setSettings(INITIAL_SETTINGS);
          localStorage.setItem("guidatrips_settings", JSON.stringify(INITIAL_SETTINGS));
        }
      } catch (error) {
        console.error("Failed to fully sync with Firestore:", error);
      }
    };

    syncFirestore();
  }, []);

  // Catch select blog post event from HomeView
  useEffect(() => {
    const handleSelectPost = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedPostSlug(customEvent.detail);
        setCurrentView("blog");
      }
    };
    window.addEventListener("guidatrips_select_post", handleSelectPost);
    return () => window.removeEventListener("guidatrips_select_post", handleSelectPost);
  }, []);

  // Sync helpers saving permanently
  const updateExperiences = async (newExps: Experience[]) => {
    const oldExps = experiences;
    setExperiences(newExps);
    localStorage.setItem("guidatrips_experiences", JSON.stringify(newExps));

    try {
      // Find deleted items to remove from Firestore
      const oldIds = oldExps.map(e => e.id);
      const newIds = newExps.map(e => e.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const delId of deletedIds) {
        await firestoreService.delete("experiences", delId);
      }

      // Save/overwrite current items
      for (const exp of newExps) {
        await firestoreService.set("experiences", exp.id, exp);
      }
    } catch (e) {
      console.error("Firestore experiences update failed:", e);
    }
  };

  const updatePosts = async (newPosts: BlogPost[]) => {
    const oldPosts = posts;
    setPosts(newPosts);
    localStorage.setItem("guidatrips_posts", JSON.stringify(newPosts));

    try {
      const oldIds = oldPosts.map(p => p.id);
      const newIds = newPosts.map(p => p.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const delId of deletedIds) {
        await firestoreService.delete("posts", delId);
      }

      for (const post of newPosts) {
        await firestoreService.set("posts", post.id, post);
      }
    } catch (e) {
      console.error("Firestore blog posts update failed:", e);
    }
  };

  const updateLeads = async (newLeads: Lead[]) => {
    const oldLeads = leads;
    setLeads(newLeads);
    localStorage.setItem("guidatrips_leads", JSON.stringify(newLeads));

    try {
      const oldIds = oldLeads.map(l => l.id);
      const newIds = newLeads.map(l => l.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const delId of deletedIds) {
        await firestoreService.delete("leads", delId);
      }

      for (const lead of newLeads) {
        await firestoreService.set("leads", lead.id, lead);
      }
    } catch (e) {
      console.error("Firestore leads update failed:", e);
    }
  };

  const updateSettings = async (newSettings: GlobalSettings) => {
    setSettings(newSettings);
    localStorage.setItem("guidatrips_settings", JSON.stringify(newSettings));

    try {
      await firestoreService.set("settings", "global", newSettings);
    } catch (e) {
      console.error("Firestore settings update failed:", e);
    }
  };

  const handleAddToCart = (item: BookingCartItem) => {
    // Intercept if not logged in
    if (!currentUser) {
      setPendingAuthAction({ type: "add_to_cart", item });
      setIsAuthModalOpen(true);
      return;
    }

    // Ensure dayIndex and properties are set safely
    const adults = item.adults ?? (item.people ?? 2);
    const children = item.children ?? 0;
    const infants = item.infants ?? 0;
    const people = adults + children + infants;
    const schedule = item.schedule ?? "08:00";
    const observations = item.observations ?? "";
    const dayIndex = item.dayIndex ?? 1;

    const normalizedItem: BookingCartItem = {
      ...item,
      adults,
      children,
      infants,
      people,
      schedule,
      observations,
      dayIndex,
    };

    const updated = [...cart, normalizedItem];
    setCart(updated);
    localStorage.setItem("guidatrips_cart", JSON.stringify(updated));
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    setCart(updated);
    localStorage.setItem("guidatrips_cart", JSON.stringify(updated));
  };

  const handleChangeItemDay = (index: number, day: number) => {
    const updated = cart.map((item, idx) => {
      if (idx === index) {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + (day - 1));
        const dateStr = targetDate.toISOString().split("T")[0];
        return { ...item, dayIndex: day, date: dateStr };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("guidatrips_cart", JSON.stringify(updated));
  };

  const handleSaveEdit = (idx: number) => {
    const updated = cart.map((item, i) => {
      if (i === idx) {
        return {
          ...item,
          date: editDate,
          schedule: editSchedule,
          adults: editAdults,
          children: editChildren,
          infants: editInfants,
          people: editAdults + editChildren + editInfants,
          observations: editObservations,
        };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("guidatrips_cart", JSON.stringify(updated));
    setEditingIndex(null);
  };

  // Conflict state warning calculation helper
  const findCartConflicts = () => {
    const conflicts: string[] = [];
    const seenDaySchedule = new Map<string, BookingCartItem>(); // key: dayIndex_schedule
    const seenDateSchedule = new Map<string, BookingCartItem>(); // key: date_schedule
    
    cart.forEach((item) => {
      const exp = experiences.find(e => e.id === item.experienceId);
      const name = exp ? exp.name : "Passeio";
      const keyDay = `${item.dayIndex || 1}_${item.schedule}`;
      const keyDate = `${item.date}_${item.schedule}`;
      
      let conflictedItem: BookingCartItem | null = null;
      if (seenDaySchedule.has(keyDay)) {
        conflictedItem = seenDaySchedule.get(keyDay)!;
      } else if (seenDateSchedule.has(keyDate)) {
        conflictedItem = seenDateSchedule.get(keyDate)!;
      }
      
      if (conflictedItem) {
        const otherExp = experiences.find(e => e.id === conflictedItem.experienceId);
        const otherName = otherExp ? otherExp.name : "Outro passeio";
        conflicts.push(`⚠️ ATENÇÃO: Os passeios "${name}" e "${otherName}" foram marcados para o mesmo dia (Dia ${item.dayIndex || 1}) e horário (${item.schedule}). Sugerimos alterar um deles para evitar sobreposição de agendas!`);
      } else {
        seenDaySchedule.set(keyDay, item);
        seenDateSchedule.set(keyDate, item);
      }
    });
    return conflicts;
  };

  // Finds experiences recommended by items in the cart but not currently in the cart
  const getCartSidebarRecommendations = () => {
    const bookedIds = new Set(cart.map(item => item.experienceId));
    const recIds = new Set<string>();
    
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (exp && exp.recommendations) {
        exp.recommendations.forEach(rId => {
          if (!bookedIds.has(rId)) {
            recIds.add(rId);
          }
        });
      }
    });
    
    const recommendedExps: Experience[] = [];
    recIds.forEach(id => {
      const found = experiences.find(e => e.id === id);
      if (found) recommendedExps.push(found);
    });
    
    return recommendedExps.slice(0, 2); // Max 2 recommendations
  };

  // Submit Lead via direct inline forms
  const handleAddNewLead = (leadData: Omit<Lead, "id" | "origin" | "status" | "createdAt" | "updatedAt">) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      origin: "formulario",
      status: "novo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newLead, ...leads];
    updateLeads(updated);
  };

  // Build beautiful WhatsApp message according to spec section 7, day-by-day sequence
  const handleTriggerWhatsapp = () => {
    if (cart.length === 0 && !selectedHotelId) return;

    let textMessage = `Olá, Guida Trips! 👋\n\nGostaria de montar meu roteiro personalizado de *${stayDays} dias* com vocês!\n\n`;

    // Add lodging summary if selected
    if (selectedHotelId) {
      const hotelNames: Record<string, string> = {
        "pousada-timoneiro": "Pousada do Timoneiro 🛌",
        "pousada-caminho-mar": "Pousada Caminho do Mar 🛌",
        "ohana-pousada": "Ohana Pousada Boutique 🛌"
      };
      const hName = hotelNames[selectedHotelId] || "Hospedagem Selecionada";
      textMessage += `🏨 *HOSPEDAGEM COORDENADA:*\n   • *${hName}*\n\n`;
    }

    // Group cart by dayIndex (1 to stayDays)
    for (let d = 1; d <= stayDays; d++) {
      const dayItems = cart.filter(item => item.dayIndex === d);
      if (dayItems.length > 0) {
        textMessage += `📅 *DIA ${d}:*\n`;
        dayItems.forEach((item, idx) => {
          const exp = experiences.find((e) => e.id === item.experienceId);
          const name = exp ? exp.name : "Passeio Personalizado";
          
          let formattedDate = item.date;
          try {
            const parts = item.date.split("-");
            if (parts.length === 3) {
              formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
          } catch (e) {}

          textMessage += `   ${idx + 1}️⃣ *${name}*\n`;
          textMessage += `      🕒 Horário: ${item.schedule}\n`;
          textMessage += `      📆 Data: ${formattedDate}\n`;
          
          let paxString = `${item.adults} Ad.`;
          if (item.children && item.children > 0) paxString += `, ${item.children} Cr.`;
          if (item.infants && item.infants > 0) paxString += `, ${item.infants} Bebê(s)`;
          textMessage += `      👥 Integrantes: ${paxString}\n`;
          
          if (item.observations && item.observations.trim()) {
            textMessage += `      ✍️ Obs/Mimos: _${item.observations.trim()}_\n`;
          }
        });
        textMessage += `\n`;
      }
    }

    const uniqueLocationsSet = new Set<string>();
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (exp) {
        uniqueLocationsSet.add(exp.location || "Arraial do Cabo");
      } else {
        uniqueLocationsSet.add("Arraial do Cabo");
      }
    });
    // Add default location Arraial do Cabo if no experiences
    if (uniqueLocationsSet.size === 0) {
      uniqueLocationsSet.add("Arraial do Cabo");
    }
    const locationsString = Array.from(uniqueLocationsSet).join(", ");

    const finalName = clientName.trim() || "[Insira o Nome]";
    const finalCity = clientCity.trim() || "[Insira a Cidade]";

    textMessage += `👤 Solicitante: *${finalName}*\n🏡 Cidade de Origem: *${finalCity}*\n📍 Locais/Destinos: *${locationsString}*\n\nPor favor, confirmem se há disponibilidade destas vagas e os valores totais! Obrigado!`;

    // Also register this WhatsApp click event as a Lead in our Admin Dashboard CRM to keep metrics active!
    const waLead: Lead = {
      id: `lead-wa-${Date.now()}`,
      name: finalName,
      phone: "Informado no WhatsApp",
      email: "Enviado via WhatsApp",
      experienceInterest: cart.map(item => item.experienceId),
      preferredDate: cart[0]?.date,
      groupSize: cart.reduce((acc, item) => acc + item.people, 0),
      origin: "whatsapp",
      status: "novo",
      notes: [`Cliente originou contato WhatsApp com roteiro de ${cart.length} itens. Origem: ${finalCity}. Estadia: ${stayDays} dias. Escrito dia a dia.`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    updateLeads([waLead, ...leads]);

    const formattedNumber = settings.whatsappNumber.replace(/\D/g, "");
    const waUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(textMessage)}`;
    
    // Clear cart and close drawer
    setCart([]);
    localStorage.removeItem("guidatrips_cart");
    setIsCartOpen(false);
    
    // Redirect
    window.open(waUrl, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen text-[#0D1B2A] bg-[#FBF9F6] font-sans selection:bg-[#E8711A]/20">
      <header>
        <Navbar 
          currentView={currentView}
          onNavigate={handleNavigate}
          cartCount={cart.length}
          onOpenCart={() => { setCurrentView("roteiro"); }}
          currentUser={currentUser}
        />
      </header>

      {/* Main viewport state selector */}
      <main className="flex-grow">
        {currentView === "home" && (
          <HomeView 
            settings={settings} 
            onNavigate={handleNavigate} 
            onAddToCart={handleAddToCart} 
            experiences={experiences}
            selectedHotelId={selectedHotelId}
            onChangeHotelId={handleUpdateHotelId}
            stayDays={stayDays}
          />
        )}
        {currentView === "experiencias" && (
          <ExperiencesView 
            experiences={experiences} 
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCart={() => { setCurrentView("roteiro"); }}
            whatsappNumber={settings.whatsappNumber}
            settings={settings}
            onUpdateSettings={updateSettings}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onTriggerAuthModal={handleTriggerAuthModalForCheckout}
          />
        )}
        {currentView === "destino" && (
          <DestinoView onNavigate={handleNavigate} />
        )}
        {currentView === "wizard" && (
          <WizardView 
            experiences={experiences}
            cart={cart}
            stayDays={stayDays}
            clientName={clientName}
            clientCity={clientCity}
            onUpdateStayDays={updateStayDays}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onNavigate={handleNavigate}
            onSetClientName={setClientName}
            onSetClientCity={setClientCity}
            selectedHotelId={selectedHotelId}
            onChangeHotelId={handleUpdateHotelId}
            whatsappNumber={settings.whatsappNumber}
          />
        )}
        {currentView === "hospedagens" && (
          <HospedagensView whatsappNumber={settings.whatsappNumber} />
        )}
        {currentView === "sobre" && (
          <AboutView />
        )}
        {currentView === "blog" && (
          <BlogView 
            posts={posts} 
            onNavigateToContact={() => handleNavigate("contato")}
            selectedSlug={selectedPostSlug}
            onSelectPost={setSelectedPostSlug}
          />
        )}
        {currentView === "contato" && (
          <ContactView 
            onAddLead={handleAddNewLead} 
            whatsappNumber={settings.whatsappNumber}
          />
        )}
        {currentView === "admin" && (
          <AdminView 
            experiences={experiences}
            leads={leads}
            posts={posts}
            settings={settings}
            onUpdateExperiences={updateExperiences}
            onUpdatePosts={updatePosts}
            onUpdateLeads={updateLeads}
            onUpdateSettings={updateSettings}
          />
        )}
        {currentView === "cliente" && (
          <ClientPanelView 
            experiences={experiences}
            posts={posts}
            settings={settings}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onLogout={handleLogout}
            userReservations={userReservations}
          />
        )}
        {currentView === "roteiro" && (
          <RoteiroView 
            cart={cart}
            experiences={experiences}
            stayDays={stayDays}
            clientName={clientName}
            clientCity={clientCity}
            whatsappNumber={settings.whatsappNumber}
            onUpdateStayDays={updateStayDays}
            onRemoveFromCart={handleRemoveFromCart}
            onChangeItemDay={handleChangeItemDay}
            onSaveEdit={handleSaveEdit}
            onAddToCart={handleAddToCart}
            onSetClientName={setClientName}
            onSetClientCity={setClientCity}
            onTriggerWhatsapp={handleTriggerWhatsapp}
            onNavigate={handleNavigate}
            selectedHotelId={selectedHotelId}
            onChangeHotelId={handleUpdateHotelId}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} whatsappNumber={settings.whatsappNumber} />

      {/* Client Authentication Modal */}
      <ClientAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { setIsAuthModalOpen(false); setPendingAuthAction(null); }} 
        onSuccess={handleAuthSuccess} 
      />

      {/* COMPONENTE FLOATING ROTERIO (TRIGGER DRAWERS) */}
      {(cart.length > 0 || selectedHotelId) && currentView !== "roteiro" && (
        <button
          onClick={() => { setCurrentView("roteiro"); }}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#E8711A] to-[#FF8A3F] text-white px-6 py-4 rounded-full font-sans text-sm font-bold tracking-normal flex items-center gap-2.5 shadow-[0_10px_30px_rgba(232,113,26,0.35)] hover:shadow-[0_12px_35px_rgba(232,113,26,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none border border-white/20"
        >
          <span>🗺️ MEU ROTEIRO</span>
          <span className="bg-[#0D1B2A] text-white h-5.5 w-5.5 rounded-full flex items-center justify-center font-sans font-extrabold text-[10px] shadow-sm">
            {cart.length + (selectedHotelId ? 1 : 0)}
          </span>
        </button>
      )}

      {/* THE MEU ROTEIRO DRAWER SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-transparent" 
            onClick={() => setIsCartOpen(false)}
          />
          <div 
            id="roteiro-drawer"
            className="relative w-full max-w-lg bg-white h-full shadow-[0_0_40px_rgba(13,27,42,0.15)] border-l border-zinc-200 flex flex-col justify-between p-6 overflow-y-auto text-[#0D1B2A] transition-all"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#E8711A]" />
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">Meu Roteiro Personalizado</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 px-3 border border-zinc-200 rounded text-xs select-none hover:bg-zinc-100 font-accent font-bold text-zinc-500 hover:text-[#0D1B2A]"
                >
                  ✕ FECHAR
                </button>
              </div>

              {/* ROTEIRO CONFIG: DIAS DE ESTADIA (PRD: Quantos dias você vai ficar?) */}
              {cart.length > 0 && (
                <div className="bg-zinc-50 border border-zinc-100 p-3.5 rounded-sm text-left space-y-2 mb-4">
                  <span className="font-accent text-[9px] text-[#5C6874] tracking-widest uppercase block">
                    Quantos dias você vai curtir em Arraial? ({stayDays} dias)
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          updateStayDays(num);
                          // Re-map items whose dayIndex exceeds the new stay days down to 1
                          const updated = cart.map((cur) => {
                            if (cur.dayIndex > num) {
                              return { ...cur, dayIndex: 1 };
                            }
                            return cur;
                          });
                          setCart(updated);
                          localStorage.setItem("guidatrips_cart", JSON.stringify(updated));
                        }}
                        className={`px-3 py-1.5 rounded-sm border font-sans text-xs font-bold transition-all cursor-pointer ${
                          stayDays === num
                            ? "bg-[#0D1B2A] text-white border-[#0D1B2A] shadow-sm"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        {num}D
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CONFLICT ALARM ALERT CARDBOX */}
              {cart.length > 1 && findCartConflicts().length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 space-y-1.5 text-left text-xs text-amber-900 leading-relaxed font-sans">
                  {findCartConflicts().map((conflictStr, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-1.5">
                      <span className="shrink-0 text-amber-600">🚨</span>
                      <span>{conflictStr}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart List */}
              {cart.length > 0 ? (
                <div className="space-y-6">
                  
                  {/* Outer Day Segment grouping loop */}
                  {Array.from({ length: stayDays }).map((_, dIdx) => {
                    const dayNum = dIdx + 1;
                    const itemsInDay = cart
                      .map((item, itemIdx) => ({ item, itemIdx }))
                      .filter(({ item }) => item.dayIndex === dayNum);

                    return (
                      <div key={dayNum} className="border-t border-dashed border-zinc-200 pt-4 flex flex-col gap-3">
                        {/* Day heading slot */}
                        <div className="flex items-center justify-between text-left">
                          <span className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1">
                            📅 DIA {dayNum} <span className="font-sans text-[10px] text-zinc-400 font-normal">({itemsInDay.length} programado{itemsInDay.length === 1 ? "" : "s"})</span>
                          </span>
                          
                          {itemsInDay.length === 0 && (
                            <span className="font-sans text-[10px] text-zinc-400 italic">Espaço livre (Relaxar na praia!)</span>
                          )}
                        </div>

                        {/* Programmed list for this day index */}
                        {itemsInDay.map(({ item, itemIdx }) => {
                          const exp = experiences.find((e) => e.id === item.experienceId);
                          const isEditingIdx = editingIndex === itemIdx;

                          // Formatting dates
                          let formattedDate = item.date;
                          try {
                            const parts = item.date.split("-");
                            if (parts.length === 3) {
                              formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                            }
                          } catch (e) {}

                          // Sum-up estimated item cost
                          const estimateCost = exp 
                            ? ((exp.priceFrom * (item.adults || 2)) + (exp.priceFrom * 0.5 * (item.children || 0)))
                            : 0;

                          return (
                            <div 
                              key={itemIdx}
                              className="bg-zinc-50 border border-zinc-150 p-4 rounded-sm text-left flex flex-col gap-3.5 transition-all duration-300"
                            >
                              {/* Read state */}
                              {!isEditingIdx ? (
                                <div className="space-y-2.5">
                                  <div className="flex items-start justify-between gap-1">
                                    <div>
                                      <h4 className="font-serif text-sm font-bold text-[#0D1B2A] leading-tight-card">
                                        {exp ? exp.name : "Experiência Personalizada"}
                                      </h4>
                                      <div className="flex flex-wrap gap-2.5 font-sans text-[11px] text-[#5C6874] mt-1.5 font-medium">
                                        <span>📆 {formattedDate}</span>
                                        <span>⏱ {item.schedule}</span>
                                        <span className="border-l border-zinc-350 pl-2.5">👤 {item.adults} Ad, {item.children || 0} Cr, {item.infants || 0} Be.</span>
                                      </div>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFromCart(itemIdx)}
                                      className="text-[10px] font-accent font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded cursor-pointer shrink-0"
                                    >
                                      ✕ Excluir
                                    </button>
                                  </div>

                                  {/* Print observations if specified */}
                                  {item.observations && item.observations.trim() && (
                                    <p className="bg-amber-500/5 border border-amber-500/10 p-2 text-[10px] font-sans text-[#E8711A]/85 italic leading-snug">
                                      ✍️ Obs: "{item.observations}"
                                    </p>
                                  )}

                                  {/* Item Cost reference & Action buttons */}
                                  <div className="border-t border-zinc-100 pt-2.5 flex items-center justify-between text-xs font-sans">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[#8A96A3] text-[10px]">Custo Estimado:</span>
                                      <span className="font-bold text-[#E8711A]">R$ {estimateCost}</span>
                                    </div>

                                    {/* Action row controls */}
                                    <div className="flex items-center gap-1.5">
                                      {/* Inline edit toggle button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingIndex(itemIdx);
                                          setEditDate(item.date);
                                          setEditSchedule(item.schedule);
                                          setEditAdults(item.adults || 2);
                                          setEditChildren(item.children || 0);
                                          setEditInfants(item.infants || 0);
                                          setEditObservations(item.observations || "");
                                        }}
                                        className="text-[10px] font-sans font-bold hover:text-black py-0.5 px-2 bg-zinc-200 hover:bg-zinc-300 rounded cursor-pointer"
                                      >
                                        ✏️ Editar
                                      </button>

                                      {/* Step Day dropdown */}
                                      <select
                                        value={item.dayIndex}
                                        onChange={(e) => handleChangeItemDay(itemIdx, parseInt(e.target.value, 10))}
                                        className="text-[10px] bg-white border border-zinc-200 py-1 px-1.5 rounded cursor-pointer focus:outline-none"
                                      >
                                        {Array.from({ length: stayDays }).map((_, i) => (
                                          <option key={i + 1} value={i + 1}>
                                            Mover para Dia {i + 1}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Inline editable state */
                                <div className="space-y-3.5 bg-zinc-100 p-3 rounded-sm border border-[#E8711A]/30">
                                  <h5 className="font-accent text-[9px] font-bold tracking-wider text-[#E8711A] uppercase">✏️ Editando Passeio</h5>
                                  
                                  {/* Inline Edit Date */}
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-sans text-zinc-500 font-bold block uppercase">Data desejada</label>
                                    <input
                                      type="date"
                                      value={editDate}
                                      onChange={(e) => setEditDate(e.target.value)}
                                      className="w-full bg-white border border-zinc-200 text-xs p-2 text-zinc-800"
                                    />
                                  </div>

                                  {/* Inline Edit Time Slot (Dynamic based on selected experience's schedules list) */}
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-sans text-zinc-500 block uppercase font-bold">Horário de partida</label>
                                    <select
                                      value={editSchedule}
                                      onChange={(e) => setEditSchedule(e.target.value)}
                                      className="w-full bg-white border border-zinc-200 text-xs p-2 text-zinc-800"
                                    >
                                      {exp && exp.schedules && exp.schedules.length > 0 ? (
                                        exp.schedules.map((time) => (
                                          <option key={time} value={time}>{time}</option>
                                        ))
                                      ) : (
                                        <>
                                          <option value="08:00">08:00</option>
                                          <option value="11:35">11:35</option>
                                          <option value="15:00">15:00</option>
                                        </>
                                      )}
                                    </select>
                                  </div>

                                  {/* Inline Edit Passenger Age category inputs */}
                                  <div className="grid grid-cols-3 gap-2 border-y border-zinc-200/50 py-2.5">
                                    <div className="text-center">
                                      <span className="text-[9px] font-sans text-zinc-500 block">Adultos</span>
                                      <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <button
                                          type="button"
                                          onClick={() => setEditAdults(Math.max(1, editAdults - 1))}
                                          className="text-xs font-bold leading-none bg-white border w-6 h-6 flex items-center justify-center rounded"
                                        >
                                          -
                                        </button>
                                        <span className="text-xs font-mono font-bold text-zinc-800">{editAdults}</span>
                                        <button
                                          type="button"
                                          onClick={() => setEditAdults(editAdults + 1)}
                                          className="text-xs font-bold leading-none bg-white border w-6 h-6 flex items-center justify-center rounded"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    <div className="text-center">
                                      <span className="text-[9px] font-sans text-zinc-500 block">Crianças</span>
                                      <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <button
                                          type="button"
                                          onClick={() => setEditChildren(Math.max(0, editChildren - 1))}
                                          className="text-xs font-bold leading-none bg-white border w-6 h-6 flex items-center justify-center rounded"
                                        >
                                          -
                                        </button>
                                        <span className="text-xs font-mono font-bold text-zinc-800">{editChildren}</span>
                                        <button
                                          type="button"
                                          onClick={() => setEditChildren(editChildren + 1)}
                                          className="text-xs font-bold leading-none bg-white border w-6 h-6 flex items-center justify-center rounded"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    <div className="text-center">
                                      <span className="text-[9px] font-sans text-zinc-500 block">Bebês</span>
                                      <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <button
                                          type="button"
                                          onClick={() => setEditInfants(Math.max(0, editInfants - 1))}
                                          className="text-xs font-bold leading-none bg-white border w-6 h-6 flex items-center justify-center rounded"
                                        >
                                          -
                                        </button>
                                        <span className="text-xs font-mono font-bold text-zinc-800">{editInfants}</span>
                                        <button
                                          type="button"
                                          onClick={() => setEditInfants(editInfants + 1)}
                                          className="text-xs font-bold leading-none bg-white border w-6 h-6 flex items-center justify-center rounded"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Inline Edit Observations */}
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-sans text-zinc-500 block uppercase font-bold">Observações / Mimos</span>
                                    <textarea
                                      value={editObservations}
                                      onChange={(e) => setEditObservations(e.target.value)}
                                      rows={2}
                                      className="w-full bg-white border border-zinc-200 text-xs p-2 text-zinc-800 resize-none font-sans"
                                    />
                                  </div>

                                  {/* Save / Cancel buttons */}
                                  <div className="flex gap-2 justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditingIndex(null)}
                                      className="text-[10px] font-sans font-bold text-zinc-500 hover:text-zinc-800 bg-white border px-3 py-1.5 rounded cursor-pointer"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEdit(itemIdx)}
                                      className="text-[10px] font-sans font-bold text-zinc-900 hover:text-white bg-[#E8711A] hover:bg-[#0D1B2A] px-3 py-1.5 rounded transition-colors cursor-pointer"
                                    >
                                      Salvar
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* HIGH-CONVERSION CROSS-SELL RECOMMENDER SECTION */}
                  {getCartSidebarRecommendations().length > 0 && (
                    <div className="border-t border-dashed border-zinc-250 pt-5 space-y-3.5 text-left select-none">
                      <span className="font-accent text-[9px] text-[#E8711A] font-bold tracking-widest uppercase block animate-pulse">
                        💡 Sugestão para completar seu dia livre:
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {getCartSidebarRecommendations().map((recExp) => (
                          <div 
                            key={recExp.id}
                            className="p-3 bg-zinc-50 border border-zinc-150 rounded flex gap-3.5 hover:border-[#E8711A] transition-all items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="h-10 w-10 shrink-0 bg-zinc-200 rounded overflow-hidden">
                                <img 
                                  src={recExp.photos && recExp.photos.length > 0 ? recExp.photos[0] : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80"} 
                                  alt={recExp.name} 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <div>
                                <h4 className="font-serif text-[11px] font-bold text-[#0D1B2A] line-clamp-1">{recExp.name}</h4>
                                <span className="font-accent text-[9px] text-[#5C6874] font-medium block mt-0.5">⏱ {recExp.duration} &middot; R$ {recExp.priceFrom}</span>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                // Add straight to cart
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                const yyyy = tomorrow.getFullYear();
                                const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
                                const dd = String(tomorrow.getDate()).padStart(2, "0");
                                
                                handleAddToCart({
                                  experienceId: recExp.id,
                                  date: `${yyyy}-${mm}-${dd}`,
                                  schedule: recExp.schedules && recExp.schedules.length > 0 ? recExp.schedules[0] : "08:00",
                                  adults: 2,
                                  children: 0,
                                  infants: 0,
                                  people: 2,
                                  observations: "Adicionado via sugestões do roteiro!",
                                  dayIndex: 1,
                                });
                              }}
                              className="text-[10px] font-accent font-bold py-1 px-2.5 bg-[#E8711A] text-[#0D1B2A] rounded hover:bg-[#0D1B2A] hover:text-white transition-all cursor-pointer"
                            >
                              + Incluir
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <p className="font-sans text-xs text-[#5C6874]">Você não possui passeios no roteiro.</p>
                  <button
                    onClick={() => { setIsCartOpen(false); setCurrentView("experiencias"); }}
                    className="px-6 py-2 border border-[#E8711A] text-[#E8711A] hover:bg-[#E8711A] hover:text-[#0D1B2A] font-accent text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Adicionar Experiência
                  </button>
                </div>
              )}
            </div>

            {/* Inputs & CTA */}
            {cart.length > 0 && (
              <div className="border-t border-zinc-100 pt-6 space-y-5 bg-white mt-8 sticky bottom-0">
                <div className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="font-accent text-[9px] text-[#5C6874] tracking-widest uppercase block">Seu Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ana Clara"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 text-xs text-[#0D1B2A] uppercase font-sans focus:outline-none focus:border-[#0D1B2A] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-accent text-[9px] text-[#5C6874] tracking-widest uppercase block">Sua Cidade de Origem *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rio de Janeiro - RJ"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 text-xs text-[#0D1B2A] uppercase font-sans focus:outline-none focus:border-[#0D1B2A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 text-[10px] font-sans text-amber-700 leading-tight">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom shrink-0 text-amber-600" /> No WhatsApp, mostraremos as datas, pessoas, roteiros do dia a dia e nomes solicitados prontos para confirmar!
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleTriggerWhatsapp}
                    disabled={!clientName.trim() || !clientCity.trim()}
                    className={`w-full py-4 text-center font-accent text-xs font-bold tracking-widest uppercase rounded-sm cursor-pointer shadow-lg transition-all flex items-center justify-center gap-1.5 ${
                      clientName.trim() && clientCity.trim()
                        ? "bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A]"
                        : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" /> SOLICITAR ESSE ROTEIRO INTEGRAL &rarr;
                  </button>
                  <button
                    onClick={() => { setIsCartOpen(false); setCurrentView("experiencias"); }}
                    className="w-full py-2.5 text-center font-accent text-[10px] text-zinc-500 hover:text-[#0D1B2A] uppercase tracking-wider transition-colors"
                  >
                    + ADICIONAR MAIS EXPERIÊNCIAS
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
