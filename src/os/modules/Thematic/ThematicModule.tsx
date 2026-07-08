import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Search, MapPin } from 'lucide-react';
import { Destination, Experience, Accommodation, Partner } from '../../../types';
import { ThematicItinerary, ThematicItineraryDay, ThematicItineraryItem } from '../../../types';
import { firestoreService } from '../../../firebase';

interface ThematicModuleProps {
  thematicItineraries: ThematicItinerary[];
  destinations: Destination[];
  experiences: Experience[];
  accommodations: Accommodation[];
  partners: Partner[];
}

export function ThematicModule({ 
  thematicItineraries, 
  destinations, 
  experiences, 
  accommodations, 
  partners 
}: ThematicModuleProps) {
  const [editingItem, setEditingItem] = useState<Partial<ThematicItinerary> | null>(null);

  const handleSave = async () => {
    if (!editingItem?.name || !editingItem?.destinationId) {
      alert("Preencha os campos obrigatórios (Nome, Destino)");
      return;
    }

    try {
      const isNew = !editingItem.id;
      const id = editingItem.id || `thematic-${Date.now()}`;
      
      const payload: ThematicItinerary = {
        id,
        destinationId: editingItem.destinationId || "",
        slug: editingItem.slug || editingItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        name: editingItem.name || "",
        description: editingItem.description || "",
        days: editingItem.days || 1,
        audience: editingItem.audience || [],
        priceRange: editingItem.priceRange || "",
        bestSeason: editingItem.bestSeason || "",
        difficulty: editingItem.difficulty || "",
        coverImage: editingItem.coverImage || "",
        status: editingItem.status || "active",
        schedule: editingItem.schedule || [],
        createdAt: editingItem.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await firestoreService.set("thematicItineraries", id, payload);
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar roteiro.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Confirmar exclusão?")) {
      await firestoreService.delete("thematicItineraries", id);
    }
  };

  const handleAddDay = () => {
    if (!editingItem) return;
    const currentDays = editingItem.schedule || [];
    const newDay: ThematicItineraryDay = {
      dayNumber: currentDays.length + 1,
      title: `Dia ${currentDays.length + 1}`,
      items: []
    };
    setEditingItem({ ...editingItem, schedule: [...currentDays, newDay], days: currentDays.length + 1 });
  };

  const handleAddItemToDay = (dayIndex: number) => {
    if (!editingItem) return;
    const currentDays = [...(editingItem.schedule || [])];
    currentDays[dayIndex].items.push({
      id: `item-${Date.now()}`,
      type: "custom",
      customName: "Novo Item"
    });
    setEditingItem({ ...editingItem, schedule: currentDays });
  };

  const handleUpdateItem = (dayIndex: number, itemIndex: number, field: string, value: any) => {
    if (!editingItem) return;
    const currentDays = [...(editingItem.schedule || [])];
    currentDays[dayIndex].items[itemIndex] = {
      ...currentDays[dayIndex].items[itemIndex],
      [field]: value
    };
    setEditingItem({ ...editingItem, schedule: currentDays });
  };

  const handleRemoveItem = (dayIndex: number, itemIndex: number) => {
    if (!editingItem) return;
    const currentDays = [...(editingItem.schedule || [])];
    currentDays[dayIndex].items.splice(itemIndex, 1);
    setEditingItem({ ...editingItem, schedule: currentDays });
  };

  if (editingItem) {
    return (
      <div className="p-6 bg-[#0a0a0a] min-h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{editingItem.id ? "Editar Roteiro" : "Novo Roteiro Temático"}</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              <Save size={16} /> Salvar Roteiro
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#121214] p-5 rounded-xl border border-zinc-800 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome do Roteiro *</label>
                <input
                  type="text"
                  value={editingItem.name || ""}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="Ex: Arraial em 2 Dias"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Destino Vinculado *</label>
                <select
                  value={editingItem.destinationId || ""}
                  onChange={e => setEditingItem({...editingItem, destinationId: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="">Selecione um destino</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Imagem de Capa (URL)</label>
                <input
                  type="text"
                  value={editingItem.coverImage || ""}
                  onChange={e => setEditingItem({...editingItem, coverImage: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Público Recomendado</label>
                <input
                  type="text"
                  value={(editingItem.audience || []).join(", ")}
                  onChange={e => setEditingItem({...editingItem, audience: e.target.value.split(",").map(s => s.trim())})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                  placeholder="Casais, Família..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Faixa de Preço</label>
                  <input
                    type="text"
                    value={editingItem.priceRange || ""}
                    onChange={e => setEditingItem({...editingItem, priceRange: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="$$$"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Dificuldade</label>
                  <input
                    type="text"
                    value={editingItem.difficulty || ""}
                    onChange={e => setEditingItem({...editingItem, difficulty: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Fácil"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição Curta</label>
                <textarea
                  value={editingItem.description || ""}
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Schedule Builder */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Cronograma</h3>
              <button onClick={handleAddDay} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <Plus size={14} /> Adicionar Dia
              </button>
            </div>

            {(editingItem.schedule || []).map((day, dIdx) => (
              <div key={dIdx} className="bg-[#121214] border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center font-bold text-white text-sm">
                    {day.dayNumber}
                  </div>
                  <input
                    type="text"
                    value={day.title}
                    onChange={e => {
                      const newSchedule = [...(editingItem.schedule || [])];
                      newSchedule[dIdx].title = e.target.value;
                      setEditingItem({...editingItem, schedule: newSchedule});
                    }}
                    className="bg-transparent border-b border-zinc-700 text-white px-2 py-1 flex-1 outline-none focus:border-blue-500"
                    placeholder="Título do dia"
                  />
                  <button onClick={() => {
                    const newSchedule = [...(editingItem.schedule || [])];
                    newSchedule.splice(dIdx, 1);
                    setEditingItem({...editingItem, schedule: newSchedule, days: newSchedule.length});
                  }} className="text-zinc-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2 pl-12">
                  {day.items.map((item, iIdx) => (
                    <div key={item.id} className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                      <select
                        value={item.timeOfDay || ""}
                        onChange={e => handleUpdateItem(dIdx, iIdx, "timeOfDay", e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                      >
                        <option value="">Horário</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noite">Noite</option>
                        <option value="Dia Inteiro">Dia Inteiro</option>
                      </select>

                      <select
                        value={item.type}
                        onChange={e => {
                          handleUpdateItem(dIdx, iIdx, "type", e.target.value);
                          handleUpdateItem(dIdx, iIdx, "refId", "");
                        }}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                      >
                        <option value="custom">Texto Livre</option>
                        <option value="experience">Passeio</option>
                        <option value="accommodation">Hospedagem</option>
                        <option value="partner">Parceiro</option>
                      </select>

                      {item.type === "experience" && (
                        <select
                          value={item.refId || ""}
                          onChange={e => handleUpdateItem(dIdx, iIdx, "refId", e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="">Selecionar Passeio...</option>
                          {experiences.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                        </select>
                      )}
                      
                      {item.type === "accommodation" && (
                        <select
                          value={item.refId || ""}
                          onChange={e => handleUpdateItem(dIdx, iIdx, "refId", e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="">Selecionar Hospedagem...</option>
                          {accommodations.map(ac => <option key={ac.id} value={ac.id}>{ac.name}</option>)}
                        </select>
                      )}

                      {item.type === "partner" && (
                        <select
                          value={item.refId || ""}
                          onChange={e => handleUpdateItem(dIdx, iIdx, "refId", e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="">Selecionar Parceiro...</option>
                          {partners.map(p => <option key={p.id} value={p.id}>{p.tradingName || p.companyName}</option>)}
                        </select>
                      )}

                      {item.type === "custom" && (
                        <input
                          type="text"
                          value={item.customName || ""}
                          onChange={e => handleUpdateItem(dIdx, iIdx, "customName", e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                          placeholder="Ex: Trilha na Praia Grande"
                        />
                      )}

                      <button onClick={() => handleRemoveItem(dIdx, iIdx)} className="text-zinc-500 hover:text-red-400 p-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  <button onClick={() => handleAddItemToDay(dIdx)} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mt-2">
                    <Plus size={12} /> Adicionar Item
                  </button>
                </div>
              </div>
            ))}

            {(!editingItem.schedule || editingItem.schedule.length === 0) && (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 text-sm mb-4">O cronograma está vazio.</p>
                <button onClick={handleAddDay} className="mx-auto flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm">
                  <Plus size={16} /> Adicionar Primeiro Dia
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Roteiros Temáticos</h2>
          <p className="text-zinc-400 text-sm mt-1">Crie sugestões editoriais para inspirar os viajantes.</p>
        </div>
        <button 
          onClick={() => setEditingItem({ status: 'active', days: 1, schedule: [] })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          Novo Roteiro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {thematicItineraries.map((itinerary) => {
          const dest = destinations.find(d => d.id === itinerary.destinationId);
          return (
            <div key={itinerary.id} className="bg-[#121214] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
              <div className="h-40 relative overflow-hidden bg-zinc-900">
                {itinerary.coverImage ? (
                  <img src={itinerary.coverImage} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">Sem Capa</div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full border border-white/10 font-medium">
                    {itinerary.days} {itinerary.days === 1 ? 'Dia' : 'Dias'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-blue-400 mb-2">
                  <MapPin size={14} />
                  <span className="text-[11px] font-semibold tracking-wider uppercase">{dest?.name || 'Múltiplos Destinos'}</span>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors">{itinerary.name}</h3>
                <p className="text-zinc-500 text-xs line-clamp-2 mb-4">{itinerary.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                  <span className="text-zinc-400 text-xs">{itinerary.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingItem(itinerary)} className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(itinerary.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {thematicItineraries.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl">
          <MapPin size={48} className="text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum roteiro cadastrado</h3>
          <p className="text-zinc-500 max-w-md text-center mb-6">Comece criando roteiros temáticos (ex: Arraial em 2 Dias, Arraial Romântico) para ajudar seus clientes no planejamento.</p>
          <button 
            onClick={() => setEditingItem({ status: 'active', days: 1, schedule: [] })}
            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Criar Primeiro Roteiro
          </button>
        </div>
      )}
    </div>
  );
}
