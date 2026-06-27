import React, { useState } from 'react';
import { Users, Search, Filter, Phone, MessageSquare, Mail, Calendar, ArrowRight } from 'lucide-react';
import { Lead } from '../../../types';

export function CRMModule({ leads }: { leads: Lead[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const funnelStages = [
    { id: 'novo', label: 'Novos', color: 'bg-blue-500' },
    { id: 'atendendo', label: 'Em Atendimento', color: 'bg-amber-500' },
    { id: 'proposta', label: 'Proposta Enviada', color: 'bg-purple-500' },
    { id: 'fechado', label: 'Fechado (Ganho)', color: 'bg-emerald-500' }
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">CRM & Leads</h2>
          <p className="text-zinc-400 text-sm">Gestão de contatos, orçamentos e conversão.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar lead, telefone ou email..."
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

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {funnelStages.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage.id && l.name.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return (
              <div key={stage.id} className="w-80 flex flex-col bg-[#121214]/50 border border-zinc-800/80 rounded-xl overflow-hidden h-full">
                <div className="p-3 border-b border-zinc-800/80 flex justify-between items-center bg-[#121214]">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                    <span className="font-semibold text-zinc-200 text-sm">{stage.label}</span>
                  </div>
                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-lg cursor-pointer transition-colors shadow-sm group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-zinc-100">{lead.name}</h4>
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded capitalize">{lead.origin}</span>
                      </div>
                      
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Phone size={12} /> {lead.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Calendar size={12} /> Viagem: {lead.preferredDate || 'A definir'} ({lead.groupSize} pax)
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                        <div className="flex gap-2">
                          <button className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500/20 transition-colors" title="WhatsApp">
                            <MessageSquare size={14} />
                          </button>
                          <button className="w-7 h-7 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition-colors" title="Email">
                            <Mail size={14} />
                          </button>
                        </div>
                        <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Ver Detalhes <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-zinc-600 text-sm border-2 border-dashed border-zinc-800 rounded-lg">
                      Nenhum lead nesta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
