import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Calendar } from "lucide-react";
import { RoomType, RoomPricingPeriod, RoomCalendarData, MediaItem } from "../../../types";

interface RoomTypesEditorProps {
  roomTypes: RoomType[];
  onChange: (roomTypes: RoomType[]) => void;
}

export function RoomTypesEditor({ roomTypes, onChange }: RoomTypesEditorProps) {
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);

  const handleAdd = () => {
    setEditingRoom({
      id: "room-" + Date.now(),
      name: "",
      description: "",
      minGuests: 1,
      maxGuests: 2,
      photos: [],
      mediaGallery: [],
      amenities: [],
      pricingPeriods: [],
      calendar: {},
      basePrice: 0,
    });
  };

  const handleSave = (room: RoomType) => {
    const exists = roomTypes.find(r => r.id === room.id);
    let newRooms;
    if (exists) {
      newRooms = roomTypes.map(r => r.id === room.id ? room : r);
    } else {
      newRooms = [...roomTypes, room];
    }
    onChange(newRooms);
    setEditingRoom(null);
  };

  const handleRemove = (id: string) => {
    onChange(roomTypes.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Tipos de Acomodações (Quartos)</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-[#E8711A] text-white rounded-lg hover:bg-[#E8711A]/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Quarto
        </button>
      </div>

      {roomTypes.length === 0 ? (
        <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-white/50">
          Nenhum quarto cadastrado. Adicione quartos para definir preços e disponibilidade.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roomTypes.map(room => (
            <div key={room.id} className="p-4 border border-white/10 rounded-xl bg-white/5 relative group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-white">{room.name}</h4>
                  <p className="text-sm text-white/60">
                    Até {room.maxGuests} hóspedes • R$ {room.basePrice}/noite
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingRoom(room)}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(room.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingRoom && (
        <RoomEditorModal 
          room={editingRoom} 
          onSave={handleSave} 
          onClose={() => setEditingRoom(null)} 
        />
      )}
    </div>
  );
}

// Sub-component for editing a specific room
function RoomEditorModal({ room, onSave, onClose }: { room: RoomType, onSave: (r: RoomType) => void, onClose: () => void }) {
  const [formData, setFormData] = useState<RoomType>({ ...room });
  const [activeTab, setActiveTab] = useState<'info' | 'pricing' | 'calendar'>('info');
  const [amenitiesStr, setAmenitiesStr] = useState(room.amenities.join(', '));
  const [photoUrl, setPhotoUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'number') {
      finalValue = Number(value);
    } else if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        mediaGallery: [...(prev.mediaGallery || []), { id: "img-" + Date.now(), type: 'image', url: photoUrl, originalUrl: photoUrl }]
      }));
      setPhotoUrl('');
    }
  };

  const removePhoto = (idx: number) => {
    setFormData(prev => {
      const media = [...(prev.mediaGallery || [])];
      media.splice(idx, 1);
      return { ...prev, mediaGallery: media };
    });
  };

  const addPricingPeriod = () => {
    setFormData(prev => ({
      ...prev,
      pricingPeriods: [
        ...(prev.pricingPeriods || []),
        { id: "period-" + Date.now(), name: "Novo Período", startDate: "", endDate: "", price: formData.basePrice }
      ]
    }));
  };

  const updatePricingPeriod = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricingPeriods: prev.pricingPeriods.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removePricingPeriod = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pricingPeriods: prev.pricingPeriods.filter(p => p.id !== id)
    }));
  };

  const submit = () => {
    const amenities = amenitiesStr.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ ...formData, amenities });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl my-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white">Editar: {formData.name || 'Nova Acomodação'}</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-white/10 shrink-0">
          <button
            type="button"
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'info' ? 'text-[#E8711A] border-b-2 border-[#E8711A]' : 'text-white/60 hover:text-white'}`}
            onClick={() => setActiveTab('info')}
          >
            Informações & Fotos
          </button>
          <button
            type="button"
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'pricing' ? 'text-[#E8711A] border-b-2 border-[#E8711A]' : 'text-white/60 hover:text-white'}`}
            onClick={() => setActiveTab('pricing')}
          >
            Tarifário
          </button>
          <button
            type="button"
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'calendar' ? 'text-[#E8711A] border-b-2 border-[#E8711A]' : 'text-white/60 hover:text-white'}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendário & Disponibilidade
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-white/60">Nome da Acomodação</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" placeholder="Ex: Quarto Duplo Standard" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60">Máx. Hóspedes</label>
                    <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60">Diária Base (R$)</label>
                    <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Descrição Breve</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60">Comodidades (separadas por vírgula)</label>
                <input type="text" value={amenitiesStr} onChange={(e) => setAmenitiesStr(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" placeholder="Ar condicionado, TV 32, Frigobar..." />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasAirConditioning" checked={formData.hasAirConditioning} onChange={handleChange} className="w-4 h-4 rounded border-white/10 bg-black/50 text-[#E8711A] focus:ring-[#E8711A]" />
                  <span className="text-sm text-white/80">Ar Condicionado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasBalcony" checked={formData.hasBalcony} onChange={handleChange} className="w-4 h-4 rounded border-white/10 bg-black/50 text-[#E8711A] focus:ring-[#E8711A]" />
                  <span className="text-sm text-white/80">Varanda</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasHydro" checked={formData.hasHydro} onChange={handleChange} className="w-4 h-4 rounded border-white/10 bg-black/50 text-[#E8711A] focus:ring-[#E8711A]" />
                  <span className="text-sm text-white/80">Hidromassagem</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="breakfastIncluded" checked={formData.breakfastIncluded} onChange={handleChange} className="w-4 h-4 rounded border-white/10 bg-black/50 text-[#E8711A] focus:ring-[#E8711A]" />
                  <span className="text-sm text-white/80">Café Incluso</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60">Tamanho (m²)</label>
                    <input type="number" name="area" value={formData.area || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60">Camas</label>
                    <input type="text" name="beds" value={formData.beds || ''} onChange={handleChange} placeholder="Ex: 1 Cama Queen" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60">Vista</label>
                    <input type="text" name="view" value={formData.view || ''} onChange={handleChange} placeholder="Ex: Vista para o mar" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" />
                  </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <h4 className="text-sm font-bold text-white mb-4">Galeria de Fotos</h4>
                <div className="flex gap-2 mb-4">
                  <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="URL da foto..." className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#E8711A] outline-none" />
                  <button type="button" onClick={handleAddPhoto} className="px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">Adicionar</button>
                </div>
                {formData.mediaGallery && formData.mediaGallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.mediaGallery.map((m, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group">
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePhoto(idx)} className="absolute top-2 right-2 p-1 bg-black/50 rounded hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold">Tarifário Base: R$ {formData.basePrice}/noite</h3>
                  <p className="text-sm text-white/60">Defina períodos com preços diferenciados (alta temporada, feriados, etc).</p>
                </div>
                <button type="button" onClick={addPricingPeriod} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                  + Novo Período
                </button>
              </div>

              <div className="space-y-4">
                {(formData.pricingPeriods || []).map((period) => (
                  <div key={period.id} className="p-4 bg-white/5 border border-white/10 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                      <label className="text-[10px] uppercase text-white/50 font-bold tracking-wider mb-1 block">Nome do Período</label>
                      <input type="text" value={period.name} onChange={e => updatePricingPeriod(period.id, 'name', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] uppercase text-white/50 font-bold tracking-wider mb-1 block">Início</label>
                      <input type="date" value={period.startDate} onChange={e => updatePricingPeriod(period.id, 'startDate', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] uppercase text-white/50 font-bold tracking-wider mb-1 block">Fim</label>
                      <input type="date" value={period.endDate} onChange={e => updatePricingPeriod(period.id, 'endDate', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase text-white/50 font-bold tracking-wider mb-1 block">Diária (R$)</label>
                      <input type="number" value={period.price} onChange={e => updatePricingPeriod(period.id, 'price', Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm text-right" />
                    </div>
                    <div className="md:col-span-1 flex justify-end mt-4 md:mt-0">
                      <button type="button" onClick={() => removePricingPeriod(period.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg mt-4">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!formData.pricingPeriods || formData.pricingPeriods.length === 0) && (
                   <div className="text-center p-8 border border-white/10 rounded-xl text-white/40">
                     Nenhum período especial. A diária base será aplicada para todos os dias.
                   </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="p-8 border border-dashed border-white/10 rounded-xl text-center">
                <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Gerenciamento de Calendário</h3>
                <p className="text-white/60 text-sm max-w-md mx-auto">
                  A visualização de mapa interativo de calendário permite fechar dias e definir número mínimo de noites de forma visual.
                  (Funcionalidade visual em breve).
                </p>
                <p className="text-[#E8711A] text-sm mt-4 font-bold">
                  Por enquanto, a disponibilidade será baseada nos períodos criados no Tarifário.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-black/20">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-white font-medium hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={submit} className="px-6 py-2 rounded-lg bg-[#E8711A] text-white font-bold hover:bg-[#E8711A]/90 transition-colors">
            Salvar Quarto
          </button>
        </div>
      </div>
    </div>
  );
}
