import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Phone, MessageSquare, Mail, Calendar, ArrowRight, Edit, X } from 'lucide-react';
import { Lead } from '../../../types';
import { firestoreService } from '../../../firebase';

export function CRMModule({ leads }: { leads: Lead[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Edit Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const leadToUpdate = leads.find(l => l.id === draggedLeadId);
    if (!leadToUpdate || leadToUpdate.status === statusId) return;

    // Update in Firestore
    try {
      await firestoreService.update("leads", draggedLeadId, { status: statusId, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status");
    }
    
    setDraggedLeadId(null);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setName(lead.name);
    setPhone(lead.phone);
    setEmail(lead.email || '');
    setGroupSize(lead.groupSize || 2);
    setPreferredDate(lead.preferredDate || '');
    setNotes(lead.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    const updatedData: Partial<Lead> = {
      name, phone, email, groupSize, preferredDate, notes, updatedAt: new Date().toISOString()
    };

    try {
      await firestoreService.update("leads", editingLead.id, updatedData);
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar lead.");
    }
  };
  
  const funnelStages = [
    { id: 'novo', label: 'Novos', color: 'bg-blue-500' },
    { id: 'atendendo', label: 'Em Atendimento', color: 'bg-amber-500' },
    { id: 'proposta', label: 'Proposta Enviada', color: 'bg-purple-500' },
    { id: 'fechado', label: 'Fechado (Ganho)', color: 'bg-emerald-500' },
    { id: 'perdido', label: 'Perdido', color: 'bg-red-500' }
  ];

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">CRM & Leads</h2>
          <p className="text-zinc-400 text-sm">Gestão de contatos, orçamentos e conversão. (Arraste para mudar o status)</p>
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
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {funnelStages.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage.id && l.name.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return (
              <div 
                key={stage.id} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="w-80 flex flex-col bg-[#121214]/50 border border-zinc-800/80 rounded-xl overflow-hidden h-full"
              >
                <div className="p-3 border-b border-zinc-800/80 flex justify-between items-center bg-[#121214]">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                    <span className="font-semibold text-zinc-200 text-sm">{stage.label}</span>
                  </div>
                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {stageLeads.map(lead => (
                    <div 
                      key={lead.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-lg cursor-grab active:cursor-grabbing transition-colors shadow-sm group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-zinc-100 truncate pr-2">{lead.name}</h4>
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded capitalize flex-shrink-0">{lead.origin}</span>
                      </div>
                      
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 truncate">
                          <Phone size={12} className="flex-shrink-0" /> {lead.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Calendar size={12} className="flex-shrink-0" /> Viagem: {lead.preferredDate || 'A definir'} ({lead.groupSize} pax)
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                        <div className="flex gap-2">
                          <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500/20 transition-colors" title="WhatsApp">
                            <MessageSquare size={14} />
                          </a>
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="w-7 h-7 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition-colors" title="Email">
                              <Mail size={14} />
                            </a>
                          )}
                        </div>
                        <button onClick={() => openEdit(lead)} className="text-xs text-zinc-500 hover:text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit size={12} /> Editar
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-zinc-600 text-sm border-2 border-dashed border-zinc-800 rounded-lg">
                      Arraste leads para cá
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && editingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-100">Editar Lead: {editingLead.name}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1">
              <form id="lead-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Nome</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Telefone</label>
                    <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Data Viagem (Mês/Ano)</label>
                    <input type="text" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Quantidade de Pessoas</label>
                    <input type="number" min="1" value={groupSize} onChange={e => setGroupSize(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Observações</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="lead-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
