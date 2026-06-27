import React from 'react';
import { Briefcase, Plus, Search, Building2, Phone, Mail, MoreHorizontal } from 'lucide-react';

export function PartnersModule() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Parceiros e Fornecedores</h2>
          <p className="text-zinc-400 text-sm">Gestão de empresas, comissões e contratos.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Novo Parceiro
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar parceiro..."
            className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Empresa</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Contato</th>
              <th className="px-6 py-4">Comissão</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  Saveiro Don Juan
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-zinc-400">Passeio Náutico</span>
              </td>
              <td className="px-6 py-4">
                <div className="text-zinc-300">João Silva</div>
                <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> (22) 99999-9999</div>
              </td>
              <td className="px-6 py-4 font-mono text-emerald-400 font-medium">20%</td>
              <td className="px-6 py-4">
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-medium">Ativo</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-zinc-400 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
              </td>
            </tr>
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  Buggy Adventure
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-zinc-400">Aventura</span>
              </td>
              <td className="px-6 py-4">
                <div className="text-zinc-300">Carlos Mendes</div>
                <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> (22) 98888-8888</div>
              </td>
              <td className="px-6 py-4 font-mono text-emerald-400 font-medium">15%</td>
              <td className="px-6 py-4">
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-medium">Ativo</span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-zinc-400 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
