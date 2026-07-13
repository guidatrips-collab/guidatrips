import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
  Plus, 
  Search, 
  MapPin, 
  Star, 
  X, 
  Edit, 
  Trash2, 
  Save, 
  DollarSign, 
  Tag, 
  Coffee, 
  Info,
  Calendar,
  BrainCircuit,
  Sparkles,
  FileText,
  CheckCircle,
  Eye,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { CalendarPricingView } from '../../../components/CalendarPricingView';
import { RoomTypesEditor } from './RoomTypesEditor';
import { Accommodation, Destination, Courtesy } from '../../../types';
import { firestoreService } from '../../../firebase';
import ImageUpload from '../../../components/ImageUpload';

interface AccommodationsModuleProps {
  accommodations: Accommodation[];
  destinations: Destination[];
}

export function AccommodationsModule({ accommodations, destinations }: AccommodationsModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'calendar' | 'ai-import'>('list');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // AI Import State (Fase 0 - Proof of Concept)
  const [rawInput, setRawInput] = useState('');
  const [aiImportLoading, setAiImportLoading] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [aiImportError, setAiImportError] = useState<string | null>(null);
  const [activePocTab, setActivePocTab] = useState<'preview' | 'rooms' | 'seasons' | 'json'>('preview');
  const [showImportSuccess, setShowImportSuccess] = useState(false);

  useEffect(() => {
    // Scroll parent container to top when tab or editing state changes
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, editingId]);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<'hotel' | 'pousada' | 'hostel' | 'casa' | 'apartamento'>('pousada');
  const [typeTag, setTypeTag] = useState<'boutique' | 'pe-na-areia' | 'vista' | string>('boutique');
  const [destinationId, setDestinationId] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesStr, setAmenitiesStr] = useState('');
  const [courtesies, setCourtesies] = useState<Courtesy[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([]);
  const [draggedPhotoIdx, setDraggedPhotoIdx] = useState<number | null>(null);
  const [dragOverPhotoIdx, setDragOverPhotoIdx] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [netRate, setNetRate] = useState<number>(0);
  const [sellRate, setSellRate] = useState<number>(0);
  const [commission, setCommission] = useState<number>(0);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [status, setStatus] = useState<'active' | 'paused' | 'draft'>('active');
  
  // Marketing / UI fields
  const [uiTag, setUiTag] = useState('CURADORIA EXCLUSIVA');
  const [rating, setRating] = useState<number>(5.0);
  const [reviews, setReviews] = useState<number>(0);
  const [highlight, setHighlight] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  
  // Accommodation Specific Rules
  const [policiesStr, setPoliciesStr] = useState('');
  const [restrictionsStr, setRestrictionsStr] = useState('');
  const [occupancyRules, setOccupancyRules] = useState('');

  useEffect(() => {
    if (!destinationId && destinations.length > 0) {
      const hasArraial = destinations.some(d => d.id === 'arraial-do-cabo');
      setDestinationId(hasArraial ? 'arraial-do-cabo' : destinations[0].id);
    }
  }, [destinations, destinationId]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setCategory('pousada');
    setTypeTag('boutique');
    const hasArraial = destinations.some(d => d.id === 'arraial-do-cabo');
    setDestinationId(hasArraial ? 'arraial-do-cabo' : (destinations[0]?.id || ''));
    setPartnerId('');
    setDescription('');
    setAmenitiesStr('');
    setCourtesies([]);
    setPhotos([]);
    setMediaGallery([]);
    setLocation('');
    setAddress('');
    setNetRate(0);
    setSellRate(0);
    setCommission(0);
    setStatus('active');
    setRoomTypes([]);
    setUiTag('CURADORIA EXCLUSIVA');
    setRating(5.0);
    setReviews(0);
    setHighlight('');
    setWhatsappMessage('');
    setPoliciesStr('');
    setRestrictionsStr('');
    setOccupancyRules('');
    setActiveTab('list');
  };

  const openEdit = (acc: Accommodation) => {
    setEditingId(acc.id);
    setName(acc.name || '');
    setSlug(acc.slug || '');
    setCategory(acc.category || 'pousada');
    setTypeTag(acc.typeTag || 'boutique');
    setDestinationId(acc.destinationId || '');
    setPartnerId(acc.partnerId || '');
    setDescription(acc.description || '');
    setAmenitiesStr(acc.amenities?.join(', ') || '');
    setCourtesies(acc.courtesies || []);
    setPhotos(acc.photos || []);
    if (acc.mediaGallery && acc.mediaGallery.length > 0) {
      setMediaGallery(acc.mediaGallery);
    } else if (acc.photos && acc.photos.length > 0) {
      setMediaGallery(acc.photos.map((p, i) => ({ id: `img-${i}`, type: 'image', url: p, originalUrl: p })));
    } else {
      setMediaGallery([]);
    }
    setLocation(acc.location || '');
    setAddress(acc.address || '');
    setNetRate(acc.netRate || 0);
    setSellRate(acc.sellRate || 0);
    setCommission(acc.commission || 0);
    setStatus(acc.status || 'active');
    setRoomTypes(acc.roomTypes || []);
    
    setUiTag(acc.tag || 'CURADORIA EXCLUSIVA');
    setRating(acc.rating || 5.0);
    setReviews(acc.reviews || 0);
    setHighlight(acc.highlight || '');
    setWhatsappMessage(acc.whatsappMessage || '');
    setPoliciesStr(acc.policies?.join('\n') || '');
    setRestrictionsStr(acc.restrictions?.join('\n') || '');
    setOccupancyRules(acc.occupancyRules || '');
    setActiveTab('create');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const markup = sellRate > 0 && netRate > 0 ? ((sellRate - netRate) / netRate) * 100 : 20;
    const amenities = amenitiesStr.split(',').map(s => s.trim()).filter(Boolean);
    const policies = policiesStr.split('\n').map(s => s.trim()).filter(Boolean);
    const restrictions = restrictionsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const priceDisplay = `A partir de R$ ${sellRate} / noite`;

    const fallbackDestId = destinations.some(d => d.id === 'arraial-do-cabo') ? 'arraial-do-cabo' : (destinations[0]?.id || '');
    const accData: Partial<Accommodation> = {
      name,
      slug: generatedSlug,
      category,
      typeTag,
      destinationId: destinationId || fallbackDestId,
      partnerId,
      description,
      amenities,
      courtesies,
      mediaGallery,
      photos: mediaGallery.length > 0 ? mediaGallery.map(m => m.url) : photos.length > 0 ? photos : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
      location,
      address,
      netRate,
      sellRate,
      markup,
      commission,
      status,
      tag: uiTag,
      rating,
      reviews,
      highlight,
      whatsappMessage,
      priceDisplay,
      policies,
      restrictions,
      occupancyRules,
      roomTypes,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await firestoreService.update("accommodations", editingId, accData);
      } else {
        const newId = `acc-${Date.now()}`;
        const finalAccData = {
          ...accData,
          id: newId,
          createdAt: new Date().toISOString()
        };
        await firestoreService.set("accommodations", newId, finalAccData);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving accommodation:", err);
      alert("Erro ao salvar dados da hospedagem.");
    } finally {
      setLoading(false);
    }
  };

  // AI Import Helper Functions (Fase 0 - Proof of Concept)
  const runProgressLogs = () => {
    setAiLogs([]);
    const logs = [
      "🔍 Analisando textos e buscando termos relevantes...",
      "🏷️ Identificando categoria principal e etiqueta conceitual...",
      "🏊 Extraindo e padronizando comodidades gerais...",
      "📍 Mapeando localização, bairro e dados de endereço...",
      "🛏️ Descobrindo categorias de quartos e limites de ocupação...",
      "📅 Estruturando calendário anual de sazonalidade e tarifas...",
      "⚖️ Analisando e organizando regras, políticas e multas...",
      "✨ Aplicando IA para gerar tags inteligentes de recomendação...",
      "⚡ Finalizando estruturação de dados no padrão GuideOS..."
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setAiLogs(prev => {
          if (!aiImportLoading && index > 1) return prev; // Stop appending logs if already finished
          if (prev.includes(log)) return prev;
          return [...prev, log];
        });
      }, index * 1000);
    });
  };

  const handleAiImportSubmit = async () => {
    if (!rawInput.trim()) {
      alert("Por favor, forneça algum texto ou escolha um dos presets de demonstração.");
      return;
    }
    
    setAiImportLoading(true);
    setAiImportError(null);
    setParsedResult(null);
    runProgressLogs();
    
    try {
      const response = await fetch("/api/accommodations/ai-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput })
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erro na chamada da API de importação.");
      }
      
      setParsedResult(result.data);
      setAiLogs(prev => [...prev, "✅ Importação e estruturação concluídas com sucesso!"]);
    } catch (err: any) {
      console.error("Erro na importação de IA:", err);
      setAiImportError(err.message || "Erro de conexão com o servidor. Verifique se a API do Gemini está configurada.");
    } finally {
      setAiImportLoading(false);
    }
  };

  const handleSaveImportedToDb = async () => {
    if (!parsedResult) return;
    setLoading(true);
    
    try {
      const id = `acc-ai-${Date.now()}`;
      const slug = parsedResult.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/[^a-z0-9]+/g, '-');
        
      const finalAccData = {
        id,
        name: parsedResult.name,
        slug,
        category: parsedResult.category || "pousada",
        typeTag: parsedResult.typeTag || "boutique",
        destinationId: destinationId || (destinations.length > 0 ? destinations[0].id : "arraial-do-cabo"),
        partnerId: partnerId || `partner-${Date.now().toString().slice(-5)}`,
        description: parsedResult.description || "",
        amenities: parsedResult.amenities || [],
        photos: [
          parsedResult.category === "casa" 
            ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"
            : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
        ],
        location: parsedResult.location || "Arraial do Cabo",
        address: parsedResult.address || "Arraial do Cabo, RJ",
        netRate: parsedResult.netRate || 300,
        sellRate: parsedResult.sellRate || 400,
        markup: parsedResult.sellRate > 0 && parsedResult.netRate > 0 
          ? Number((((parsedResult.sellRate - parsedResult.netRate) / parsedResult.netRate) * 100).toFixed(1))
          : 25,
        commission: parsedResult.sellRate > 0 ? parsedResult.sellRate * 0.1 : 40,
        status: "active",
        tag: parsedResult.typeTag?.toUpperCase() || "CURADORIA",
        rating: parsedResult.rating || 5.0,
        reviews: parsedResult.reviews || 80,
        highlight: parsedResult.highlight || "",
        whatsappMessage: parsedResult.whatsappMessage || `Olá! Gostaria de consultar tarifas com benefícios exclusivos para a hospedagem ${parsedResult.name}.`,
        priceDisplay: `A partir de R$ ${parsedResult.sellRate} / noite`,
        policies: parsedResult.policies || [],
        restrictions: parsedResult.restrictions || [],
        occupancyRules: parsedResult.occupancyRules || "",
        smartTags: parsedResult.smartTags || [],
        roomCategories: parsedResult.roomCategories || [],
        seasonalPeriods: parsedResult.seasonalPeriods || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await firestoreService.set("accommodations", id, finalAccData);
      
      setShowImportSuccess(true);
      setTimeout(() => {
        setShowImportSuccess(false);
        setParsedResult(null);
        setRawInput('');
        setActiveTab('list');
      }, 3000);
    } catch (err) {
      console.error("Erro ao salvar hospedagem:", err);
      alert("Erro ao salvar hospedagem no catálogo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta hospedagem do catálogo?")) return;
    try {
      await firestoreService.delete("accommodations", id);
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Erro ao excluir hospedagem.");
    }
  };

  const filtered = accommodations.filter(a => 
    a && (
      (a.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) || 
      (a.location || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    )
  );

  return (
    <div className="w-full h-full flex flex-col relative text-zinc-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Hospedagens Curadas</h2>
          <p className="text-zinc-400 text-sm">Gerencie hotéis, pousadas, casas e apartamentos curados parceiros.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'list' && (
            <>
              <button 
                onClick={() => setActiveTab('ai-import')}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <BrainCircuit size={18} />
                Importar com IA (POC)
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <Calendar size={18} />
                Tarifário
              </button>
              <button 
                onClick={() => { resetForm(); setActiveTab('create'); }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={18} />
                Nova Hospedagem
              </button>
            </>
          )}
          {activeTab !== 'list' && (
            <button 
              onClick={() => setActiveTab('list')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              <X size={18} />
              Fechar
            </button>
          )}
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="flex-1 flex flex-col h-full">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar hospedagem..."
                className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">Nenhuma hospedagem encontrada.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(acc => (
                  <div key={acc.id} className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden group flex flex-col">
                    <div className="h-44 bg-zinc-900 relative flex-shrink-0">
                      {acc.photos && acc.photos.length > 0 ? (
                        <img src={acc.photos[0]} alt={acc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                          <Hotel size={48} />
                        </div>
                      )}
                      <div className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        acc.status === 'active' ? 'bg-emerald-500' : acc.status === 'paused' ? 'bg-amber-500' : 'bg-zinc-600'
                      }`}>
                        {acc.status === 'active' ? 'Ativo' : acc.status === 'paused' ? 'Pausado' : 'Rascunho'}
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(acc)} className="bg-blue-600 p-2 rounded hover:bg-blue-500 text-white cursor-pointer"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(acc.id)} className="bg-red-600 p-2 rounded hover:bg-red-500 text-white cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-zinc-100 text-lg truncate pr-2">{acc.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-500 text-sm mb-2 truncate">
                          <MapPin size={14} className="flex-shrink-0" /> {acc.location}
                        </div>
                        {acc.highlight && (
                          <div className="bg-zinc-900 text-zinc-400 text-xs px-2 py-1 rounded inline-block mb-4 border border-zinc-850">
                            ✨ {acc.highlight}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-zinc-800/80 mt-auto">
                        <div>
                          <div className="text-xs text-zinc-500">Tarifa Venda</div>
                          <div className="font-mono text-emerald-400 font-medium text-base">R$ {acc.sellRate?.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-zinc-500">Custo Neto</div>
                          <div className="font-mono text-zinc-400 text-xs">R$ {acc.netRate?.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleSave} className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex-1 overflow-y-auto space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors">&larr; Voltar</button>
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Hospedagem' : 'Cadastrar Nova Hospedagem'}</h3>
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-4 py-2 border border-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save size={18} />
                {loading ? 'Salvando...' : 'Salvar Hospedagem'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION: BASIC INFO */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Informações Básicas</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Nome da Hospedagem *</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Ohana Pousada Boutique" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Slug URL (Gerado automático se vazio)</label>
                    <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="ohana-pousada-boutique" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Destino Vinculado</label>
                    <select value={destinationId} onChange={e => setDestinationId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                      <option value="">(Selecione)</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                      <option value="pousada">🏡 Pousada</option>
                      <option value="hotel">🏢 Hotel</option>
                      <option value="hostel">🎒 Hostel</option>
                      <option value="casa">🔑 Casa de Temporada</option>
                      <option value="apartamento">🏢 Apartamento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Tipo de Filtro (Tags Curadas)</label>
                    <select value={typeTag} onChange={e => setTypeTag(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                      <option value="boutique">✨ Boutique / Charme</option>
                      <option value="pe-na-areia">🏖️ Pé na Areia</option>
                      <option value="vista">🌅 Vista Panorâmica</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Bairro, Cidade / UF (Localização)</label>
                    <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Praia dos Anjos, Arraial do Cabo" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Endereço Completo</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Av. Beira Mar, 150" />
                  </div>
                </div>
              </div>

              {/* SECTION: DESCRIPTIVE DETAILS */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Conteúdo de Marketing & Detalhes</h4>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição Comercial</label>
                  <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-sm font-sans" placeholder="Conteúdo envolvente detalhando os quartos, atrativos e diferenciais..." />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Diferencial / Destaque (Destaque visual do card)</label>
                  <input type="text" value={highlight} onChange={e => setHighlight(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Café da manhã flutuante na piscina" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Características Inclusas (Infraestrutura/Atributos - Separe por vírgula)</label>
                  <input type="text" value={amenitiesStr} onChange={e => setAmenitiesStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Wi-Fi gratuito, Piscina de borda infinita, Ar-condicionado, Estacionamento" />
                </div>

                <div className="border border-zinc-800/80 rounded p-4 bg-zinc-950/50 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <label className="block text-sm font-medium text-[#E8711A]">🎁 Cortesias (Benefícios Extras)</label>
                    <button
                      type="button"
                      onClick={() => setCourtesies([...courtesies, { id: `courtesy-${Date.now()}`, name: '', active: true, order: courtesies.length }])}
                      className="text-xs bg-[#E8711A] text-white px-3 py-1.5 rounded hover:bg-[#E8711A]/80 flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} /> Adicionar Cortesia
                    </button>
                  </div>
                  <div className="space-y-3">
                    {courtesies.length === 0 && <p className="text-xs text-zinc-500 italic">Nenhuma cortesia adicionada. Estes são benefícios especiais (ex: Frutas frescas, Espumante, Upgrade).</p>}
                    {courtesies.map((courtesy, idx) => (
                      <div key={courtesy.id} className="flex gap-2 items-start bg-zinc-900 p-2 rounded border border-zinc-800">
                        <input
                          type="text"
                          value={courtesy.name}
                          onChange={(e) => {
                            const newArr = [...courtesies];
                            newArr[idx].name = e.target.value;
                            setCourtesies(newArr);
                          }}
                          placeholder="Nome da Cortesia"
                          className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-1.5 rounded focus:border-[#E8711A] focus:outline-none text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = [...courtesies];
                            newArr.splice(idx, 1);
                            setCourtesies(newArr);
                          }}
                          className="p-1.5 text-zinc-500 hover:text-red-400 bg-zinc-800 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: RULES & POLICIES */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Regras e Políticas da Hospedagem</h4>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Políticas Gerais (Uma por linha)</label>
                  <textarea rows={3} value={policiesStr} onChange={e => setPoliciesStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-sm font-sans" placeholder="Ex: Cancelamento gratuito até 7 dias\nCheck-in a partir das 14h\nCheck-out até 11h" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Restrições (Uma por linha)</label>
                  <textarea rows={2} value={restrictionsStr} onChange={e => setRestrictionsStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-sm font-sans" placeholder="Ex: Não é permitido animais (No Pet)\nProibido fumar nos quartos" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Regras de Ocupação (Descrição única)</label>
                  <input type="text" value={occupancyRules} onChange={e => setOccupancyRules(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Quarto Duplo Standard acomoda até 2 adultos e 1 criança até 5 anos" />
                </div>
              </div>

              {/* SECTION: PHOTO GALLERY */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Galeria de Imagens da Hospedagem</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {mediaGallery.map((media, idx) => (
                    <div 
                      key={`photo-${idx}`}
                      className={`relative group transition-all duration-200 cursor-move ${draggedPhotoIdx === idx ? 'opacity-40 scale-95' : ''} ${dragOverPhotoIdx === idx ? 'ring-2 ring-[#E8711A] scale-105 rounded-xl z-10 shadow-xl' : ''}`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggedPhotoIdx(idx);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (draggedPhotoIdx !== null && draggedPhotoIdx !== idx) {
                          setDragOverPhotoIdx(idx);
                        }
                      }}
                      onDragLeave={() => {
                        if (dragOverPhotoIdx === idx) {
                          setDragOverPhotoIdx(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedPhotoIdx !== null && draggedPhotoIdx !== idx) {
                          const newMedia = [...mediaGallery];
                          const draggedItem = newMedia[draggedPhotoIdx];
                          newMedia.splice(draggedPhotoIdx, 1);
                          newMedia.splice(idx, 0, draggedItem);
                          setMediaGallery(newMedia);
                        }
                        setDraggedPhotoIdx(null);
                        setDragOverPhotoIdx(null);
                      }}
                      onDragEnd={() => {
                        setDraggedPhotoIdx(null);
                        setDragOverPhotoIdx(null);
                      }}
                    >
                      <div className="absolute top-2 left-2 z-20 bg-black/60 text-white rounded-md px-1.5 py-0.5 text-[10px] font-bold backdrop-blur-sm shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        Arraste para ordenar
                      </div>
                      <ImageUpload
                        currentImageUrl={media.url}
                        onUploadComplete={(url, originalUrl, cropData) => {
                          const newMedia = [...mediaGallery];
                          newMedia[idx] = { ...newMedia[idx], url, originalUrl: originalUrl || url, cropData };
                          setMediaGallery(newMedia);
                        }}
                        onRemove={() => {
                          const newMedia = mediaGallery.filter((_, i) => i !== idx);
                          setMediaGallery(newMedia);
                        }}
                        folder="accommodations"
                      />
                    </div>
                  ))}
                  <ImageUpload
                    onUploadComplete={(url, originalUrl, cropData) => setMediaGallery([...mediaGallery, {
                      id: Date.now().toString(),
                      type: "image",
                      url,
                      originalUrl: originalUrl || url,
                      cropData
                    }])}
                    folder="accommodations"
                    label="Nova Foto"
                  />
                </div>
              </div>
            </div>

            {/* ROOM TYPES (QUARTOS E TARIFÁRIOS) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md mt-6">
              <RoomTypesEditor roomTypes={roomTypes} onChange={setRoomTypes} />
            </div>

            {/* SIDEBAR COLUMNS */}
            <div className="space-y-6">
              
              {/* STATUS & HOME DISPLAY */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-100 font-semibold mb-2">Visibilidade & Status</h4>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Status Operacional</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option value="active">🟢 Ativo (Publicado)</option>
                    <option value="paused">⏸️ Pausado (Oculto)</option>
                    <option value="draft">📁 Rascunho (Oculto)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Etiqueta Visual (Badge Superior)</label>
                  <input type="text" value={uiTag} onChange={e => setUiTag(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Nota Avaliação</label>
                    <input type="number" step="0.1" value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Qtd. Avaliações</label>
                    <input type="number" value={reviews} onChange={e => setReviews(parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* INTEGRATION PARTNERS */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-100 font-semibold mb-2">Integração & Vendas</h4>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">ID do Parceiro Fornecedor (Opcional)</label>
                  <input type="text" value={partnerId} onChange={e => setPartnerId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: partner-12345" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Texto para Mensagem WhatsApp (Direct Book)</label>
                  <input type="text" value={whatsappMessage} onChange={e => setWhatsappMessage(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Gostaria de reservar a Ohana..." />
                </div>
              </div>

              {/* FINANCIAL PRICING */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-100 font-semibold mb-2 flex items-center gap-2">
                  <DollarSign size={18} className="text-emerald-500" />
                  Tarifas Diárias (R$)
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Diária NET (Custo)</label>
                    <input required type="number" step="0.01" value={netRate} onChange={e => setNetRate(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Diária Venda</label>
                    <input required type="number" step="0.01" value={sellRate} onChange={e => setSellRate(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold px-4 py-2 rounded-lg focus:border-emerald-500 focus:outline-none font-mono" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Taxa de Comissão Direta (R$ ou %)</label>
                  <input type="number" step="0.01" value={commission} onChange={e => setCommission(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none font-mono" placeholder="Ex: 50.00" />
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Markup Calculado:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {sellRate > 0 && netRate > 0 ? (((sellRate - netRate) / netRate) * 100).toFixed(1) : '20'}%
                  </span>
                </div>
              </div>

            </div>
          </div>
        </form>
      )}

      {activeTab === 'calendar' && (
        <div className="flex-1 overflow-y-auto">
          <CalendarPricingView 
            items={accommodations as any[]} 
            onUpdateItem={async (updatedAcc: any) => {
              try {
                await firestoreService.update("accommodations", updatedAcc.id, {
                  calendar: updatedAcc.calendar || {},
                  pricing: updatedAcc.pricing || {},
                  updatedAt: new Date().toISOString()
                });
              } catch (err) {
                console.error(err);
                alert("Erro ao atualizar o tarifário da hospedagem no banco de dados.");
              }
            }} 
            title="Tarifário e Disponibilidade (Hospedagens)"
            itemTypeLabel="hospedagem"
          />
        </div>
      )}

      {activeTab === 'ai-import' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {showImportSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-900/40 rounded-xl border border-zinc-800">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Hospedagem Importada com Sucesso!</h3>
              <p className="text-zinc-400 text-sm max-w-md">
                A hospedagem <strong className="text-emerald-400">{parsedResult?.name}</strong> foi cadastrada automaticamente com todas as categorias de quartos, tarifas sazonais e tags de recomendação inteligente.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
                <RefreshCw className="animate-spin text-zinc-400" size={14} />
                <span>Atualizando catálogo do GuideOS...</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
              {/* LEFT SIDE: RAW DATA INPUT & PRESETS */}
              <div className="lg:col-span-5 flex flex-col h-full bg-[#121214] border border-zinc-800 rounded-xl p-5 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="text-purple-400" size={20} />
                  <h3 className="font-bold text-zinc-100 text-base">Importador Inteligente (Fase 0 — POC)</h3>
                </div>
                
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Insira uma descrição bruta, tarifário anual ou políticas de qualquer hospedagem de Arraial do Cabo. Nosso agente de IA baseado no <strong className="text-purple-400">Gemini 3.5</strong> estruturará as informações automaticamente no modelo GuideOS.
                </p>

                {/* Presets */}
                <div className="mb-4">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Selecione uma Hospedagem Real (Presets):</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button 
                      type="button"
                      onClick={() => setRawInput(`Nome: Pousada Caminho do Sol
Categoria: Pousada
Localização: Praia Grande, Arraial do Cabo
Estilo: Boutique e romântico, ideal para casais.

Descrição:
A Pousada Caminho do Sol é famosa pela sua atmosfera intimista e acolhedora, situada a apenas 100 metros da belíssima Praia Grande, conhecida pelo pôr do sol mais espetacular de Arraial do Cabo. Com uma arquitetura rústica elegante, oferecemos uma piscina rodeada de jardins, sauna a vapor, restaurante próprio que serve pratos contemporâneos e café da manhã artesanal de alta gastronomia com pães caseiros e frutas frescas.

Comodidades Gerais: Piscina externa, Wi-Fi ultra-rápido gratuito, Café da manhã artesanal completo, Restaurante Sol & Mar, Bar de piscina, Sauna úmida, Recepção 24h, Estacionamento gratuito, Toalhas de praia disponíveis.

Acomodações / Categorias de Quartos:
1. Suíte Standard Casal: Quarto aconchegante com cama queen size, ar condicionado split, Smart TV, frigobar, banheiro privativo e decoração praiana minimalista. Ideal para 2 adultos. Tarifa base sugerida: R$ 420 por diária.
2. Suíte Master Vista Piscina: Suíte mais ampla com varanda privativa com rede de frente para a piscina, cama king size, frigobar retro, máquina de café expresso e enxoval premium de algodão egípcio. Comporta até 2 adultos e 1 criança de até 5 anos. Tarifa base sugerida: R$ 580 por diária.

Regras e Políticas:
- Cancelamento gratuito com até 7 dias de antecedência.
- Check-in a partir das 14h00 e Check-out até as 12h00.
- Não é permitida a entrada de animais de estimação (Pet-free).
- Proibido fumar nas suítes e áreas fechadas.
- Crianças de até 5 anos são cortesia na mesma cama dos pais na Suíte Master.

Períodos Tarifários:
- Alta temporada (Verão e Feriados): Multiplicador de 1.4x sobre a tarifa base, mínimo de 3 noites de hospedagem.
- Baixa temporada: Tarifa padrão, sem mínimo de noites.`)}
                      className="bg-zinc-900 border border-zinc-800 hover:border-purple-500 text-left p-3 rounded-lg transition-all group flex flex-col cursor-pointer"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs text-purple-300">Pousada Caminho do Sol</span>
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 font-mono px-1.5 py-0.5 rounded">Romântico & Praia Grande</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">Suítes casal, piscina, sauna, próximo à Praia Grande.</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setRawInput(`Nome: Pousada Capitão N'Areia
Categoria: Pousada
Localização: Praia dos Anjos, Arraial do Cabo
Estilo: Prático, familiar e com excelente localização para passeios de barco.

Descrição:
Localizada estrategicamente em frente à Praia dos Anjos, ao lado do porto (Cais da Praia dos Anjos) de onde saem todos os passeios de escuna e lanchas de Arraial do Cabo, a Pousada Capitão N'Areia é a escolha perfeita para famílias e aventureiros que buscam conveniência absoluta. Dispõe de uma bela piscina com vista para o mar, salão de jogos, playground infantil para as crianças e um restaurante com buffet completo.

Comodidades Gerais: Piscina com vista mar, Café da manhã buffet regional, Wi-Fi gratuito em toda propriedade, Recepção 24 horas, Salão de jogos, Playground infantil, Churrasqueira, Acesso direto à praia.

Acomodações / Categorias de Quartos:
1. Quarto Família Triplo: Equipado com 1 cama de casal e 1 cama de solteiro, frigobar, ar condicionado silencioso, TV a cabo e banheiro privativo. Ideal para até 3 hóspedes. Tarifa base: R$ 490 por diária.
2. Quarto Família Quádruplo: Equipado com 1 cama de casal e 2 de solteiro (ou beliche), ideal para famílias com crianças. Ar condicionado, frigobar e TV. Acomoda até 4 hóspedes. Tarifa base: R$ 590 por diária.

Regras e Políticas:
- Cancelamento sem custo se solicitado com até 15 dias de antecedência.
- Check-in a partir das 13h00 e Check-out até as 11h00.
- Aceitamos pets de pequeno porte (até 8kg) mediante taxa diária de R$ 50.
- Proibido fumar em áreas comuns e internas dos quartos.

Sazonalidades:
- Réveillon e Carnaval: Pacote fechado de no mínimo 4 noites com acréscimo de 1.8x na diária.
- Alta Temporada (Janeiro e Fevereiro): Diárias acrescidas em 1.3x, mínimo de 2 noites.`)}
                      className="bg-zinc-900 border border-zinc-800 hover:border-purple-500 text-left p-3 rounded-lg transition-all group flex flex-col cursor-pointer"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs text-purple-300">Pousada Capitão N'Areia</span>
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 font-mono px-1.5 py-0.5 rounded">Familiar & Próximo ao Porto</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">Suítes triplas/quádruplas, piscina de frente pro mar, área infantil.</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setRawInput(`Nome: Casa da Praia Vista Linda
Categoria: Casa de Temporada
Localização: Pontal do Atalaia, Arraial do Cabo
Estilo: Luxo, imersivo e espetacular.

Descrição:
Esta deslumbrante casa de temporada de alto padrão está localizada nas encostas exclusivas do Pontal do Atalaia, proporcionando uma vista panorâmica de 180 graus de tirar o fôlego para o oceano Atlântico. Com uma piscina de borda infinita que parece se fundir com o mar azul-turquesa de Arraial, a propriedade oferece total privacidade e conforto absoluto para grupos seletos ou famílias grandes. Conta com 4 suítes climatizadas, cozinha gourmet integrada, churrasqueira, deck panorâmico e acesso exclusivo por trilha particular a uma enseada de mar calmo.

Comodidades Gerais: Piscina de borda infinita, Deck panorâmico com espreguiçadeiras, Espaço Gourmet com churrasqueira e forno de pizza, Cozinha americana totalmente equipada, Wi-Fi de alta velocidade, Garagem para 3 carros, Ar condicionado em todas as suítes, Enxoval completo de cama e banho de alto padrão, Serviço de limpeza opcional.

Capacidade e Estrutura:
A casa inteira possui 4 suítes e acomoda confortavelmente até 10 pessoas (máximo de 8 adultos e 2 crianças).
Tarifa de venda sugerida: R$ 2.200 por diária (Casa Inteira). Custo net contratual com proprietário: R$ 1.600 por diária.

Políticas e Restrições:
- Reserva garantida mediante pagamento de 50% de sinal. Cancelamento gratuito em até 30 dias antes do check-in.
- Check-in: 15h00, Check-out: 10h00.
- Não é permitida a realização de eventos ou festas de grande porte sem autorização prévia.
- Animais de estimação são muito bem-vindos (Pet-friendly).
- Proibido fumar no interior da residência.

Sazonalidades de Aluguel:
- Alta temporada (Dezembro a Março): R$ 3.000 / diária, mínimo de 5 noites.
- Baixa temporada: R$ 1.800 / diária, mínimo de 3 noites.`)}
                      className="bg-zinc-900 border border-zinc-800 hover:border-purple-500 text-left p-3 rounded-lg transition-all group flex flex-col cursor-pointer"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs text-purple-300">Casa da Praia Vista Linda</span>
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 font-mono px-1.5 py-0.5 rounded">Luxo & Pontal do Atalaia</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">Casa inteira, piscina de borda infinita, vista espetacular 180° mar.</span>
                    </button>
                  </div>
                </div>

                {/* Raw Input Text Area */}
                <div className="flex-1 flex flex-col min-h-[220px] mb-4">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Dados Brutos da Hospedagem:</label>
                  <textarea
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Cole aqui textos, comodidades, descrições de quartos, calendários brutos ou políticas da hospedagem..."
                    className="flex-1 w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Trigger Button & Loading */}
                {aiImportLoading ? (
                  <div className="bg-purple-950/20 border border-purple-900/40 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="animate-spin text-purple-400" size={18} />
                      <span className="font-medium text-xs text-purple-200">Interpretando e estruturando dados...</span>
                    </div>
                    <div className="space-y-1.5 border-t border-purple-900/30 pt-2.5 max-h-[140px] overflow-y-auto">
                      {aiLogs.map((log, idx) => (
                        <div key={`log-${idx}`} className="text-[10px] text-purple-300 flex items-center gap-1.5 font-mono">
                          <span className="text-purple-500">›</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAiImportSubmit}
                    disabled={!rawInput.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-950/20"
                  >
                    <Sparkles size={16} />
                    Interpretar & Estruturar com IA
                  </button>
                )}

                {aiImportError && (
                  <div className="mt-4 bg-red-950/20 border border-red-900/40 rounded-lg p-3.5 flex gap-2 text-xs text-red-300">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-200">Erro no Processamento</p>
                      <p className="mt-0.5 leading-relaxed">{aiImportError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: STRUCTURING PREVIEW & DB MAP */}
              <div className="lg:col-span-7 flex flex-col h-full bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
                {!parsedResult ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500">
                    <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mb-3 text-zinc-600">
                      <FileText size={32} />
                    </div>
                    <h4 className="font-bold text-zinc-300 mb-1">Aguardando Interpretação</h4>
                    <p className="text-xs text-zinc-500 max-w-sm">
                      Escolha um dos presets ou cole dados brutos de uma hospedagem na coluna ao lado e clique em "Interpretar & Estruturar com IA" para rodar a Prova de Conceito.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header Controls */}
                    <div className="border-b border-zinc-800 p-4 bg-zinc-900/40 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold px-2 py-0.5 rounded uppercase">
                            {parsedResult.category}
                          </span>
                          <span className="text-xs text-zinc-400 font-medium">Arraial do Cabo, RJ</span>
                        </div>
                        <h4 className="font-bold text-zinc-100 text-base mt-1">{parsedResult.name}</h4>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleSaveImportedToDb}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
                      >
                        <CheckCircle size={14} />
                        Confirmar e Cadastrar no Catálogo
                      </button>
                    </div>

                    {/* Navigation Tabs for Preview */}
                    <div className="flex border-b border-zinc-800 px-4 bg-zinc-900/20">
                      {[
                        { id: 'preview', label: 'Preview no Painel', icon: Eye },
                        { id: 'rooms', label: 'Quartos extraídos', icon: Coffee },
                        { id: 'seasons', label: 'Sazonalidades IA', icon: Calendar },
                        { id: 'json', label: 'JSON Estruturado', icon: FileText }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActivePocTab(tab.id as any)}
                          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                            activePocTab === tab.id 
                              ? 'border-purple-500 text-purple-300 bg-purple-500/5' 
                              : 'border-transparent text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <tab.icon size={13} />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content Panels */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      {activePocTab === 'preview' && (
                        <div className="space-y-4">
                          {/* Bento Grid layout */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Live Card Render Mock */}
                            <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between">
                              <div className="h-36 bg-zinc-900 relative">
                                <img 
                                  src={
                                    parsedResult.category === 'casa' 
                                      ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" 
                                      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                                  } 
                                  alt={parsedResult.name} 
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute top-2 right-2 bg-purple-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase text-white font-mono">
                                  {parsedResult.typeTag || "Curadoria"}
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                  <Star size={10} className="fill-amber-400 text-amber-400" />
                                  <span className="font-bold">{parsedResult.rating || '5.0'}</span>
                                  <span className="text-zinc-400">({parsedResult.reviews || '120'} reviews)</span>
                                </div>
                              </div>
                              <div className="p-4 space-y-2">
                                <h5 className="font-bold text-sm text-zinc-100">{parsedResult.name}</h5>
                                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                                  <MapPin size={11} className="text-purple-400" />
                                  <span>{parsedResult.location}</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                                  {parsedResult.description}
                                </p>
                                <div className="border-t border-zinc-800/60 pt-2 flex justify-between items-center text-xs">
                                  <span className="text-zinc-500">Média Diária:</span>
                                  <span className="text-purple-400 font-bold font-mono">
                                    R$ {parsedResult.sellRate}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Intelligent Recommendations Profiler */}
                            <div className="bg-zinc-950/20 border border-purple-950/40 rounded-xl p-4 flex flex-col justify-between">
                              <div>
                                <h5 className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 mb-2.5">
                                  <Sparkles size={12} />
                                  Mecanismo de Recomendação IA
                                </h5>
                                
                                <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                                  Tags inteligentes identificadas para os algoritmos de Match Personalizado de roteiros:
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                  {parsedResult.smartTags?.map((tag: string, idx: number) => (
                                    <span key={`smarttag-${idx}`} className="text-[10px] bg-purple-500/10 text-purple-300 font-medium px-2 py-0.5 rounded border border-purple-500/10">
                                      ✨ {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="border-t border-zinc-800/60 pt-3 mt-3 text-[11px] text-zinc-400 space-y-1.5">
                                <div className="flex justify-between">
                                  <span>Destaque Curadoria:</span>
                                  <span className="font-medium text-zinc-200 text-right line-clamp-1 max-w-[150px]">{parsedResult.highlight}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Bairro Match:</span>
                                  <span className="font-medium text-purple-300">{parsedResult.location}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Estilo:</span>
                                  <span className="font-medium text-emerald-400 capitalize">{parsedResult.typeTag}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="bg-zinc-950/20 border border-zinc-800/60 rounded-xl p-4">
                            <h5 className="text-xs font-semibold text-zinc-300 mb-2.5">Comodidades Extraídas & Normalizadas ({parsedResult.amenities?.length || 0}):</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {parsedResult.amenities?.map((am: string, idx: number) => (
                                <div key={`preview-am-${idx}`} className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                  <span>{am}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Policies */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-zinc-950/20 border border-zinc-800/60 rounded-xl p-4">
                              <h5 className="text-xs font-semibold text-zinc-300 mb-2">Políticas Gerais:</h5>
                              <ul className="space-y-1.5">
                                {parsedResult.policies?.map((pol: string, idx: number) => (
                                  <li key={`preview-pol-${idx}`} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                                    <span className="text-purple-400 mt-0.5">•</span>
                                    <span>{pol}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-zinc-950/20 border border-zinc-800/60 rounded-xl p-4">
                              <h5 className="text-xs font-semibold text-zinc-300 mb-2">Restrições & Regras:</h5>
                              <ul className="space-y-1.5">
                                {parsedResult.restrictions?.map((rest: string, idx: number) => (
                                  <li key={`preview-rest-${idx}`} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    <span>{rest}</span>
                                  </li>
                                ))}
                                {parsedResult.occupancyRules && (
                                  <li className="text-[11px] text-zinc-400 flex items-start gap-1.5 border-t border-zinc-800/40 pt-1.5 mt-1.5">
                                    <span className="text-amber-400 mt-0.5">ℹ️</span>
                                    <span className="font-semibold text-zinc-300">{parsedResult.occupancyRules}</span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePocTab === 'rooms' && (
                        <div className="space-y-4">
                          <p className="text-xs text-zinc-400 mb-2">
                            A inteligência extraiu as seguintes categorias de quartos para reservas independentes:
                          </p>
                          <div className="space-y-4">
                            {parsedResult.roomCategories?.map((room: any, idx: number) => (
                              <div key={`room-${idx}`} className="bg-zinc-950/30 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-sm text-zinc-100">{room.name}</h5>
                                    <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                                      Max {room.capacityMax} pessoas
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed">{room.description}</p>
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {room.amenities?.map((am: string, amIdx: number) => (
                                      <span key={`room-am-${amIdx}`} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                                        {am}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-zinc-800 md:pl-5 pt-3 md:pt-0 flex flex-col justify-center items-end min-w-[120px]">
                                  <span className="text-[10px] text-zinc-500 font-mono">Custo (NET): R$ {room.netPrice}</span>
                                  <span className="text-base font-extrabold text-emerald-400 font-mono mt-0.5 font-bold">R$ {room.basePrice}</span>
                                  <span className="text-[10px] text-zinc-500 mt-1">por diária base</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activePocTab === 'seasons' && (
                        <div className="space-y-4">
                          <p className="text-xs text-zinc-400 mb-2">
                            Regras de sazonalidade mapeadas automaticamente no calendário tarifário anual do GuideOS:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {parsedResult.seasonalPeriods?.map((season: any, idx: number) => (
                              <div key={`season-${idx}`} className="bg-zinc-950/20 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                                <div className="space-y-1">
                                  <h5 className="font-bold text-xs text-zinc-100">{season.name}</h5>
                                  <div className="text-[10px] text-zinc-500 font-mono flex gap-1">
                                    <span>{season.startDate}</span>
                                    <span>até</span>
                                    <span>{season.endDate}</span>
                                  </div>
                                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded inline-block mt-1 ${
                                    season.type === 'high' ? 'bg-amber-500/10 text-amber-300' : 'bg-blue-500/10 text-blue-300'
                                  }`}>
                                    Sazonalidade: {season.type === 'high' ? 'Alta Temporada' : 'Baixa Temporada'}
                                  </span>
                                </div>
                                <div className="text-right flex flex-col">
                                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Multiplicador</span>
                                  <span className="text-lg font-bold text-purple-300 font-mono mt-0.5 font-bold">{season.priceMultiplier}x</span>
                                  {season.minNights && (
                                    <span className="text-[10px] text-zinc-500">mín. {season.minNights} noites</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activePocTab === 'json' && (
                        <div className="relative">
                          <pre className="bg-zinc-950 border border-zinc-800 text-purple-300 text-[10px] font-mono p-4 rounded-xl overflow-x-auto leading-relaxed max-h-[400px]">
                            {JSON.stringify(parsedResult, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
