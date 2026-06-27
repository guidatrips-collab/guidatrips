import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';

export function FinancialModule() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Financeiro</h2>
          <p className="text-zinc-400 text-sm">Fluxo de caixa, conciliação e comissões.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg font-medium transition-colors">
            Nova Despesa
          </button>
          <button className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-lg font-medium transition-colors">
            Nova Receita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Saldo Atual</h3>
            <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center"><Wallet size={16} /></div>
          </div>
          <p className="text-zinc-100 text-2xl font-bold font-mono">R$ 14.250,00</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Receitas (Mês)</h3>
            <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><TrendingUp size={16} /></div>
          </div>
          <p className="text-emerald-400 text-2xl font-bold font-mono">R$ 28.400,00</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Despesas (Mês)</h3>
            <div className="w-8 h-8 rounded bg-red-500/10 text-red-500 flex items-center justify-center"><TrendingDown size={16} /></div>
          </div>
          <p className="text-red-400 text-2xl font-bold font-mono">R$ 12.150,00</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Lucro Líquido</h3>
            <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center"><DollarSign size={16} /></div>
          </div>
          <p className="text-zinc-100 text-2xl font-bold font-mono">R$ 16.250,00</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Lançamentos Recentes</h3>
      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex-1">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4 text-zinc-400">12/Nov/2026</td>
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-100">Pagamento Reserva #RES-9823</div>
                <div className="text-xs text-zinc-500">Pix - Cliente Maria Oliveira</div>
              </td>
              <td className="px-6 py-4"><span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">Venda de Passeio</span></td>
              <td className="px-6 py-4 text-right font-mono text-emerald-400 font-medium flex items-center justify-end gap-2">
                <ArrowUpRight size={14} /> + R$ 240,00
              </td>
            </tr>
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4 text-zinc-400">10/Nov/2026</td>
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-100">Repasse Parceiro - Saveiro Don Juan</div>
                <div className="text-xs text-zinc-500">Ref. 5 reservas pagas</div>
              </td>
              <td className="px-6 py-4"><span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">Repasse Fornecedor</span></td>
              <td className="px-6 py-4 text-right font-mono text-red-400 font-medium flex items-center justify-end gap-2">
                <ArrowDownRight size={14} /> - R$ 850,00
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
