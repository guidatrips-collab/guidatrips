import React, { useState } from 'react';
import { Plus, Search, Filter, Map, Edit, Trash, Activity } from 'lucide-react';
import { Experience } from '../../../types';

export function ProductsModule({ experiences }: { experiences: Experience[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Catálogo de Passeios</h2>
          <p className="text-zinc-400 text-sm">Gerencie experiências, tarifários e disponibilidade.</p>
        </div>
        <button 
          onClick={() => setActiveTab('create')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Novo Passeio
        </button>
      </div>

      {activeTab === 'list' && (
        <>
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
            <button className="bg-[#121214] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Filter size={18} />
              Filtros
            </button>
          </div>

          <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Passeio</th>
                  <th className="px-6 py-4">Tarifa Neto</th>
                  <th className="px-6 py-4">Tarifa Venda</th>
                  <th className="px-6 py-4">Margem</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {experiences.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map((exp) => {
                  const netRate = exp.netRate || (exp.priceFrom * 0.7); // Mock if missing
                  const margin = exp.priceFrom - netRate;
                  const marginPercent = ((margin / exp.priceFrom) * 100).toFixed(1);

                  return (
                    <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100">{exp.name}</div>
                        <div className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                          <Map size={12} /> {exp.location || 'Destino Padrão'}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-400">R$ {netRate.toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono text-emerald-400 font-medium">R$ {exp.priceFrom.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">
                          {marginPercent}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          exp.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {exp.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-zinc-400 hover:text-blue-400 transition-colors mr-3"><Edit size={16} /></button>
                        <button className="text-zinc-400 hover:text-red-400 transition-colors"><Trash size={16} /></button>
                      </td>
                    </tr>
                  )
                })}
                {experiences.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                      Nenhum passeio encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'create' && (
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <button onClick={() => setActiveTab('list')} className="text-zinc-400 hover:text-white">&larr; Voltar</button>
            <h3 className="text-xl font-bold text-zinc-100">Cadastrar Novo Passeio</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nome do Passeio</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Passeio de Lancha VIP" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Categoria</label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option>Náutico</option>
                    <option>Aventura</option>
                    <option>Cultura</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Destino / Cidade</label>
                  <input type="text" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Ex: Arraial do Cabo" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Descrição Resumida</label>
                <textarea className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none h-24" placeholder="Descrição para o card..." />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                <h4 className="text-zinc-100 font-semibold mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  Tarifário
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Tarifa Neto (Custo Parceiro)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                      <input type="number" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Tarifa Venda (Cliente)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                      <input type="number" className="w-full bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold pl-10 pr-4 py-2 rounded-lg focus:border-emerald-500 focus:outline-none" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Margem Estimada</span>
                    <span className="text-emerald-400 font-semibold">--</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors">
                Salvar Passeio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
