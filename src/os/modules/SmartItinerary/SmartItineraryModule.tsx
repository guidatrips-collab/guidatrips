import React from 'react';
import { BrainCircuit, Sparkles, Send, FileText } from 'lucide-react';

export function SmartItineraryModule() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Roteiro Inteligente (IA)</h2>
          <p className="text-zinc-400 text-sm">Geração de roteiros e orçamentos otimizados com Inteligência Artificial.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Sparkles size={18} />
          Gerar Novo Roteiro
        </button>
      </div>

      <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
          <BrainCircuit size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-100 mb-2">Motor de Roteiros IA</h3>
        <p className="text-zinc-400 max-w-md mb-8">
          O motor de inteligência artificial analisará o perfil do cliente, disponibilidade de passeios e orçamentos para montar roteiros perfeitos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-left">
            <div className="text-blue-500 mb-3"><Sparkles size={24} /></div>
            <h4 className="font-semibold text-zinc-100 mb-1">Análise de Perfil</h4>
            <p className="text-sm text-zinc-500">A IA cruza dados de idade, grupo e preferências para sugerir as melhores opções.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-left">
            <div className="text-emerald-500 mb-3"><FileText size={24} /></div>
            <h4 className="font-semibold text-zinc-100 mb-1">Orçamentação</h4>
            <p className="text-sm text-zinc-500">Cálculo automático de margens, tarifas neto e comissões para o orçamento final.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-left">
            <div className="text-purple-500 mb-3"><Send size={24} /></div>
            <h4 className="font-semibold text-zinc-100 mb-1">Envio Automatizado</h4>
            <p className="text-sm text-zinc-500">Geração de PDFs bonitos e envio direto por WhatsApp com link de pagamento.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
