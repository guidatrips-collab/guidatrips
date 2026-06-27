import React from 'react';
import { Share2, Users, Link as LinkIcon, DollarSign, ArrowRight } from 'lucide-react';

export function AffiliatesModule() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Programa de Afiliados</h2>
          <p className="text-zinc-400 text-sm">Gestão de links, comissionamento e indicações.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"><Users size={24} /></div>
          <h3 className="text-2xl font-bold text-zinc-100">24</h3>
          <p className="text-zinc-400 text-sm">Afiliados Ativos</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3"><Share2 size={24} /></div>
          <h3 className="text-2xl font-bold text-zinc-100">1.250</h3>
          <p className="text-zinc-400 text-sm">Cliques em Links</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-3"><DollarSign size={24} /></div>
          <h3 className="text-2xl font-bold text-zinc-100">R$ 4.500</h3>
          <p className="text-zinc-400 text-sm">Comissões Geradas</p>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <h3 className="font-semibold text-zinc-100">Top Afiliados</h3>
          <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">Ver Todos</button>
        </div>
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Afiliado</th>
              <th className="px-6 py-4 text-center">Cliques</th>
              <th className="px-6 py-4 text-center">Conversões</th>
              <th className="px-6 py-4 text-right">Comissões</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-100">João Viajante (Insta)</div>
                <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1"><LinkIcon size={10} /> guiadatrips.com.br/joao</div>
              </td>
              <td className="px-6 py-4 text-center font-mono text-zinc-400">450</td>
              <td className="px-6 py-4 text-center font-mono text-zinc-400">12</td>
              <td className="px-6 py-4 text-right font-mono text-emerald-400 font-medium">R$ 1.200,00</td>
            </tr>
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-100">Mochilando Barato</div>
                <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1"><LinkIcon size={10} /> guiadatrips.com.br/mochilando</div>
              </td>
              <td className="px-6 py-4 text-center font-mono text-zinc-400">320</td>
              <td className="px-6 py-4 text-center font-mono text-zinc-400">8</td>
              <td className="px-6 py-4 text-right font-mono text-emerald-400 font-medium">R$ 850,00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
