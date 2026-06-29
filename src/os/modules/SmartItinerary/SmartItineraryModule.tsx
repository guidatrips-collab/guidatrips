import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Send, FileText, Plus, Search, Filter, Trash, Edit, Copy, X } from 'lucide-react';
import { Budget, Experience } from '../../../types';
import { firestoreService } from '../../../firebase';

export function SmartItineraryModule({ budgets, experiences }: { budgets: Budget[], experiences: Experience[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<Budget["status"]>('draft');
  const [items, setItems] = useState<Budget["items"]>([]);
  const [selectedExp, setSelectedExp] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setClientId('');
    setStatus('draft');
    setItems([]);
    setIsModalOpen(true);
  };

  const openEdit = (b: Budget) => {
    setEditingId(b.id);
    setClientId(b.clientId);
    setStatus(b.status);
    setItems(b.items || []);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (b: Budget) => {
    try {
      const copy = { ...b, id: `ORC-${Math.floor(Math.random() * 10000)}`, status: 'draft' as const };
      await firestoreService.set("budgets", copy.id, copy);
    } catch (err) {
      console.error(err);
      alert('Erro ao duplicar.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir orçamento?')) return;
    try {
      await firestoreService.delete("budgets", id);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir.');
    }
  };

  const addItem = () => {
    const exp = experiences.find(e => e.id === selectedExp);
    if (!exp) return;
    
    setItems([...items, {
      type: 'experience',
      itemId: exp.id,
      name: exp.name,
      date: new Date().toISOString().split('T')[0],
      pax: 2,
      netRate: exp.netRate || 0,
      sellRate: exp.priceFrom || 0,
      discount: 0,
      total: (exp.priceFrom || 0) * 2
    }]);
    setSelectedExp('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let netTotal = 0;
    let sellTotal = 0;
    
    items.forEach(it => {
      netTotal += (it.netRate * it.pax);
      sellTotal += (it.sellRate * it.pax) - it.discount;
    });

    const bData: Partial<Budget> = {
      clientId,
      status,
      items,
      dateCreated: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      totals: {
        netTotal,
        sellTotal,
        discountTotal: 0,
        finalTotal: sellTotal,
        profit: sellTotal - netTotal,
        profitMargin: sellTotal > 0 ? ((sellTotal - netTotal) / sellTotal) * 100 : 0
      }
    };

    try {
      if (editingId) {
        await firestoreService.update("budgets", editingId, bData);
      } else {
        bData.id = `ORC-${Math.floor(Math.random() * 10000)}`;
        await firestoreService.set("budgets", bData.id, bData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Orçamentos & Roteiros</h2>
          <p className="text-zinc-400 text-sm">Geração de roteiros e orçamentos otimizados com Inteligência Artificial.</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Novo Orçamento
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por ID ou cliente..."
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
              <th className="px-6 py-4">ID / Cliente</th>
              <th className="px-6 py-4">Itens</th>
              <th className="px-6 py-4">Custo Total</th>
              <th className="px-6 py-4">Venda Total</th>
              <th className="px-6 py-4">Margem</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {budgets.filter(b => b && ((b.id || "").toLowerCase().includes((searchTerm || "").toLowerCase()) || (b.clientId || "").toLowerCase().includes((searchTerm || "").toLowerCase()))).map((b) => (
              <tr key={b.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-zinc-500 text-xs mb-1">#{b.id}</div>
                  <div className="font-medium text-zinc-100">{b.clientId || 'Cliente Genérico'}</div>
                </td>
                <td className="px-6 py-4 text-zinc-300">{b.items?.length || 0} passeios</td>
                <td className="px-6 py-4 text-zinc-400">R$ {b.totals?.netTotal?.toFixed(2) || '0.00'}</td>
                <td className="px-6 py-4 font-mono font-medium text-emerald-400">R$ {b.totals?.finalTotal?.toFixed(2) || '0.00'}</td>
                <td className="px-6 py-4">
                  <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">
                    {b.totals?.profitMargin?.toFixed(1) || '0'}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                    b.status === 'sent' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleDuplicate(b)} className="text-zinc-400 hover:text-white transition-colors" title="Duplicar"><Copy size={16} /></button>
                    <button onClick={() => openEdit(b)} className="text-zinc-400 hover:text-blue-400 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(b.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {budgets.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  <FileText className="mx-auto mb-3 opacity-20" size={32} />
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl max-h-[90vh]">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Orçamento' : 'Novo Orçamento'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <form id="budget-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Cliente</label>
                    <input required type="text" value={clientId} onChange={e => setClientId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Ex: João Silva" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="draft">Rascunho</option>
                      <option value="sent">Enviado</option>
                      <option value="approved">Aprovado</option>
                      <option value="rejected">Rejeitado</option>
                    </select>
                  </div>
                </div>

                <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/50">
                  <h4 className="text-zinc-100 font-semibold mb-4">Adicionar Passeios</h4>
                  <div className="flex gap-2">
                    <select value={selectedExp} onChange={e => setSelectedExp(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="">Selecione um passeio...</option>
                      {experiences.map(e => <option key={e.id} value={e.id}>{e.name} - R$ {e.priceFrom}</option>)}
                    </select>
                    <button type="button" onClick={addItem} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Adicionar
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                        <div>
                          <p className="font-medium text-zinc-200">{item.name}</p>
                          <p className="text-xs text-zinc-500">Venda: R$ {item.sellRate} | Pax: {item.pax}</p>
                        </div>
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 p-1">
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                    {items.length === 0 && <p className="text-sm text-zinc-500 italic">Nenhum passeio adicionado ao orçamento.</p>}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="budget-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Salvar Orçamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
