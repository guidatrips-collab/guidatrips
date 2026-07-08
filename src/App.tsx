/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
import ConfirmacaoRoteiroView from "./components/ConfirmacaoRoteiroView";
import ThematicItineraryView from "./components/ThematicItineraryView";
import { GuidaOS } from "./os/GuidaOS";
import { LeadCaptureModal } from "./components/LeadCaptureModal";
import { analytics } from "./lib/analytics";
import { getValidAffiliateRef } from "./lib/utils";

import { 
  Experience, BlogPost, Lead, GlobalSettings, BookingCartItem, ClientUser, ClientReservation, SavedItinerary,
  getBrazilLocalDate, addDaysToBrazilDate, Destination, Accommodation, LeadHistoryItem
} from "./types";
import { 
  INITIAL_EXPERIENCES, INITIAL_BLOG_POSTS, INITIAL_LEADS, INITIAL_SETTINGS, INITIAL_DESTINATIONS, INITIAL_ACCOMMODATIONS
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

  const [savedItinerary, setSavedItinerary] = useState<SavedItinerary | null>(() => {
    try {
      const stored = localStorage.getItem("guidatrips_saved_itinerary");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync load of itinerary from Firestore
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!currentUser) {
        return;
      }
      try {
        const itineraryId = `itinerary-${currentUser.id}`;
        const docSnap = await firestoreService.get<SavedItinerary>("itineraries", itineraryId);
        if (docSnap) {
          setSavedItinerary(docSnap);
          localStorage.setItem("guidatrips_saved_itinerary", JSON.stringify(docSnap));
        } else {
          // If not in Firestore, but we have one in localStorage, save it under this user
          const stored = localStorage.getItem("guidatrips_saved_itinerary");
          if (stored) {
            const parsed = JSON.parse(stored) as SavedItinerary;
            parsed.userId = currentUser.id;
            parsed.id = `itinerary-${currentUser.id}`;
            await firestoreService.set("itineraries", parsed.id, parsed);
            setSavedItinerary(parsed);
            localStorage.setItem("guidatrips_saved_itinerary", JSON.stringify(parsed));
          }
        }
      } catch (err) {
        console.error("Error loading user itinerary from Firestore:", err);
      }
    };
    fetchItinerary();
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("guidatrips_logged_in_user");
    setUserReservations([]);
    setSavedItinerary(null);
    localStorage.removeItem("guidatrips_saved_itinerary");
    navigate("/");
  };

  const handleAuthSuccess = (user: ClientUser) => {
    setCurrentUser(user);
    localStorage.setItem("guidatrips_logged_in_user", JSON.stringify(user));

    // Resolve any pending protected actions
    if (pendingAuthAction) {
      if (pendingAuthAction.type === "navigate") {
        handleNavigate(pendingAuthAction.view);
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
        
        // Mantém o usuário no fluxo de planejamento (Roteiro Inteligente ou Experiências)
        // para dar continuidade de onde ele estava, sem quebrar o fluxo de compra!
      } else if (pendingAuthAction.type === "online_booking") {
        pendingAuthAction.callback();
      }
      setPendingAuthAction(null);
    } else {
      // Se não havia ação pendente e o usuário já estava em uma view ativa de planejamento,
      // mantemos ele onde ele estava para não quebrar o fluxo de navegação do cliente.
      const viewsToKeep = ["wizard", "experiencias", "roteiro", "hospedagens"];
      if (!viewsToKeep.includes(currentView)) {
        handleNavigate("cliente");
      }
    }
  };

  const handleNavigate = (view: string) => {
    if (view === "cliente") {
      if (!currentUser) {
        setPendingAuthAction({ type: "navigate", view });
        setIsAuthModalOpen(true);
        return;
      }
      navigate('/dashboard');
      setSelectedPostSlug(null);
      return;
    }
    
    let path = '/';
    switch (view) {
      case 'home': path = '/'; break;
      case 'destino': path = '/lugares'; break;
      case 'experiencias': path = '/passeios'; break;
      case 'wizard': path = '/roteiro-inteligente'; break;
      case 'roteiro': path = '/meu-roteiro'; break;
      case 'hospedagens': path = '/hospedagens'; break;
      case 'sobre': path = '/sobre'; break;
      case 'blog': path = '/blog'; break;
      case 'contato': path = '/contato'; break;
      case 'admin': path = '/admin'; break;
      case 'os': path = '/guideos/dashboard'; break;
      case 'confirmacao-roteiro': path = '/confirmacao-roteiro'; break;
      default: path = '/';
    }
    navigate(path);
    setSelectedPostSlug(null);
  };

  const handleTriggerAuthModalForCheckout = (action: { type: string; action: () => void }) => {
    setPendingAuthAction({ type: "online_booking", callback: action.action });
    setIsAuthModalOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentViewFromPath = (pathname: string) => {
    if (pathname.startsWith('/guideos')) return 'os';
    if (pathname.startsWith('/lugares/') && pathname.split('/').length >= 4) return 'thematic-view';
    if (pathname === '/lugares' || pathname === '/restaurantes' || pathname === '/eventos') return 'destino';
    if (pathname === '/passeios') return 'experiencias';
    if (pathname === '/roteiro-inteligente') return 'wizard';
    if (pathname === '/meu-roteiro') return 'roteiro';
    if (pathname === '/dashboard' || pathname === '/perfil') return 'cliente';
    if (pathname === '/hospedagens') return 'hospedagens';
    if (pathname === '/sobre') return 'sobre';
    if (pathname === '/blog') return 'blog';
    if (pathname === '/contato') return 'contato';
    if (pathname === '/admin') return 'admin';
    if (pathname === '/confirmacao-roteiro') return 'confirmacao-roteiro';
    return 'home';
  };
  const currentView = getCurrentViewFromPath(location.pathname);

  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);

  // Core CRM / Experiential Data loaded initially or from LocalStorage
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);

  // Additional OS Collections
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [osReservations, setOsReservations] = useState<any[]>([]);
  const [financial, setFinancial] = useState<any[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [thematicItineraries, setThematicItineraries] = useState<any[]>([]);

  // Affiliate Tracking
  useEffect(() => {
    // Also handle `/ref/:slug` paths by checking if pathname starts with `/ref/`
    let ref = null;
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'ref') {
      ref = pathParts[2];
    } else {
      const params = new URLSearchParams(window.location.search);
      ref = params.get('ref');
    }

    if (ref) {
      // Don't track if the logged-in user IS the affiliate (to avoid self-referral)
      // We will do a generic click tracking. Since we don't have user yet in the initial render,
      // we'll just store the ref and expiry
      
      const durationDays = settings.affiliateCookieDurationDays || 30;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + durationDays);
      
      const affiliateData = {
        ref,
        expiry: expiry.toISOString()
      };
      
      const stored = localStorage.getItem('guidatrips_affiliate_data');
      let shouldTrackClick = false;
      
      if (!stored) {
        shouldTrackClick = true;
      } else {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.ref !== ref) {
             shouldTrackClick = true;
          }
        } catch(e) {}
      }

      localStorage.setItem('guidatrips_affiliate_data', JSON.stringify(affiliateData));
      
      if (shouldTrackClick) {
        // Track the click in firestore (fetch affiliates, find by slug, increment clicks)
        // Since we are inside App.tsx, we can do it async
        const trackAffiliateClick = async () => {
           try {
              const allAff = await firestoreService.getAll<any>('affiliates');
              const found = allAff.find(a => a.slug === ref);
              if (found) {
                // If it's a new visitor (no session storage tracker for this ref)
                const sessionTracker = sessionStorage.getItem(`tracked_affiliate_click_${ref}`);
                let clicks = (found.clicks || 0) + 1;
                let uniqueVisitors = found.uniqueVisitors || 0;
                
                if (!sessionTracker) {
                  uniqueVisitors += 1;
                  sessionStorage.setItem(`tracked_affiliate_click_${ref}`, 'true');
                }
                
                await firestoreService.update('affiliates', found.id, {
                  clicks,
                  uniqueVisitors
                });
              }
           } catch(e) {
              console.error("Error tracking affiliate click", e);
           }
        };
        trackAffiliateClick();
      }

      // If it was a /ref/ path, redirect to home to clean URL
      if (location.pathname.startsWith('/ref/')) {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, location.search, settings.affiliateCookieDurationDays, navigate]);
  
  // WhatsApp Lead Capture State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [waDefaultMessage, setWaDefaultMessage] = useState("");

  // Tracking user journey and scroll to top on navigation change
  useEffect(() => {
    analytics.trackPageView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  const openWhatsAppModal = (message?: string) => {
    setWaDefaultMessage(message || settings.whatsappGreeting || "Olá! Gostaria de mais informações.");
    setIsLeadModalOpen(true);
  };

  // Roteiro (Shopping Cart) Drawer States
  const [cart, setCart] = useState<BookingCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [lastItineraryRecap, setLastItineraryRecap] = useState<{
    clientName: string;
    itemsCount: number;
    totalEstimate: number;
  } | null>(null);

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

  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("guidatrips_selected_destination_id") || "arraial-do-cabo";
    } catch {
      return "arraial-do-cabo";
    }
  });

  const updateSelectedDestinationId = (destId: string) => {
    setSelectedDestinationId(destId);
    localStorage.setItem("guidatrips_selected_destination_id", destId);
  };

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

  // Initialize data safely with real-time sync
  useEffect(() => {
    // 1. Sync load of local storage first for immediate UI
    try {
      const storedExps = localStorage.getItem("guidatrips_experiences");
      if (storedExps) setExperiences(JSON.parse(storedExps));
      
      const storedLeads = localStorage.getItem("guidatrips_leads");
      if (storedLeads) {
        const parsed = (JSON.parse(storedLeads) as Lead[]).filter(l => 
          l && 
          !(l.name && l.name.toLowerCase().includes("karina")) && 
          !(l.phone && l.phone.includes("229888227272")) &&
          l.id !== "7c05c87d-8092-4d52-93e7-cd6ab586a5e5" &&
          l.id !== "PmPDaiT45agDXDQUorOs"
        );
        const unique = Array.from(new Map(parsed.map(l => [l?.id, l])).values()).filter(Boolean);
        setLeads(unique);
      }

      const storedPosts = localStorage.getItem("guidatrips_posts");
      if (storedPosts) setPosts(JSON.parse(storedPosts));

      const storedSettings = localStorage.getItem("guidatrips_settings");
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (e) {
      console.warn("Local Storage read error:", e);
    }

    // 2. Database Seeding (if empty)
    const seed = async () => {
      await firestoreService.seedCollection("experiences", INITIAL_EXPERIENCES);
      await firestoreService.seedCollection("posts", INITIAL_BLOG_POSTS);
      await firestoreService.seedCollection("leads", INITIAL_LEADS);
      await firestoreService.seedCollection("destinations", INITIAL_DESTINATIONS);
      await firestoreService.seedCollection("accommodations", INITIAL_ACCOMMODATIONS);
      
      // Special check for global settings
      const settingsData = await firestoreService.getAll("settings");
      if (!settingsData.find((s: any) => s.id === "global")) {
        await firestoreService.set("settings", "global", INITIAL_SETTINGS);
      }
    };
    seed();

    // 3. Real-time Subscriptions
    const unsubExps = firestoreService.subscribe("experiences", (data) => {
      setExperiences(data as Experience[]);
      localStorage.setItem("guidatrips_experiences", JSON.stringify(data));
    });

    const unsubPosts = firestoreService.subscribe("posts", (data) => {
      setPosts(data as BlogPost[]);
      localStorage.setItem("guidatrips_posts", JSON.stringify(data));
    });

    const unsubLeads = firestoreService.subscribe("leads", (data) => {
      const filtered = (data as Lead[]).filter(l => 
        l && 
        !(l.name && l.name.toLowerCase().includes("karina")) && 
        !(l.phone && l.phone.includes("229888227272")) &&
        l.id !== "7c05c87d-8092-4d52-93e7-cd6ab586a5e5" &&
        l.id !== "PmPDaiT45agDXDQUorOs"
      );
      const sorted = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const unique = Array.from(new Map(sorted.map(l => [l?.id, l])).values()).filter(Boolean);
      setLeads(unique);
      localStorage.setItem("guidatrips_leads", JSON.stringify(unique));
    });

    const unsubSettings = firestoreService.subscribe("settings", (data) => {
      const docGlobal = (data as any[]).find((s: any) => s.id === "global");
      if (docGlobal) {
        setSettings(docGlobal);
        localStorage.setItem("guidatrips_settings", JSON.stringify(docGlobal));
      }
    });

    const unsubDest = firestoreService.subscribe("destinations", (data) => {
      setDestinations(data as Destination[]);
    });

    const unsubAcc = firestoreService.subscribe("accommodations", setAccommodations);
    const unsubPartners = firestoreService.subscribe("partners", setPartners);
    const unsubRes = firestoreService.subscribe("reservations", setOsReservations);
    const unsubFin = firestoreService.subscribe("financial", setFinancial);
    const unsubAff = firestoreService.subscribe("affiliates", setAffiliates);
    const unsubBud = firestoreService.subscribe("budgets", setBudgets);
    const unsubThematic = firestoreService.subscribe("thematicItineraries", setThematicItineraries);

    return () => {
      unsubExps();
      unsubPosts();
      unsubLeads();
      unsubSettings();
      unsubDest();
      unsubAcc();
      unsubPartners();
      unsubRes();
      unsubFin();
      unsubAff();
      unsubBud();
      unsubThematic();
    };
  }, []);

  // Catch select blog post event from HomeView
  useEffect(() => {
    const handleSelectPost = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedPostSlug(customEvent.detail);
        handleNavigate("blog");
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
    const filtered = newLeads.filter(l => 
      l && 
      !(l.name && l.name.toLowerCase().includes("karina")) && 
      !(l.phone && l.phone.includes("229888227272")) &&
      l.id !== "7c05c87d-8092-4d52-93e7-cd6ab586a5e5" &&
      l.id !== "PmPDaiT45agDXDQUorOs"
    );
    const unique = Array.from(new Map(filtered.map(l => [l?.id, l])).values()).filter(Boolean);
    const oldLeads = leads;
    setLeads(unique);
    localStorage.setItem("guidatrips_leads", JSON.stringify(unique));

    try {
      const oldIds = oldLeads.map(l => l?.id).filter(Boolean);
      const newIds = unique.map(l => l?.id).filter(Boolean);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const delId of deletedIds) {
        await firestoreService.delete("leads", delId);
      }

      for (const lead of unique) {
        await firestoreService.set("leads", lead.id, lead);
      }
    } catch (e) {
      console.error("Firestore leads update failed:", e);
    }
  };

  const updateDestinations = async (newDestinations: Destination[]) => {
    const oldDestinations = destinations;
    setDestinations(newDestinations);
    localStorage.setItem("guidatrips_destinations", JSON.stringify(newDestinations));

    try {
      const oldIds = oldDestinations.map(d => d.id);
      const newIds = newDestinations.map(d => d.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const delId of deletedIds) {
        await firestoreService.delete("destinations", delId);
      }

      for (const dest of newDestinations) {
        await firestoreService.set("destinations", dest.id, dest);
      }
    } catch (e) {
      console.error("Firestore destinations update failed:", e);
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

  const updateAccommodations = async (newAcc: Accommodation[]) => {
    const oldAcc = accommodations;
    setAccommodations(newAcc);
    localStorage.setItem("guidatrips_accommodations", JSON.stringify(newAcc));

    try {
      const oldIds = oldAcc.map(a => a.id);
      const newIds = newAcc.map(a => a.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const delId of deletedIds) {
        await firestoreService.delete("accommodations", delId);
      }

      for (const acc of newAcc) {
        await firestoreService.set("accommodations", acc.id, acc);
      }
    } catch (e) {
      console.error("Firestore accommodations update failed:", e);
    }
  };

  const updateReservations = async (newRes: any[]) => {
    const oldRes = osReservations;
    setOsReservations(newRes);
    // Reservations are handled individually in Wizard but here we might need bulk update for Admin
    try {
      const oldIds = oldRes.map(r => r.id);
      const newIds = newRes.map(r => r.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const delId of deletedIds) {
        await firestoreService.delete("reservations", delId);
      }

      for (const res of newRes) {
        await firestoreService.set("reservations", res.id, res);
      }
    } catch (e) {
      console.error("Firestore reservations update failed:", e);
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
    
    const savedDay = localStorage.getItem("guidatrips_current_planning_day");
    const dayIndex = item.dayIndex ?? (savedDay ? parseInt(savedDay, 10) : 1);

    // If date is not provided, calculate it consistently based on dayIndex
    let finalDate = item.date;
    if (!finalDate) {
      finalDate = addDaysToBrazilDate(getBrazilLocalDate(), dayIndex);
    }

    const normalizedItem: BookingCartItem = {
      ...item,
      adults,
      children,
      infants,
      people,
      schedule,
      observations,
      dayIndex,
      date: finalDate,
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

  const handleUpdateCartItem = (index: number, fields: Partial<BookingCartItem>) => {
    const updated = cart.map((item, idx) => {
      if (idx === index) {
        const adults = fields.adults !== undefined ? fields.adults : (item.adults ?? 2);
        const children = fields.children !== undefined ? fields.children : (item.children ?? 0);
        const infants = fields.infants !== undefined ? fields.infants : (item.infants ?? 0);
        const people = adults + children + infants;
        return {
          ...item,
          ...fields,
          people
        };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("guidatrips_cart", JSON.stringify(updated));
  };

  const handleChangeItemDay = (index: number, day: number) => {
    const updated = cart.map((item, idx) => {
      if (idx === index) {
        const dateStr = addDaysToBrazilDate(getBrazilLocalDate(), day);
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
    
    cart.forEach((item) => {
      const exp = experiences.find(e => e.id === item.experienceId);
      const name = exp ? exp.name : "Passeio";
      const dayIndex = item.dayIndex !== undefined && item.dayIndex !== null ? item.dayIndex : 1;
      const keyDay = `${dayIndex}_${item.schedule}`;
      
      if (seenDaySchedule.has(keyDay)) {
        const conflictedItem = seenDaySchedule.get(keyDay)!;
        const otherExp = experiences.find(e => e.id === conflictedItem.experienceId);
        const otherName = otherExp ? otherExp.name : "Outro passeio";
        conflicts.push(`⚠️ ATENÇÃO: Os passeios "${name}" e "${otherName}" foram marcados para o mesmo dia (Dia ${dayIndex}) e horário (${item.schedule}). Sugerimos alterar um deles para evitar sobreposição de agendas!`);
      } else {
        seenDaySchedule.set(keyDay, item);
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
    const affiliateRef = getValidAffiliateRef();
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      origin: "formulario",
      status: "novo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (affiliateRef) {
      newLead.attribution = { ...newLead.attribution, affiliateRef };
    }
    
    const updated = [newLead, ...leads];
    updateLeads(updated);
  };

  // Build beautiful WhatsApp message according to spec section 7, day-by-day sequence
  const handleTriggerWhatsapp = async () => {
    if (cart.length === 0 && !selectedHotelId) return;

    // Calculate total estimate
    let totalEstimate = 0;
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (!exp) return;
      
      const baseAdult = exp.pricing?.adultPrice ?? exp.priceFrom;
      const baseChild = exp.pricing?.childPrice ?? (exp.promotionalPrice || exp.priceFrom) * 0.5;
      const baseBaby = exp.pricing?.babyPrice ?? 0;
      
      let tariff = { adultPrice: baseAdult, childPrice: baseChild, babyPrice: baseBaby };
      if (item.date && exp.calendar?.[item.date]) {
        const customData = exp.calendar[item.date];
        tariff = {
          adultPrice: customData.adultPrice,
          childPrice: customData.childPrice,
          babyPrice: customData.babyPrice
        };
      }
      
      const adultsCost = tariff.adultPrice * (item.adults || 2);
      const kidsCost = tariff.childPrice * (item.children || 0);
      const babiesCost = tariff.babyPrice * (item.infants || 0);
      totalEstimate += (adultsCost + kidsCost + babiesCost);
    });

    const finalName = clientName.trim() || "[Nome do Cliente]";
    const finalCity = clientCity.trim() || "[Cidade de Origem]";

    let textMessage = `Olá, Guida Trips! 👋\n\n`;
    textMessage += `Gostaria de solicitar o agendamento do meu roteiro personalizado!\n\n`;
    textMessage += `👤 *Nome do Cliente:* ${finalName}\n`;
    textMessage += `🏡 *Cidade de Origem:* ${finalCity}\n`;
    textMessage += `📅 *Dias de Viagem:* ${stayDays} dias\n\n`;

    // Add lodging summary if selected
    if (selectedHotelId) {
      const hotelNames: Record<string, string> = {
        "pousada-timoneiro": "Pousada do Timoneiro 🛌",
        "pousada-caminho-mar": "Pousada Caminho do Mar 🛌",
        "ohana-pousada": "Ohana Pousada Boutique 🛌"
      };
      const hName = hotelNames[selectedHotelId] || "Hospedagem Selecionada";
      textMessage += `🏨 *Hospedagem Coordenada:* ${hName}\n\n`;
    }

    textMessage += `📋 *PASSEIOS ESCOLHIDOS:*\n\n`;

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
          
          let paxString = `${item.adults} Adulto(s)`;
          if (item.children && item.children > 0) paxString += `, ${item.children} Criança(s)`;
          if (item.infants && item.infants > 0) paxString += `, ${item.infants} Bebê(s)`;
          textMessage += `      👥 Participantes: ${paxString}\n`;
          
          if (item.observations && item.observations.trim()) {
            textMessage += `      ✍️ Observações: _${item.observations.trim()}_\n`;
          }
        });
        textMessage += `\n`;
      }
    }

    const uniqueLocationsSet = new Set<string>();
    cart.forEach(item => {
      const exp = experiences.find(e => e.id === item.experienceId);
      if (exp) {
        if (exp.destinationId) {
           const dest = destinations.find(d => d.id === exp.destinationId);
           if (dest) uniqueLocationsSet.add(dest.name);
        } else if (exp.location) {
           uniqueLocationsSet.add(exp.location);
        }
      }
    });
    // Add default location if none
    if (uniqueLocationsSet.size === 0) {
      const defaultDest = destinations.find(d => d.id === selectedDestinationId) || destinations[0];
      if (defaultDest) uniqueLocationsSet.add(defaultDest.name);
    }
    const locationsString = Array.from(uniqueLocationsSet).join(", ");

    textMessage += `📍 *Destinos:* ${locationsString}\n`;
    textMessage += `💰 *Valor Estimado do Roteiro:* R$ ${totalEstimate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}\n\n`;
    textMessage += `Por favor, confirmem a disponibilidade das vagas e os valores para finalizarmos! Obrigado!`;

    // 1. Determine active user (or create beautiful guest user in database so they can access their dashboard!)
    let activeUser = currentUser;
    if (!activeUser) {
      const guestId = `user-guest-${Date.now()}`;
      const guestEmail = `guest-${Date.now()}@guidatrips.com.br`;
      const guestUser = {
        id: guestId,
        name: finalName,
        email: guestEmail,
        password: "guest",
        phone: clientPhone || "Não informado",
        photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}`,
        preferences: [],
        favorites: [],
        createdAt: new Date().toISOString()
      };
      
      try {
        await firestoreService.set("users", guestId, guestUser);
        setCurrentUser(guestUser);
        localStorage.setItem("guidatrips_logged_in_user", JSON.stringify(guestUser));
        activeUser = guestUser;
      } catch (err) {
        console.error("Erro ao registrar usuário temporário:", err);
      }
    }

    // 2. Automatically save all itinerary cart items as reservations in Firestore under this active user
    if (activeUser) {
      const affiliateRef = getValidAffiliateRef();

      for (let idx = 0; idx < cart.length; idx++) {
        const item = cart[idx];
        const exp = experiences.find(e => e.id === item.experienceId);
        const reservationId = `res-roteiro-${Date.now()}-${idx}-${Math.floor(Math.random() * 100)}`;
        const newReservation: ClientReservation = {
          id: reservationId,
          userId: activeUser.id,
          experienceId: item.experienceId,
          date: item.date || new Date().toISOString().split("T")[0],
          time: item.schedule || "08:00",
          pax: (item.adults ?? 2) + (item.children ?? 0) + (item.infants ?? 0),
          adults: item.adults ?? 2,
          children: item.children ?? 0,
          infants: item.infants ?? 0,
          status: "new",
          bringItems: exp?.bringItems || ["Filtro Solar", "Toalha de Banho"],
          avoidItems: exp?.notIncluded || ["Sapatos de Salto"],
          meetingPoint: exp?.meetingPoint || "A combinar",
          ...(affiliateRef ? { affiliateRef } : {})
        };
        try {
          await firestoreService.set("reservations", reservationId, newReservation);
        } catch (dbErr) {
          console.error("Erro ao salvar reserva no banco:", dbErr);
        }
      }

      try {
        const itineraryId = `itinerary-${activeUser.id}`;
        const defaultDest = destinations.find(d => d.id === selectedDestinationId) || destinations[0];
        const itineraryData: SavedItinerary = {
          id: itineraryId,
          userId: activeUser.id,
          clientName: activeUser.name || finalName,
          clientPhone: activeUser.phone || clientPhone || "Não informado",
          clientCity: finalCity || "Não informado",
          arrivalDate: getBrazilLocalDate(),
          departureDate: addDaysToBrazilDate(getBrazilLocalDate(), stayDays),
          stayDays,
          budget: "Moderado",
          profile: "personalizado",
          selectedHotelId,
          totalEstimate,
          createdAt: new Date().toISOString(),
          items: cart,
          destinationName: defaultDest?.name || "Destino",
          status: "Aguardando atendimento",
          ...(affiliateRef ? { affiliateRef } : {})
        };
        await firestoreService.set("itineraries", itineraryId, itineraryData);
        localStorage.setItem("guidatrips_saved_itinerary", JSON.stringify(itineraryData));
        setSavedItinerary(itineraryData);
      } catch (err) {
        console.error("Erro ao salvar roteiro:", err);
      }
    }

    // 3. Register this WhatsApp click event as a Lead in our Admin Dashboard CRM to keep metrics active!
    const waLead: Lead = {
      id: `lead-wa-${Date.now()}`,
      name: finalName,
      phone: clientPhone || "Informado no WhatsApp",
      email: activeUser?.email || "Enviado via WhatsApp",
      experienceInterest: cart.map(item => item.experienceId),
      preferredDate: cart[0]?.date,
      groupSize: cart.reduce((acc, item) => acc + item.people, 0),
      origin: "whatsapp",
      status: "novo",
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "status_change",
          description: `Solicitação de Roteiro via WhatsApp. Origem: ${finalCity}. Estadia de ${stayDays} dias.`
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [
        `Cliente originou contato WhatsApp com roteiro de ${cart.length} itens.`,
        `Origem: ${finalCity}`,
        `Estadia: ${stayDays} dias.`,
        `Data/Horário da solicitação: ${new Date().toLocaleString("pt-BR")}`,
        `Total estimado: R$ ${totalEstimate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        `Atividades diárias:\n` + cart.map(item => {
          const exp = experiences.find(e => e.id === item.experienceId);
          return `- Dia ${item.dayIndex}: ${exp?.name || "Passeio"} às ${item.schedule} (${item.adults} adultos, ${item.children} crianças)`;
        }).join('\n')
      ]
    };

    try {
      await firestoreService.set("leads", waLead.id, waLead);
    } catch (dbErr) {
      console.error("Erro ao salvar lead no banco de dados:", dbErr);
    }
    updateLeads([waLead, ...leads]);

    // Store recap details for confirmation view
    setLastItineraryRecap({
      clientName: finalName,
      itemsCount: cart.length,
      totalEstimate: totalEstimate
    });

    const formattedNumber = settings.whatsappNumber.replace(/\D/g, "");
    const waUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(textMessage)}`;
    
    // Close drawer, but keep the cart so the itinerary is still editable
    setIsCartOpen(false);
    
    // Open WhatsApp
    window.open(waUrl, "_blank");

    // Redirect immediately to confirmation view
    handleNavigate("confirmacao-roteiro");
  };

  if (currentView === "os") {
    if (!currentUser) {
      return (
        <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center text-white">
          <p className="mb-4">Autenticação necessária para acessar o GuideOS.</p>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2 bg-[#E8711A] rounded-lg font-bold hover:bg-[#FF8A3F] transition-colors cursor-pointer"
          >
            Fazer Login
          </button>
          {isAuthModalOpen && (
            <ClientAuthModal
              isOpen={isAuthModalOpen}
              onClose={() => {
                setIsAuthModalOpen(false);
                handleNavigate("home");
              }}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      );
    }

    return (
      <GuidaOS 
        onNavigateHome={() => handleNavigate("home")} 
        experiences={experiences} 
        leads={leads}
        accommodations={accommodations}
        partners={partners}
        reservations={osReservations}
        financial={financial}
        affiliates={affiliates}
        budgets={budgets}
        thematicItineraries={thematicItineraries}
        settings={settings}
        destinations={destinations}
        onUpdateSettings={updateSettings}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-[#0D1B2A] bg-[#FBF9F6] font-sans selection:bg-[#E8711A]/20">
      <header>
        <Navbar 
          currentView={currentView}
          onNavigate={handleNavigate}
          cartCount={cart.length}
          onOpenCart={() => { handleNavigate("roteiro"); }}
          currentUser={currentUser}
          onWhatsAppContact={openWhatsAppModal}
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
            destinations={destinations}
            selectedDestinationId={selectedDestinationId}
            onUpdateSelectedDestinationId={updateSelectedDestinationId}
            onWhatsAppContact={openWhatsAppModal}
          />
        )}
        {currentView === "experiencias" && (
          <ExperiencesView 
            experiences={experiences} 
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCart={() => { handleNavigate("roteiro"); }}
            whatsappNumber={settings.whatsappNumber}
            settings={settings}
            onUpdateSettings={updateSettings}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onTriggerAuthModal={handleTriggerAuthModalForCheckout}
            stayDays={stayDays}
            destinations={destinations}
            selectedDestinationId={selectedDestinationId}
            onUpdateSelectedDestinationId={updateSelectedDestinationId}
            onWhatsAppContact={openWhatsAppModal}
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
            onUpdateCartItem={handleUpdateCartItem}
            onSaveItinerary={setSavedItinerary}
            onNavigate={handleNavigate}
            onSetClientName={setClientName}
            onSetClientCity={setClientCity}
            selectedHotelId={selectedHotelId}
            onChangeHotelId={handleUpdateHotelId}
            whatsappNumber={settings.whatsappNumber}
            currentUser={currentUser}
            onSetCurrentUser={setCurrentUser}
            onTriggerAuthModal={handleTriggerAuthModalForCheckout}
            destinations={destinations}
            selectedDestinationId={selectedDestinationId}
            onUpdateSelectedDestinationId={updateSelectedDestinationId}
            accommodations={accommodations}
          />
        )}
        {currentView === "hospedagens" && (
          <HospedagensView 
            whatsappNumber={settings.whatsappNumber} 
            accommodations={accommodations}
            onWhatsAppContact={openWhatsAppModal}
          />
        )}
        {currentView === "sobre" && (
          <AboutView />
        )}
        {currentView === "blog" && (
          <BlogView 
            posts={posts} 
            thematicItineraries={thematicItineraries}
            destinations={destinations}
            onNavigateToContact={() => handleNavigate("contato")}
            selectedSlug={selectedPostSlug}
            onSelectPost={setSelectedPostSlug}
            onNavigateToThematic={(destSlug, thematicSlug) => navigate(`/lugares/${destSlug}/${thematicSlug}`)}
          />
        )}
        {currentView === "contato" && (
          <ContactView 
            onAddLead={handleAddNewLead} 
            whatsappNumber={settings.whatsappNumber}
            onWhatsAppContact={openWhatsAppModal}
          />
        )}
        {currentView === "admin" && (
          <AdminView 
            experiences={experiences}
            leads={leads}
            posts={posts}
            settings={settings}
            destinations={destinations}
            accommodations={accommodations}
            reservations={osReservations}
            onUpdateExperiences={updateExperiences}
            onUpdatePosts={updatePosts}
            onUpdateLeads={updateLeads}
            onUpdateSettings={updateSettings}
            onUpdateDestinations={updateDestinations}
            onUpdateAccommodations={updateAccommodations}
            onUpdateReservations={updateReservations}
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
            destinations={destinations}
            selectedDestinationId={selectedDestinationId}
            savedItinerary={savedItinerary}
          />
        )}
        {currentView === "roteiro" && (
          <RoteiroView 
            cart={cart}
            experiences={experiences}
            stayDays={stayDays}
            clientName={clientName}
            clientCity={clientCity}
            clientPhone={clientPhone}
            whatsappNumber={settings.whatsappNumber}
            onUpdateStayDays={updateStayDays}
            onRemoveFromCart={handleRemoveFromCart}
            onChangeItemDay={handleChangeItemDay}
            onSaveEdit={handleSaveEdit}
            onAddToCart={handleAddToCart}
            onSetClientName={setClientName}
            onSetClientCity={setClientCity}
            onSetClientPhone={setClientPhone}
            onTriggerWhatsapp={handleTriggerWhatsapp}
            onNavigate={handleNavigate}
            selectedHotelId={selectedHotelId}
            onChangeHotelId={handleUpdateHotelId}
          />
        )}
        {currentView === "thematic-view" && (
          <ThematicItineraryView 
            pathname={location.pathname}
            thematicItineraries={thematicItineraries}
            destinations={destinations}
            experiences={experiences}
            accommodations={accommodations}
            partners={partners}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onWhatsAppContact={openWhatsAppModal}
          />
        )}
        {currentView === "confirmacao-roteiro" && (
          <ConfirmacaoRoteiroView
            onNavigate={handleNavigate}
            clientName={lastItineraryRecap?.clientName}
            totalEstimate={lastItineraryRecap?.totalEstimate}
            itemsCount={lastItineraryRecap?.itemsCount}
          />
        )}
      </main>

      <Footer 
        onNavigate={handleNavigate} 
        whatsappNumber={settings.whatsappNumber} 
        onWhatsAppContact={openWhatsAppModal}
      />

      {/* Client Authentication Modal */}
      <ClientAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { setIsAuthModalOpen(false); setPendingAuthAction(null); }} 
        onSuccess={handleAuthSuccess} 
      />

      {/* COMPONENTE FLOATING ROTERIO (TRIGGER DRAWERS) */}
      {(cart.length > 0 || selectedHotelId) && currentView !== "roteiro" && (
        <button
          onClick={() => { handleNavigate("roteiro"); }}
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
                    onClick={() => { setIsCartOpen(false); handleNavigate("experiencias"); }}
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
                    onClick={() => { setIsCartOpen(false); handleNavigate("experiencias"); }}
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

      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        whatsappNumber={settings.whatsappNumber}
        defaultMessage={waDefaultMessage}
      />
    </div>
  );
}
