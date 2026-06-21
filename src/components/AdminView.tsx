/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  TrendingUp, Users, Compass, BarChart3, Settings, ShieldAlert,
  Globe, Plus, Trash2, Edit3, Eye, FileText, CheckCircle, 
  X, AlertTriangle, Play, HelpCircle, Save, Phone, MessageSquare
} from "lucide-react";
import { Experience, Lead, BlogPost, GlobalSettings, ExperienceCategory } from "../types";

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

  // Active submodule
  const [activeTab, setActiveTab] = useState<"overview" | "experiences" | "leads" | "blog" | "settings">("overview");

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
  const [tempSettings, setTempSettings] = useState<GlobalSettings>({ ...settings });

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
        included: editingExperience.included || [],
        notIncluded: editingExperience.notIncluded || [],
        meetingPoint: editingExperience.meetingPoint || "A combinar",
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
              { id: "leads", label: "Leads CRM", icon: Users, alertCount: activeLeadsCount },
              { id: "blog", label: "Revista/Blog", icon: FileText },
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
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Preço a partir de (R$)</label>
                      <input
                        type="number"
                        placeholder="Ex: 120"
                        value={editingExperience.priceFrom || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, priceFrom: parseInt(e.target.value) || 0 })}
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
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Fotos da Galeria (Cole URLs de fotos separadas por vírgulas)</label>
                      <input
                        type="text"
                        value={(editingExperience.photos || []).join(", ")}
                        onChange={(e) => setEditingExperience({ ...editingExperience, photos: e.target.value.split(",").map(s => s.trim()) })}
                        className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                      />
                    </div>
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

        {/* -------------------- TAB: SETTINGS & CONFIGS -------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-6 text-left">
            <div className="bg-[#132033] border border-white/5 p-6 rounded-sm space-y-6">
              <h3 className="font-serif text-lg font-bold">Diretivas do Operador e WhatsApp Business</h3>
              
              <form onSubmit={handleUpdateSettings} className="space-y-6">
                
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-white/5 pt-6">
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

                {/* O Diferencial Customizable Text Section */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h4 className="font-serif text-sm font-bold text-[#E8711A]">O Diferencial Guida Trips (Landing Page)</h4>
                  
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Título Principal do Diferencial</label>
                    <input
                      type="text"
                      value={tempSettings.diferencialTitle || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, diferencialTitle: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                      placeholder="Arraial merece ser vivido, não apenas visitado."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-white tracking-widest uppercase">Descrição Curta do Diferencial</label>
                    <textarea
                      rows={3}
                      value={tempSettings.diferencialDescription || ""}
                      onChange={(e) => setTempSettings({ ...tempSettings, diferencialDescription: e.target.value })}
                      className="w-full bg-[#0D1B2A] border border-white/5 p-3 text-xs text-white text-sans"
                      placeholder="Conectamos você ao melhor da Região dos Lagos através de experiências..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end border-t border-white/5 pt-6">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#E8711A] text-[#0D1B2A] hover:bg-[#C45E12] font-accent text-xs font-bold uppercase rounded-sm cursor-pointer shadow-md flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Salvar Ajustes Globais
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
