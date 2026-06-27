import React from 'react';
import { Hotel, Plus, Search, MapPin, Star } from 'lucide-react';

export function AccommodationsModule() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Hospedagens</h2>
          <p className="text-zinc-400 text-sm">Gerencie hotéis, pousadas e casas de temporada.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Nova Hospedagem
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar hospedagem..."
            className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Card 1 */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden group">
          <div className="h-40 bg-zinc-900 relative">
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
              <Hotel size={48} />
            </div>
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
              Ativo
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-zinc-100 text-lg">Pousada Canto da Baleia</h3>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                <Star size={14} className="fill-current" /> 4.8
              </div>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-sm mb-4">
              <MapPin size={14} /> Arraial do Cabo, RJ
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800/80">
              <div>
                <div className="text-xs text-zinc-500">Tarifa Venda</div>
                <div className="font-mono text-emerald-400 font-medium">R$ 450,00</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Margem</div>
                <div className="font-mono text-zinc-300">20%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Card 2 */}
        <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden group">
          <div className="h-40 bg-zinc-900 relative">
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
              <Hotel size={48} />
            </div>
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
              Ativo
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-zinc-100 text-lg">Hotel Ocean View</h3>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                <Star size={14} className="fill-current" /> 4.5
              </div>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-sm mb-4">
              <MapPin size={14} /> Búzios, RJ
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800/80">
              <div>
                <div className="text-xs text-zinc-500">Tarifa Venda</div>
                <div className="font-mono text-emerald-400 font-medium">R$ 890,00</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Margem</div>
                <div className="font-mono text-zinc-300">15%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
