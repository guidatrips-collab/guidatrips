/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  TrendingUp, Users, Compass, BarChart3, Settings, ShieldAlert,
  Globe, Plus, Trash2, Edit3, Eye, FileText, CheckCircle, 
  X, AlertTriangle, Play, HelpCircle, Save, Phone, MessageSquare, Image, User, Calendar
} from "lucide-react";
import { Experience, Lead, BlogPost, GlobalSettings, ExperienceCategory } from "../types";
import { CalendarPricingView } from "./CalendarPricingView";

interface AdminViewProps {
  experiences: Experience[];
  leads: Lead[];
  posts: BlogPost[];
  settings: GlobalSettings;
  onUpdateExperiences: (exps: Experience[]) => void;
  onUpdatePosts: (posts: BlogPost[]) => void;
  onUpdateLeads: (leads: Lead[]) => void;
  onUpdateSettings: (settings: GlobalSettings) => void;
}

export default function AdminView({
  experiences,
  leads,
  posts,
  settings,
  onUpdateExperiences,
  onUpdatePosts,
  onUpdateLeads,
  onUpdateSettings
}: AdminViewProps) {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [loginError, setLoginError] = useState("");

  const DEFAULT_PASSPHRASE = "admin"; // Easy to demo bypass!

  // Safe defaults for customizable arrays
  const defaultFilosofiaPillars = [
    { id: 1, badge: "01 / AFETO NATIVO", title: "Ouro do Acolhimento", desc: "Guias locais diplomados com paixão para contar histórias e cuidar de sua segurança mística." },
    { id: 2, badge: "02 / FLUIDEZ CRISTAL", title: "Roteiros sem Fila", desc: "Cálculos matemáticos de vento, ressurgência e fluxo para atracar antes da invasão comercial." },
    { id: 3, badge: "03 / MIMOS DE MARÉ", title: "Cortejos de Charme", desc: "Frutas geladas selecionadas, espumantes artesanais e toalhas secas sob medida para você." },
    { id: 4, badge: "04 / ZERO POLUIÇÃO", title: "Compromisso Ecológico", desc: "Zelo ativo integral com lixo zero e motores silenciosos de baixíssimo atrito químico." }
  ];

  const defaultCategories = [
    { id: "praias", name: "Praias & Costas", count: "8 paragens", font: "font-serif text-[13px]" },
    { id: "mirantes", name: "Mirantes Rústicos", count: "4 refúgios", font: "font-serif text-[13px]" },
    { id: "vibe", name: "Vibe de Afeto", count: "Experiências", font: "font-serif text-[13px]" },
    { id: "embarcacoes", name: "Embarcações", count: "Peixes & Veleiros", font: "font-serif text-[12px]" },
    { id: "gastronomia", name: "Gastronomia", count: "6 quintais", font: "font-serif text-[13px]" },
    { id: "hospedagem", name: "Pousadas Boutique", count: "8 seleções", font: "font-serif text-[12px]" },
    { id: "aventura", name: "Cultura & Trilhas", count: "10 rotas", font: "font-serif text-[12px]" },
    { id: "logistica", name: "Logística Completa", count: "Dicas nativas", font: "font-serif text-[11px]" }
  ];

  const defaultMimosTabs = [
    { key: "sabores", badge: "🍽️ COMPOSIÇÃO ARTESANAL", title: "Sabores Que Unem E Celebram", text: "A nossa gastronomia abraça o seu paladar com frescor incomparável. Desfrute de espumantes selecionados de vinícolas de selo premiado, tábuas de frios rústicas, ceviche preparado na hora e deliciosos mimos regionais servidos sob a brisa morna do oceano.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
    { key: "lounges", badge: "✨ INSTALAÇÃO PRIVADA", title: "Piqueniques Sob a Luz Dourada", text: "Montamos lounges boutique com tapetes rústicos, almofadas macias e iluminação minimalista quente diretamente em mirantes ou praias reservadas. Uma experiência mágica de cinema para conversar, provar iguarias e desfrutar da melhor hora do pôr do sol com quem você mais ama.", img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" },
    { key: "noite", badge: "🌙 ENCONTROS NO DECK", title: "Luau Intimista & Noite sob Velas", text: "Ao entardecer, as estrelas tomam conta do cabo. Projetamos jantares privativos aconchegantes sob velas aromáticas flutuantes nas areias, harmonizados com vinhos finos de selo orgânico e o som rítmico das ondas quebrando suavemente na orla.", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" },
    { key: "nativismo", badge: "🤝 CONEXÃO VERDADEIRA", title: "A Hospitalidade de Pura Alma", text: "Liderados por Guida, nossa equipe é composta por moradores apaixonados que respiram o destino. Nosso diferencial é a conexão humana verdadeira: recebemos você com sorrisos sinceros de braços abertos, contando causos divertidos de pescadores, lendas marítimas e segredos fascinantes.", img: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80" }
  ];

  const defaultLogisticaPoints = [
    { title: "Como Chegar em Conforto", desc: "Arraial fica a 165km do Rio. Oferecemos opções sob medida de transfer executivo corporativo porta-a-porta partindo dos aeroportos rústicos da capital diretamente para a sua pousada curada." },
    { title: "A Melhor Época de Ventos", desc: "O sol brilha o ano todo. Para águas com nitidez mística extrema de reflexos azulados, indicamos os meses de Março a Junho, onde a calmaria de ventos sintoniza mar cristalino." },
    { title: "O Que Trazer na Mochila", desc: "Traga bonés leves, protetor solar mineral (pelo zelo ecológico da fauna de restinga) e claro: óculos de mergulho para fitar cavalos-marinhos e siris coloridos." }
  ];

  const defaultFeedbackList = [
    { name: "Daniela Pinheiro & Noivo", city: "Rio de Janeiro - RJ", quote: "Eu queria um pedido de casamento surpresa perfeito nas dunas e a equipe da Guida estruturou TUDO. Montaram um lounge maravilhoso com velas, queijos e champanhe maravilhoso no Pontal e até contrataram fotógrafo para se disfarçar de turista! Sensacional!", role: "Momentos Especiais", avatar: "D" },
    { name: "Ricardo e Cláudia Lemos", city: "Campinas - SP", quote: "Viajamos com as crianças de 5 e 8 anos. O barco é limpíssimo, o colete das crianças coube perfeitamente e os marinheiros prepararam cortes de melancia bem gelada que as crianças devoraram após o mergulho. Foi o dia mais feliz de nossas férias!", role: "Fórmula de Família", avatar: "R" },
    { name: "Letícia Amaral", city: "Brasília - DF", quote: "Atendimento caloroso incrível. Não somos tratadas como meros bilhetes de turismo. Guida nos pegou na porta da pousada, nos deu dicas preciosas sobre horários e nos levou para jantar lulas na brasa. Esse afeto é o verdadeiro ouro!", role: "Aventura Curada", avatar: "L" }
  ];

  const defaultHeroStats = [
    { value: "5★", label: "Acolhimento Humano" },
    { value: "100%", label: "Lanchas Privativas" },
    { value: "Nativo", label: "Amor pelo Território" }
  ];

  // Active submodule
  const [activeTab, setActiveTab] = useState<"overview" | "experiences" | "calendar" | "leads" | "blog" | "settings" | "client">("overview");

  // CRM status labels
  const leadStatuses = [
    { id: "novo", label: "Novo", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { id: "atendendo", label: "Em Atendimento", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    { id: "proposta", label: "Proposta Enviada", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { id: "fechado", label: "Fechado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { id: "perdido", label: "Perdido", color: "bg-red-500/20 text-red-400 border-red-500/30" }
  ];

  // Forms / Modals States
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [tempSettings, setTempSettings] = useState<GlobalSettings>({
    ...settings,
    homeFilosofiaPillars: settings.homeFilosofiaPillars || defaultFilosofiaPillars,
    homeCategories: settings.homeCategories || defaultCategories,
    homeMimosTabs: settings.homeMimosTabs || defaultMimosTabs,
    homeLogisticaPoints: settings.homeLogisticaPoints || defaultLogisticaPoints,
    homeFeedbackList: settings.homeFeedbackList || defaultFeedbackList,
    homeHeroStats: settings.homeHeroStats || defaultHeroStats
  });

  React.useEffect(() => {
    setTempSettings({
      ...settings,
      homeFilosofiaPillars: settings.homeFilosofiaPillars || defaultFilosofiaPillars,
      homeCategories: settings.homeCategories || defaultCategories,
      homeMimosTabs: settings.homeMimosTabs || defaultMimosTabs,
      homeLogisticaPoints: settings.homeLogisticaPoints || defaultLogisticaPoints,
      homeFeedbackList: settings.homeFeedbackList || defaultFeedbackList,
      homeHeroStats: settings.homeHeroStats || defaultHeroStats
    });
  }, [settings]);

  // Action log pre-seeding
  const [activityLog, setActivityLog] = useState<string[]>([
    "Hoje 11h45 · Clique WhatsApp: Passeio de Barco Premium &mdash; João V.",
    "Ontem 18h32 · Lead via Formulário registrado: Mariana Souza",
    "Ontem 10h15 · Novo Artigo publicado: Guia Completo das Prainhas",
    "2 dias atrás · Status do Lead #lead-maria-santos alterado para 'Em Atendimento'"
  ]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.toLowerCase() === DEFAULT_PASSPHRASE) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Senha de administrador incorreta. Dica: use 'admin'.");
    }
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return { ...l, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return l;
    });
    onUpdateLeads(updated);
    addLog(`Status do Lead #${leadId.slice(0,8)} alterado para '${newStatus}'`);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm("Confirmar exclusão definitiva do lead?")) {
      const filtered = leads.filter((l) => l.id !== leadId);
      onUpdateLeads(filtered);
      addLog(`Lead #${leadId.slice(0,8)} excluído do CRM.`);
    }
  };

  // Experiences CRUD Actions
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    if (!editingExperience.id) {
      // Create new one
      const newId = `exp-${Date.now()}`;
      const newExp: Experience = {
        id: newId,
        name: editingExperience.name || "Sem Nome",
        slug: editingExperience.slug || `${editingExperience.name?.toLowerCase().replace(/\s+/g, "-")}`,
        category: editingExperience.category || ExperienceCategory.NAUTICO,
        shortDescription: editingExperience.shortDescription || "",
        fullDescription: editingExperience.fullDescription || "",
        duration: editingExperience.duration || "2 horas",
        capacity: editingExperience.capacity || 10,
        priceFrom: editingExperience.priceFrom || 100,
        promotionalPrice: editingExperience.promotionalPrice,
        included: editingExperience.included || [],
        notIncluded: editingExperience.notIncluded || [],
        highlights: editingExperience.highlights || [],
        bringItems: editingExperience.bringItems || [],
        itinerary: editingExperience.itinerary || [],
        faqs: editingExperience.faqs || [],
        meetingPoint: editingExperience.meetingPoint || "A combinar",
        googleMapsUrl: editingExperience.googleMapsUrl || "",
        partnerName: editingExperience.partnerName || "",
        videoEmbed: editingExperience.videoEmbed || "",
        coordinates: editingExperience.coordinates || { lat: -22.9715, lng: -42.0224 },
        photos: editingExperience.photos || ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"],
        status: editingExperience.status || "active",
        featured: editingExperience.featured || false,
        badge: editingExperience.badge || "",
        location: editingExperience.location || "Arraial do Cabo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onUpdateExperiences([newExp, ...experiences]);
      addLog(`Nova experiência criada: ${newExp.name}`);
    } else {
      // Update existing
      const updated = experiences.map((exp) => {
        if (exp.id === editingExperience.id) {
          return {
            ...exp,
            ...editingExperience,
            updatedAt: new Date().toISOString()
          } as Experience;
        }
        return exp;
      });
      onUpdateExperiences(updated);
      addLog(`Experiência atualizada: ${editingExperience.name}`);
    }

    setEditingExperience(null);
  };

  const handleUpdateSingleExperience = (updatedExp: Experience) => {
    const updated = experiences.map((exp) => exp.id === updatedExp.id ? { ...updatedExp, updatedAt: new Date().toISOString() } : exp);
    onUpdateExperiences(updated);
    addLog(`Tarifário atualizado: ${updatedExp.name}`);
  };

  const handleDeleteExperience = (expId: string) => {
    if (confirm("Tens certeza que deseja excluir esta experiência?")) {
      const filtered = experiences.filter((e) => e.id !== expId);
      onUpdateExperiences(filtered);
      addLog(`Experiência excluída: #${expId}`);
    }
  };

  // Blog content CRUD Actions
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (!editingPost.id) {
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: editingPost.title || "Rascunho Sem Título",
        slug: editingPost.slug || `${editingPost.title?.toLowerCase().replace(/\s+/g, "-")}`,
        category: editingPost.category || "Férias",
        tags: editingPost.tags || [],
        coverImage: editingPost.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        excerpt: editingPost.excerpt || "",
        body: editingPost.body || "",
        status: editingPost.status || "draft",
        publishedAt: new Date().toISOString(),
        views: 0,
        readTime: editingPost.readTime || 5
      };
      onUpdatePosts([newPost, ...posts]);
      addLog(`Novo post de blog criado: ${newPost.title}`);
    } else {
      const updated = posts.map((post) => {
        if (post.id === editingPost.id) {
          return {
            ...post,
            ...editingPost,
          } as BlogPost;
        }
        return post;
      });
      onUpdatePosts(updated);
      addLog(`Post de blog atualizado: ${editingPost.title}`);
    }

    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm("Tens certeza de tirar essa matéria do ar?")) {
      const filtered = posts.filter((p) => p.id !== postId);
      onUpdatePosts(filtered);
      addLog(`Artigo removido da revista: #${postId}`);
    }
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    addLog("Configurações sistêmicas e número do WhatsApp alterados pelo painel.");
    alert("Configurações atualizadas com sucesso!");
  };

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setActivityLog([`Hoje ${time} · ${text}`, ...activityLog.slice(0, 5)]);
  };

  const handleAddNote = (leadId: string) => {
    const txt = prompt("Escreva uma observação interna para este lead:");
    if (!txt) return;

    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          notes: [...(l.notes || []), txt],
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });
    onUpdateLeads(updated);
    addLog(`Nota interna inserida no lead #${leadId.slice(0,8)}`);
  };

  // Login page layout
  if (!isAuthenticated) {
    return (
      <div id="admin-login-view" className="py-24 bg-[#0D1B2A] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-[#132033] border border-white/5 p-8 rounded-sm space-y-6 text-center shadow-2xl">
            <div className="flex justify-center flex-col items-center select-none">
              <span className="font-serif text-3xl font-extrabold text-[#F4EFE6] tracking-tight">
                GUID<span className="text-[#E8711A]">A</span>
              </span>
              <span className="font-accent text-[9px] text-[#E8711A] tracking-widest uppercase mt-1">
                PAINEL PRIVADO ADMIN
              </span>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded text-left space-y-1.5 font-sans">
              <span className="text-xs font-bold text-yellow-400 block flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Controle de Ingressos
              </span>
              <p className="text-[10px] text-[#8A96A3] leading-relaxed">
                Este é o ambiente de Backoffice para o time Guida Trips. Para acessar e testar os CRUDs de roteiros locais, use a chave demonstrativa abaixo:
              </p>
              <code className="text-yellow-400 text-xs font-mono block pt-1 bg-black/40 px-2 py-0.5 rounded w-fit">
                admin
              </code>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="font-accent text-[9px] text-white tracking-widest uppercase">Palavra-Chave *</label>
                <input
                  type="password"
                  required
                  placeholder="Senha do Administrador"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full bg-[#0D1B2A] border border-white/5 p-3 rounded-sm text-xs text-white focus:outline-none focus:border-[#E8711A]"
                />
              </div>

              {loginError && <p className="text-[10px] font-sans text-red-400">{loginError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#E8711A] hover:bg-[#C45E12] text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase rounded-sm duration-200 cursor-pointer shadow-lg"
              >
                Acessar Painel de Controle
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin Workspace Layout
  const activeLeadsCount = leads.filter((l) => l.status === "novo").length;

  return (
    <div id="admin-workspace" className="py-24 bg-[#0D1B2A] text-[#F4EFE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TOP OVERVIEW ROW */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 pb-6 border-b border-white/5 gap-4">
          <div>
            <span className="font-accent text-[#E8711A] text-xs font-bold uppercase tracking-wider">Workspace do Operator</span>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight mt-1">Controle Guida Trips</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-1 bg-[#132033] p-1.5 border border-white/5 rounded">
            {[
              { id: "overview", label: "Visão Geral", icon: TrendingUp },
              { id: "experiences", label: "Passeios", icon: Compass },
              { id: "calendar", label: "Tarifário", icon: Calendar },
              { id: "leads", label: "Leads CRM", icon: Users, alertCount: activeLeadsCount },
              { id: "blog", label: "Revista/Blog", icon: FileText },
              { id: "client", label: "Área Cliente", icon: User },
              { id: "settings", label: "Ajustes", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setEditingExperience(null); setEditingPost(null); }}
                  className={`px-3 py-2 rounded font-accent text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#E8711A] text-[#0D1B2A]"
                      : "text-[#8A96A3] hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.alertCount !== undefined && tab.alertCount > 0 && (
                    <span className="bg-red-500 text-white font-accent text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {tab.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* -------------------- TAB: OVERVIEW / METRICAS -------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-8 text-left">
            
            {/* Metricas principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Cliques Whatsapp", value: `${leads.length * 15 + Number(settings.whatsappNumber.slice(-3))}`, diff: "+12.4% este mês", icon: MessageSquare },
                { title: "Boletins CRM (N)", value: `${leads.length}`, diff: `${activeLeadsCount} novos na fila`, icon: Users },
                { title: "Passeios Ativos", value: `${experiences.filter(e => e.status === "active").length}`, diff: `${experiences.filter(e => e.status !== "active").length} rascunhos`, icon: Compass },
                { title: "Conversão Estimada", value: "25.4%", diff: "Foco no lead WhatsApp", icon: TrendingUp }
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="bg-[#132033] border border-white/5 p-6 rounded-sm space-y-2 relative shadow-md">
                    <div className="flex items-center justify-between text-[#8A96A3]">
                      <span className="font-accent text-[10px] uppercase tracking-widest">{m.title}</span>
                      <Icon className="w-4 h-4 text-[#E8711A]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-serif font-extrabold text-[#F4EFE6]">{m.value}</div>
                    <p className="font-sans text-[10px] text-green-400">{m.diff}</p>
                  </div>
                );
              })}
            </div>

            {/* Graficos Ficticios mas bonitos e Logs de Atividade */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Grafico de Funil */}
              <div className="lg:col-span-7 bg-[#132033] border border-white/5 p-6 rounded-sm space-y-4 flex flex-col justify-between h-[350px]">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#F4EFE6]">Visualizador de Funil: Visitas &rarr; WhatsApp</h4>
                  <p className="font-sans text-[10px] text-[#8A96A3]">Estágios de engajamento do tráfego orgânico e social.</p>
                </div>

                {/* Funil Visual */}
                <div className="space-y-3 pt-4">
                  {[
                    { stage: "Acessaram o site", val: "2.400 / 100%", width: "w-full", color: "bg-[#1e3d59]/70 text-[#F4EFE6]" },
                    { stage: "Visualizaram Passeio", val: "1.240 / 51%", width: "w-[51%]", color: "bg-[#1e3d59]/90 text-white" },
                    { stage: "Add Roteiro / Leads", val: `${leads.length * 40} / 12%`, width: "w-[24%]", color: "bg-[#E8711A]/40 text-[#E8711A]" },
                    { stage: "Originaram WA", val: "140 / 5.8%", width: "w-[12%]", color: "bg-[#E8711A] text-[#0D1B2A] font-bold" }
                  ].map((s, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-accent uppercase">
                        <span>{s.stage}</span>
                        <span>{s.val}</span>
                      </div>
                      <div className="h-4 w-full bg-black/35 rounded-sm overflow-hidden flex">
                        <div className={`${s.width} ${s.color} text-[8px] font-accent flex items-center pl-2 uppercase tracking-wider`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console de Atividades Recentes */}
              <div className="lg:col-span-5 bg-[#132033] border border-white/5 p-6 rounded-sm space-y-4 flex flex-col justify-between h-[350px]">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#F4EFE6]">Logs de Fluxo Tecnológico</h4>
                  <p className="font-sans text-[10px] text-[#8A96A3]">Atualizações automáticas da interface e CRM.</p>
                </div>

                <div className="flex-1 bg-black/40 rounded p-4 font-mono text-[10px] text-[#8A96A3] leading-relaxed overflow-y-auto block space-y-2 mt-4 space-y-2.5">
                  {activityLog.map((log, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: log }} />
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* -------------------- TAB: EXPERIENCES CRUD -------------------- */}
        {activeTab === "experiences" && (
          <div className="space-y-6 text-left">
            
            {/* Listagem se não estiver editando */}
            {!editingExperience ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#132033] border border-white/5 p-4 rounded-sm">
                  <span className="font-accent text-xs font-bold text-[#8A96A3] uppercase">Controle de Experiências ({experiences.length})</span>
                  <button
                    onClick={() => setEditingExperience({})}
                    className="flex items-center gap-1 bg-[#E8711A] text-[#0D1B2A] font-accent text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm hover:bg-[#C45E12] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Nova Experiência
                  </button>
                </div>

                <div className="bg-[#132033]/60 border border-white/5 rounded-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-[#132033] font-accent text-[10px] text-[#8A96A3] uppercase tracking-widest">
                        <th className="p-4">Foto</th>
                        <th className="p-4">Nome da Experiência</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Preço Base</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="font-sans text-xs">
                      {experiences.map((exp) => (
                        <tr key={exp.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                          <td className="p-4">
                            <img src={exp.photos[0]} className="w-10 h-10 object-cover rounded" alt="Thumb" />
                          </td>
                          <td className="p-4 font-bold text-white">{exp.name}</td>
                          <td className="p-4 opacity-75">
                            {exp.category}
                            <div className="text-[10px] text-[#8A96A3] mt-0.5">📍 {exp.location || "Arraial do Cabo"}</div>
                          </td>
                          <td className="p-4 font-bold text-[#E8711A]">R$ {exp.priceFrom}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-accent uppercase ${
                              exp.status === "active" ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"
                            }`}>
                              {exp.status === "active" ? "Ativo" : "Pausado"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2 shrink-0">
                            <button
                              onClick={() => setEditingExperience(exp)}
                              className="p-2 bg-white/5 text-white hover:text-[#E8711A] rounded inline-block"
                              title="Editar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-2 bg-white/5 text-red-400 hover:bg-red-500/10 rounded inline-block"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // FORMULÁRIO DE GESTÃO DE PALESTRAS
              <div className="bg-[#132033] border border-white/5 p-6 rounded-sm space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="font-serif text-lg font-bold">
                    {editingExperience.id ? "Alterar Detalhes da Experiência" : "Lançar Nova Experiência Cativa"}
                  </h3>
                  <button 
                    onClick={() => setEditingExperience(null)}
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveExperience} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Nome do Passeio / Experiência *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Passeio Premium de Barco"
                        value={editingExperience.name || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, name: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Slug de Url (Gerado automático se vazio)</label>
                      <input
                        type="text"
                        placeholder="Ex: passeio-premium-barco"
                        value={editingExperience.slug || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, slug: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Categoria</label>
                      <select
                        value={editingExperience.category || ExperienceCategory.NAUTICO}
                        onChange={(e) => setEditingExperience({ ...editingExperience, category: e.target.value as any })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      >
                        <option value="nautico">🚤 Náutico</option>
                        <option value="off-road">🚙 Off-Road</option>
                        <option value="cultura">🏛️ Cultura</option>
                        <option value="gastronomia">🍴 Gastronomia</option>
                        <option value="temporada">🐋 Temporada</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Duração (Ex: 4 horas)</label>
                      <input
                        type="text"
                        placeholder="Ex: 4 horas"
                        value={editingExperience.duration || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, duration: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Cidade de Partida (Ex: Cabo Frio RJ)</label>
                      <input
                        type="text"
                        placeholder="Ex: Cabo Frio RJ"
                        value={editingExperience.departureCity || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, departureCity: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Idade Mínima (Ex: 2 anos)</label>
                      <input
                        type="text"
                        placeholder="Ex: 2 anos"
                        value={editingExperience.minAge || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, minAge: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Idade Máxima (Ex: 65 anos)</label>
                      <input
                        type="text"
                        placeholder="Ex: 65 anos"
                        value={editingExperience.maxAge || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, maxAge: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Preço Base Referência (R$)</label>
                      <input
                        type="number"
                        placeholder="Ex: 120"
                        value={editingExperience.priceFrom || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, priceFrom: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Preço Base Promocional (R$)</label>
                      <input
                        type="number"
                        placeholder="Ex: 99"
                        value={editingExperience.promotionalPrice || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, promotionalPrice: parseInt(e.target.value) || undefined })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* PRECIFICAÇÃO DETALHADA */}
                  <div className="p-4 bg-[#0D1B2A]/50 border border-white/10 rounded-lg space-y-4">
                    <h4 className="font-serif text-sm font-bold text-[#E8711A]">Tabela de Preços (Adulto, Criança, Bebê)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Adulto (R$)</label>
                        <input
                          type="number"
                          value={editingExperience.pricing?.adultPrice || ""}
                          onChange={(e) => setEditingExperience({ 
                            ...editingExperience, 
                            pricing: { ...(editingExperience.pricing || { adultPrice: 0 }), adultPrice: parseInt(e.target.value) || 0 } 
                          })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Criança (R$)</label>
                        <input
                          type="number"
                          value={editingExperience.pricing?.childPrice || ""}
                          onChange={(e) => setEditingExperience({ 
                            ...editingExperience, 
                            pricing: { ...(editingExperience.pricing || { adultPrice: 0 }), childPrice: parseInt(e.target.value) || 0 } 
                          })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Bebê (R$)</label>
                        <input
                          type="number"
                          value={editingExperience.pricing?.babyPrice || ""}
                          onChange={(e) => setEditingExperience({ 
                            ...editingExperience, 
                            pricing: { ...(editingExperience.pricing || { adultPrice: 0 }), babyPrice: parseInt(e.target.value) || 0 } 
                          })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CALENDÁRIO & DISPONIBILIDADE */}
                  <div className="p-4 bg-[#0D1B2A]/50 border border-white/10 rounded-lg space-y-4">
                    <h4 className="font-serif text-sm font-bold text-[#E8711A]">Calendário e Disponibilidade</h4>
                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Tipo de Frequência</label>
                        <select
                          value={editingExperience.availability?.type || "daily"}
                          onChange={(e) => setEditingExperience({ 
                            ...editingExperience, 
                            availability: { ...(editingExperience.availability || { type: "daily", slots: [] }), type: e.target.value as "daily" | "specific_days" } 
                          })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white outline-none"
                        >
                          <option value="daily">Todos os dias</option>
                          <option value="specific_days">Dias Específicos (Semana/Mês)</option>
                        </select>
                      </div>

                      {editingExperience.availability?.type === "specific_days" && (
                        <div className="space-y-1.5">
                          <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Dias da Semana Permitidos (0 = Dom, 6 = Sáb)</label>
                          <input
                            type="text"
                            placeholder="Ex: 1, 2, 3, 4, 5 (Segunda a Sexta)"
                            value={editingExperience.availability?.daysOfWeek?.join(", ") || ""}
                            onChange={(e) => {
                              const days = e.target.value.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                              setEditingExperience({
                                ...editingExperience,
                                availability: { ...(editingExperience.availability || { type: "specific_days", slots: [] }), daysOfWeek: days }
                              });
                            }}
                            className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Horários (Separe por vírgula)</label>
                        <input
                          type="text"
                          placeholder="Ex: 08:00, 10:00, 14:00"
                          value={editingExperience.schedules?.join(", ") || ""}
                          onChange={(e) => setEditingExperience({ ...editingExperience, schedules: e.target.value.split(",").map(s => s.trim()) })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                        />
                        <p className="text-[10px] text-zinc-500 mt-1">Horários de saída e capacidade são gerenciados aqui (Ex: 08:00, 10:00)</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                        <div className="space-y-1.5">
                          <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Antecedência Check-in (minutos)</label>
                          <input
                            type="number"
                            placeholder="Padrão: 30"
                            value={editingExperience.checkInMinutesBefore !== undefined && editingExperience.checkInMinutesBefore !== null ? editingExperience.checkInMinutesBefore : ""}
                            onChange={(e) => setEditingExperience({ ...editingExperience, checkInMinutesBefore: e.target.value === "" ? undefined : parseInt(e.target.value) })}
                            className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                          />
                          <p className="text-[9px] text-zinc-500">Ex: 30 ou 60 minutos antes da saída.</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Duração Estimada (minutos)</label>
                          <input
                            type="number"
                            placeholder="Padrão: 180 (3h)"
                            value={editingExperience.durationMinutes !== undefined && editingExperience.durationMinutes !== null ? editingExperience.durationMinutes : ""}
                            onChange={(e) => setEditingExperience({ ...editingExperience, durationMinutes: e.target.value === "" ? undefined : parseInt(e.target.value) })}
                            className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                          />
                          <p className="text-[9px] text-zinc-500">Ex: 240 minutos para passeios de 4h.</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Margem de Segurança (minutos)</label>
                          <input
                            type="number"
                            placeholder="Padrão: 60 (1h)"
                            value={editingExperience.safetyBufferMinutes !== undefined && editingExperience.safetyBufferMinutes !== null ? editingExperience.safetyBufferMinutes : ""}
                            onChange={(e) => setEditingExperience({ ...editingExperience, safetyBufferMinutes: e.target.value === "" ? undefined : parseInt(e.target.value) })}
                            className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                          />
                          <p className="text-[9px] text-zinc-500">Margem mínima entre programações.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Parceiro Responsável</label>
                      <input
                        type="text"
                        placeholder="Ex: Agência Marítima X"
                        value={editingExperience.partnerName || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, partnerName: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Localização (Link do Google Maps)</label>
                      <input
                        type="text"
                        placeholder="Ex: https://maps.app.goo.gl/..."
                        value={editingExperience.googleMapsUrl || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, googleMapsUrl: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Capacidade Máxima de Pessoas</label>
                      <input
                        type="number"
                        placeholder="Ex: 45"
                        value={editingExperience.capacity || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, capacity: parseInt(e.target.value) || 10 })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Tag Especial / Badge (Home e Cards)</label>
                      <select
                        value={editingExperience.badge || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, badge: e.target.value as any })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-accent"
                      >
                        <option value="">Nenhuma</option>
                        <option value="mais-vendido">🔥 Mais vendido</option>
                        <option value="novidade">✨ Novidade</option>
                        <option value="temporada">🐋 Temporada</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Breve Resumo (para cards da listagem - máx 150 caracteres)</label>
                    <input
                      type="text"
                      placeholder="Ex: Um passeio inesquecível de escuna privativa contornando as margens caribenhas."
                      value={editingExperience.shortDescription || ""}
                      onChange={(e) => setEditingExperience({ ...editingExperience, shortDescription: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Descrição Completa e Roteiro Literário de Viagem</label>
                    <textarea
                      rows={6}
                      placeholder="Use parágrafos organizados detalhando cada marco do trajeto..."
                      value={editingExperience.fullDescription || ""}
                      onChange={(e) => setEditingExperience({ ...editingExperience, fullDescription: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Ponto de Encontro Oficial</label>
                      <input
                        type="text"
                        placeholder="Ex: Praia dos Anjos, píer 1"
                        value={editingExperience.meetingPoint || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, meetingPoint: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Vídeo de Destaque (URL do YouTube/Vimeo)</label>
                      <input
                        type="text"
                        placeholder="Ex: https://youtube.com/watch?v=..."
                        value={editingExperience.videoEmbed || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, videoEmbed: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Fotos da Galeria (Cole URLs de fotos separadas por vírgulas)</label>
                    <input
                      type="text"
                      value={(editingExperience.photos || []).join(", ")}
                      onChange={(e) => setEditingExperience({ ...editingExperience, photos: e.target.value.split(",").map(s => s.trim()) })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Destaques Principais (Uma por linha)</label>
                      <textarea
                        rows={4}
                        placeholder="Ex: Guia Bilíngue\nEquipamento Incluso"
                        value={(editingExperience.highlights || []).join("\n")}
                        onChange={(e) => setEditingExperience({ ...editingExperience, highlights: e.target.value.split("\n").filter(Boolean) })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">O Que Levar (Um por linha)</label>
                      <textarea
                        rows={4}
                        placeholder="Ex: Protetor Solar\nToalha\nGarrafa d'água"
                        value={(editingExperience.bringItems || []).join("\n")}
                        onChange={(e) => setEditingExperience({ ...editingExperience, bringItems: e.target.value.split("\n").filter(Boolean) })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">O Que Está Incluso (Um por linha)</label>
                      <textarea
                        rows={4}
                        placeholder="Ex: Água\nSnacks"
                        value={(editingExperience.included || []).join("\n")}
                        onChange={(e) => setEditingExperience({ ...editingExperience, included: e.target.value.split("\n").filter(Boolean) })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">O Que Não Está Incluso (Um por linha)</label>
                      <textarea
                        rows={4}
                        placeholder="Ex: Almoço\nFotos Profissionais"
                        value={(editingExperience.notIncluded || []).join("\n")}
                        onChange={(e) => setEditingExperience({ ...editingExperience, notIncluded: e.target.value.split("\n").filter(Boolean) })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Roteiro Completo (Título do Ponto: Descrição - Um por linha)</label>
                    <textarea
                      rows={6}
                      placeholder="Ex: Praia do Forte 🌊: Linda vista panorâmica da praia.&#10;Ilha dos Papagaios 🦜: Parada perfeita para banho de mar."
                      value={(editingExperience.itinerary || []).join("\n")}
                      onChange={(e) => setEditingExperience({ ...editingExperience, itinerary: e.target.value.split("\n").filter(Boolean) })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Status Operacional</label>
                      <select
                        value={editingExperience.status || "active"}
                        onChange={(e) => setEditingExperience({ ...editingExperience, status: e.target.value as any })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      >
                        <option value="active">✅ Ativo no site</option>
                        <option value="paused">⏸️ Pausado/Rascunho</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Cidade / Região (Localidade)</label>
                      <select
                        value={editingExperience.location || "Arraial do Cabo"}
                        onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      >
                        <option value="Arraial do Cabo font-bold">Arraial do Cabo (Principal)</option>
                        <option value="Cabo Frio">Cabo Frio</option>
                        <option value="Búzios">Búzios</option>
                        <option value="Rio de Janeiro">Rio de Janeiro</option>
                        <option value="Angra dos Reis">Angra dos Reis</option>
                        <option value="Paraty">Paraty</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer font-accent text-xs">
                        <input
                          type="checkbox"
                          checked={editingExperience.featured || false}
                          onChange={(e) => setEditingExperience({ ...editingExperience, featured: e.target.checked })}
                          className="w-4 h-4 bg-[#0D1B2A] accent-[#E8711A]"
                        />
                        Exibir com destaque na Home?
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-white/5 pt-6">
                    <button
                      type="button"
                      onClick={() => setEditingExperience(null)}
                      className="px-6 py-2 border border-white/10 text-white hover:bg-white/5 font-accent text-xs font-bold uppercase rounded-sm cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#C45E12] font-accent text-xs font-bold uppercase rounded-sm cursor-pointer shadow-md flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" /> Salvar Experiência
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        )}

        {/* -------------------- TAB: CALENDAR TARIFÁRIO -------------------- */}
        {activeTab === "calendar" && (
          <CalendarPricingView 
            experiences={experiences} 
            onUpdateExperience={handleUpdateSingleExperience} 
          />
        )}

        {/* -------------------- TAB: LEADS CRM GESTOR -------------------- */}
        {activeTab === "leads" && (
          <div className="space-y-6 text-left">
            <div className="bg-[#132033] border border-white/5 p-4 rounded-sm">
              <span className="font-accent text-xs font-bold text-[#8A96A3] uppercase">Leads Qualificados do CRM ({leads.length})</span>
            </div>

            {leads.length > 0 ? (
              <div className="bg-[#132033]/60 border border-white/5 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#132033] font-accent text-[10px] text-[#8A96A3] uppercase tracking-widest">
                      <th className="p-4"># Lead</th>
                      <th className="p-4">Info do Viajante</th>
                      <th className="p-4">Interesse Escrito</th>
                      <th className="p-4">Grupo/Data</th>
                      <th className="p-4">Status Comissariado</th>
                      <th className="p-4 text-right">Ações CRM</th>
                    </tr>
                  </thead>
                  <tbody className="font-sans text-xs">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                        <td className="p-4 font-mono font-bold text-[#8A96A3]">
                          #{lead.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="font-bold text-white text-sm">{lead.name}</div>
                          <div className="text-[10px] opacity-75">{lead.email}</div>
                          <div className="text-[10px] text-[#E8711A]">{lead.phone}</div>
                        </td>
                        <td className="p-4 space-y-1">
                          {lead.experienceInterest.map((expId) => {
                            const exp = experiences.find(e => e.id === expId);
                            return (
                              <span key={expId} className="block text-[11px] font-bold text-white">
                                {exp ? exp.name : expId}
                              </span>
                            );
                          })}
                          {lead.notes && lead.notes.length > 0 && (
                            <p className="text-[10px] italic text-[#8A96A3] max-w-xs truncate" title={lead.notes.join(" | ")}>
                              " {lead.notes[0]} "
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-accent text-[10px] text-white">
                            📅 {lead.preferredDate || "A decidir"}
                          </div>
                          <div className="text-[10px] opacity-75 mt-0.5">
                            👥 {lead.groupSize} {lead.groupSize === 1 ? "pessoa" : "pessoas"}
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                            className="bg-[#0D1B2A] border border-white/10 p-1.5 rounded text-[11px] font-accent text-white focus:outline-none"
                          >
                            <option value="novo">🔵 Novo</option>
                            <option value="atendendo">🟡 Em Atendimento</option>
                            <option value="proposta">🟣 Proposta Enviada</option>
                            <option value="fechado">🟢 Fechado</option>
                            <option value="perdido">🔴 Perdido</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleAddNote(lead.id)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded inline-block text-white"
                            title="Inserir Nota Interna"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Botão de deep links direct WA */}
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded inline-block text-green-400"
                            title="Iniciar conversa no WhatsApp com o cliente"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 bg-white/5 text-red-400 hover:bg-red-500/10 rounded inline-block"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 bg-[#132033]/40 border border-white/5 rounded-sm">
                <p className="font-sans text-xs text-[#8A96A3]">Nenhum lead qualificado no CRM ainda.</p>
              </div>
            )}
          </div>
        )}

        {/* -------------------- TAB: BLOG EDIT GESTOR -------------------- */}
        {activeTab === "blog" && (
          <div className="space-y-6 text-left">
            {!editingPost ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#132033] border border-white/5 p-4 rounded-sm">
                  <span className="font-accent text-xs font-bold text-[#8A96A3] uppercase">Controle de Mídia / Matérias ({posts.length})</span>
                  <button
                    onClick={() => setEditingPost({})}
                    className="flex items-center gap-1 bg-[#E8711A] text-[#0D1B2A] font-accent text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm hover:bg-[#C45E12] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Nova Matéria / Post
                  </button>
                </div>

                <div className="bg-[#132033]/60 border border-white/5 rounded-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-[#132033] font-accent text-[10px] text-[#8A96A3] uppercase tracking-widest">
                        <th className="p-4">Capa</th>
                        <th className="p-4">Título da Matéria</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Minutos Leitura</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="font-sans text-xs">
                      {posts.map((post) => (
                        <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                          <td className="p-4">
                            <img src={post.coverImage} className="w-10 h-10 object-cover rounded" alt="Cover" />
                          </td>
                          <td className="p-4 font-bold text-white max-w-xs truncate">{post.title}</td>
                          <td className="p-4 opacity-75">{post.category}</td>
                          <td className="p-4">{post.readTime} min read</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-accent uppercase ${
                              post.status === "published" ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"
                            }`}>
                              {post.status === "published" ? "Publicado" : "Rascunho"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingPost(post)}
                              className="p-2 bg-white/5 text-white hover:text-[#E8711A] rounded inline-block"
                              title="Editar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 bg-white/5 text-red-400 hover:bg-red-500/10 rounded inline-block"
                              title="Deletar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // FORMULÁRIO DE GESTÃO DE BLOG POSTS
              <div className="bg-[#132033] border border-white/5 p-6 rounded-sm space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="font-serif text-lg font-bold">
                    {editingPost.id ? "Alterar Artigo da Revista" : "Escrever Novo Artigo de Bordo"}
                  </h3>
                  <button 
                    onClick={() => setEditingPost(null)}
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSavePost} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título do Artigo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Pôr do sol no Pontal"
                        value={editingPost.title || ""}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Slug amigável (Gerador no salvamento)</label>
                      <input
                        type="text"
                        placeholder="Ex: o-melhor-sunset-em-arraial"
                        value={editingPost.slug || ""}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-sans text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Categoria Editorial</label>
                      <input
                        type="text"
                        placeholder="Ex: Roteiros ou Dicas Locais"
                        value={editingPost.category || ""}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Tempo estimado de leitura (Minutos)</label>
                      <input
                        type="number"
                        placeholder="Ex: 5"
                        value={editingPost.readTime || ""}
                        onChange={(e) => setEditingPost({ ...editingPost, readTime: parseInt(e.target.value) || 5 })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Status de publicação</label>
                      <select
                        value={editingPost.status || "draft"}
                        onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      >
                        <option value="draft">📁 Rascunho Interno</option>
                        <option value="published">🌐 Publicado no site públicos</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Imagem de Capa (URL)</label>
                    <input
                      type="text"
                      placeholder="URL da Foto do Unsplash"
                      value={editingPost.coverImage || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-sans text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Vídeo Dica (URL do YouTube/Vimeo) - Opcional</label>
                    <input
                      type="text"
                      placeholder="Ex: https://www.youtube.com/watch?v=..."
                      value={editingPost.videoUrl || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, videoUrl: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-sans text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Resumo / Linha de chamada (Exibido nas listas)</label>
                    <input
                      type="text"
                      placeholder="Breve e chamativo..."
                      value={editingPost.excerpt || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Corpo do Post / Diário de Bordo</label>
                    <textarea
                      rows={10}
                      placeholder="Use quebras de linha normais para estruturar a legibilidade..."
                      value={editingPost.body || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  <div className="flex gap-3 justify-end border-t border-white/5 pt-6">
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="px-6 py-2 border border-white/10 text-white hover:bg-white/5 font-accent text-xs font-bold uppercase rounded-sm cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#C45E12] font-accent text-xs font-bold uppercase rounded-sm cursor-pointer shadow-md flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" /> Publicar Artigo
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------- TAB: CLIENT AREA -------------------- */}
        {activeTab === "client" && (
          <div className="space-y-6 text-left">
            <div className="bg-[#132033] border border-white/5 p-6 rounded-sm space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold">Gestão da Área do Cliente</h3>
                  <p className="font-sans text-xs text-zinc-400 mt-1">Configure os dados de demonstração (roteiros, parceiros, etc).</p>
                </div>
                <button 
                  onClick={handleUpdateSettings} 
                  className="bg-[#E8711A] text-[#0D1B2A] font-accent text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded flex items-center gap-2 hover:bg-white transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                
                {/* Roteiros Personalizados (Reservas) */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Map className="w-4 h-4" /> 1. Roteiros Personalizados (Exemplo Cliente)
                  </h4>
                  <p className="text-xs text-zinc-400">Edite as informações da viagem (o que evitar, checklist) do usuário de exemplo.</p>
                  
                  {tempSettings.clientReservations?.map((res, rIdx) => (
                    <div key={res.id} className="bg-[#0D1B2A] border border-white/10 p-4 rounded space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-accent text-[9px] text-white tracking-widest uppercase">ID da Experiência</label>
                          <input
                            type="text"
                            value={res.experienceId}
                            onChange={(e) => {
                              const arr = [...(tempSettings.clientReservations || [])];
                              arr[rIdx] = { ...arr[rIdx], experienceId: e.target.value };
                              setTempSettings({ ...tempSettings, clientReservations: arr });
                            }}
                            className="w-full bg-transparent border border-white/5 p-2 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-accent text-[9px] text-white tracking-widest uppercase">Ponto de Encontro</label>
                          <input
                            type="text"
                            value={res.meetingPoint}
                            onChange={(e) => {
                              const arr = [...(tempSettings.clientReservations || [])];
                              arr[rIdx] = { ...arr[rIdx], meetingPoint: e.target.value };
                              setTempSettings({ ...tempSettings, clientReservations: arr });
                            }}
                            className="w-full bg-transparent border border-white/5 p-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-white tracking-widest uppercase">Checklist (O que levar - Separe por vírgula)</label>
                        <input
                          type="text"
                          value={res.bringItems.join(", ")}
                          onChange={(e) => {
                            const arr = [...(tempSettings.clientReservations || [])];
                            arr[rIdx] = { ...arr[rIdx], bringItems: e.target.value.split(",").map(i => i.trim()) };
                            setTempSettings({ ...tempSettings, clientReservations: arr });
                          }}
                          className="w-full bg-transparent border border-white/5 p-2 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-white tracking-widest uppercase">O que evitar (Separe por vírgula)</label>
                        <input
                          type="text"
                          value={res.avoidItems.join(", ")}
                          onChange={(e) => {
                            const arr = [...(tempSettings.clientReservations || [])];
                            arr[rIdx] = { ...arr[rIdx], avoidItems: e.target.value.split(",").map(i => i.trim()) };
                            setTempSettings({ ...tempSettings, clientReservations: arr });
                          }}
                          className="w-full bg-transparent border border-white/5 p-2 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-accent text-[9px] text-white tracking-widest uppercase">Regras de Ouro (Separe por |)</label>
                        <input
                          type="text"
                          value={res.rules.join(" | ")}
                          onChange={(e) => {
                            const arr = [...(tempSettings.clientReservations || [])];
                            arr[rIdx] = { ...arr[rIdx], rules: e.target.value.split("|").map(i => i.trim()) };
                            setTempSettings({ ...tempSettings, clientReservations: arr });
                          }}
                          className="w-full bg-transparent border border-white/5 p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={() => {
                      const newRes = {
                        id: `res-${Date.now()}`,
                        userId: "user-1",
                        experienceId: experiences[0]?.id || "",
                        date: "2026-10-15",
                        time: "08:00",
                        status: "confirmed" as any,
                        pax: 2,
                        voucherCode: "GDT-NEW",
                        meetingPoint: "Cais da Praia dos Anjos, Píer 3",
                        rules: ["Chegue com 20 min de antecedência"],
                        bringItems: ["Protetor solar"],
                        avoidItems: ["Sacos plásticos"]
                      };
                      setTempSettings({ ...tempSettings, clientReservations: [...(tempSettings.clientReservations || []), newRes] });
                    }}
                    className="mt-2 text-xs text-[#E8711A] flex items-center gap-1 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Reserva
                  </button>
                </div>

                {/* Dicas (Blog Posts - Vídeos) */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Play className="w-4 h-4" /> 2. Dicas & Vídeos (Via Aba Blog)
                  </h4>
                  <p className="text-xs text-zinc-400">Para adicionar vídeos, vá na aba "Revista/Blog" e edite os artigos, adicionando um link de vídeo.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* -------------------- TAB: SETTINGS & CONFIGS -------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-6 text-left">
            <div className="bg-[#132033] border border-white/5 p-6 rounded-sm space-y-6">
              
              <form onSubmit={handleUpdateSettings} className="space-y-8">
                
                {/* SETTINGS CARD 1: CONTATO & TRAFEGO */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Phone className="w-4 h-4" /> 1. Ajustes de Contato & Tráfego
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">WhatsApp para Leads (Somente Números c/ DDI + DDD) *</label>
                      <input
                        type="text"
                        required
                        value={tempSettings.whatsappNumber}
                        onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Horário de Atendimento Comercial</label>
                      <input
                        type="text"
                        required
                        value={tempSettings.businessHours}
                        onChange={(e) => setTempSettings({ ...tempSettings, businessHours: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Mensagem Padrão de Whatsapp (Template de Boas-Vindas)</label>
                    <textarea
                      rows={3}
                      value={tempSettings.whatsappGreeting}
                      onChange={(e) => setTempSettings({ ...tempSettings, whatsappGreeting: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Google Analytics GA4 - Measurement ID</label>
                      <input
                        type="text"
                        value={tempSettings.googleAnalyticsId}
                        onChange={(e) => setTempSettings({ ...tempSettings, googleAnalyticsId: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Meta Pixel ID (Facebook Ads)</label>
                      <input
                        type="text"
                        value={tempSettings.metaPixelId}
                        onChange={(e) => setTempSettings({ ...tempSettings, metaPixelId: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 2: HERO / LANDING */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Globe className="w-4 h-4" /> 2. Hero & Cabeçalho da Home
                  </h4>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título Secundário da Home (Hero)</label>
                    <input
                      type="text"
                      value={tempSettings.diferencialTitle || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, diferencialTitle: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Descrição Curta (Hero)</label>
                    <textarea
                      rows={3}
                      value={tempSettings.diferencialDescription || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, diferencialDescription: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">URL da Imagem da Home (Ao lado do texto)</label>
                    <input
                      type="text"
                      value={tempSettings.homeHeroImgUrl || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, homeHeroImgUrl: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Texto do Botão Principal (WhatsApp)</label>
                    <input
                      type="text"
                      value={tempSettings.homeHeroBtnText || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, homeHeroBtnText: e.target.value })}
                      placeholder="Ex: Fale com nossa Equipe"
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                    />
                  </div>

                  {/* Estatísticas Hero */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">Os 3 Indicadores da Home</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(tempSettings.homeHeroStats || defaultHeroStats).map((stat, idx) => (
                        <div key={idx} className="bg-[#0D1B2A]/70 border border-white/5 p-3 rounded space-y-2">
                          <span className="font-serif text-xs font-bold text-white block">Indicador #{idx + 1}</span>
                          <input
                            type="text"
                            placeholder="Valor (Ex: 5★)"
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...(tempSettings.homeHeroStats || [])];
                              if (!updated[idx]) updated[idx] = { value: "", label: "" };
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              setTempSettings({ ...tempSettings, homeHeroStats: updated });
                            }}
                            className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white uppercase"
                          />
                          <input
                            type="text"
                            placeholder="Legenda"
                            value={stat.label}
                            onChange={(e) => {
                              const updated = [...(tempSettings.homeHeroStats || [])];
                              if (!updated[idx]) updated[idx] = { value: "", label: "" };
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setTempSettings({ ...tempSettings, homeHeroStats: updated });
                            }}
                            className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white uppercase"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 3: FILOSOFIA DE EXPERIENCIA & 4 PILLARS */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-5">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Compass className="w-4 h-4" /> 3. Seção: Filosofia & 4 Pilares
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Etiqueta da Seção (Tag)</label>
                      <input
                        type="text"
                        value={tempSettings.homeFilosofiaTag || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeFilosofiaTag: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título Principal</label>
                      <input
                        type="text"
                        value={tempSettings.homeFilosofiaTitle || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeFilosofiaTitle: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Descrição Longa</label>
                    <textarea
                      rows={3}
                      value={tempSettings.homeFilosofiaDesc || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, homeFilosofiaDesc: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título do Botão de Vídeo</label>
                      <input
                        type="text"
                        value={tempSettings.homeFilosofiaVideoTitle || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeFilosofiaVideoTitle: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Subtítulo de Detalhes do Vídeo</label>
                      <input
                        type="text"
                        value={tempSettings.homeFilosofiaVideoSub || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeFilosofiaVideoSub: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Pillars Edit Array */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">Os Quatro Pilares de Cuidado</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(tempSettings.homeFilosofiaPillars || defaultFilosofiaPillars).map((pil, idx) => (
                        <div key={pil.id} className="bg-[#0D1B2A]/70 border border-white/5 p-4 rounded space-y-2">
                          <span className="font-serif text-xs font-bold text-white block">Pilar #{pil.id}</span>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Badge (Ex: 01 / AFETO)"
                              value={pil.badge}
                              onChange={(e) => {
                                const updated = [...(tempSettings.homeFilosofiaPillars || [])];
                                updated[idx] = { ...pil, badge: e.target.value };
                                setTempSettings({ ...tempSettings, homeFilosofiaPillars: updated });
                              }}
                              className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Título"
                              value={pil.title}
                              onChange={(e) => {
                                const updated = [...(tempSettings.homeFilosofiaPillars || [])];
                                updated[idx] = { ...pil, title: e.target.value };
                                setTempSettings({ ...tempSettings, homeFilosofiaPillars: updated });
                              }}
                              className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                            />
                            <textarea
                              rows={2}
                              placeholder="Descrição resumida"
                              value={pil.desc}
                              onChange={(e) => {
                                const updated = [...(tempSettings.homeFilosofiaPillars || [])];
                                updated[idx] = { ...pil, desc: e.target.value };
                                setTempSettings({ ...tempSettings, homeFilosofiaPillars: updated });
                              }}
                              className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="URL da Imagem"
                              value={pil.img || ""}
                              onChange={(e) => {
                                const updated = [...(tempSettings.homeFilosofiaPillars || [])];
                                updated[idx] = { ...pil, img: e.target.value };
                                setTempSettings({ ...tempSettings, homeFilosofiaPillars: updated });
                              }}
                              className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 4: COMPASS MAP BENTO NAVIGATOR */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <TrendingUp className="w-4 h-4" /> 4. Seção: Bento Grid - Bússola
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Etiqueta (Tag)</label>
                      <input
                        type="text"
                        value={tempSettings.homeCompassTag || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeCompassTag: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título Principal</label>
                      <input
                        type="text"
                        value={tempSettings.homeCompassTitle || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeCompassTitle: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Descrição Curta</label>
                    <input
                      type="text"
                      value={tempSettings.homeCompassDesc || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, homeCompassDesc: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  {/* Categories list builder */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">As 8 Categorias da Bússola Bento</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(tempSettings.homeCategories || defaultCategories).map((cat, idx) => (
                        <div key={cat.id} className="bg-[#0D1B2A]/70 border border-white/5 p-3 rounded space-y-2">
                          <span className="font-accent text-[8px] text-zinc-400 block uppercase">ID: {cat.id}</span>
                          <input
                            type="text"
                            placeholder="Nome de Exibição"
                            value={cat.name}
                            onChange={(e) => {
                              const updated = [...(tempSettings.homeCategories || [])];
                              updated[idx] = { ...cat, name: e.target.value };
                              setTempSettings({ ...tempSettings, homeCategories: updated });
                            }}
                            className="w-full bg-[#0D1B2A] border border-white/10 p-1.5 text-xs text-white font-sans"
                          />
                          <input
                            type="text"
                            placeholder="Contagem/Marcas"
                            value={cat.count}
                            onChange={(e) => {
                              const updated = [...(tempSettings.homeCategories || [])];
                              updated[idx] = { ...cat, count: e.target.value };
                              setTempSettings({ ...tempSettings, homeCategories: updated });
                            }}
                            className="w-full bg-[#0D1B2A] border border-white/10 p-1.5 text-[11px] text-zinc-300 font-sans"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 5: PRAIA DO FORNO HIGHLIGHT BANNER & MIMOS BOUTIQUE */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-5">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Globe className="w-4 h-4" /> 5. Seção: Banner Forno & Mimos Boutique
                  </h4>
                  <div className="space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">Banner Praia do Forno Highlight</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">ETIQUETA (TAG)</label>
                        <input
                          type="text"
                          value={tempSettings.homeBannerTag || ""}
                          onChange={(e) => setTempSettings({ ...tempSettings, homeBannerTag: e.target.value })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">TÍTULO PRINCIPAL</label>
                        <input
                          type="text"
                          value={tempSettings.homeBannerTitle || ""}
                          onChange={(e) => setTempSettings({ ...tempSettings, homeBannerTitle: e.target.value })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">TEXTO DO BOTÃO</label>
                        <input
                          type="text"
                          value={tempSettings.homeBannerBtnText || ""}
                          onChange={(e) => setTempSettings({ ...tempSettings, homeBannerBtnText: e.target.value })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">URL DA IMAGEM DE FUNDO</label>
                        <input
                          type="text"
                          value={tempSettings.homeBannerImgUrl || ""}
                          onChange={(e) => setTempSettings({ ...tempSettings, homeBannerImgUrl: e.target.value })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white text-sans"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">DESCRIÇÃO CURTA</label>
                      <textarea
                        rows={2}
                        value={tempSettings.homeBannerDesc || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeBannerDesc: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* MIMOS BOUTIQUE INTRO HERO */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">Cabeçalho dos Mimos Boutique (Além do Óbvio)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">ETIQUETA (TAG)</label>
                        <input
                          type="text"
                          value={tempSettings.homeMimosTag || ""}
                          onChange={(e) => setTempSettings({ ...tempSettings, homeMimosTag: e.target.value })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">TÍTULO PRINCIPAL</label>
                        <input
                          type="text"
                          value={tempSettings.homeMimosTitle || ""}
                          onChange={(e) => setTempSettings({ ...tempSettings, homeMimosTitle: e.target.value })}
                          className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[8px] text-zinc-400 uppercase tracking-widest block">DESCRIÇÃO CURTA</label>
                      <input
                        type="text"
                        value={tempSettings.homeMimosDesc || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeMimosDesc: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* 4 Interactive Tabs List */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">As 4 Abas de Experiência</span>
                    <div className="space-y-4 pb-2">
                      {(tempSettings.homeMimosTabs || defaultMimosTabs).map((tab, idx) => (
                        <div key={tab.key} className="bg-[#0D1B2A]/70 border border-white/5 p-4 rounded space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="font-accent text-[9px] text-[#E8711A] font-bold">Aba: {tab.key.toUpperCase()}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="font-accent text-[8px] text-zinc-400">EMBLEMA / BADGE</label>
                              <input
                                type="text"
                                value={tab.badge}
                                onChange={(e) => {
                                  const updated = [...(tempSettings.homeMimosTabs || [])];
                                  updated[idx] = { ...tab, badge: e.target.value };
                                  setTempSettings({ ...tempSettings, homeMimosTabs: updated });
                                }}
                                className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-accent text-[8px] text-zinc-400">TÍTULO DA ABA</label>
                              <input
                                type="text"
                                value={tab.title}
                                onChange={(e) => {
                                  const updated = [...(tempSettings.homeMimosTabs || [])];
                                  updated[idx] = { ...tab, title: e.target.value };
                                  setTempSettings({ ...tempSettings, homeMimosTabs: updated });
                                }}
                                className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1.5">
                              <label className="font-accent text-[8px] text-zinc-400">TEXTO DESCRITIVO</label>
                              <textarea
                                rows={2.5}
                                value={tab.text}
                                onChange={(e) => {
                                  const updated = [...(tempSettings.homeMimosTabs || [])];
                                  updated[idx] = { ...tab, text: e.target.value };
                                  setTempSettings({ ...tempSettings, homeMimosTabs: updated });
                                }}
                                className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-accent text-[8px] text-zinc-400">URL DA IMAGEM</label>
                              <textarea
                                rows={2.5}
                                value={tab.img}
                                onChange={(e) => {
                                  const updated = [...(tempSettings.homeMimosTabs || [])];
                                  updated[idx] = { ...tab, img: e.target.value };
                                  setTempSettings({ ...tempSettings, homeMimosTabs: updated });
                                }}
                                className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white text-sans"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 6: GUIA REVERSO DE LOGISTICA */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <FileText className="w-4 h-4" /> 6. Seção: Guia de Logística Completa
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Etiqueta da Seção (Tag)</label>
                      <input
                        type="text"
                        value={tempSettings.homeLogisticaTag || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeLogisticaTag: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título Principal</label>
                      <input
                        type="text"
                        value={tempSettings.homeLogisticaTitle || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeLogisticaTitle: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Descrição Curta</label>
                    <textarea
                      rows={2}
                      value={tempSettings.homeLogisticaDesc || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, homeLogisticaDesc: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">URL da Imagem da Logística</label>
                    <input
                      type="text"
                      value={tempSettings.homeLogisticaImgUrl || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, homeLogisticaImgUrl: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                    />
                  </div>

                  {/* 3 Logistic Points Dynamic Form */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">As 3 Dicas Logísticas</span>
                    <div className="space-y-3">
                      {(tempSettings.homeLogisticaPoints || defaultLogisticaPoints).map((pt, idx) => (
                        <div key={idx} className="bg-[#0D1B2A]/70 border border-white/5 p-3 rounded space-y-2">
                          <span className="font-serif text-xs font-bold text-white block">Ponto Logístico #{idx + 1}</span>
                          <input
                            type="text"
                            placeholder="Título do Ponto"
                            value={pt.title}
                            onChange={(e) => {
                              const updated = [...(tempSettings.homeLogisticaPoints || [])];
                              updated[idx] = { ...pt, title: e.target.value };
                              setTempSettings({ ...tempSettings, homeLogisticaPoints: updated });
                            }}
                            className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                          />
                          <textarea
                            rows={2}
                            placeholder="Descrição completa"
                            value={pt.desc}
                            onChange={(e) => {
                              const updated = [...(tempSettings.homeLogisticaPoints || [])];
                              updated[idx] = { ...pt, desc: e.target.value };
                              setTempSettings({ ...tempSettings, homeLogisticaPoints: updated });
                            }}
                            className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 7: TESTIMONIALS / DEPONIMENTOS */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Users className="w-4 h-4" /> 7. Seção: Depoimentos & Histórias Reais
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Etiqueta da Seção (Tag)</label>
                      <input
                        type="text"
                        value={tempSettings.homeFeedbackTag || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeFeedbackTag: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título Principal</label>
                      <input
                        type="text"
                        value={tempSettings.homeFeedbackTitle || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeFeedbackTitle: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Descrição Opcional</label>
                    <textarea
                      rows={2}
                      value={tempSettings.homeFeedbackDesc || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, homeFeedbackDesc: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                    />
                  </div>

                  {/* Feedback items list builder */}
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block">Os 3 Depoimentos Coletados</span>
                    <div className="space-y-4">
                      {(tempSettings.homeFeedbackList || defaultFeedbackList).map((item, idx) => (
                        <div key={idx} className="bg-[#0D1B2A]/70 border border-white/5 p-4 rounded space-y-3">
                          <span className="font-serif text-xs font-bold text-white block">Depoimento #{idx + 1}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="font-accent text-[8px] text-zinc-400">NOME DO CLIENTE</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const updated = [...(tempSettings.homeFeedbackList || [])];
                                  updated[idx] = { ...item, name: e.target.value };
                                  setTempSettings({ ...tempSettings, homeFeedbackList: updated });
                                }}
                                className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-accent text-[8px] text-zinc-400">CIDADE - UF</label>
                              <input
                                type="text"
                                value={item.city}
                                onChange={(e) => {
                                  const updated = [...(tempSettings.homeFeedbackList || [])];
                                  updated[idx] = { ...item, city: e.target.value };
                                  setTempSettings({ ...tempSettings, homeFeedbackList: updated });
                                }}
                                className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-accent text-[8px] text-zinc-400">CATEGORIA / PERFIL DO CLIENTE</label>
                              <input
                                type="text"
                                value={item.role}
                                onChange={(e) => {
                                  const updated = [...(tempSettings.homeFeedbackList || [])];
                                  updated[idx] = { ...item, role: e.target.value };
                                  setTempSettings({ ...tempSettings, homeFeedbackList: updated });
                                }}
                                className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-accent text-[8px] text-zinc-400">DEPOIMENTO COMPLETO</label>
                            <textarea
                              rows={2.5}
                              value={item.quote}
                              onChange={(e) => {
                                const updated = [...(tempSettings.homeFeedbackList || [])];
                                updated[idx] = { ...item, quote: e.target.value };
                                setTempSettings({ ...tempSettings, homeFeedbackList: updated });
                              }}
                              className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 8: DOWNLOAD LIVRETE / GUIA DIGITAL */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <FileText className="w-4 h-4" /> 8. Seção: Guia Digital do Livrete
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Etiqueta do Livrete (Tag)</label>
                      <input
                        type="text"
                        value={tempSettings.homeGuideTag || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeGuideTag: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título do Livrete</label>
                      <input
                        type="text"
                        value={tempSettings.homeGuideTitle || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeGuideTitle: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Texto do Botão de Submit</label>
                      <input
                        type="text"
                        value={tempSettings.homeGuideBtnText || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeGuideBtnText: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-white tracking-widest uppercase">Descrição do Livrete</label>
                      <textarea
                        rows={1}
                        value={tempSettings.homeGuideDesc || ""}
                        onChange={(e) => setTempSettings({ ...tempSettings, homeGuideDesc: e.target.value })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* SETTINGS CARD 9: IMAGENS SECUNDÁRIAS DA HOME (MAPA, POUSADAS, REVISTA) */}
                <div className="bg-[#0D1B2A]/40 border border-white/5 p-5 rounded space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Image className="w-4 h-4" /> 9. Substituição Geração de Imagens
                  </h4>
                  <p className="font-sans text-xs text-zinc-400">Aqui você pode trocar as imagens que vêm como padrão no Mapa da Bússola, Recomendações de Pousadas e Posts do Blog na página Inicial.</p>

                  <div className="space-y-3">
                    {[
                      { key: "map-0", label: "Mapa: Praia do Farol" },
                      { key: "map-1", label: "Mapa: Prainhas do Pontal" },
                      { key: "map-2", label: "Mapa: Mirante do Pontal" },
                      { key: "map-3", label: "Mapa: Fenda de Nossa Senhora" },
                      { key: "map-4", label: "Mapa: Bistrô Praia dos Anjos" },
                      { key: "pousada-timoneiro", label: "Pousada: Timoneiro" },
                      { key: "pousada-caminho-mar", label: "Pousada: Caminho do Mar" },
                      { key: "ohana-pousada", label: "Pousada: Ohana Boutique" },
                      { key: "blog-0", label: "Blog: O que fazer em Arraial..." },
                      { key: "blog-1", label: "Blog: Prainhas do Pontal..." },
                      { key: "blog-2", label: "Blog: Baleias-Jubarte..." },
                      { key: "exp-0", label: "Roteiro Inteligente: Premium" },
                      { key: "exp-1", label: "Roteiro Inteligente: Buggy" },
                      { key: "exp-2", label: "Roteiro Inteligente: Baleias" }
                    ].map((overrideItem) => (
                      <div key={overrideItem.key} className="flex flex-col space-y-1">
                        <label className="font-accent text-[8px] text-white tracking-widest uppercase">{overrideItem.label} (URL)</label>
                        <input
                          type="text"
                          placeholder="Ex: https://images.unsplash..."
                          value={(tempSettings.homeImageOverrides || {})[overrideItem.key] || ""}
                          onChange={(e) => {
                            const overrides = { ...(tempSettings.homeImageOverrides || {}) };
                            overrides[overrideItem.key] = e.target.value;
                            setTempSettings({ ...tempSettings, homeImageOverrides: overrides });
                          }}
                          className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUBMIT ACTIONS GLOBALS */}
                <div className="flex gap-3 justify-end border-t border-white/5 pt-6">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#C45E12] font-accent text-xs font-bold uppercase rounded-sm cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4 animate-pulse" /> Salvar Ajustes Globais da Home e Contatos
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
