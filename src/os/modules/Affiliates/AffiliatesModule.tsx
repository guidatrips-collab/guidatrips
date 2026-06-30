import React, { useState, useEffect } from 'react';
import { Share2, Users, Link as LinkIcon, DollarSign, ArrowRight, Plus, Search, Filter, Trash, Edit, X } from 'lucide-react';
import { firestoreService } from '../../../firebase';

interface Affiliate {
  id: string;
  name: string;
  slug: string;
  clicks: number;
  conversions: number;
  commissions: number;
  status: 'active' | 'inactive';
}

export function AffiliatesModule({ affiliates }: { affiliates: Affiliate[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<Affiliate["status"]>('active');

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEdit = (a: Affiliate) => {
    setEditingId(a.id);
    setName(a.name);
    setSlug(a.slug);
    setStatus(a.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const aData: Partial<Affiliate> = {
      name,
      slug,
      status
    };

    try {
      if (editingId) {
        await firestoreService.update("affiliates", editingId, aData);
      } else {
        aData.id = Math.random().toString(36).substring(2, 9);
        aData.clicks = 0;
        aData.conversions = 0;
        aData.commissions = 0;
        await firestoreService.set("affiliates", aData.id, aData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir afiliado?')) return;
    try {
      await firestoreService.delete("affiliates", id);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir.');
    }
  };

  const totalClicks = affiliates.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalCommissions = affiliates.reduce((acc, curr) => acc + (curr.commissions || 0), 0);

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Programa de Afiliados</h2>
          <p className="text-zinc-400 text-sm">Gestão de links, comissionamento e indicações.</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Novo Afiliado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"><Users size={24} /></div>
          <h3 className="text-2xl font-bold text-zinc-100">{affiliates.length}</h3>
          <p className="text-zinc-400 text-sm">Afiliados Ativos</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3"><Share2 size={24} /></div>
          <h3 className="text-2xl font-bold text-zinc-100">{totalClicks}</h3>
          <p className="text-zinc-400 text-sm">Cliques em Links</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-3"><DollarSign size={24} /></div>
          <h3 className="text-2xl font-bold text-zinc-100">R$ {totalCommissions.toFixed(2)}</h3>
          <p className="text-zinc-400 text-sm">Comissões Geradas</p>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar afiliado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800 bg-zinc-900/50">
            <tr>
              <th className="px-6 py-4">Afiliado</th>
              <th className="px-6 py-4 text-center">Cliques</th>
              <th className="px-6 py-4 text-center">Conversões</th>
              <th className="px-6 py-4 text-right">Comissões</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {affiliates.filter(a => a && (a.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())).map((a) => (
              <tr key={a.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-100">{a.name}</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1"><LinkIcon size={10} /> guiadatrips.com.br/?ref={a.slug}</div>
                </td>
                <td className="px-6 py-4 text-center font-mono text-zinc-400">{a.clicks || 0}</td>
                <td className="px-6 py-4 text-center font-mono text-zinc-400">{a.conversions || 0}</td>
                <td className="px-6 py-4 text-right font-mono text-emerald-400 font-medium">R$ {(a.commissions || 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openEdit(a)} className="text-zinc-400 hover:text-blue-400 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(a.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {affiliates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  Nenhum afiliado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Afiliado' : 'Novo Afiliado'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1">
              <form id="affiliate-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Afiliado</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Ex: João Viajante" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Slug (Link único)</label>
                  <input required type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="ex: joao-viajante" />
                  <p className="text-xs text-zinc-500 mt-1">O link ficará: guiadatrips.com.br/?ref={slug || '...'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="affiliate-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Salvar Afiliado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
