import React, { useState } from 'react';
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
  Info 
} from 'lucide-react';
import { Accommodation, Destination } from '../../../types';
import { firestoreService } from '../../../firebase';
import ImageUpload from '../../../components/ImageUpload';

interface AccommodationsModuleProps {
  accommodations: Accommodation[];
  destinations: Destination[];
}

export function AccommodationsModule({ accommodations, destinations }: AccommodationsModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<'hotel' | 'pousada' | 'hostel' | 'casa' | 'apartamento'>('pousada');
  const [typeTag, setTypeTag] = useState<'boutique' | 'pe-na-areia' | 'vista' | string>('boutique');
  const [destinationId, setDestinationId] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesStr, setAmenitiesStr] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [netRate, setNetRate] = useState<number>(0);
  const [sellRate, setSellRate] = useState<number>(0);
  const [commission, setCommission] = useState<number>(0);
  const [status, setStatus] = useState<'active' | 'paused' | 'draft'>('active');
  
  // Marketing / UI fields
  const [uiTag, setUiTag] = useState('CURADORIA EXCLUSIVA');
  const [rating, setRating] = useState<number>(5.0);
  const [reviews, setReviews] = useState<number>(0);
  const [highlight, setHighlight] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setCategory('pousada');
    setTypeTag('boutique');
    setDestinationId(destinations[0]?.id || '');
    setPartnerId('');
    setDescription('');
    setAmenitiesStr('');
    setPhotos([]);
    setLocation('');
    setAddress('');
    setNetRate(0);
    setSellRate(0);
    setCommission(0);
    setStatus('active');
    setUiTag('CURADORIA EXCLUSIVA');
    setRating(5.0);
    setReviews(0);
    setHighlight('');
    setWhatsappMessage('');
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
    setPhotos(acc.photos || []);
    setLocation(acc.location || '');
    setAddress(acc.address || '');
    setNetRate(acc.netRate || 0);
    setSellRate(acc.sellRate || 0);
    setCommission(acc.commission || 0);
    setStatus(acc.status || 'active');
    
    setUiTag(acc.tag || 'CURADORIA EXCLUSIVA');
    setRating(acc.rating || 5.0);
    setReviews(acc.reviews || 0);
    setHighlight(acc.highlight || '');
    setWhatsappMessage(acc.whatsappMessage || '');
    setActiveTab('create');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const markup = sellRate > 0 && netRate > 0 ? ((sellRate - netRate) / netRate) * 100 : 20;
    const amenities = amenitiesStr.split(',').map(s => s.trim()).filter(Boolean);
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const priceDisplay = `A partir de R$ ${sellRate} / noite`;

    const accData: Partial<Accommodation> = {
      name,
      slug: generatedSlug,
      category,
      typeTag,
      destinationId: destinationId || destinations[0]?.id || '',
      partnerId,
      description,
      amenities,
      photos: photos.length > 0 ? photos : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
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
        {activeTab === 'list' && (
          <button 
            onClick={() => { resetForm(); setActiveTab('create'); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={18} />
            Nova Hospedagem
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
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Comodidades (Amenities - Separe por vírgula)</label>
                  <input type="text" value={amenitiesStr} onChange={e => setAmenitiesStr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Wi-Fi gratuito, Piscina de borda infinita, Ar-condicionado, Estacionamento" />
                </div>
              </div>

              {/* SECTION: PHOTO GALLERY */}
              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                <h4 className="text-zinc-200 font-semibold border-b border-zinc-800 pb-2">Galeria de Imagens da Hospedagem</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {photos.map((photo, idx) => (
                    <div key={`acc-photo-${idx}`} className="relative group">
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
                        folder="accommodations"
                      />
                    </div>
                  ))}
                  <ImageUpload
                    onUploadComplete={(url) => setPhotos([...photos, url])}
                    folder="accommodations"
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
    </div>
  );
}
