import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Map, 
  Edit, 
  Trash, 
  Activity, 
  X, 
  Save, 
  Clock, 
  Compass, 
  Users, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Experience, Destination, ExperienceCategory, Courtesy } from '../../../types';
import { firestoreService } from '../../../firebase';
import ImageUpload from '../../../components/ImageUpload';

interface ProductsModuleProps {
  experiences: Experience[];
  destinations: Destination[];
}

export function ProductsModule({ experiences, destinations }: ProductsModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    // Scroll parent container to top when tab or editing state changes
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, editingId]);

  // Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [category, setCategory] = useState('nautico');
  const [duration, setDuration] = useState('2 horas');
  const [departureCity, setDepartureCity] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [priceFrom, setPriceFrom] = useState(0);
  const [promotionalPrice, setPromotionalPrice] = useState<number | undefined>(undefined);
  
  // Pricing
  const [adultPrice, setAdultPrice] = useState(0);
  const [childPrice, setChildPrice] = useState(0);
  const [babyPrice, setBabyPrice] = useState(0);

  // Availability
  const [availType, setAvailType] = useState<'daily' | 'specific_days'>('daily');
  const [daysOfWeekStr, setDaysOfWeekStr] = useState('');
  const [schedulesStr, setSchedulesStr] = useState('');
  const [checkInMinutesBefore, setCheckInMinutesBefore] = useState<number | undefined>(undefined);
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(undefined);
  const [safetyBufferMinutes, setSafetyBufferMinutes] = useState<number | undefined>(undefined);

  const [partnerName, setPartnerName] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [badge, setBadge] = useState<'mais-vendido' | 'novidade' | 'temporada' | ''>('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [videoEmbed, setVideoEmbed] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [draggedPhotoIdx, setDraggedPhotoIdx] = useState<number | null>(null);
  const [dragOverPhotoIdx, setDragOverPhotoIdx] = useState<number | null>(null);
  
  // Lists
  const [highlightsStr, setHighlightsStr] = useState('');
  const [bringItemsStr, setBringItemsStr] = useState('');
  const [includedStr, setIncludedStr] = useState('');
  const [notIncludedStr, setNotIncludedStr] = useState('');
  const [itineraryStr, setItineraryStr] = useState('');
  const [policiesStr, setPoliciesStr] = useState('');
  const [courtesies, setCourtesies] = useState<Courtesy[]>([]);

  const [status, setStatus] = useState<'active' | 'paused' | 'draft'>('active');
  const [location, setLocation] = useState('Arraial do Cabo');
  const [featured, setFeatured] = useState(false);
  const [netRate, setNetRate] = useState(0);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDestinationId(destinations[0]?.id || '');
    setCategory('nautico');
    setDuration('2 horas');
    setDepartureCity('');
    setMinAge('');
    setMaxAge('');
    setPriceFrom(0);
    setPromotionalPrice(undefined);
    setAdultPrice(0);
    setChildPrice(0);
    setBabyPrice(0);
    setAvailType('daily');
    setDaysOfWeekStr('');
    setSchedulesStr('');
    setCheckInMinutesBefore(undefined);
    setDurationMinutes(undefined);
    setSafetyBufferMinutes(undefined);
    setPartnerName('');
    setGoogleMapsUrl('');
    setCapacity(10);
    setBadge('');
    setShortDesc('');
    setFullDesc('');
    setMeetingPoint('');
    setVideoEmbed('');
    setPhotos([]);
    setHighlightsStr('');
    setBringItemsStr('');
    setIncludedStr('');
    setNotIncludedStr('');
    setItineraryStr('');
    setPoliciesStr('');
    setCourtesies([]);
    setStatus('active');
    setLocation('Arraial do Cabo');
    setFeatured(false);
    setNetRate(0);
    setActiveTab('list');
  };

  const openEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setName(exp.name || '');
    setSlug(exp.slug || '');
    setDestinationId(exp.destinationId || '');
    setCategory(exp.category || 'nautico');
    setDuration(exp.duration || '2 horas');
    setDepartureCity(exp.departureCity || '');
    setMinAge(exp.minAge || '');
    setMaxAge(exp.maxAge || '');
    setPriceFrom(exp.priceFrom || 0);
    setPromotionalPrice(exp.promotionalPrice);
    
    setAdultPrice(exp.pricing?.adultPrice || 0);
    setChildPrice(exp.pricing?.childPrice || 0);
    setBabyPrice(exp.pricing?.babyPrice || 0);

    setAvailType(exp.availability?.type || 'daily');
    setDaysOfWeekStr(exp.availability?.daysOfWeek?.join(', ') || '');
    setSchedulesStr(exp.schedules?.join(', ') || '');
    setCheckInMinutesBefore(exp.checkInMinutesBefore);
    setDurationMinutes(exp.durationMinutes);
    setSafetyBufferMinutes(exp.safetyBufferMinutes);

    setPartnerName(exp.partnerName || '');
    setGoogleMapsUrl(exp.googleMapsUrl || '');
    setCapacity(exp.capacity || 10);
    setBadge(exp.badge || '');
    setShortDesc(exp.shortDescription || '');
    setFullDesc(exp.fullDescription || '');
    setMeetingPoint(exp.meetingPoint || '');
    setVideoEmbed(exp.videoEmbed || '');
    setPhotos(exp.photos || []);
    
    setHighlightsStr(exp.highlights?.join('\n') || '');
    setBringItemsStr(exp.bringItems?.join('\n') || '');
    setIncludedStr(exp.included?.join('\n') || '');
    setNotIncludedStr(exp.notIncluded?.join('\n') || '');
    setItineraryStr(exp.itinerary?.join('\n') || '');
    setPoliciesStr(exp.policies?.join('\n') || '');
    setCourtesies(exp.courtesies || []);

    setStatus(exp.status || 'active');
    setLocation(exp.location || 'Arraial do Cabo');
    setFeatured(exp.featured || false);
    setNetRate(exp.netRate || 0);

    setActiveTab('create');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const markup = priceFrom > 0 && netRate > 0 ? ((priceFrom - netRate) / netRate) * 100 : 20;

    const daysOfWeek = daysOfWeekStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const schedules = schedulesStr.split(',').map(s => s.trim()).filter(Boolean);
    const highlights = highlightsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const bringItems = bringItemsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const included = includedStr.split('\n').map(s => s.trim()).filter(Boolean);
    const notIncluded = notIncludedStr.split('\n').map(s => s.trim()).filter(Boolean);
    const itinerary = itineraryStr.split('\n').map(s => s.trim()).filter(Boolean);
    const policies = policiesStr.split('\n').map(s => s.trim()).filter(Boolean);

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const expData: Partial<Experience> = {
      name,
      slug: generatedSlug,
      destinationId: destinationId || destinations[0]?.id || '',
      category,
      duration,
      departureCity,
      minAge,
      maxAge,
      priceFrom,
      promotionalPrice: promotionalPrice || undefined,
      netRate,
      markup,
      pricing: {
        adultPrice: adultPrice || priceFrom,
        childPrice: childPrice || undefined,
        babyPrice: babyPrice || undefined
      },
      availability: {
        type: availType,
        daysOfWeek: availType === 'specific_days' ? daysOfWeek : [],
        slots: schedules.map(time => ({ time, capacity }))
      },
      schedules,
      checkInMinutesBefore: checkInMinutesBefore !== undefined ? checkInMinutesBefore : undefined,
      durationMinutes: durationMinutes !== undefined ? durationMinutes : undefined,
      safetyBufferMinutes: safetyBufferMinutes !== undefined ? safetyBufferMinutes : undefined,
      partnerName,
      googleMapsUrl,
      capacity,
      badge: badge || "",
      shortDescription: shortDesc,
      fullDescription: fullDesc,
      meetingPoint: meetingPoint || 'A combinar',
      videoEmbed,
      photos: photos.length > 0 ? photos : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"],
      highlights,
      bringItems,
      included,
      notIncluded,
      courtesies,
      itinerary,
      policies,
      status,
      location,
      featured,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await firestoreService.update("experiences", editingId, expData);
      } else {
        const newId = `exp-${Date.now()}`;
        const finalExpData = {
          ...expData,
          id: newId,
          createdAt: new Date().toISOString(),
          coordinates: { lat: -22.9715, lng: -42.0224 }
        };
        await firestoreService.set("experiences", newId, finalExpData);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar as informações do passeio.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta experiência? Todos os canais de venda serão afetados.')) return;
    try {
      await firestoreService.delete("experiences", id);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir passeio do catálogo.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative text-zinc-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Catálogo de Passeios (Tours)</h2>
          <p className="text-zinc-400 text-sm">Controle de saídas, tarifas, lotações e exibição integrada no site.</p>
        </div>
        {activeTab === 'list' && (
          <button 
            onClick={() => { resetForm(); setActiveTab('create'); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={18} />
            Novo Passeio
          </button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="flex-1 flex flex-col h-full">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome, cidade ou parceiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Passeio</th>
                  <th className="px-6 py-4">Tarifa Neto (Custo)</th>
                  <th className="px-6 py-4">Tarifa Venda</th>
                  <th className="px-6 py-4">Margem</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {experiences.filter(e => e && (e.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())).map((exp) => {
                  const estNetRate = exp.netRate || 0;
                  const margin = exp.priceFrom - estNetRate;
                  const marginPercent = estNetRate > 0 ? ((margin / estNetRate) * 100).toFixed(1) : '0.0';

                  return (
                    <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={exp.photos?.[0]} className="w-12 h-12 object-cover rounded" alt="Cover" />
                          <div>
                            <div className="font-medium text-zinc-100">{exp.name}</div>
                            <div className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                              <Map size={12} /> {exp.location || 'Arraial do Cabo'}
                              <span className="mx-1">•</span>
                              <Compass size={12} /> {exp.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-400">
                        {estNetRate > 0 ? `R$ ${estNetRate.toFixed(2)}` : 'Não definido'}
                      </td>
                      <td className="px-6 py-4 font-mono text-emerald-400 font-medium">R$ {exp.priceFrom.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs font-mono">
                          {marginPercent}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          exp.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 
                          exp.status === 'paused' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {exp.status === 'active' ? 'Ativo' : exp.status === 'paused' ? 'Pausado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEdit(exp)} className="p-2 text-zinc-400 hover:text-blue-400 transition-colors" title="Editar"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(exp.id)} className="p-2 text-zinc-400 hover:text-red-400 transition-colors" title="Excluir"><Trash size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {experiences.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                      Nenhum passeio cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleSave} className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex-1 overflow-y-auto space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors">&larr; Voltar</button>
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Passeio' : 'Cadastrar Novo Passeio'}</h3>
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION: BASIC INFO */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Informações Principais</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Nome do Passeio / Experiência *</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Passeio de Lancha VIP" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Slug URL (Gerado automático se vazio)</label>
                    <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="passeio-lancha-vip" />
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
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                      <option value="nautico">🚤 Náutico</option>
                      <option value="off-road">🚙 Off-Road</option>
                      <option value="cultura">🏛️ Cultura</option>
                      <option value="gastronomia">🍴 Gastronomia</option>
                      <option value="temporada">🐋 Temporada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Cidade de Partida</label>
                    <input type="text" value={departureCity} onChange={e => setDepartureCity(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Arraial do Cabo RJ" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Duração Textual</label>
                    <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: 4 horas" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Idade Mínima</label>
                    <input type="text" value={minAge} onChange={e => setMinAge(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: 2 anos" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Idade Máxima</label>
                    <input type="text" value={maxAge} onChange={e => setMaxAge(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: 70 anos" />
                  </div>
                </div>
              </div>

              {/* SECTION: DESCRIPTIONS & CONTENT */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Conteúdo Literário & Descrições</h4>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Breve Resumo (cards de listagem - máx 150 caracteres)</label>
                  <input type="text" value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Resumo simples..." />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição Completa e Detalhes da Aventura</label>
                  <textarea rows={6} value={fullDesc} onChange={e => setFullDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none font-sans text-sm" placeholder="Detalhes completos que encantam o cliente..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Ponto de Encontro Oficial</label>
                    <input type="text" value={meetingPoint} onChange={e => setMeetingPoint(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Píer da Praia dos Anjos" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Vídeo de Destaque (Link do YouTube/Vimeo)</label>
                    <input type="text" value={videoEmbed} onChange={e => setVideoEmbed(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="https://..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Destaques Principais (Um por linha)</label>
                    <textarea rows={3} value={highlightsStr} onChange={e => setHighlightsStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-xs" placeholder="Ex: Guia Local Credenciado&#10;Equipamentos de snorkel inclusos" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">O que levar (Um por linha)</label>
                    <textarea rows={3} value={bringItemsStr} onChange={e => setBringItemsStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-xs" placeholder="Ex: Toalha de banho&#10;Protetor Solar" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Características Inclusas (Infraestrutura/Atributos - Um por linha)</label>
                    <textarea rows={3} value={includedStr} onChange={e => setIncludedStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-xs" placeholder="Ex: Guia credenciado&#10;Colete salva-vidas&#10;Banheiro a bordo" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">O que NÃO está incluso (Um por linha)</label>
                    <textarea rows={3} value={notIncludedStr} onChange={e => setNotIncludedStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-xs" placeholder="Ex: Taxa de embarque da prefeitura&#10;Almoço" />
                  </div>
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
                    {courtesies.length === 0 && <p className="text-xs text-zinc-500 italic">Nenhuma cortesia adicionada. Estes são benefícios especiais (ex: Água mineral, Fotos gratuitas, Espumante).</p>}
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
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Roteiro Completo (Título: Descrição - Um por linha)</label>
                  <textarea rows={4} value={itineraryStr} onChange={e => setItineraryStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-xs font-sans" placeholder="Ex: Parada na Praia do Forno: 40 min para mergulho livre.&#10;Parada nas Prainhas: Desembarque direto na areia." />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Políticas (Pagamento, Cancelamento, Reembolso - Um por linha)</label>
                  <textarea rows={4} value={policiesStr} onChange={e => setPoliciesStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-xs font-sans" placeholder="Ex: Cancelamento gratuito até 48h antes.&#10;Pagamento de 50% para reserva." />
                </div>
              </div>

              {/* SECTION: MEDIA GALLERY */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Galeria de Fotos do Passeio</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {photos.map((photo, idx) => (
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
                          const newPhotos = [...photos];
                          const draggedItem = newPhotos[draggedPhotoIdx];
                          newPhotos.splice(draggedPhotoIdx, 1);
                          newPhotos.splice(idx, 0, draggedItem);
                          setPhotos(newPhotos);
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
                        currentImageUrl={photo}
                        onUploadComplete={(url) => {
                          const newPhotos = [...photos];
                          newPhotos[idx] = url;
                          setPhotos(newPhotos);
                        }}
                        onRemove={() => {
                          const newPhotos = photos.filter((_, i) => i !== idx);
                          setPhotos(newPhotos);
                        }}
                        folder="experiences"
                      />
                    </div>
                  ))}
                  <ImageUpload
                    onUploadComplete={(url) => setPhotos([...photos, url])}
                    folder="experiences"
                    label="Nova Foto"
                  />
                </div>
              </div>
            </div>

            {/* SIDEBAR COLUMNS */}
            <div className="space-y-6">
              
              {/* STATUS & HOME DISPLAY */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-100 font-semibold mb-2">Visibilidade & Status</h4>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Status Operacional</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option value="active">🟢 Ativo (Exibir no site)</option>
                    <option value="paused">⏸️ Pausado (Indisponível)</option>
                    <option value="draft">📁 Rascunho (Oculto)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Cidade / Região do Site</label>
                  <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option value="Arraial do Cabo">Arraial do Cabo</option>
                    <option value="Cabo Frio">Cabo Frio</option>
                    <option value="Búzios">Búzios</option>
                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                    <option value="Angra dos Reis">Angra dos Reis</option>
                    <option value="Paraty">Paraty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Tag Promocional / Badge</label>
                  <select value={badge} onChange={e => setBadge(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option value="">Nenhuma</option>
                    <option value="mais-vendido">🔥 Mais vendido</option>
                    <option value="novidade">✨ Novidade</option>
                    <option value="temporada">🐋 Temporada</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={featured}
                    onChange={e => setFeatured(e.target.checked)}
                    className="w-4 h-4 bg-zinc-950 border border-zinc-800 accent-blue-600 rounded"
                  />
                  <label htmlFor="feat" className="text-xs text-zinc-300 font-medium cursor-pointer">Destacar na Home do site?</label>
                </div>
              </div>

              {/* LOGISTICS */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-100 font-semibold mb-2">Operação & Logística</h4>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Parceiro Operador Responsável</label>
                  <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Passeios Incríveis Ltda" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Link Google Maps do Ponto</label>
                  <input type="text" value={googleMapsUrl} onChange={e => setGoogleMapsUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="https://maps.app.goo.gl/..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Lotação Máx.</label>
                    <input type="number" value={capacity} onChange={e => setCapacity(parseInt(e.target.value) || 10)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Check-In Antecip. (min)</label>
                    <input type="number" placeholder="Ex: 30" value={checkInMinutesBefore !== undefined ? checkInMinutesBefore : ''} onChange={e => setCheckInMinutesBefore(e.target.value === '' ? undefined : parseInt(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Duração Est. (min)</label>
                    <input type="number" placeholder="Ex: 240" value={durationMinutes !== undefined ? durationMinutes : ''} onChange={e => setDurationMinutes(e.target.value === '' ? undefined : parseInt(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Segurança Buffer (min)</label>
                    <input type="number" placeholder="Ex: 60" value={safetyBufferMinutes !== undefined ? safetyBufferMinutes : ''} onChange={e => setSafetyBufferMinutes(e.target.value === '' ? undefined : parseInt(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* PRICING INTELLIGENCE */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-100 font-semibold mb-2 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  Inteligência Tarifária (Adultos, Crianças)
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Custo Neto (Parceiro)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">R$</span>
                      <input required type="number" step="0.01" value={netRate} onChange={e => setNetRate(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 pl-8 pr-3 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Preço Venda Base</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">R$</span>
                      <input required type="number" step="0.01" value={priceFrom} onChange={e => setPriceFrom(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 pl-8 pr-3 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Preço Promocional (Opcional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">R$</span>
                    <input type="number" step="0.01" value={promotionalPrice !== undefined ? promotionalPrice : ''} onChange={e => setPromotionalPrice(e.target.value === '' ? undefined : Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 pl-8 pr-3 py-2 rounded-lg focus:border-blue-500 focus:outline-none text-sm" />
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-xs space-y-3">
                  <p className="text-zinc-400">Preços Detalhados do Grid:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">Adulto *</label>
                      <input required type="number" value={adultPrice} onChange={e => setAdultPrice(parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-2 py-1.5 rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">Criança</label>
                      <input type="number" value={childPrice} onChange={e => setChildPrice(parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-2 py-1.5 rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-0.5">Bebê</label>
                      <input type="number" value={babyPrice} onChange={e => setBabyPrice(parseInt(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-2 py-1.5 rounded text-xs" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-zinc-500">Margem Comercial:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {priceFrom > 0 && netRate > 0 ? (((priceFrom - netRate) / netRate) * 100).toFixed(1) : '20'}%
                    </span>
                  </div>
                </div>
              </div>

              {/* SCHEDULE FREQUENCY */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-100 font-semibold mb-2">Frequência & Horários</h4>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Tipo de Frequência</label>
                  <select value={availType} onChange={e => setAvailType(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option value="daily">Todos os dias</option>
                    <option value="specific_days">Dias Específicos da Semana</option>
                  </select>
                </div>

                {availType === 'specific_days' && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Dias Permitidos (0=Dom, 6=Sáb, separe por vírgula)</label>
                    <input type="text" value={daysOfWeekStr} onChange={e => setDaysOfWeekStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: 1, 2, 3, 4, 5 (Seg a Sex)" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Horários de Saída (Separe por vírgula)</label>
                  <input required type="text" value={schedulesStr} onChange={e => setSchedulesStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: 08:30, 11:30, 14:30" />
                </div>
              </div>

            </div>
          </div>
        </form>
      )}
    </div>
  );
}
