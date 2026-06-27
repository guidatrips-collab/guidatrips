import React, { useState, useEffect } from 'react';
import { Hotel, Plus, Search, MapPin, Star, X, Edit, Trash2 } from 'lucide-react';
import { Accommodation } from '../../../types';
import { firestoreService } from '../../../firebase';

export function AccommodationsModule({ accommodations }: { accommodations: Accommodation[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Accommodation["category"]>('hotel');
  const [location, setLocation] = useState('');
  const [netRate, setNetRate] = useState<number>(0);
  const [sellRate, setSellRate] = useState<number>(0);
  const [status, setStatus] = useState<Accommodation["status"]>('active');

  const resetForm = () => {
    setName('');
    setCategory('hotel');
    setLocation('');
    setNetRate(0);
    setSellRate(0);
    setStatus('active');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const openEdit = (acc: Accommodation) => {
    setName(acc.name);
    setCategory(acc.category);
    setLocation(acc.location);
    setNetRate(acc.netRate);
    setSellRate(acc.sellRate);
    setStatus(acc.status);
    setEditingId(acc.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const markup = sellRate > 0 ? ((sellRate - netRate) / netRate) * 100 : 0;
    const accData: Partial<Accommodation> = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      location,
      netRate,
      sellRate,
      markup,
      status,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await firestoreService.update("accommodations", editingId, accData);
      } else {
        accData.id = Math.random().toString(36).substring(2, 9);
        accData.createdAt = new Date().toISOString();
        accData.photos = [];
        accData.amenities = [];
        accData.address = location;
        accData.description = "";
        accData.partnerId = "";
        accData.destinationId = "";
        accData.commission = 0;
        await firestoreService.set("accommodations", accData.id, accData);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving", err);
      alert("Erro ao salvar.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta hospedagem?")) return;
    try {
      await firestoreService.delete("accommodations", id);
    } catch (err) {
      console.error("Error deleting", err);
      alert("Erro ao excluir.");
    }
  };

  const filtered = accommodations.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Hospedagens</h2>
          <p className="text-zinc-400 text-sm">Gerencie hotéis, pousadas e casas de temporada.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nova Hospedagem
        </button>
      </div>

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
              <div key={acc.id} className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden group">
                <div className="h-40 bg-zinc-900 relative">
                  {acc.photos && acc.photos.length > 0 ? (
                    <img src={acc.photos[0]} alt={acc.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                      <Hotel size={48} />
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded ${
                    acc.status === 'active' ? 'bg-emerald-500' : acc.status === 'paused' ? 'bg-amber-500' : 'bg-zinc-600'
                  }`}>
                    {acc.status === 'active' ? 'Ativo' : acc.status === 'paused' ? 'Pausado' : 'Rascunho'}
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(acc)} className="bg-blue-600 p-2 rounded hover:bg-blue-500 text-white"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(acc.id)} className="bg-red-600 p-2 rounded hover:bg-red-500 text-white"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-zinc-100 text-lg truncate pr-2">{acc.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-500 text-sm mb-4 truncate">
                    <MapPin size={14} className="flex-shrink-0" /> {acc.location}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800/80">
                    <div>
                      <div className="text-xs text-zinc-500">Tarifa Venda</div>
                      <div className="font-mono text-emerald-400 font-medium">R$ {acc.sellRate.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">Margem</div>
                      <div className="font-mono text-zinc-300">{acc.markup?.toFixed(1) || 0}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Hospedagem' : 'Nova Hospedagem'}</h3>
              <button onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="acc-form" onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Nome do Local</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="hotel">Hotel</option>
                      <option value="pousada">Pousada</option>
                      <option value="hostel">Hostel</option>
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Localização (Cidade/UF)</label>
                    <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Tarifa Custo (Neto)</label>
                    <input required type="number" step="0.01" value={netRate} onChange={e => setNetRate(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Tarifa Venda</label>
                    <input required type="number" step="0.01" value={sellRate} onChange={e => setSellRate(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="active">Ativo</option>
                      <option value="paused">Pausado</option>
                      <option value="draft">Rascunho</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="acc-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                {editingId ? 'Salvar Alterações' : 'Salvar Hospedagem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
