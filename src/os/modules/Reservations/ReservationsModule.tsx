import React from 'react';
import { CalendarCheck, Search, Filter, Calendar as CalendarIcon, CheckCircle, Clock } from 'lucide-react';

export function ReservationsModule() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Reservas</h2>
          <p className="text-zinc-400 text-sm">Gestão de reservas confirmadas, calendário e vouchers.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente ou código..."
            className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="bg-[#121214] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Filter size={18} />
          Status
        </button>
        <button className="bg-[#121214] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <CalendarIcon size={18} />
          Data
        </button>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Código / Cliente</th>
              <th className="px-6 py-4">Passeio</th>
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Pax</th>
              <th className="px-6 py-4">Valor Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-mono text-zinc-500 text-xs mb-1">#RES-9823</div>
                <div className="font-medium text-zinc-100">Maria Oliveira</div>
              </td>
              <td className="px-6 py-4 text-zinc-300">Passeio de Barco Tradicional</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-zinc-300"><CalendarIcon size={14} className="text-blue-500" /> 15/Nov/2026</div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-1"><Clock size={12} /> 09:00</div>
              </td>
              <td className="px-6 py-4 text-zinc-300">2 Adultos</td>
              <td className="px-6 py-4 font-mono font-medium text-zinc-100">R$ 240,00</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full text-xs font-medium w-fit">
                  <CheckCircle size={12} /> Confirmada
                </span>
              </td>
            </tr>
             <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-mono text-zinc-500 text-xs mb-1">#RES-9824</div>
                <div className="font-medium text-zinc-100">Carlos Santos</div>
              </td>
              <td className="px-6 py-4 text-zinc-300">Mergulho de Cilindro (Batismo)</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-zinc-300"><CalendarIcon size={14} className="text-blue-500" /> 16/Nov/2026</div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-1"><Clock size={12} /> 08:30</div>
              </td>
              <td className="px-6 py-4 text-zinc-300">1 Adulto</td>
              <td className="px-6 py-4 font-mono font-medium text-zinc-100">R$ 350,00</td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full text-xs font-medium w-fit">
                  <Clock size={12} /> Pag. Pendente
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
