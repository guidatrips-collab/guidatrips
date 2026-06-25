import React, { useState } from "react";
import { Experience, BlogPost, ClientUser, ClientReservation, ClientPartner } from "../types";
import { 
  Compass, Map, Ticket, Star, User, Heart, ChevronRight, 
  MapPin, Clock, Calendar, CheckCircle, Info, Video, Gift, Search,
  AlertTriangle
} from "lucide-react";

interface ClientPanelViewProps {
  experiences: Experience[];
  posts: BlogPost[];
  onNavigate: (view: string) => void;
}

export default function ClientPanelView({ experiences, posts, onNavigate }: ClientPanelViewProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "viagem" | "dicas" | "beneficios" | "perfil">("dashboard");
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  // MOCK DATA FOR DEMO PURPOSES
  const mockUser: ClientUser = {
    id: "user-1",
    name: "Carolina Mendes",
    email: "carolina.mendes@example.com",
    phone: "+55 11 99999-9999",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    preferences: ["Navegação", "Gastronomia", "Pôr do sol"],
    favorites: []
  };

  const mockReservations: ClientReservation[] = [
    {
      id: "res-1",
      userId: "user-1",
      experienceId: "passeio-barco-premium",
      date: "2026-10-15",
      time: "08:00",
      status: "confirmed",
      pax: 2,
      voucherCode: "GDT-A93B2",
      meetingPoint: "Cais da Praia dos Anjos, Píer 3",
      rules: [
        "Chegue com 20 minutos de antecedência.",
        "Não é permitido embarcar com cooler ou bebidas alcoólicas.",
        "Uso de colete salva-vidas obrigatório durante a navegação."
      ],
      bringItems: ["Protetor solar ecológico", "Toalha", "Óculos de sol", "Câmera fotográfica"],
      avoidItems: ["Sacos plásticos descartáveis", "Sapatos de salto", "Jóias de valor"]
    }
  ];

  const mockPartners: ClientPartner[] = [
    {
      id: "part-1",
      category: "restaurantes",
      name: "Bistrô do Farol",
      description: "Culinária mediterrânea com ingredientes locais fresquíssimos.",
      benefit: "Uma taça de espumante cortesia ou 10% de desconto na conta.",
      couponCode: "GUIDAVIP10",
      img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "part-2",
      category: "fotografos",
      name: "Estúdio Mar Aberto",
      description: "Ensaio fotográfico profissional nas areias de Arraial do Cabo.",
      benefit: "5 fotos extras gratuitas no pacote.",
      couponCode: "GUIDACLICKS",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Helper to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const currentReservation = selectedReservationId 
    ? mockReservations.find(r => r.id === selectedReservationId)
    : mockReservations[0];

  const currentExp = currentReservation 
    ? experiences.find(e => e.id === currentReservation.experienceId)
    : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FBF9F6] pt-14 md:pt-0">
      {/* SIDEBAR NAVIGATION (Desktop) / BOTTOM BAR (Mobile) */}
      <aside className="fixed bottom-0 left-0 right-0 h-16 md:h-screen md:sticky md:top-0 md:w-64 bg-[#0D1B2A] text-white flex flex-row md:flex-col z-50 border-t md:border-t-0 md:border-r border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:shadow-none">
        <div className="hidden md:flex flex-col items-center p-8 border-b border-white/10 mt-14">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E8711A] mb-3">
            <img src={mockUser.photoUrl} alt={mockUser.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="font-serif text-sm font-bold">{mockUser.name}</h3>
          <p className="font-sans text-[10px] text-zinc-400">Viajante Guida Trips</p>
        </div>

        <nav className="flex-1 flex flex-row justify-around md:justify-start md:flex-col overflow-x-auto md:overflow-visible p-2 md:p-4 gap-1 md:gap-3 bg-[#0D1B2A] items-center md:items-stretch">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded text-center md:text-left transition-colors flex-1 md:flex-none ${
              activeTab === "dashboard" ? "md:bg-[#E8711A] md:text-[#0D1B2A] text-[#E8711A] md:shadow-md md:font-bold" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Compass className="w-5 h-5 shrink-0 mx-auto md:mx-0" />
            <span className="font-accent text-[8px] md:text-[10px] uppercase tracking-widest block font-bold">Painel</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("viagem"); setSelectedReservationId(mockReservations[0]?.id || null); }}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded text-center md:text-left transition-colors flex-1 md:flex-none ${
              activeTab === "viagem" ? "md:bg-[#E8711A] md:text-[#0D1B2A] text-[#E8711A] md:shadow-md md:font-bold" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Map className="w-5 h-5 shrink-0 mx-auto md:mx-0" />
            <span className="font-accent text-[8px] md:text-[10px] uppercase tracking-widest block font-bold">Viagem</span>
          </button>
          
          <button
            onClick={() => setActiveTab("dicas")}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded text-center md:text-left transition-colors flex-1 md:flex-none ${
              activeTab === "dicas" ? "md:bg-[#E8711A] md:text-[#0D1B2A] text-[#E8711A] md:shadow-md md:font-bold" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Video className="w-5 h-5 shrink-0 mx-auto md:mx-0" />
            <span className="font-accent text-[8px] md:text-[10px] uppercase tracking-widest block font-bold hidden xs:block">Dicas</span>
          </button>

          <button
            onClick={() => setActiveTab("beneficios")}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded text-center md:text-left transition-colors flex-1 md:flex-none ${
              activeTab === "beneficios" ? "md:bg-[#E8711A] md:text-[#0D1B2A] text-[#E8711A] md:shadow-md md:font-bold" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Gift className="w-5 h-5 shrink-0 mx-auto md:mx-0" />
            <span className="font-accent text-[8px] md:text-[10px] uppercase tracking-widest block font-bold hidden xs:block">Cupons</span>
          </button>

          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded text-center md:text-left transition-colors flex-1 md:flex-none ${
              activeTab === "perfil" ? "md:bg-[#E8711A] md:text-[#0D1B2A] text-[#E8711A] md:shadow-md md:font-bold" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <User className="w-5 h-5 shrink-0 mx-auto md:mx-0" />
            <span className="font-accent text-[8px] md:text-[10px] uppercase tracking-widest block font-bold">Perfil</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-10">
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
            <header className="space-y-2">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0D1B2A]">Olá, Carolina! 🌊</h1>
              <p className="font-sans text-sm text-[#5C6874]">Faltam <strong className="text-[#E8711A]">12 dias</strong> para a sua experiência incrível em Arraial do Cabo começar.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Próximo Passeio Card */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab("viagem")}>
                <div className="w-full md:w-48 h-48 md:h-auto relative">
                  <img 
                    src={currentExp?.photos?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"} 
                    alt="Próximo Passeio"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                  <div className="absolute top-3 left-3 bg-[#E8711A] text-white font-accent text-[8px] px-2 py-1 uppercase tracking-widest rounded-sm font-bold shadow-md">
                    Seu Próximo Destino
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0D1B2A] group-hover:text-[#E8711A] transition-colors">
                      {currentExp?.name || "Cruzeiro Náutico Premium"}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-4 text-[#5C6874] font-sans text-xs">
                      <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#E8711A]" /> {currentReservation?.date ? formatDate(currentReservation.date) : "A Definir"}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#E8711A]" /> {currentReservation?.time || "A Definir"}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#E8711A]" /> {currentReservation?.meetingPoint || "Cais"}</div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center border-t border-zinc-100 pt-4">
                    <span className="font-sans text-xs font-medium text-[#0D1B2A]">Ver detalhes completos &rarr;</span>
                  </div>
                </div>
              </div>

              {/* Clima & Dicas Rápidas */}
              <div className="space-y-6">
                <div className="bg-[#0D1B2A] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                  <h4 className="font-accent text-[10px] uppercase tracking-widest text-zinc-400 mb-4">Previsão Arraial do Cabo</h4>
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-serif font-bold">28°</span>
                    <div className="pb-1">
                      <p className="font-sans text-sm font-medium">Sol com algumas nuvens</p>
                      <p className="font-sans text-xs text-zinc-400">Água cristalina ideal para mergulho</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FBF9F7] border border-zinc-200 rounded-xl p-6">
                  <h4 className="font-accent text-[10px] uppercase tracking-widest text-[#E8711A] mb-4">Dica da Guida</h4>
                  <p className="font-serif text-sm text-[#0D1B2A] leading-relaxed">
                    "O sol do Caribe Brasileiro é forte! Lembre-se de beber muita água e aplicar o protetor ecológico antes de embarcar."
                  </p>
                </div>
              </div>
            </div>

            {/* Descubra Novas Experiências */}
            <div className="pt-6 border-t border-zinc-200">
              <h3 className="font-serif text-2xl font-bold text-[#0D1B2A] mb-6">Complete seu Roteiro</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.filter(e => e.id !== currentExp?.id).slice(0, 3).map(exp => (
                  <div key={exp.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => onNavigate("experiencias")}>
                    <div className="h-40 overflow-hidden relative">
                      <img src={exp.photos?.[0]} alt={exp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95" />
                    </div>
                    <div className="p-5">
                      <h4 className="font-serif text-base font-bold text-[#0D1B2A] leading-tight mb-2 group-hover:text-[#E8711A] transition-colors">{exp.name}</h4>
                      <p className="font-sans text-xs text-[#5C6874] line-clamp-2 mb-4">{exp.shortDescription}</p>
                      <span className="font-accent text-[10px] text-[#E8711A] font-bold uppercase tracking-widest flex items-center gap-1">Saiba mais <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MINHA VIAGEM TAB */}
        {activeTab === "viagem" && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#0D1B2A]">Minha Viagem</h1>
                <p className="font-sans text-sm text-[#5C6874] mt-2">Acesse os detalhes de sua experiência contratada.</p>
              </div>
            </header>

            {currentReservation ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Esquerda: Informações do Passeio */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="h-48 md:h-64 relative">
                      <img src={currentExp?.photos?.[0]} alt={currentExp?.name} className="w-full h-full object-cover filter brightness-[0.85]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/90 to-transparent flex flex-col justify-end p-6">
                        <span className="bg-[#E8711A] text-white text-[10px] font-accent uppercase tracking-widest font-bold px-2 py-1 rounded-sm w-max mb-3">Reserva Confirmada</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">{currentExp?.name}</h2>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans text-sm text-[#0D1B2A]">
                        <div className="bg-[#FBF9F7] p-4 rounded-lg">
                          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Data & Hora</span>
                          <span className="font-medium">{formatDate(currentReservation.date)} às {currentReservation.time}</span>
                        </div>
                        <div className="bg-[#FBF9F7] p-4 rounded-lg">
                          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Ponto de Encontro</span>
                          <span className="font-medium">{currentReservation.meetingPoint}</span>
                        </div>
                        <div className="bg-[#FBF9F7] p-4 rounded-lg">
                          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Pessoas</span>
                          <span className="font-medium">{currentReservation.pax} Integrantes</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-100">
                        <h3 className="font-serif text-lg font-bold text-[#0D1B2A] mb-4">Conheça sua Experiência</h3>
                        <p className="font-sans text-sm text-[#5C6874] leading-relaxed mb-6">
                          {currentExp?.fullDescription}
                        </p>
                        
                        {/* Pontos de Parada mockados */}
                        <div className="space-y-4">
                          <h4 className="font-accent text-[10px] text-[#E8711A] uppercase tracking-widest font-bold">Roteiro Previsto</h4>
                          <div className="border-l-2 border-zinc-200 pl-4 space-y-6">
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#0D1B2A] rounded-full"></span>
                              <h5 className="font-serif text-base font-bold text-[#0D1B2A]">Ilha do Farol</h5>
                              <p className="font-sans text-xs text-[#5C6874] mt-1">Nossa primeira parada. Faremos o desembarque de forma segura. O tempo médio de permanência é de 40 minutos (determinado pela Marinha).</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#E8711A] rounded-full"></span>
                              <h5 className="font-serif text-base font-bold text-[#0D1B2A]">Prainhas do Pontal do Atalaia</h5>
                              <p className="font-sans text-xs text-[#5C6874] mt-1">O famoso cenário da escadaria. Você terá tempo livre para mergulho e relaxamento.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direita: QR Code e Regras */}
                <div className="space-y-6">
                  {/* Voucher Card */}
                  <div className="bg-[#0D1B2A] text-white rounded-xl shadow-lg overflow-hidden relative text-center p-8">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#E8711A]"></div>
                    <Ticket className="w-8 h-8 mx-auto text-[#E8711A] mb-4" />
                    <h4 className="font-accent text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Voucher de Acesso</h4>
                    <p className="font-mono text-2xl font-bold tracking-wider mb-6">{currentReservation.voucherCode}</p>
                    
                    <div className="bg-white p-4 rounded-lg inline-block mx-auto mb-4">
                      {/* Fake QR CODE layout */}
                      <div className="grid grid-cols-5 grid-rows-5 gap-1 w-32 h-32 opacity-80">
                         {Array.from({length: 25}).map((_, i) => (
                           <div key={i} className={`bg-[#0D1B2A] rounded-sm ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`}></div>
                         ))}
                      </div>
                    </div>
                    <p className="font-sans text-[10px] text-zinc-400">Apresente este código no embarque.</p>
                  </div>

                  {/* Checklist Card */}
                  <div className="bg-white border border-zinc-200 rounded-xl p-6">
                    <h3 className="font-serif text-base font-bold text-[#0D1B2A] mb-4">Checklist do Viajante</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-accent text-[10px] text-green-600 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> O que levar</h4>
                        <ul className="space-y-1.5">
                          {currentReservation.bringItems.map((item, idx) => (
                            <li key={idx} className="font-sans text-xs text-[#5C6874] pl-2 border-l-2 border-green-200">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="font-accent text-[10px] text-red-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> O que evitar</h4>
                        <ul className="space-y-1.5">
                          {currentReservation.avoidItems.map((item, idx) => (
                            <li key={idx} className="font-sans text-xs text-[#5C6874] pl-2 border-l-2 border-red-200">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Regras Card */}
                  <div className="bg-[#FBF9F7] border border-zinc-200 rounded-xl p-6">
                    <h3 className="font-serif text-base font-bold text-[#0D1B2A] mb-4 flex items-center gap-2"><Info className="w-4 h-4 text-[#E8711A]" /> Regras de Ouro</h3>
                    <ul className="space-y-2">
                      {currentReservation.rules.map((rule, idx) => (
                        <li key={idx} className="font-sans text-[11px] text-[#5C6874] flex items-start gap-2">
                          <span className="text-[#E8711A]">•</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white p-10 rounded-xl border border-zinc-200 text-center">
                <Ticket className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">Você ainda não possui viagens agendadas</h3>
                <button onClick={() => onNavigate("experiencias")} className="mt-4 px-6 py-2 bg-[#0D1B2A] text-white font-accent text-[10px] uppercase font-bold tracking-widest rounded-sm">
                  Explorar Passeios
                </button>
              </div>
            )}
          </div>
        )}

        {/* DICAS EXCLUSIVAS TAB */}
        {activeTab === "dicas" && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <header className="border-b border-zinc-200 pb-6">
              <h1 className="font-serif text-3xl font-bold text-[#0D1B2A]">Dicas Exclusivas</h1>
              <p className="font-sans text-sm text-[#5C6874] mt-2">Conteúdos produzidos por nativos para enriquecer sua jornada.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                  <div className="h-44 relative overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#0D1B2A] font-accent text-[8px] px-2 py-1 uppercase tracking-widest rounded-sm font-bold">
                      {post.category || "Editorial"}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-[#0D1B2A] group-hover:text-[#E8711A] transition-colors leading-tight mb-2">{post.title}</h3>
                    <p className="font-sans text-xs text-[#5C6874] line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[#8A96A3] font-sans text-[10px] uppercase font-bold">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>Ler Artigo &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BENEFICIOS GUIDA TAB */}
        {activeTab === "beneficios" && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <header className="border-b border-zinc-200 pb-6">
              <h1 className="font-serif text-3xl font-bold text-[#0D1B2A]">Benefícios Guida</h1>
              <p className="font-sans text-sm text-[#5C6874] mt-2">Acesse vantagens exclusivas em nossos parceiros de confiança.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPartners.map(partner => (
                <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col sm:flex-row overflow-hidden group">
                  <div className="sm:w-2/5 h-48 sm:h-auto relative">
                    <img src={partner.img} alt={partner.name} className="w-full h-full object-cover filter brightness-95" />
                  </div>
                  <div className="p-5 sm:w-3/5 flex flex-col justify-between">
                    <div>
                      <span className="font-accent text-[8px] text-[#E8711A] font-bold uppercase tracking-widest mb-1 block">{partner.category}</span>
                      <h3 className="font-serif text-xl font-bold text-[#0D1B2A] mb-2">{partner.name}</h3>
                      <p className="font-sans text-xs text-[#5C6874] mb-3">{partner.description}</p>
                    </div>
                    <div className="bg-[#FBF9F7] p-3 rounded-lg border border-zinc-200/50">
                      <p className="font-sans text-[11px] font-bold text-[#0D1B2A] mb-2">{partner.benefit}</p>
                      <div className="flex items-center justify-between bg-white border border-dashed border-zinc-300 px-3 py-1.5 rounded">
                        <span className="font-mono text-xs font-bold text-[#E8711A] tracking-wider">{partner.couponCode}</span>
                        <button className="font-accent text-[9px] text-[#0D1B2A] uppercase font-bold hover:text-[#E8711A]">Copiar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PERFIL TAB */}
        {activeTab === "perfil" && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <header className="border-b border-zinc-200 pb-6">
              <h1 className="font-serif text-3xl font-bold text-[#0D1B2A]">Meu Perfil</h1>
              <p className="font-sans text-sm text-[#5C6874] mt-2">Gerencie suas informações e preferências.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#0D1B2A] border-b border-zinc-100 pb-3">Dados Pessoais</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-accent text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Nome Completo</label>
                    <p className="font-sans text-sm text-[#0D1B2A] font-medium">{mockUser.name}</p>
                  </div>
                  <div>
                    <label className="font-accent text-[9px] text-zinc-500 uppercase tracking-widest font-bold">E-mail</label>
                    <p className="font-sans text-sm text-[#0D1B2A] font-medium">{mockUser.email}</p>
                  </div>
                  <div>
                    <label className="font-accent text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Telefone</label>
                    <p className="font-sans text-sm text-[#0D1B2A] font-medium">{mockUser.phone}</p>
                  </div>
                </div>
                <button className="mt-4 px-6 py-2 bg-zinc-100 text-[#0D1B2A] font-accent text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-zinc-200 transition-colors">
                  Editar Dados
                </button>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#0D1B2A] border-b border-zinc-100 pb-3">Preferências de Viagem</h3>
                <div className="flex flex-wrap gap-2">
                  {mockUser.preferences?.map((pref, idx) => (
                    <span key={idx} className="bg-[#FBF9F7] border border-zinc-200 text-[#5C6874] px-3 py-1.5 rounded-full font-sans text-xs">
                      {pref}
                    </span>
                  ))}
                  <button className="bg-white border border-dashed border-zinc-300 text-zinc-400 px-3 py-1.5 rounded-full font-sans text-xs hover:border-[#E8711A] hover:text-[#E8711A] transition-colors">
                    + Adicionar interesse
                  </button>
                </div>

                <div className="pt-6 border-t border-zinc-100 mt-6">
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A] mb-4">Meus Favoritos</h3>
                  <div className="text-center bg-[#FBF9F7] border border-zinc-200 rounded-lg p-6">
                    <Heart className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
                    <p className="font-sans text-xs text-[#5C6874]">Você ainda não salvou nenhum passeio ou dica.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
