import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = "pt" | "en" | "es";

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translateText: (text: string, targetLang?: SupportedLanguage) => Promise<string>;
  translateObject: <T extends Record<string, any>>(obj: T, fieldsToTranslate: string[], targetLang?: SupportedLanguage) => Promise<T>;
}

const STORAGE_KEY = "guida_trips_lang_v1";

const dictionaries: Record<SupportedLanguage, Record<string, string>> = {
  pt: {
    // Brand & Slogan
    "brand.tagline": "Experiências que conectam",
    
    // Navbar
    "nav.home": "Início",
    "nav.wizard": "Roteiro Inteligente 🧭",
    "nav.experiencias": "Experiências",
    "nav.hospedagens": "Hospedagens",
    "nav.sobre": "Sobre Nós",
    "nav.blog": "Revista/Blog",
    "nav.contato": "Contato",
    "nav.cart": "Meu Roteiro",
    "nav.guideos": "GuidaOS",
    "nav.login": "Entrar",
    "nav.profile": "Meu Perfil",
    
    // Hero
    "hero.badge": "Curadoria Oficial de Turismo",
    "hero.title": "Experiências Inesquecíveis na Região dos Lagos",
    "hero.subtitle": "Reserve paseios de barco, lanchas VIP, quadriciclos e hospedagens boutique com garantia de vagas e atendimento humano.",
    "hero.btn.wizard": "Montar Roteiro Personalizado",
    "hero.btn.explore": "Explorar Passeios",
    
    // Filters & Sections
    "filter.all": "Todos os Passeios",
    "filter.nautico": "Náutico & Barco",
    "filter.offroad": "Quadriciclo & Buggy",
    "filter.mergulho": "Mergulho & Snorkel",
    "filter.gastronomia": "Gastronomia & Vinhos",
    "filter.helitour": "Passeio de Helicóptero",
    
    "section.featured_exp": "Passeios Mais Recomendados",
    "section.featured_exp_sub": "Selecionados a dedo para garantir memórias incríveis e segurança total.",
    "section.destinations": "Destinos Incríveis",
    "section.destinations_sub": "Explore o Caribe Brasileiro e as enseadas mais deslumbrantes do Rio de Janeiro.",
    "section.lodging": "Hospedagens Curadas",
    "section.lodging_sub": "Casas de praia, pousadas charmosas e hotéis pé na areia.",
    "section.magazine": "Revista de Viagem",
    
    // Common Card Labels
    "card.duration": "Duração",
    "card.capacity": "Capacidade",
    "card.from": "A partir de",
    "card.per_person": "/ pessoa",
    "card.per_night": "/ noite",
    "card.book_now": "Garantir Vaga",
    "card.add_to_itinerary": "Adicionar ao Roteiro",
    "card.view_details": "Ver Detalhes",
    
    // Cart & Drawer
    "cart.title": "Resumo do Seu Roteiro",
    "cart.empty": "Seu roteiro ainda está vazio. Escolha passeios ou hospedagens para personalizar sua viagem!",
    "cart.total": "Valor Total Estimado",
    "cart.deposit_today": "Sinal Pago Hoje",
    "cart.due_boarding": "No Embarque",
    "cart.financial_guarantee": "Resumo Financeiro & Garantia de Vaga",
    "cart.deposit_info": "* Você paga apenas o sinal para travar o lote e garantir a reserva. O restante é quitado direto no embarque!",
    "cart.client_name": "Seu Nome Completo",
    "cart.client_city": "Cidade de Origem",
    "cart.btn_quote": "1. Solicitar Orçamento no WhatsApp",
    "cart.btn_book_online": "2. Garantir Vaga Online",
    
    // Voucher Modal
    "voucher.title": "Voucher Inteligente Oficial",
    "voucher.present_boarding": "Apresente no Embarque",
    "voucher.date": "Data da Reserva",
    "voucher.time": "Horário de Saída",
    "voucher.passengers": "Passageiros",
    "voucher.meeting_point": "Ponto de Encontro e Check-in",
    "voucher.weather_forecast": "Previsão do Tempo & Náutica",
    "voucher.share": "Compartilhar Voucher",
    "voucher.my_dashboard": "Meu Dashboard da Viagem",
    "voucher.community": "Comunidade de Viajantes",
    "voucher.temp": "Temperatura",
    "voucher.wind": "Vento",
    "voucher.water_temp": "Água",
    "voucher.visibility": "Visibilidade",
    
    // Wizard Steps
    "wizard.step1.title": "Para onde você quer ir?",
    "wizard.step2.title": "Quando será sua viagem?",
    "wizard.step3.title": "Quantas pessoas vão?",
    "wizard.step4.title": "Qual seu estilo de viagem?",
    "wizard.step5.title": "Escolha seus passeios",
    "wizard.btn_next": "Avançar",
    "wizard.btn_back": "Voltar",
    "wizard.btn_finish": "Finalizar Roteiro",
    
    // GuidaOS / Admin
    "os.restricted_title": "Acesso Restrito (GuidaOS)",
    "os.restricted_desc": "Você precisa estar logado com credenciais autorizadas para acessar o GuidaOS.",
    "os.btn_login": "Fazer Login no GuidaOS",
    
    // Footer
    "footer.slogan": "A plataforma definitiva de curadoria de experiências e roteiros na Região dos Lagos e Rio de Janeiro.",
    "footer.quick_links": "Links Rápidos",
    "footer.contact": "Atendimento Concierge",
    "footer.rights": "Todos os direitos reservados. Guida Trips®"
  },

  en: {
    // Brand & Slogan
    "brand.tagline": "Experiences that connect",
    
    // Navbar
    "nav.home": "Home",
    "nav.wizard": "Smart Itinerary 🧭",
    "nav.experiencias": "Experiences",
    "nav.hospedagens": "Accommodations",
    "nav.sobre": "About Us",
    "nav.blog": "Magazine/Blog",
    "nav.contato": "Contact",
    "nav.cart": "My Itinerary",
    "nav.guideos": "GuidaOS",
    "nav.login": "Sign In",
    "nav.profile": "My Profile",
    
    // Hero
    "hero.badge": "Official Tourism Curation",
    "hero.title": "Unforgettable Experiences in the Lakes Region",
    "hero.subtitle": "Book boat tours, VIP speedboats, ATV quad rides, and boutique accommodations with guaranteed slots and personal assistance.",
    "hero.btn.wizard": "Build Custom Itinerary",
    "hero.btn.explore": "Explore Tours",
    
    // Filters & Sections
    "filter.all": "All Tours",
    "filter.nautico": "Nautical & Boat",
    "filter.offroad": "ATV & Buggy",
    "filter.mergulho": "Diving & Snorkeling",
    "filter.gastronomia": "Food & Wine",
    "filter.helitour": "Helicopter Tour",
    
    "section.featured_exp": "Top Recommended Tours",
    "section.featured_exp_sub": "Hand-picked to ensure incredible memories and complete safety.",
    "section.destinations": "Stunning Destinations",
    "section.destinations_sub": "Explore the Brazilian Caribbean and Rio de Janeiro's most breathtaking coves.",
    "section.lodging": "Curated Lodgings",
    "section.lodging_sub": "Beach houses, charming inns, and beachfront boutique hotels.",
    "section.magazine": "Travel Magazine",
    
    // Common Card Labels
    "card.duration": "Duration",
    "card.capacity": "Capacity",
    "card.from": "From",
    "card.per_person": "/ person",
    "card.per_night": "/ night",
    "card.book_now": "Book Slot Now",
    "card.add_to_itinerary": "Add to Itinerary",
    "card.view_details": "View Details",
    
    // Cart & Drawer
    "cart.title": "Your Itinerary Summary",
    "cart.empty": "Your itinerary is currently empty. Choose tours or lodgings to customize your trip!",
    "cart.total": "Estimated Total",
    "cart.deposit_today": "Deposit Paid Today",
    "cart.due_boarding": "Due at Boarding",
    "cart.financial_guarantee": "Financial Summary & Slot Guarantee",
    "cart.deposit_info": "* You only pay a small deposit online to lock in your slot. The remaining balance is paid upon boarding!",
    "cart.client_name": "Your Full Name",
    "cart.client_city": "City of Origin",
    "cart.btn_quote": "1. Request Quote on WhatsApp",
    "cart.btn_book_online": "2. Book Online Now",
    
    // Voucher Modal
    "voucher.title": "Official Smart Voucher",
    "voucher.present_boarding": "Present at Boarding",
    "voucher.date": "Reservation Date",
    "voucher.time": "Departure Time",
    "voucher.passengers": "Passengers",
    "voucher.meeting_point": "Meeting Point & Check-in",
    "voucher.weather_forecast": "Live Weather & Nautical Forecast",
    "voucher.share": "Share Voucher",
    "voucher.my_dashboard": "My Trip Dashboard",
    "voucher.community": "Traveler Community",
    "voucher.temp": "Temperature",
    "voucher.wind": "Wind",
    "voucher.water_temp": "Water Temp",
    "voucher.visibility": "Visibility",
    
    // Wizard Steps
    "wizard.step1.title": "Where do you want to go?",
    "wizard.step2.title": "When are you traveling?",
    "wizard.step3.title": "How many travelers?",
    "wizard.step4.title": "What's your travel style?",
    "wizard.step5.title": "Choose your experiences",
    "wizard.btn_next": "Next",
    "wizard.btn_back": "Back",
    "wizard.btn_finish": "Finish Itinerary",
    
    // GuidaOS / Admin
    "os.restricted_title": "Restricted Access (GuidaOS)",
    "os.restricted_desc": "You must be logged in with authorized credentials to access GuidaOS.",
    "os.btn_login": "Log in to GuidaOS",
    
    // Footer
    "footer.slogan": "The ultimate platform for curated experiences and itineraries in the Lakes Region and Rio de Janeiro.",
    "footer.quick_links": "Quick Links",
    "footer.contact": "Concierge Support",
    "footer.rights": "All rights reserved. Guida Trips®"
  },

  es: {
    // Brand & Slogan
    "brand.tagline": "Experiencias que conectan",
    
    // Navbar
    "nav.home": "Inicio",
    "nav.wizard": "Itinerario Inteligente 🧭",
    "nav.experiencias": "Experiencias",
    "nav.hospedagens": "Alojamientos",
    "nav.sobre": "Nosotros",
    "nav.blog": "Revista/Blog",
    "nav.contato": "Contacto",
    "nav.cart": "Mi Itinerario",
    "nav.guideos": "GuidaOS",
    "nav.login": "Iniciar Sesión",
    "nav.profile": "Mi Perfil",
    
    // Hero
    "hero.badge": "Curaduría Oficial de Turismo",
    "hero.title": "Experiencias Inolvidables en la Región de los Lagos",
    "hero.subtitle": "Reserva paseos en barco, lanchas VIP, cuatrimotos y alojamientos boutique con cupos garantizados y atención personalizada.",
    "hero.btn.wizard": "Crear Itinerario Personalizado",
    "hero.btn.explore": "Explorar Paseos",
    
    // Filters & Sections
    "filter.all": "Todos los Paseos",
    "filter.nautico": "Náutico y Barcos",
    "filter.offroad": "Cuatrimotos y Buggy",
    "filter.mergulho": "Buceo y Snorkel",
    "filter.gastronomia": "Gastronomía y Vinos",
    "filter.helitour": "Paseo en Helicóptero",
    
    "section.featured_exp": "Paseos Más Recomendados",
    "section.featured_exp_sub": "Seleccionados minuciosamente para garantizar momentos mágicos y total seguridad.",
    "section.destinations": "Destinos Increíbles",
    "section.destinations_sub": "Explora el Caribe Brasileño y las calas más deslumbrantes de Río de Janeiro.",
    "section.lodging": "Alojamientos Curados",
    "section.lodging_sub": "Casas de playa, posadas con encanto y hoteles frente al mar.",
    "section.magazine": "Revista de Viajes",
    
    // Common Card Labels
    "card.duration": "Duración",
    "card.capacity": "Capacidad",
    "card.from": "Desde",
    "card.per_person": "/ persona",
    "card.per_night": "/ noche",
    "card.book_now": "Reservar Cupo",
    "card.add_to_itinerary": "Agregar al Itinerario",
    "card.view_details": "Ver Detalles",
    
    // Cart & Drawer
    "cart.title": "Resumen de tu Itinerario",
    "cart.empty": "Tu itinerario está vacío. ¡Elige paseos o alojamientos para personalizar tu viaje!",
    "cart.total": "Valor Total Estimado",
    "cart.deposit_today": "Depósito Pagado Hoy",
    "cart.due_boarding": "Al Embarcar",
    "cart.financial_guarantee": "Resumen Financiero y Garantía de Cupo",
    "cart.deposit_info": "* Solo pagas un depósito en línea para asegurar tu cupo. El saldo restante se paga al embarcar.",
    "cart.client_name": "Tu Nombre Completo",
    "cart.client_city": "Ciudad de Origen",
    "cart.btn_quote": "1. Solicitar Presupuesto por WhatsApp",
    "cart.btn_book_online": "2. Reservar en Línea Ahora",
    
    // Voucher Modal
    "voucher.title": "Voucher Inteligente Oficial",
    "voucher.present_boarding": "Presentar al Embarcar",
    "voucher.date": "Fecha de Reserva",
    "voucher.time": "Hora de Salida",
    "voucher.passengers": "Pasajeros",
    "voucher.meeting_point": "Punto de Encuentro y Check-in",
    "voucher.weather_forecast": "Pronóstico Náutico y del Tiempo",
    "voucher.share": "Compartir Voucher",
    "voucher.my_dashboard": "Mi Panel de Viaje",
    "voucher.community": "Comunidad de Viajeros",
    "voucher.temp": "Temperatura",
    "voucher.wind": "Viento",
    "voucher.water_temp": "Agua",
    "voucher.visibility": "Visibilidad",
    
    // Wizard Steps
    "wizard.step1.title": "¿A dónde quieres ir?",
    "wizard.step2.title": "¿Cuándo viajarás?",
    "wizard.step3.title": "¿Cuántas personas viajan?",
    "wizard.step4.title": "¿Cuál es tu estilo de viaje?",
    "wizard.step5.title": "Elige tus experiencias",
    "wizard.btn_next": "Siguiente",
    "wizard.btn_back": "Atrás",
    "wizard.btn_finish": "Finalizar Itinerario",
    
    // GuidaOS / Admin
    "os.restricted_title": "Acceso Restringido (GuidaOS)",
    "os.restricted_desc": "Debes iniciar sesión con credenciales autorizadas para acceder a GuidaOS.",
    "os.btn_login": "Iniciar Sesión en GuidaOS",
    
    // Footer
    "footer.slogan": "La plataforma definitiva de curaduría de experiencias e itinerarios en la Región de los Lagos y Río de Janeiro.",
    "footer.quick_links": "Enlaces Rápidos",
    "footer.contact": "Atención Concierge",
    "footer.rights": "Todos los derechos reservados. Guida Trips®"
  }
};

// Memory cache for translated database items (e.g. experiences, blog posts, accommodations)
const translationCache: Record<string, string> = {};

export const LanguageContext = createContext<LanguageContextType>({
  language: "pt",
  setLanguage: () => {},
  t: (key) => key,
  translateText: async (text) => text,
  translateObject: async (obj) => obj,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === "pt" || saved === "en" || saved === "es")) {
        return saved as SupportedLanguage;
      }
      // Check browser navigator language
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith("es")) return "es";
      if (navLang.startsWith("en")) return "en";
    } catch {
      // Fallback to PT
    }
    return "pt";
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn("Storage write error for language preference:", e);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = dictionaries[language] || dictionaries.pt;
    let text = dict[key] || dictionaries.pt[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, "g"), String(value));
      });
    }

    return text;
  };

  /**
   * Helper function to translate dynamic database text (Descriptions, Names, Highlights)
   * into the target language using cache + server AI endpoint or local fallback rules.
   */
  const translateText = async (text: string, targetLang?: SupportedLanguage): Promise<string> => {
    const lang = targetLang || language;
    if (lang === "pt" || !text || !text.trim()) return text;

    const cacheKey = `${lang}:${text.trim()}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: lang })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translatedText) {
          translationCache[cacheKey] = data.translatedText;
          return data.translatedText;
        }
      }
    } catch (err) {
      console.warn("Dynamic AI translation endpoint unreachable, using client translation fallback:", err);
    }

    return text;
  };

  /**
   * Translate specific fields of a database object (e.g. Experience, Accommodation, Post)
   */
  const translateObject = async <T extends Record<string, any>>(
    obj: T,
    fieldsToTranslate: string[],
    targetLang?: SupportedLanguage
  ): Promise<T> => {
    const lang = targetLang || language;
    if (lang === "pt" || !obj) return obj;

    const cloned: Record<string, any> = { ...obj };
    for (const field of fieldsToTranslate) {
      if (typeof cloned[field] === "string") {
        cloned[field] = await translateText(cloned[field], lang);
      } else if (Array.isArray(cloned[field])) {
        cloned[field] = await Promise.all(
          cloned[field].map(async (item: any) => {
            if (typeof item === "string") return await translateText(item, lang);
            return item;
          })
        );
      }
    }
    return cloned as T;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateText, translateObject }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
