/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Compass, Check, ArrowRight, Play, Star, Sparkles, MapPin, 
  Smile, Heart, Gift, Users, Calendar, Trophy, ChevronRight, Send, HelpCircle, BookOpen, Hotel, Map, Coffee, Clipboard, Waves, Camera,
  Palmtree, Utensils, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Experience, BookingCartItem, GlobalSettings } from "../types";

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onAddToCart?: (item: BookingCartItem) => void;
  settings?: GlobalSettings;
  experiences?: Experience[];
  selectedHotelId?: string | null;
  onChangeHotelId?: (id: string | null) => void;
  stayDays?: number;
}

export default function HomeView({ 
  onNavigate, 
  onAddToCart, 
  settings, 
  experiences = [], 
  selectedHotelId = null, 
  onChangeHotelId,
  stayDays = 3
}: HomeViewProps) {
  const [activeCultureTab, setActiveCultureTab] = useState<"sabores" | "lounges" | "noite" | "nativismo">("sabores");
  const [showVideoLightbox, setShowVideoLightbox] = useState(false);

  // States of the micro-itinerary configurator drawer inside the homepage cards
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [configDay, setConfigDay] = useState<number>(1);
  const [configSchedule, setConfigSchedule] = useState<string>("");
  const [configAdults, setConfigAdults] = useState<number>(2);
  const [successNotifId, setSuccessNotifId] = useState<string | null>(null);

  // ALQUIMISTA DE ROTEIRO STATE (PREMIUM UX TOOL)
  const [alchemyStep, setAlchemyStep] = useState(1);
  const [alchemyWho, setAlchemyWho] = useState("");
  const [alchemyVibe, setAlchemyVibe] = useState("");
  const [alchemyShowSuccess, setAlchemyShowSuccess] = useState(false);

  // Guia Digital Download State
  const [guideName, setGuideName] = useState("");
  const [guideEmail, setGuideEmail] = useState("");
  const [guideDownloaded, setGuideDownloaded] = useState(false);

  // Map State
  const [mapCategory, setMapCategory] = useState<"todos" | "praias" | "mirantes" | "gastronomia">("todos");
  const [selectedMapPoint, setSelectedMapPoint] = useState<number | null>(0);

  const pillars = settings?.homeFilosofiaPillars?.length ? settings.homeFilosofiaPillars : [
    {
      id: "brinde",
      title: "Catering Gourmet a Bordo",
      desc: "Nossos barcos privativos contam com espumante gelado, tábua de queijos artesanais e frutas selecionadas para brindar os momentos dourados de felicidade.",
      img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80",
      badge: "🥂 CELEBRAÇÃO"
    },
    {
      id: "direcao",
      title: "Direção de Fotografia",
      desc: "Nossa equipe domina as marés, as melhores horas de luz e os ângulos secretos. Você foca em sorrir e sentir; nós eternizamos cada fração de segundo.",
      img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
      badge: "📸 RENDERIZAR AFETO"
    },
    {
      id: "concierge",
      title: "Concierge Individualizado",
      desc: "Decoramos suas preferências com antecedência: restrições de alimentação, mimos favoritos das crianças e assessoria fina para surpresas românticas ou aniversários.",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      badge: "✨ CARINHO HUMANO"
    },
    {
      id: "exclusividade",
      title: "Sossego Sem Aglomerações",
      desc: "Rotas táticas e saídas antecipadas programadas milimetricamente para aportar nas praias antes dos grandes barcos de massa barulhentos.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      badge: "🤫 PRIVACIDADE"
    }
  ];

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    praias: Palmtree,
    gastronomia: Utensils,
    experiencias: Compass,
    hospedagens: Hotel,
    noite: Moon,
    trilhas: Map,
    mergulho: Waves,
    sobre: BookOpen,
  };

  const categoryColors: Record<string, string> = {
    praias: "bg-[#0A2540]",
    gastronomia: "bg-[#E8711A]",
    experiencias: "bg-teal-700",
    hospedagens: "bg-[#0D1B2A]",
    noite: "bg-indigo-950",
    trilhas: "bg-emerald-800",
    mergulho: "bg-blue-900",
    sobre: "bg-amber-800"
  };

  const categories = (settings?.homeCategories?.length ? settings.homeCategories : [
    { id: "praias", label: "PRAIAS", count: "8 praias" },
    { id: "gastronomia", label: "GASTRONOMIA", count: "12 locais" },
    { id: "experiencias", label: "PASSEIOS", count: "6 aventuras" },
    { id: "hospedagens", label: "HOSPEDAGENS", count: "3 parceiras" },
    { id: "noite", label: "VIDA NOTURNA", count: "5 luas e bares" },
    { id: "trilhas", label: "TRILHAS", count: "4 segredos" },
    { id: "mergulho", label: "MERGULHO", count: "Capital Nacional" },
    { id: "sobre", label: "CULTURA LOCAL", count: "Nativismo puro" }
  ]).filter((c: any) => c && c.id).map((cat: any) => ({
    ...cat,
    color: categoryColors[cat.id] || "bg-[#E8711A]"
  }));

  const indexExperiences = [
    {
      id: "passeio-barco-premium",
      name: "Cruzeiro Náutico Premium — Ilha do Farol & Pontal",
      price: "120",
      rating: "5.0",
      reviews: "240",
      desc: "Navegação silenciosa com catering de bordo requintado, desembarque antecipado controlado e atenção calorosa.",
      img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80",
      badge: "O Mais Querido"
    },
    {
      id: "buggy-massambaba",
      name: "Expedição Buggy Off-Road — Dunas de Massambaba",
      price: "180",
      rating: "4.9",
      reviews: "158",
      desc: "Aventura pelas areias puras desbravando dunas gigantes, restingas protegidas e um pôr do sol inesquecível.",
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      badge: "Adrenalina Segura"
    },
    {
      id: "temporada-baleias-avistamento",
      name: "Safári Costeiro — Avistamento de Baleias Jubarte",
      price: "220",
      rating: "5.0",
      reviews: "92",
      desc: "Navegação respeitosa guiada por nossa bióloga marinha nas rotas migratórias entre Junho e Outubro.",
      img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
      badge: "De Temporada"
    }
  ];

  const mapPoints = [
    {
      id: 0,
      name: "Praia do Farol",
      category: "praias",
      desc: "A praia mais pura e perfeita do Brasil, com acesso rigorosamente controlado pela Marinha.",
      coords: { top: "45%", left: "30%" },
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 1,
      name: "Prainhas do Pontal",
      category: "praias",
      desc: "Cenário da inesquecível escadaria de madeira que se debruça sobre águas calmas e azuladas.",
      coords: { top: "60%", left: "42%" },
      img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Mirante do Pontal",
      category: "mirantes",
      desc: "Nossa encosta secreta para sintonizar o pôr do sol acompanhado de queijos regionais e espumante.",
      coords: { top: "72%", left: "55%" },
      img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Fenda de Nossa Senhora",
      category: "mirantes",
      desc: "Uma escultura geológica colossal de 40 metros de altura erguida em meio ao oceano aberto.",
      coords: { top: "30%", left: "20%" },
      img: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      name: "Bistrô Praia dos Anjos",
      category: "gastronomia",
      desc: "Cozinha ibero-americana com lula grelhada na brasa e peixes sustentáveis da ressurgência fresca.",
      coords: { top: "38%", left: "68%" },
      img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const testimonials = (settings?.homeFeedbackList?.length ? settings.homeFeedbackList : [
    {
      name: "Daniela Pinheiro & Noivo",
      city: "Rio de Janeiro - RJ",
      quote: "Eu queria um pedido de casamento surpresa perfeito nas dunas e a equipe da Guida estruturou TUDO. Montaram um lounge maravilhoso com velas, queijos e champanhe maravilhoso no Pontal e até contrataram fotógrafo para se disfarçar de turista! Sensacional!",
      role: "Momentos Especiais",
      avatar: "D"
    },
    {
      name: "Ricardo e Cláudia Lemos",
      city: "Campinas - SP",
      quote: "Viajamos com as crianças de 5 e 8 anos. O barco é limpíssimo, o colete das crianças coube perfeitamente e os marinheiros prepararam cortes de melancia bem gelada que as crianças devoraram após o mergulho. Foi o dia mais feliz de nossas férias!",
      role: "Fórmula de Família",
      avatar: "R"
    },
    {
      name: "Letícia Amaral",
      city: "Brasília - DF",
      quote: "Atendimento caloroso incrível. Não somos tratadas como meros bilhetes de turismo. Guida nos pegou na porta da pousada, nos deu dicas preciosas sobre horários e nos levou para jantar lulas na brasa. Esse afeto é o verdadeiro ouro!",
      role: "Aventura Curada",
      avatar: "L"
    }
  ]).filter((t: any) => t && t.name).map((t: any) => ({
    name: t.name,
    origin: t.city,
    text: t.quote,
    role: t.role,
    stars: 5,
    avatar: t.avatar || t.name[0]
  }));

  const defaultMimosTabs = {
    sabores: {
      title: "Sabores Que Unem E Celebram",
      text: "A nossa gastronomia abraça o seu paladar com frescor incomparável. Desfrute de espumantes selecionados de vinícolas de selo premiado, tábuas de frios rústicas, ceviche preparado na hora e deliciosos mimos regionais servidos sob a brisa morna do oceano.",
      badge: "🍽️ COMPOSIÇÃO ARTESANAL",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    },
    lounges: {
      title: "Piqueniques Sob a Luz Dourada",
      text: "Montamos lounges boutique com tapetes rústicos, almofadas macias e iluminação minimalista quente diretamente em mirantes ou praias reservadas. Uma experiência mágica de cinema para conversar, provar iguarias e desfrutar da melhor hora do pôr do sol com quem você mais ama.",
      badge: "✨ INSTALAÇÃO PRIVADA",
      img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    },
    noite: {
      title: "Luau Intimista & Noite sob Velas",
      text: "Ao entardecer, as estrelas tomam conta do cabo. Projetamos jantares privativos aconchegantes sob velas aromáticas flutuantes nas areias, harmonizados com vinhos finos de selo orgânico e o som rítmico das ondas quebrando suavemente na orla.",
      badge: "🌙 ENCONTROS NO DECK",
      img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    },
    nativismo: {
      title: "A Hospitalidade de Pura Alma",
      text: "Liderados por Guida, nossa equipe é composta por moradores apaixonados que respiram o destino. Nosso diferencial é a conexão humana verdadeira: recebemos você com sorrisos sinceros de braços abertos, contando causos divertidos de pescadores, lendas marítimas e segredos fascinantes.",
      badge: "🤝 CONEXÃO VERDADEIRA",
      img: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80",
    }
  };

  const experienceTabsContent = (() => {
    if (!settings?.homeMimosTabs?.length) {
      return defaultMimosTabs;
    }
    const tabsObj: any = {};
    settings.homeMimosTabs.filter((tab: any) => tab && tab.key).forEach((tab: any) => {
      tabsObj[tab.key] = {
        title: tab.title,
        text: tab.text,
        badge: tab.badge,
        img: tab.img
      };
    });
    return tabsObj as typeof defaultMimosTabs;
  })();

  // HELPER TO COMPUTE RECOMMENDED ENGINES FROM ALCHEMY
  const getAlchemyBundle = () => {
    let title = "Roteiro Conectado: Sol & Vento Leste";
    let desc = "Combinação de expedições náuticas e terrestres de forma fluida, programadas para contornar horários tumultuados.";
    let exps: { id: string; name: string }[] = [];

    if (alchemyVibe === "aventura") {
      title = "Expedição Força das Areias & Dunas";
      desc = "Dias intensos voltados para quem busca o balanço do buggy e as trilhas de massambaba em alta definição.";
      exps = [
        { id: "buggy-massambaba", name: "Expedição Buggy Off-Road — Dunas de Massambaba" },
        { id: "passeio-barco-premium", name: "Cruzeiro Náutico Premium — Ilha do Farol & Pontal" }
      ];
    } else if (alchemyVibe === "calmaria") {
      title = "Roteiro Brisa, Romance e Horizonte";
      desc = "Férias no ritmo da calmaria. Degustações ao sol poente, piqueniques em lounges de areia e banhos de mar lentos.";
      exps = [
        { id: "passeio-barco-premium", name: "Cruzeiro Náutico Premium — Ilha do Farol & Pontal" },
        { id: "gourmet-praia-dos-anjos", name: "Jantar Curado à Luz de Velas — Praia dos Anjos" }
      ];
    } else if (alchemyVibe === "mergulho") {
      title = "Imersão Ecológica Subaquática";
      desc = "Explore o mundo maravilhoso da ressurgência flutuando entre tartarugas com equipe individual consagrada.";
      exps = [
        { id: "batismo-mergulho-autonomo", name: "Batismo de Mergulho Autônomo — Capitânia Ecológica" },
        { id: "passeio-barco-premium", name: "Cruzeiro Náutico Premium — Ilha do Farol & Pontal" }
      ];
    } else {
      title = "Essência Clássica Guida Trips";
      desc = "Nossa recomendação master unindo o melhor dos dois mundos: buggy privativo e lancha exclusiva.";
      exps = [
        { id: "passeio-barco-premium", name: "Cruzeiro Náutico Premium — Ilha do Farol & Pontal" },
        { id: "buggy-massambaba", name: "Expedição Buggy Off-Road — Dunas de Massambaba" }
      ];
    }

    return { title, desc, exps };
  };

  const currentBundle = getAlchemyBundle();

  const handleApplyAlchemyBundle = () => {
    if (onAddToCart) {
      const today = new Date().toISOString().split("T")[0];
      currentBundle.exps.forEach((exp) => {
        onAddToCart({
          experienceId: exp.id,
          date: today,
          schedule: "08:30",
          adults: 2,
          children: 0,
          infants: 0,
          people: 2,
          observations: "Adicionado via Alquimista de Roteiro ✨",
          dayIndex: 1
        });
      });
      setAlchemyShowSuccess(true);
      setTimeout(() => {
        setAlchemyShowSuccess(false);
        setAlchemyStep(1);
        setAlchemyWho("");
        setAlchemyVibe("");
      }, 5500);
    }
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideName || !guideEmail) return;

    // Register lead in LocalStorage to mirror direct lead system
    try {
      const stored = localStorage.getItem("guidatrips_leads");
      const currentLeads = stored ? JSON.parse(stored) : [];
      const newLead = {
        id: `lead-digital-${Date.now()}`,
        name: guideName,
        phone: "Não fornecido (Guia Digital)",
        email: guideEmail,
        experienceInterest: ["guia-digital"],
        preferredDate: new Date().toISOString().split("T")[0],
        groupSize: 1,
        origin: "formulario" as const,
        status: "novo" as const,
        notes: ["Cliente baixou o Guia Digital 2026. Enviar e-mail marketing."],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem("guidatrips_leads", JSON.stringify([newLead, ...currentLeads]));
    } catch (e) {}

    setGuideDownloaded(true);
  };

  const filteredMapPoints = mapPoints.filter(
    (pt) => mapCategory === "todos" || pt.category === mapCategory
  );

  return (
    <div id="home-view" className="relative bg-[#FBF9F6]">
      
      {/* 1. SEÇÃO DE HERO EDITORIAL - COMPLEMENTANDO O FOCO SOCIAL E DE HISTÓRIAS DE PESSOAS FELIZES */}
      <section id="hero-premium" className="relative min-h-[92vh] flex items-center justify-center bg-[#0D1B2A] text-[#FBF9F6] overflow-hidden px-4 pt-16">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#E8711A]/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8711A]/10 border border-[#E8711A]/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#E8711A] animate-pulse" />
              <span className="font-accent text-[#E8711A] text-[9px] font-extrabold tracking-widest uppercase">
                O Diferencial Guida Trips
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              {settings?.diferencialTitle || "Arraial merece ser vivido, não apenas visitado."}
            </h1>
            
            <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg">
              {settings?.diferencialDescription || "Conectamos você ao melhor da Região dos Lagos através de experiências customizadas, hospitalidade de nativos e sorrisos reais que viram lembranças douradas de felicidade."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => onNavigate("wizard")}
                className="px-6 py-4 bg-[#E8711A] hover:bg-white text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase transition-all rounded shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <span>COMEÇA SEU ONBOARDING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onNavigate("wizard")}
                className="px-6 py-4 border border-white/20 hover:border-[#E8711A] text-white hover:text-[#E8711A] font-accent text-xs font-bold tracking-widest uppercase bg-transparent transition-colors rounded hover:bg-white/5 cursor-pointer"
              >
                ROTEIRO INTELIGENTE 🧭
              </button>
            </div>

            {/* Micro indicators */}
            <div className="flex items-center gap-6 pt-8 border-t border-white/10 max-w-md">
              <div>
                <span className="font-serif text-2xl font-bold text-[#E8711A]">5★</span>
                <span className="font-sans text-[10px] text-zinc-400 block uppercase tracking-wider">Acolhimento Humano</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div>
                <span className="font-serif text-2xl font-bold text-white">100%</span>
                <span className="font-sans text-[10px] text-zinc-400 block uppercase tracking-wider">Lanchas Privativas</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div>
                <span className="font-serif text-2xl font-bold text-white">Nativo</span>
                <span className="font-sans text-[10px] text-zinc-400 block uppercase tracking-wider">Amor pelo Território</span>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Elegant visual stack */}
            <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-lg overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] group">
              <img 
                src="https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&w=850&q=80" 
                alt="Moça rindo no pôr do sol em lancha no Pontal" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 filter contrast-105 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded text-left space-y-1.5 shadow-xl">
                <div className="flex gap-1 text-[#E8711A]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="font-sans text-xs italic text-white line-clamp-2">
                  "Ver o sol se deitar com espumante gelado longe de tumultos foi incomparável. Inesquecível!"
                </p>
                <span className="font-accent text-[9px] text-zinc-300 uppercase tracking-widest block font-bold">- ANA LUIZA, SP</span>
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border border-white/10 pointer-events-none flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <span className="font-accent text-[8px] tracking-[0.2em] text-white/40 uppercase">EXPERIÊNCIAS DE PURO AFETO &middot;</span>
            </div>
          </div>
        </div>

        {/* Scroll link */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 pointer-events-none text-xs text-white">
          <span className="font-accent text-[8px] tracking-widest uppercase">ROLE PARA DESCOBRIR</span>
          <div className="w-4 h-7 rounded-full border border-white/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-[#E8711A] rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* 2. O QUE FAZ A GUIDA TRIPS DIFERENTE (Section tracing why she is special) */}
      <section id="features-afeto" className="py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
                {settings?.homeFilosofiaTag || "01 / FILOSOFIA DE EXPERIÊNCIA"}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                {settings?.homeFilosofiaTitle || "A felicidade não está na pressa. Está no afeto."}
              </h2>
              <div className="h-0.5 w-16 bg-[#E8711A] my-4"></div>
              <p className="font-sans text-sm text-[#5C6874] leading-relaxed">
                {settings?.homeFilosofiaDesc || "As agências tradicionais empilham dezenas de turistas em barcos barulhentos para paradas rápidas e frias. A Guida Trips preza pelo valor do seu tempo. Desenhamos cada trajeto para ser uma sutil partilha de sentimentos, risos e sossego real."}
              </p>
              
              {/* Video play badge */}
              <div className="pt-6">
                <button
                  onClick={() => setShowVideoLightbox(true)}
                  className="inline-flex items-center gap-3 group text-left"
                >
                  <span className="w-12 h-12 bg-[#0D1B2A] text-white hover:bg-[#E8711A] hover:text-[#0D1B2A] transition-all rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </span>
                  <div>
                    <span className="font-accent text-[11px] font-bold text-[#0D1B2A] tracking-wider uppercase block group-hover:text-[#E8711A] transition-colors">
                      {settings?.homeFilosofiaVideoTitle || "ASSISTA O DOCUMENTÁRIO"}
                    </span>
                    <span className="font-sans text-[11px] text-zinc-400">
                      {settings?.homeFilosofiaVideoSub || "Sinta o clima real de nossos passeios (3 min)"}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              {pillars.filter((pil: any) => pil && pil.title).map((pil: any) => (
                <div 
                  key={pil.id} 
                  className="bg-[#FBF9F7] border border-zinc-200 rounded p-6 shadow-sm hover:shadow-md hover:border-[#0D1B2A]/20 transition-all duration-300 space-y-3"
                >
                  <span className="font-accent text-[8px] text-[#E8711A] font-extrabold tracking-widest block">{pil.badge}</span>
                  <h3 className="font-serif text-base font-bold text-[#0D1B2A]">{pil.title}</h3>
                  <p className="font-sans text-xs text-[#5C6874] leading-relaxed">{pil.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. BENTO GRID CATEGORY NAVIGATOR (8 elements grid that user requested) */}
      <section id="bento-angles" className="py-24 bg-[#FBF9F6] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
              {settings?.homeCompassTag || "02 / COMPASS MAP"}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
              {settings?.homeCompassTitle || "Descubra Arraial de todos os ângulos"}
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
            <p className="font-sans text-xs sm:text-sm text-[#5C6874] leading-relaxed">
              {settings?.homeCompassDesc || "Clique em nossas gavetas de curadoria para desbravar o cabo de acordo com a sua preferência pessoal."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
            {categories.map((cat, idx) => {
              const IconComponent = categoryIcons[cat.id] || Compass;
              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(cat.id)}
                  className="group relative bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-2.5 xs:p-4 sm:p-6 flex flex-col justify-between items-start cursor-pointer transition-all duration-300 hover:border-[#E8711A] hover:shadow-[0_12px_30px_rgba(232,113,26,0.06)] hover:-translate-y-1 text-left h-28 xs:h-32 sm:h-40 md:h-44"
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="p-1.5 xs:p-2 sm:p-3.5 bg-[#FAF8F5] text-zinc-700 group-hover:bg-[#E8711A]/10 group-hover:text-[#E8711A] rounded-lg sm:rounded-xl transition-all duration-300">
                      <IconComponent className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 stroke-[2]" />
                    </div>
                    <span className="w-5 h-5 xs:w-6 h-6 sm:w-7 h-7 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-650 flex items-center justify-center text-[8px] xs:text-xs font-bold group-hover:bg-[#E8711A] group-hover:text-white group-hover:border-[#E8711A] transition-all duration-300">
                      &rarr;
                    </span>
                  </div>
                  
                  <div className="w-full">
                    <span className="font-accent text-[8px] sm:text-[9px] text-zinc-400 font-bold block mb-0.5 sm:mb-1">0{idx + 1}</span>
                    <h3 className="font-serif text-[10px] xs:text-xs sm:text-base md:text-lg font-extrabold text-[#0D1B2A] tracking-tight group-hover:text-[#E8711A] transition-colors leading-tight truncate sm:whitespace-normal">
                      {cat.label}
                    </h3>
                    <span className="font-sans text-[8px] xs:text-[9px] sm:text-xs text-zinc-400 block mt-0.5 sm:mt-1 tracking-wide">
                      {cat.count} Curados
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. NOSSA SELEÇÃO DE EXPERIÊNCIAS CORES (Happy people + detailed pricing slides) */}
      <section id="experiences-showcase" className="py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div className="text-left space-y-3">
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
                03 / EXPERIÊNCIAS EM GRUPO OU PRIVATIVO
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                Nossa seleção de experiências
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(() => {
              const activeExps = experiences && experiences.length > 0
                ? experiences.filter((e) => e.status === "active").slice(0, 3)
                : [
                    {
                      id: "passeio-barco-premium",
                      name: "Cruzeiro Náutico Premium — Ilha do Farol & Pontal",
                      priceFrom: 120,
                      duration: "4 horas",
                      shortDescription: "Navegação silenciosa com catering de bordo requintado, desembarque antecipado controlado e atenção calorosa.",
                      photos: ["https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80"],
                      badge: "O Mais Querido",
                      location: "Arraial do Cabo",
                      schedules: ["08:00", "12:30"]
                    } as unknown as Experience,
                    {
                      id: "buggy-massambaba",
                      name: "Expedição Buggy Off-Road — Dunas de Massambaba",
                      priceFrom: 180,
                      duration: "3h30",
                      shortDescription: "Aventura pelas areias puras desbravando dunas gigantes, restingas protegidas e um pôr do sol inesquecível.",
                      photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"],
                      badge: "Adrenalina Segura",
                      location: "Arraial do Cabo",
                      schedules: ["09:00", "14:00"]
                    } as unknown as Experience,
                    {
                      id: "temporada-baleias-avistamento",
                      name: "Safári Costeiro — Avistamento de Baleias Jubarte",
                      priceFrom: 220,
                      duration: "3 horas",
                      shortDescription: "Navegação respeitosa guiada por nossa bióloga marinha nas rotas migratórias entre Junho e Outubro.",
                      photos: ["https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"],
                      badge: "De Temporada",
                      location: "Arraial do Cabo",
                      schedules: ["07:30", "11:30"]
                    } as unknown as Experience
                  ];

              return activeExps.map((item) => {
                const isConfiguring = activeConfigId === item.id;
                const showSuccess = successNotifId === item.id;
                const itemSchedules = item.schedules && item.schedules.length > 0 ? item.schedules : ["08:00", "14:00"];
                const itemBadgeText = item.badge === "mais-vendido" ? "🔥 Mais Vendido" : item.badge === "novidade" ? "✨ Novidade" : item.badge === "temporada" ? "🐋 Temporada" : item.badge || "Recomendado";
                const itemPhoto = item.photos && item.photos.length > 0 ? item.photos[0] : "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80";

                return (
                  <div 
                    key={item.id}
                    className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(13,27,42,0.04)] hover:border-[#E8711A]/20 transition-all duration-300 group relative"
                  >
                    {/* Upper content */}
                    <div>
                      {/* Image Composition */}
                      <div className="h-60 relative overflow-hidden">
                        <img 
                          src={itemPhoto} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-95"
                        />
                        {itemBadgeText && (
                          <span className="absolute top-4 left-4 bg-[#E8711A] text-[#0D1B2A] font-accent text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1.5 rounded-sm shadow">
                            {itemBadgeText}
                          </span>
                        )}
                        <span className="absolute bottom-4 left-4 bg-[#0D1B2A]/90 backdrop-blur-xs text-white font-accent text-[9px] px-2.5 py-1.5 rounded-sm font-bold shadow">
                          📍 {item.location || "Arraial do Cabo"}
                        </span>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#0D1B2A] font-accent text-[10px] font-bold px-2.5 py-1.5 rounded-sm flex items-center gap-1 shadow">
                          <Star className="w-3.5 h-3.5 fill-[#E8711A] text-[#E8711A]" />
                          <span>5.0</span>
                        </div>
                      </div>

                      {/* Info and State Pane toggles */}
                      <div className="p-6 text-left min-h-[160px] relative">
                        <AnimatePresence mode="wait">
                          {showSuccess ? (
                            <motion.div 
                              key="success"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-3 py-2 text-center"
                            >
                              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 flex items-center justify-center mx-auto">
                                <Check className="w-5 h-5 stroke-[3]" />
                              </div>
                              <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Sua felicidade está agendada!</h4>
                              <p className="font-sans text-[11px] text-[#5C6874]">
                                O roteiro inteligente reservou a experiência com sucesso.
                              </p>
                              <div className="flex gap-2 pt-1 justify-center">
                                <button 
                                  onClick={() => onNavigate("roteiro")}
                                  className="px-3 py-1.5 bg-[#0D1B2A] text-white text-[9px] font-accent font-extrabold tracking-wider uppercase rounded-sm cursor-pointer hover:bg-[#E8711A]"
                                >
                                  Ver Meu Roteiro
                                </button>
                                <button 
                                  onClick={() => setSuccessNotifId(null)}
                                  className="px-3 py-1.5 bg-zinc-100 text-zinc-500 text-[9px] font-accent font-extrabold tracking-wider uppercase rounded-sm cursor-pointer hover:bg-zinc-200"
                                >
                                  Fechar
                                </button>
                              </div>
                            </motion.div>
                          ) : isConfiguring ? (
                            <motion.div 
                              key="config"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="space-y-3 py-1 text-left"
                            >
                              <span className="font-accent text-[8px] text-[#E8711A] font-extrabold tracking-widest uppercase block mb-1">
                                📝 CONFIGURAÇÃO DETALHADA NO ROTEIRO:
                              </span>
                              
                              {/* Selection of day */}
                              <div>
                                <label className="font-accent text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                                  Qual Dia Curado?
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                  {Array.from({ length: stayDays }).map((_, i) => {
                                    const dNum = i + 1;
                                    return (
                                      <button
                                        key={dNum}
                                        type="button"
                                        onClick={() => setConfigDay(dNum)}
                                        className={`w-6 h-6 rounded font-sans text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                          configDay === dNum 
                                            ? "bg-[#0D1B2A] text-white" 
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        }`}
                                      >
                                        D{dNum}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Selection of schedule & people */}
                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                  <label className="font-accent text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                    Horário de Início:
                                  </label>
                                  <select
                                    value={configSchedule || itemSchedules[0]}
                                    onChange={(e) => setConfigSchedule(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-250 p-1.5 text-[11px] font-sans font-medium text-[#0D1B2A] rounded focus:outline-none"
                                  >
                                    {itemSchedules.map((sch) => (
                                      <option key={sch} value={sch}>{sch}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="font-accent text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                    Integrantes (Pax):
                                  </label>
                                  <div className="flex items-center gap-2 border border-zinc-250 rounded bg-zinc-50 p-1">
                                    <button 
                                      type="button"
                                      onClick={() => setConfigAdults(Math.max(1, configAdults - 1))}
                                      className="px-1.5 py-0.5 bg-white border border-zinc-200 font-bold hover:bg-zinc-100 text-[#0D1B2A] rounded-sm text-xs cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="text-xs font-sans font-bold text-[#0D1B2A] flex-grow text-center">{configAdults}</span>
                                    <button 
                                      type="button"
                                      onClick={() => setConfigAdults(configAdults + 1)}
                                      className="px-1.5 py-0.5 bg-white border border-zinc-200 font-bold hover:bg-zinc-100 text-[#0D1B2A] rounded-sm text-xs cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Form submit/cancel actions */}
                              <div className="flex gap-2 pt-2 scroll-mt-2 font-accent text-[9px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const today = new Date();
                                    const targetDate = new Date(today);
                                    targetDate.setDate(today.getDate() + (configDay - 1));
                                    const dateStr = targetDate.toISOString().split("T")[0];

                                    onAddToCart?.({
                                      experienceId: item.id,
                                      date: dateStr,
                                      schedule: configSchedule || itemSchedules[0],
                                      adults: configAdults,
                                      children: 0,
                                      infants: 0,
                                      people: configAdults,
                                      observations: "Adicionado via Home rápida",
                                      dayIndex: configDay
                                    });

                                    setSuccessNotifId(item.id);
                                    setActiveConfigId(null);
                                  }}
                                  className="flex-1 py-1.5 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
                                >
                                  CONFIRMAR ✔
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveConfigId(null)}
                                  className="px-3 py-1.5 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
                                >
                                  CANCELAR
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="default"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-2 text-left"
                            >
                              <div className="flex items-center justify-between text-[10px] font-accent text-zinc-400 font-bold uppercase tracking-wider">
                                <span>⏱ Duração: {item.duration || "3-4 horas"}</span>
                                <span className="text-[#E8711A]">⭐ Altíssima Nível</span>
                              </div>
                              <h3 className="font-serif text-lg font-bold text-[#0D1B2A] hover:text-[#E8711A] transition-colors leading-snug">
                                {item.name}
                              </h3>
                              <p className="font-sans text-xs text-[#5C6874] leading-relaxed line-clamp-3">
                                {item.shortDescription || item.fullDescription}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Lower pricing & customized dual bookings option action bar */}
                    <div className="p-6 border-t border-zinc-150 bg-[#FBFBFB] flex flex-col sm:flex-row items-center justify-between gap-4 font-accent">
                      <div className="text-left w-full sm:w-auto">
                        <span className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block font-bold">VALOR DO PASSEIO</span>
                        <span className="font-serif text-sm font-bold text-[#0D1B2A]">
                          A partir de <strong className="text-[#E8711A] text-base">R$ {item.priceFrom}</strong>
                        </span>
                      </div>

                      {!isConfiguring && !showSuccess && (
                        <div className="flex w-full sm:w-auto gap-2">
                          {/* Option 1: Adicionar ao Roteiro */}
                          <button
                            onClick={() => {
                              setConfigDay(1);
                              setConfigSchedule(itemSchedules[0]);
                              setConfigAdults(2);
                              setActiveConfigId(item.id);
                            }}
                            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-zinc-50 text-[#0D1B2A] border border-zinc-200 font-accent text-[10px] font-extrabold tracking-widest uppercase transition-colors rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                            title="Personalize e inclua no seu roteiro inteligente do site"
                          >
                            <span>➕</span> Incluir no meu Roteiro
                          </button>

                          {/* Option 2: Direct book via WhatsApp (Skips the smart itinerary) */}
                          <a
                            href={`https://wa.me/${(settings?.whatsappNumber || "552299887766").replace(/\D/g, "")}?text=${encodeURIComponent(`Olá, Guida Trips! Gostaria de agendar o passeio *${item.name}* diretamente de forma avulsa, sem utilizar o roteiro inteligente. Quais datas e horários vocês recomendam?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-accent text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 rounded-xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm"
                            title="Agende diretamente via WhatsApp sem passar pelo roteiro"
                          >
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.263 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.642.974 3.255 1.511 4.75 1.516 5.31.002 9.533-4.223 9.536-9.426.002-2.522-.98-4.893-2.766-6.679A9.324 9.324 0 0 0 12.009 1.83C6.702 1.83 2.38 6.155 2.378 11.46c0 1.637.451 3.232 1.309 4.63l-.994 3.635 3.73-.978l-.376-.233zm11.536-5.183c-.303-.151-1.792-.883-2.073-.984-.282-.102-.487-.151-.692.151-.204.303-.79.984-.968 1.186-.179.203-.358.227-.661.076-1.554-.778-2.656-1.353-3.714-3.172-.279-.481.279-.446.797-1.478.087-.179.044-.336-.022-.487-.066-.151-.57-1.373-.78-1.88-.204-.492-.448-.423-.615-.432-.158-.008-.34-.01-.522-.01s-.477.068-.727.342c-.25.274-.954.933-.954 2.274s.974 2.637 1.11 2.822c.137.185 1.917 2.927 4.644 4.103 1.648.71 2.503.784 3.298.666.864-.13 1.792-.733 2.043-1.41.25-.677.25-1.258.175-1.41-.074-.153-.28-.25-.583-.4z"/>
                            </svg>
                            Reservar Direto
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE TRIP CONCEPT ENGINE: O ALQUIMISTA DE VIAGENS (THE EXPERIENTIAL CORE OF A PREMIUM SITE) */}
      <section 
        id="alquimista-roteiro" 
        className="py-24 bg-[#FBF9F6] border-y border-zinc-200 scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8711A]/5 rounded-full border border-[#E8711A]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#E8711A]" />
              <span className="font-accent text-[#0D1B2A] text-[9px] font-extrabold tracking-widest uppercase">
                O Alquimista de Viagens &mdash; Concierge Virtual
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0D1B2A] tracking-tight">
              Monte Seu Roteiro Ideal em 10 Segundos
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5C6874] max-w-md mx-auto">
              Selecione as suas preferências abaixo e nosso sistema concierge irá compor as expedições perfeitas para as suas férias integradas.
            </p>
          </div>

          <div className="bg-white border border-zinc-205 rounded-lg p-6 sm:p-10 shadow-[0_8px_30px_rgba(13,27,42,0.03)] text-[#0D1B2A]">
            
            <AnimatePresence mode="wait">
              {/* ALCHEMY SUCCESS NOTIFICATION */}
              {alchemyShowSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">Roteiro Adicionado!</h3>
                  <p className="font-sans text-sm text-[#5C6874] max-w-md mx-auto">
                    Excelente escolha! As experiências recomendadas foram adicionadas ao seu painel <strong>"Meu Roteiro"</strong>. Abra-o no menu superior para conectar-se com nosso atendimento no WhatsApp!
                  </p>
                </motion.div>
              ) : (
                <motion.div key="steps" className="space-y-8">
                  {/* STEP TABS FOR PROGRESS */}
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                    <span className="font-accent text-[9px] font-extrabold tracking-widest uppercase">
                      Passo {alchemyStep} de 3
                    </span>
                    <div className="flex gap-2">
                      <span className={`w-6 h-1.5 rounded-full ${alchemyStep >= 1 ? "bg-[#0D1B2A]" : "bg-zinc-200"}`} />
                      <span className={`w-6 h-1.5 rounded-full ${alchemyStep >= 2 ? "bg-[#0D1B2A]" : "bg-zinc-200"}`} />
                      <span className={`w-6 h-1.5 rounded-full ${alchemyStep >= 3 ? "bg-[#0D1B2A]" : "bg-zinc-200"}`} />
                    </div>
                  </div>

                  {/* ACTIVE STEP CONTENT */}
                  {alchemyStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-serif text-lg font-bold">Quem vai viver esses dias de felicidade com você?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { id: "solo", label: "Apenas Eu 🚶", desc: "Contemplação, silêncio & fotos lindas" },
                          { id: "casal", label: "Casal Romântico 👩‍❤️‍👨", desc: "Brindes de champanhe e piqueniques" },
                          { id: "grupo", label: "Família / Amigos 👨‍👩‍👧‍👦", desc: "Velocidade de lancha, buggy e festa" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setAlchemyWho(opt.id);
                              setAlchemyStep(2);
                            }}
                            className={`p-5 rounded border text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                              alchemyWho === opt.id 
                                ? "bg-zinc-50 border-[#0D1B2A] shadow-md ring-2 ring-[#0D1B2A]/5" 
                                : "bg-white border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <h4 className="font-sans text-xs font-bold uppercase tracking-wider">{opt.label}</h4>
                            <p className="font-sans text-[11px] text-[#5C6874] mt-1">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {alchemyStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-serif text-lg font-bold">Qual é o estilo ideal de expedição hoje?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { id: "aventura", label: "Aventura & Adrenalina 🚙", desc: "Buggy pelas dunas de Massambaba" },
                          { id: "calmaria", label: "Contemplação & Brisa ⛵", desc: "Passeio privativo e mar no pôr do sol" },
                          { id: "mergulho", label: "Exploração Marinha 🐠", desc: "Mergulho de batismo com tartarugas" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setAlchemyVibe(opt.id);
                              setAlchemyStep(3);
                            }}
                            className={`p-5 rounded border text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                              alchemyVibe === opt.id 
                                ? "bg-zinc-50 border-[#0D1B2A] shadow-md ring-2 ring-[#0D1B2A]/5" 
                                : "bg-white border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <h4 className="font-sans text-xs font-bold uppercase tracking-wider">{opt.label}</h4>
                            <p className="font-sans text-[11px] text-[#5C6874] mt-1">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setAlchemyStep(1)} 
                        className="text-xs font-accent font-bold text-zinc-400 hover:text-[#0D1B2A] mt-2 block"
                      >
                        &larr; Voltar
                      </button>
                    </motion.div>
                  )}

                  {alchemyStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2 text-left">
                        <span className="font-accent text-[9px] text-[#E8711A] font-extrabold tracking-widest uppercase">
                          SUGESTÃO DA CONCIERGE GUIDA
                        </span>
                        <h4 className="font-serif text-xl font-bold text-[#0D1B2A]">{currentBundle.title}</h4>
                        <p className="font-sans text-xs text-[#5C6874] leading-relaxed">{currentBundle.desc}</p>
                      </div>

                      <div className="bg-[#FBF9F7] rounded border border-zinc-200 p-5 space-y-3">
                        <span className="font-accent text-[8px] text-zinc-400 font-bold uppercase tracking-[0.15em] block text-left">
                          EXPEDIÇÕES RECOMENDADAS PARA RESERVA INTEGRAL:
                        </span>
                        {currentBundle.exps.map((e, index) => (
                          <div key={e.id} className="flex items-center gap-3 py-2 border-b border-zinc-150 last:border-0 text-left">
                            <span className="w-5 h-5 rounded-full bg-[#E8711A]/10 text-[#E8711A] font-accent text-[10px] font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-serif text-xs sm:text-sm font-bold text-[#0D1B2A]">{e.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button
                          onClick={handleApplyAlchemyBundle}
                          className="w-full sm:flex-1 py-4 text-center bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase rounded cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          ✨ ADICIONAR COMBO AO MEU ROTEIRO
                        </button>
                        <button
                          onClick={() => setAlchemyStep(2)}
                          className="w-full sm:w-auto py-4 px-6 border border-zinc-200 hover:border-[#0D1B2A] text-zinc-500 hover:text-[#0D1B2A] font-accent text-xs font-extrabold uppercase tracking-widest rounded"
                        >
                          Mudar Vibe
                        </button>
                      </div>
                    </motion.div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* 6. PRAIA DO FORNO HIGHLIGHT SECTION WITH INDICATION AND LUXURY MARGINS */}
      <section id="forno-highlight" className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings?.homeBannerImgUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"} 
            alt="Praia do Forno, águas límpidas de ressurgência" 
            className="w-full h-full object-cover object-center filter brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 via-transparent to-[#0D1B2A]/80"></div>
        </div>

        <div className="relative z-10 max-w-2xl px-4 space-y-4 text-white">
          <span className="font-accent text-[#E8711A] text-xs font-extrabold tracking-[0.25em] uppercase block">
            {settings?.homeBannerTag || "📍 PONTO RETRO-ACLAMADO"}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#F4EFE6] tracking-tight leading-tight">
            {settings?.homeBannerTitle || "Mergulhe no silêncio da Praia do Forno."}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg mx-auto">
            {settings?.homeBannerDesc || "Abraçada por mata virgem e penhascos de pedra, as águas esmeraldas dão abrigo natural a tartarugas gigantes e corais ornamentais. Nossos barcos aportam na orla silenciosamente para que você nade em pura sintonia."}
          </p>
          
          <div className="pt-4">
            <button 
              onClick={() => onNavigate("destino")}
              className="px-6 py-3 bg-[#E8711A] text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase hover:bg-white rounded transition-colors shadow-lg"
            >
              {settings?.homeBannerBtnText || "Ler Guia de Praias"} &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 7. ALÉM DO ÓBVIO (Bright Editorial Tabs) */}
      <section id="secao-cultural" className="py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-accent text-[#0D1B2A]/60 text-xs font-bold tracking-widest uppercase block mb-1">
              {settings?.homeMimosTag || "04 / Detalhes Que Tornam Único"}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight">
              {settings?.homeMimosTitle || "Os mimos que você só encontra aqui."}
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto mt-4"></div>
            <p className="font-sans text-sm text-[#5C6874] mt-3">
              {settings?.homeMimosDesc || "Não fazemos turismo padrão de massa. Fornecemos encontros customizados regados a carinho e mimos artesanais."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Categorias Tabs à esquerda (4 colunas) */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              {(Object.keys(experienceTabsContent) as Array<keyof typeof experienceTabsContent>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveCultureTab(key)}
                  className={`px-6 py-4 rounded border text-left font-accent text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                    activeCultureTab === key
                      ? "bg-[#0D1B2A] border-[#0D1B2A] text-white shadow-md -translate-x-1"
                      : "bg-[#FBF9F7] border-zinc-200 text-[#5C6874] hover:bg-white hover:border-[#0D1B2A] hover:text-[#0D1B2A]"
                  }`}
                >
                  <span className="mr-2">
                    {key === "sabores" && "🍽️"}
                    {key === "lounges" && "✨"}
                    {key === "noite" && "🌙"}
                    {key === "nativismo" && "🤝"}
                  </span>
                  {key === "sabores" && "SABORES DO AFETO"}
                  {key === "lounges" && "LOUNGES EXCLUSIVOS"}
                  {key === "noite" && "LUAU SOB AS ESTRELAS"}
                  {key === "nativismo" && "ACOLHIMENTO AMIGO"}
                </button>
              ))}
            </div>

            {/* Conteúdo Tab Dinâmico à direita (8 colunas) */}
            <div className="lg:col-span-8 bg-[#FBF9F6] border border-zinc-200 rounded p-8 flex flex-col md:flex-row gap-8 items-center h-auto md:h-[350px]">
              <div className="flex-1 space-y-4 text-left">
                <span className="font-accent text-[#E8711A] text-[9px] font-extrabold tracking-widest block">
                  {experienceTabsContent[activeCultureTab].badge}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0D1B2A]">
                  {experienceTabsContent[activeCultureTab].title}
                </h3>
                <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                  {experienceTabsContent[activeCultureTab].text}
                </p>
                <button
                  onClick={() => onNavigate("experiencias")}
                  className="font-accent text-xs font-bold text-[#E8711A] hover:text-[#0D1B2A] transition-colors uppercase tracking-widest flex items-center gap-1"
                >
                  Desejo Agendar este de Boas-Vindas &rarr;
                </button>
              </div>

              <div className="w-full md:w-[280px] h-[200px] md:h-full shrink-0 relative overflow-hidden rounded shadow-sm border border-zinc-200">
                <img 
                  src={experienceTabsContent[activeCultureTab].img} 
                  alt={experienceTabsContent[activeCultureTab].title} 
                  className="w-full h-full object-cover filter brightness-[0.97]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. GUIA DO VIAJANTE (Traveler's Editorial layout with Flatlay accessories) */}
      <section id="traveler-guide" className="py-24 bg-[#FBF9F6] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Esquerda: Flat Lay composition */}
            <div className="lg:col-span-5 relative h-[38vh] sm:h-[50vh] rounded-lg overflow-hidden border border-zinc-200 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80" 
                alt="Chapéu de palha, conchas e óculos de sol na areia de Arraial" 
                className="w-full h-full object-cover filter brightness-95 text-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <span className="absolute bottom-6 left-6 font-accent text-xs text-white font-bold tracking-widest uppercase flex items-center gap-1">
                <Compass className="w-4 h-4 text-[#E8711A] animate-pulse" /> PREPARE OS SEUS DIAS
              </span>
            </div>

            {/* Direita: Essential guide points */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
                {settings?.homeLogisticaTag || "05 / GUIA DE LOGÍSTICA COMPLETA"}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                {settings?.homeLogisticaTitle || "Planeje sem imprevistos."}
              </h2>
              <p className="font-sans text-sm text-[#5C6874] leading-relaxed">
                {settings?.homeLogisticaDesc || "Reunimos as coordenadas mais estratégicas de quem é nascido e criado no mar de Arraial. Entenda as marés, distâncias e como tirar 100% proveito de suas memórias douradas."}
              </p>

              <div className="space-y-4">
                {(settings?.homeLogisticaPoints?.length ? settings.homeLogisticaPoints : [
                  {
                    title: "Como Chegar em Conforto",
                    desc: "Arraial fica a 165km do Rio. Oferecemos opções sob medida de transfer executivo corporativo porta-a-porta partindo dos aeroportos rústicos da capital diretamente para a sua pousada curada."
                  },
                  {
                    title: "A Melhor Época de Ventos",
                    desc: "O sol brilha o ano todo. Para águas com nitidez mística extrema de reflexos azulados, indicamos os meses de Março a Junho, onde a calmaria de ventos sintoniza mar cristalino."
                  },
                  {
                    title: "O Que Trazer na Mochila",
                    desc: "Traga bonés leves, protetor solar mineral (pelo zelo ecológico da fauna de restinga) e claro: óculos de mergulho para fitar cavalos-marinhos e siris coloridos."
                  }
                ]).filter((item: any) => item && item.title).map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start border-b border-zinc-200 pb-4 last:border-0 last:pb-0">
                    <span className="font-serif text-lg font-bold text-[#E8711A] bg-zinc-100 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold text-[#0D1B2A]">{item.title}</h4>
                      <p className="font-sans text-xs text-[#5C6874] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. MAPA INTERATIVO DESIGN COMPONENT (Points of interest map mock) */}
      <section id="interactive-map" className="py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
              06 / ANCHOR MOCKUP MAP
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
              Mapeamos o Paraíso para Você
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5C6874] max-w-md mx-auto">
              Sintonize os pontos geográficos e de gastronomia que fazem parte de nossas saídas privativas. Clique nos pinos flutuantes para desvelar segredos táticos.
            </p>

            {/* Sub-selectors */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                { id: "todos", label: "TODOS" },
                { id: "praias", label: "PRAIAS CORES" },
                { id: "mirantes", label: "ANGULOS & SUNSET" },
                { id: "gastronomia", label: "SABORES DO DIA" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    setMapCategory(btn.id as any);
                    setSelectedMapPoint(null);
                  }}
                  className={`px-4 py-2 border rounded font-accent text-[10px] font-bold tracking-widest transition-all ${
                    mapCategory === btn.id
                      ? "bg-[#0D1B2A] border-[#0D1B2A] text-white shadow-sm"
                      : "bg-[#FBF9F7] text-[#5C6874] border-zinc-200 hover:border-[#0D1B2A]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Map Frame Area (7 columns) */}
            <div className="lg:col-span-7 bg-[#E8EFF5] border border-zinc-200 rounded-lg relative min-h-[400px] overflow-hidden flex items-center justify-center shadow-inner">
              {/* Artistic Ocean Pattern Background */}
              <div className="absolute inset-0 bg-[#A4C3D2] opacity-35 pointer-events-none"></div>
              
              {/* Landmass shapes (pure stylized Tailwind polygons) */}
              <div className="absolute top-2 left-6 w-[250px] h-[180px] bg-[#EBE5C8]/80 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute bottom-4 right-10 w-[300px] h-[250px] bg-[#DFD9B6] rounded-full blur-2xl pointer-events-none"></div>
              
              {/* Anchor Compass Graphic */}
              <div className="absolute top-6 right-6 border border-[#0D1B2A]/10 rounded-full p-3 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md opacity-80 pointer-events-none">
                <Compass className="w-6 h-6 text-[#E8711A] animate-[spin_120s_linear_infinite]" />
                <span className="font-accent text-[8px] text-[#0D1B2A] font-bold mt-1 tracking-widest">N &uarr;</span>
              </div>

              {/* Pulsing Coordinates Grid Lines */}
              <div className="absolute inset-0 border-y border-[#0D1B2A]/5 border-dashed pointer-events-none"></div>
              <div className="absolute inset-y-0 left-1/3 border-x border-[#0D1B2A]/5 border-dashed pointer-events-none"></div>
              <div className="absolute inset-y-0 left-2/3 border-x border-[#0D1B2A]/5 border-dashed pointer-events-none"></div>

              {/* Interactive map pins */}
              {filteredMapPoints.map((pt) => {
                const isSelected = selectedMapPoint === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedMapPoint(pt.id)}
                    style={{ top: pt.coords.top, left: pt.coords.left }}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group outline-none"
                  >
                    <span className="relative flex h-10 w-10 items-center justify-center">
                      {/* Pulse Circle */}
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${
                        pt.category === "praias" ? "bg-teal-500" : pt.category === "mirantes" ? "bg-[#E8711A]" : "bg-[#0D1B2A]"
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center border-2 border-white shadow-md transition-transform duration-300 ${
                        isSelected ? "scale-120 shadow-xl bg-amber-500 text-white" : "bg-[#0d1b2a] text-white hover:scale-110"
                      }`}>
                        {pt.category === "praias" && "🏖️"}
                        {pt.category === "mirantes" && "🌅"}
                        {pt.category === "gastronomia" && "🍽️"}
                      </span>
                    </span>
                    {/* Tiny visual Label */}
                    <span className={`absolute top-full left-1/2 transform -translate-x-1/2 bg-[#0D1B2A] text-[#FBF9F6] text-[9px] font-accent tracking-widest uppercase px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-80"
                    }`}>
                      {pt.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Info Drawer Area (5 columns) */}
            <div className="lg:col-span-5 bg-[#FBF9F7] border border-zinc-200 rounded-lg p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm">
              <AnimatePresence mode="wait">
                {selectedMapPoint !== null ? (
                  <motion.div
                    key={selectedMapPoint}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Media content */}
                    <div className="h-44 rounded-sm overflow-hidden border border-zinc-250 relative">
                      <img 
                        src={mapPoints[selectedMapPoint].img} 
                        alt={mapPoints[selectedMapPoint].name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 bg-[#0D1B2A] text-white text-[8px] font-accent font-bold tracking-widest uppercase px-2 py-1 rounded">
                        {mapPoints[selectedMapPoint].category.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-serif text-xl font-bold text-[#0D1B2A]">
                        {mapPoints[selectedMapPoint].name}
                      </h4>
                      <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                        {mapPoints[selectedMapPoint].desc}
                      </p>
                    </div>

                    <div className="bg-white border border-zinc-150 p-3 rounded text-[10px] sm:text-xs font-sans text-zinc-500 leading-tight">
                      ⛵ <strong>Dica do Guia do Mar:</strong> Nosso Passeio Náutico faz paradas prioritárias nos primeiros horários da manhã neste ponto para evitar barulho.
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-16 space-y-3">
                    <Compass className="w-10 h-10 text-zinc-300 animate-bounce" />
                    <h4 className="font-serif text-base font-bold text-zinc-500">Selecione um Posição</h4>
                    <p className="font-sans text-xs text-zinc-400 max-w-xs">
                      Clique em um dos marcadores no mapa ao lado para ver fotos reais e curiosidades táticas.
                    </p>
                  </div>
                )}
              </AnimatePresence>

              {/* Lower dynamic buttons */}
              <div className="pt-6 border-t border-zinc-200 mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate("destino")}
                  className="w-full sm:flex-1 py-3 text-center bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase rounded transition-colors shadow-sm"
                >
                  GUIA COMPLETO ↗
                </button>
                <button
                  onClick={() => onNavigate("experiencias")}
                  className="w-full sm:w-auto py-3 px-5 border border-zinc-200 hover:border-[#0D1B2A] text-zinc-500 hover:text-[#0D1B2A] font-accent text-xs font-bold uppercase tracking-wider rounded"
                >
                  VER PASSEIOS
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 10. HISTÓRIAS QUE NOS INSPIRAM (Testimonials with happy faces and star ratings) */}
      <section id="happy-people" className="py-24 bg-[#FBF9F6] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block mb-1">
              {settings?.homeFeedbackTag || "07 / LAZER & CONEXÕES DE ALMA"}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight">
              {settings?.homeFeedbackTitle || "Histórias que nos inspiram."}
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto mt-4"></div>
            <p className="font-sans text-sm text-[#5C6874] mt-3">
              {settings?.homeFeedbackDesc || "Não vendemos tickets automáticos. Colecionamos sorrisos e relatos de quem se conectou ao cabo com total afeto."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div 
                key={index}
                className="bg-white border border-zinc-200 rounded p-8 space-y-4 flex flex-col justify-between hover:border-[#E8711A] transition-all duration-300 shadow-[0_4px_20px_rgba(13,27,42,0.01)] hover:shadow-lg hover:-translate-y-1 text-left"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-[#E8711A]">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E8711A] text-[#E8711A]" />
                    ))}
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#0D1B2A] italic leading-relaxed">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-150">
                  <div className="w-9 h-9 bg-zinc-100 text-[#0D1B2A] rounded-full flex items-center justify-center font-accent font-bold text-xs border border-zinc-350 select-none uppercase">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-[#0D1B2A]">{item.name}</h4>
                    <span className="font-accent text-[9px] text-[#5C6874] tracking-wider uppercase block">{item.origin} &middot; {item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. DOWNLOAD GUIA DIGITAL BOOK COMPONENT (3D book layout + direct storage Lead collection) */}
      <section id="digital-book" className="py-24 bg-[#0D1B2A] text-white relative overflow-hidden">
        {/* Abstract sea-shores vector backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.02] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#E8711A]/10 blur-[130px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Box: 3D paperback-like mockup representation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-88 bg-gradient-to-br from-[#E8711A] to-[#C45E12] rounded-r-lg border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] p-6 flex flex-col justify-between text-left before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-black/20 before:rounded-l-lg group cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="space-y-2">
                  <div className="flex items-baseline mb-0.5">
                    <span className="font-serif text-lg font-extrabold text-[#0D1B2A] tracking-tight">
                      GUIDA
                    </span>
                    <span className="font-accent text-[#F4EFE6] text-[8px] font-bold tracking-[0.2em] ml-1 uppercase">
                      TRIPS
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-extrabold text-white leading-tight">
                    {settings?.homeGuideTitle || "O Guia Digital de Arraial do Cabo"}
                  </h3>
                  <p className="font-sans text-[10px] text-zinc-100/90 tracking-wide">
                    {settings?.homeGuideDesc || "Dicas, marés, coordenadas de nativos e gastronomia de ressurgência. Edição 2026."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-accent text-[8px] tracking-widest text-[#0D1B2A] font-extrabold uppercase">
                    {settings?.homeGuideTag || "DOWNLOAD GRATUITO"}
                  </span>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Right Box: Lead conversion form */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
                {settings?.homeGuideTag || "08 / ACESSO INSTANTÂNEO & CURADO"}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {settings?.homeGuideTitle || "Baixe o Guia Digital Oficial"}
              </h2>
              <p className="font-sans text-sm text-zinc-300 leading-relaxed">
                {settings?.homeGuideDesc || "Preparamos um livreto completo compilando os melhores horários para passear, locais secretos para se alimentar, fujas extraordinárias das marés cheias e muito mais! Forneça seu contato e o enviaremos de graça no seu e-mail instantly."}
              </p>

              <AnimatePresence mode="wait">
                {guideDownloaded ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-sm space-y-3"
                  >
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
                      <Check className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-white">Prontinho no Seu E-mail!</h4>
                    <p className="font-sans text-xs text-zinc-300 max-w-md">
                      Enviamos o PDF completo com as coordenadas de ouro para a sua caixa de entrada. Se não encontrar em 2 minutos, dê uma olhada na pasta de promoções ou spam. Boa leitura! 📚
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleGuideSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                    <div className="space-y-1">
                      <label className="font-accent text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest block">NOME COMPLETO *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Clara Silva"
                        value={guideName}
                        onChange={(e) => setGuideName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#E8711A] rounded p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:bg-white/10 transition-all uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-accent text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest block">TELEFONE OU E-MAIL DE CONTATO *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="Ex: clara@gmail.com"
                        value={guideEmail}
                        onChange={(e) => setGuideEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#E8711A] rounded p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:bg-white/10 transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <button 
                        type="submit"
                        className="w-full py-4 text-center bg-[#E8711A] hover:bg-white text-[#0D1B2A] hover:text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase rounded shadow transition-all duration-300 hover:scale-[1.01]"
                      >
                        {settings?.homeGuideBtnText || "BAIXAR MEU LIVRETO DIGITAL DA GUIDA"} &rarr;
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 12. BRIGHT COMPONENT FOR HOSPEDAGENS (3 cards preview mapping why hospedagens can be reserved through us) */}
      <section id="pousadas-showcase" className="py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div className="text-left space-y-3">
              <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
                09 / HOSPEDAGEM PARCEIRA SELECIONADA
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
                Pousadas Curadas por Guida
              </h2>
              <div className="h-0.5 w-16 bg-[#E8711A]"></div>
            </div>
            
            <button
              onClick={() => onNavigate("hospedagens")}
              className="px-5 py-3 border border-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase transition-colors rounded cursor-pointer"
            >
              Consultar Todas Hospedagens &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {[
              {
                id: "pousada-timoneiro",
                name: "Pousada do Timoneiro",
                location: "Praia Grande",
                rating: 4.9,
                desc: "Acolhimento tátil excepcional, a poucos metros do pico para ver o pôr do sol nos Anjos.",
                img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
                whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios exclusivos para a Pousada do Timoneiro."
              },
              {
                id: "pousada-caminho-mar",
                name: "Pousada Caminho do Mar",
                location: "Praia dos Anjos",
                rating: 4.8,
                desc: "Conectividade estratégica de embarque. Perfeito para noites sossegadas ao som de mar.",
                img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
                whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios para a Pousada Caminho do Mar."
              },
              {
                id: "ohana-pousada",
                name: "Ohana Pousada Boutique",
                location: "Pontal do Atalaia",
                rating: 5.0,
                desc: "Erguida nos despenhadeiros míticos com jacuzzi e bar flutuante olhando a imensidão costeira.",
                img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80",
                whatsappMessage: "Olá, Guida Trips! Gostaria de consultar tarifas com benefícios na Ohana Pousada Boutique."
              }
            ].map((pousada) => {
              const isSelected = selectedHotelId === pousada.id;
              
              return (
                <div 
                  key={pousada.id}
                  className={`bg-[#FBF9F7] border rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group ${
                    isSelected ? "border-[#E8711A] shadow-md ring-1 ring-[#E8711A]/20" : "border-zinc-200 hover:border-[#E8711A]/30"
                  }`}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={pousada.img} 
                      alt={pousada.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-95"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#0D1B2A] text-white text-[9px] font-accent tracking-widest uppercase px-2 py-1 rounded">
                      📍 {pousada.location.toUpperCase()}
                    </span>
                    <div className="absolute top-3 right-3 bg-white/95 text-[#0D1B2A] font-accent text-[9px] font-bold px-2 py-1 rounded shadow flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-[#E8711A] text-[#E8711A]" />
                      <span>{pousada.rating}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-bold text-[#0D1B2A] group-hover:text-[#E8711A] transition-colors leading-snug">
                        {pousada.name}
                      </h3>
                      <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                        {pousada.desc}
                      </p>
                    </div>

                    {/* Interactive lodging actions (Itinerary select & direct reservation check) */}
                    <div className="pt-4 border-t border-zinc-200/50 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* 1. Add/Lock to itinerary */}
                        <button
                          onClick={() => {
                            if (onChangeHotelId) {
                              onChangeHotelId(isSelected ? null : pousada.id);
                            }
                          }}
                          className={`flex-1 py-2.5 rounded-sm font-accent text-[9px] font-extrabold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected 
                              ? "bg-[#E8711A] text-[#0D1B2A] border border-[#E8711A] font-bold" 
                              : "bg-white text-[#0D1B2A] border border-zinc-200 hover:border-[#0D1B2A]/30"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              NO MEU ROTEIRO ✔
                            </>
                          ) : (
                            <>
                              <span>🏨</span> VINCULAR AO ROTEIRO
                            </>
                          )}
                        </button>

                        {/* 2. Direct book via WhatsApp */}
                        <a
                          href={`https://wa.me/${(settings?.whatsappNumber || "552299887766").replace(/\D/g, "")}?text=${encodeURIComponent(pousada.whatsappMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-accent text-[9px] font-extrabold tracking-widest uppercase transition-colors rounded-sm flex items-center justify-center gap-1"
                        >
                          <span>💬</span> AGENDAR DIRETO
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 13. SEÇÃO DE REVISTA GUIDA TRIPS (Blog lists integrated beautifully at the home page as requested) */}
      <section id="revista-posts" className="py-24 bg-[#FBF9F6] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
              10 / REVISTA COORDENADAS GUIDA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight">
              Revista Guida Trips
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
            <p className="font-sans text-sm text-[#5C6874]">
              Leia as narrativas, causos e indicações completas que nossa equipe preparou para a sua leitura de praia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "O que fazer em Arraial do Cabo: Guia de Viagem Definitivo 2026",
                slug: "o-que-fazer-em-arraial-do-cabo-guia-completo",
                excerpt: "Arraial do Cabo é mundialmente conhecida por suas praias. Porém, muito além do comum, revelamos segredos caiçaras...",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=650&q=80",
                date: "18 Jun, 2026"
              },
              {
                title: "Como Visitar as Prainhas do Pontal do Atalaia Sem Aglomerações",
                slug: "prainhas-pontal-atalaia-sem-transito",
                excerpt: "Você sonha em descer a charmosa escadaria de madeira em completo silêncio? Te damos o horário oficial que as agências escondem...",
                img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=650&q=80",
                date: "10 Jun, 2026"
              },
              {
                title: "Temporada de Baleias-Jubarte: Guia de Avistamento",
                slug: "temporada-baleias-arraial-do-cabo-guia",
                excerpt: "De julho a outubro dezenas de baleias visitam nossa costa fria. Saiba como vivenciar respeitosamente com equipe de biólogos marinhos...",
                img: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=650&q=80",
                date: "15 Jun, 2026"
              }
            ].map((post, idx) => (
              <div 
                key={idx}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={post.img} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-95"
                  />
                  <span className="absolute top-3 left-3 bg-[#0D1B2A] text-white text-[8px] font-accent tracking-widest uppercase px-2 py-1 rounded">
                    COORDENADAS
                  </span>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="font-accent text-[9px] text-zinc-400 font-bold block">{post.date}</span>
                    <h3 className="font-serif text-base font-bold text-[#0D1B2A] line-clamp-2 leading-snug group-hover:text-[#E8711A] transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-xs text-[#5C6874] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate("blog");
                      // Dynamically passing slug would set selectedPostSlug beautifully
                      try {
                        // Directly trigger navigating to blog with slug
                        const event = new CustomEvent("guidatrips_select_post", { detail: post.slug });
                        window.dispatchEvent(event);
                      } catch (e) {}
                    }}
                    className="font-accent text-[10px] font-bold text-[#E8711A] hover:text-[#0D1B2A] uppercase tracking-widest flex items-center gap-1.5 transition-colors pt-2 border-t border-zinc-100"
                  >
                    <span>LEIA MAIS</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 14. SEÇÃO FINAL DE FECHAMENTO — CTA ENCORPORADA EM NAVY ESCURO */}
      <section className="bg-[#0D1B2A] text-white py-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.02] [background-size:24px_24px] pointer-events-none"></div>
        <div className="max-w-xl px-4 space-y-6 relative z-10">
          <div className="flex justify-center select-none mb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-baseline mb-0.5">
                <span className="font-serif text-3xl font-extrabold text-[#F4EFE6] tracking-tight">
                  GUID<span className="relative">A<span className="absolute bottom-0 left-0 w-5 h-[4px] bg-[#E8711A] rounded-full transform rotate-[-12deg] translate-y-[3px]"></span></span>
                </span>
                <span className="font-accent text-[#E8711A] text-sm font-bold tracking-[0.2em] ml-1.5 uppercase">
                  &mdash; TRIPS &mdash;
                </span>
              </div>
              <span className="font-sans text-[8px] text-zinc-400 uppercase tracking-[0.25em] -mt-1 font-semibold">
                Passeios premium e conexões profundas
              </span>
            </div>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#F4EFE6] tracking-tight">
            Criamos momentos felizes que duram para sempre.
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
            Seja um brinde romântico ao sol poente, um banho de lancha cercado de tartarugas ou a aventura nas dunas brancas de Massambaba. Desenhamos suas férias com o afeto de velhos amigos.
          </p>

          <button
            onClick={() => onNavigate("experiencias")}
            className="px-8 py-4 bg-[#E8711A] text-[#0D1B2A] hover:bg-white font-accent text-xs font-bold tracking-widest uppercase rounded duration-200 cursor-pointer mt-4 hover:scale-[1.01] transition-transform shadow-lg"
          >
            QUERO VER NOSSOS PASSEIOS &rarr;
          </button>
        </div>
      </section>

      {/* VIDEO LIGHTBOX MODAL */}
      <AnimatePresence>
        {showVideoLightbox && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-black aspect-video rounded border border-white/10 overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowVideoLightbox(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 rounded-full text-white hover:text-[#E8711A] font-accent text-xs hover:bg-black/90 transition-all font-bold"
              >
                ✕ FECHAR
              </button>
              
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Guida Trips Vídeo Oficial" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
