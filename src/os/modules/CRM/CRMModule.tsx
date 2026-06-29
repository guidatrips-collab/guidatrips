import React, { useState } from 'react';
import { 
  Users, Search, Filter, Phone, MessageSquare, Mail, Calendar, 
  ArrowRight, Edit, X, Clock, FileText, CheckCircle2, AlertCircle, ShoppingBag, DollarSign
} from 'lucide-react';
import { Lead, Experience, ClientReservation, FinancialTransaction, LeadHistoryItem } from '../../../types';
import { firestoreService } from '../../../firebase';

interface CRMModuleProps {
  leads: Lead[];
  experiences?: Experience[];
}

export function CRMModule({ leads, experiences = [] }: CRMModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Seller State
  const [activeSeller, setActiveSeller] = useState(() => {
    return localStorage.getItem('guida_active_seller') || '';
  });
  const [assignedTo, setAssignedTo] = useState('');

  // Status transition state (for mandatory observation modal)
  const [pendingStatusChange, setPendingStatusChange] = useState<{ lead: Lead; targetStatus: string } | null>(null);
  const [statusObservation, setStatusObservation] = useState('');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Edit Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [preferredDate, setPreferredDate] = useState('');
  const [newObservation, setNewObservation] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const leadToUpdate = leads.find(l => l.id === draggedLeadId);
    if (!leadToUpdate || leadToUpdate.status === statusId) return;

    // Trigger mandatory observation modal
    setPendingStatusChange({ lead: leadToUpdate, targetStatus: statusId });
    setStatusObservation('');
    setStatusSuccessMessage('');
    setDraggedLeadId(null);
  };

  const getStageLabel = (statusId: string) => {
    switch (statusId) {
      case 'novo': return 'Novos';
      case 'atendendo': return 'Em Atendimento';
      case 'proposta': return 'Proposta Enviada';
      case 'fechado': return 'Fechado (Ganho)';
      case 'perdido': return 'Perdido';
      default: return statusId;
    }
  };

  const handleConfirmStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingStatusChange || !statusObservation.trim() || !activeSeller.trim()) return;

    const { lead, targetStatus } = pendingStatusChange;
    setIsSubmittingStatus(true);
    const finalSeller = activeSeller.trim();

    try {
      // 1. Prepare history item
      const historyItem: LeadHistoryItem = {
        id: 'hist-' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: 'status_change',
        description: `Status alterado de "${getStageLabel(lead.status)}" para "${getStageLabel(targetStatus)}". Observação: ${statusObservation.trim()}`,
        user: finalSeller
      };

      const updatedHistory = [...(lead.history || []), historyItem];
      const noteWithSeller = `[Vendedor: ${finalSeller}] ${statusObservation.trim()}`;
      const updatedNotes = [...(lead.notes || []), noteWithSeller];

      // First update on Novos (or any update) sets assignedTo if empty
      const updatedAssignedTo = lead.assignedTo || finalSeller;

      const leadUpdate: Partial<Lead> = {
        status: targetStatus as any,
        notes: updatedNotes,
        history: updatedHistory,
        assignedTo: updatedAssignedTo,
        updatedAt: new Date().toISOString()
      };

      // 2. Perform integrations if status is 'fechado' (Closed/Won)
      let integrationNotes = '';
      if (targetStatus === 'fechado') {
        const interests = lead.experienceInterest || [];
        if (interests.length > 0) {
          let createdCount = 0;
          let financialTotal = 0;

          for (const expId of interests) {
            const exp = experiences.find(e => e.id === expId);
            if (exp) {
              const resId = `res-crm-${lead.id}-${exp.id}-${Date.now().toString().slice(-4)}`;
              const finalDate = lead.preferredDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              
              // Create ClientReservation
              const newReservation: ClientReservation = {
                id: resId,
                userId: lead.id,
                experienceId: exp.id,
                date: finalDate,
                time: '08:00',
                status: 'confirmed',
                pax: lead.groupSize || 2,
                meetingPoint: exp.meetingPoint || 'A combinar',
                bringItems: exp.bringItems || [],
                avoidItems: exp.notIncluded || [],
                rules: exp.included || [],
                adults: lead.groupSize || 2,
                children: 0,
                infants: 0
              };
              await firestoreService.set("reservations", resId, newReservation);

              // Create FinancialTransaction
              const transId = `fin-crm-${lead.id}-${exp.id}-${Date.now().toString().slice(-4)}`;
              const unitPrice = exp.promotionalPrice || exp.priceFrom || 0;
              const totalAmount = unitPrice * (lead.groupSize || 2);
              financialTotal += totalAmount;

              const newTransaction: FinancialTransaction = {
                id: transId,
                type: 'receita',
                description: `Venda Passeio: ${exp.name} - Cliente: ${lead.name}`,
                amount: totalAmount,
                date: new Date().toISOString().split('T')[0],
                status: 'pago',
                referenceId: resId,
                referenceType: 'reservation',
                paymentMethod: 'pix',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              await firestoreService.set("financial", transId, newTransaction);
              createdCount++;
            }
          }

          if (createdCount > 0) {
            integrationNotes = `\n\n[OS Integração] Criadas ${createdCount} reservas e lançamentos de receita totalizando R$ ${financialTotal.toFixed(2)} no Guida OS!`;
            
            // Add system log history item
            const systemLog: LeadHistoryItem = {
              id: 'hist-' + Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toISOString(),
              type: 'system_log',
              description: `Integração OS: ${createdCount} reservas confirmadas e R$ ${financialTotal.toFixed(2)} lançados no financeiro.`,
              user: 'Sistema Guida OS'
            };
            leadUpdate.history = [...updatedHistory, systemLog];
            leadUpdate.notes = [...updatedNotes, `Reserva e lançamento de receita criados automaticamente no Guida OS (R$ ${financialTotal.toFixed(2)})`];
          }
        }
      }

      // 3. Update in Firestore
      await firestoreService.update("leads", lead.id, leadUpdate);

      setStatusSuccessMessage(`Status atualizado com sucesso!${integrationNotes}`);
      setTimeout(() => {
        setPendingStatusChange(null);
        setStatusObservation('');
        setStatusSuccessMessage('');
      }, 3000);

    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar o lead e integrar dados.");
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setName(lead.name);
    setPhone(lead.phone);
    setEmail(lead.email || '');
    setGroupSize(lead.groupSize || 2);
    setPreferredDate(lead.preferredDate || '');
    setAssignedTo(lead.assignedTo || '');
    setNewObservation('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !newObservation.trim() || !activeSeller.trim()) return;

    setIsSavingEdit(true);
    const finalSeller = activeSeller.trim();

    try {
      const historyItem: LeadHistoryItem = {
        id: 'hist-' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        type: 'note_added',
        description: `Nova observação inserida: ${newObservation.trim()}`,
        user: finalSeller
      };

      const updatedHistory = [...(editingLead.history || []), historyItem];
      const noteWithSeller = `[Vendedor: ${finalSeller}] ${newObservation.trim()}`;
      const updatedNotes = [...(editingLead.notes || []), noteWithSeller];

      // First update on Novos (or any update) sets assignedTo if empty
      const updatedAssignedTo = assignedTo.trim() || editingLead.assignedTo || finalSeller;

      const updatedData: Partial<Lead> = {
        name,
        phone,
        email,
        groupSize,
        preferredDate,
        assignedTo: updatedAssignedTo,
        notes: updatedNotes,
        history: updatedHistory,
        updatedAt: new Date().toISOString()
      };

      await firestoreService.update("leads", editingLead.id, updatedData);
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar lead.");
    } finally {
      setIsSavingEdit(false);
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
          <p className="text-zinc-400 text-sm">Gestão de contatos, orçamentos e conversão. (Arraste para mudar o status - Observações são obrigatórias)</p>
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
            const stageLeads = leads.filter(l => l && l.status === stage.id && (l.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()));
            
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
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[400px]">
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
                      
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 truncate">
                          <Phone size={12} className="flex-shrink-0" /> {lead.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Calendar size={12} className="flex-shrink-0" /> Viagem: {lead.preferredDate || 'A definir'} ({lead.groupSize} pax)
                        </div>
                        {lead.experienceInterest && lead.experienceInterest.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <ShoppingBag size={12} className="flex-shrink-0" /> {lead.experienceInterest.length} passeio(s) de interesse
                          </div>
                        )}
                      </div>

                      {/* Vendedor Responsável */}
                      <div className="flex items-center gap-2 text-[11px] border-t border-zinc-800/40 pt-2 mb-2 text-zinc-400">
                        <Users size={11} className="text-zinc-500 flex-shrink-0" />
                        <span>Vendedor: <span className={lead.assignedTo ? "text-blue-400 font-semibold" : "text-zinc-500 italic"}>{lead.assignedTo || "Não atribuído"}</span></span>
                      </div>

                      {/* Última Observação */}
                      {lead.notes && lead.notes.length > 0 && (
                        <div className="mb-3 text-[11px] text-zinc-400 bg-zinc-950/30 border border-zinc-800/60 p-2 rounded-lg italic line-clamp-2">
                          {(() => {
                            const lastNote = lead.notes[lead.notes.length - 1];
                            const match = lastNote.match(/^\[Vendedor:\s*([^\]]+)\]\s*(.*)$/s);
                            if (match) {
                              return (
                                <span>
                                  <strong className="text-blue-400 font-medium not-italic">@{match[1]}:</strong> {match[2]}
                                </span>
                              );
                            }
                            return lastNote;
                          })()}
                        </div>
                      )}
                      
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

      {/* Mandatory Status Observation Modal */}
      {pendingStatusChange && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Atualizar Status de Lead</h3>
                  <p className="text-zinc-400 text-xs">A equipe de vendas exige justificativa obrigatória.</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-2 text-sm text-zinc-300">
                <p><strong>Lead:</strong> {pendingStatusChange.lead.name}</p>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{getStageLabel(pendingStatusChange.lead.status)}</span>
                  <ArrowRight size={12} className="text-zinc-500" />
                  <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 font-semibold">{getStageLabel(pendingStatusChange.targetStatus)}</span>
                </div>
              </div>

              {pendingStatusChange.targetStatus === 'fechado' && (
                <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl text-xs text-emerald-400 flex gap-2.5">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Atenção - Conversão de Venda!</span>
                    Ao fechar este lead como Ganho, o sistema gerará automaticamente as reservas e os lançamentos financeiros de receita correspondentes a este cliente no Guida OS.
                  </div>
                </div>
              )}

              {statusSuccessMessage ? (
                <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-sm text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-300">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                  <div className="whitespace-pre-wrap">{statusSuccessMessage}</div>
                </div>
              ) : (
                <form onSubmit={handleConfirmStatusChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Seu Nome (Vendedor) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={activeSeller}
                      onChange={e => {
                        setActiveSeller(e.target.value);
                        localStorage.setItem('guida_active_seller', e.target.value);
                      }}
                      placeholder="Quem está atualizando este lead?"
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm mb-1.5"
                    />
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[10px] text-zinc-500 mr-1">Rápido:</span>
                      {["Yuri Guida", "Carlos", "Fernanda", "Mariana", "Pedro"].map(name => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setActiveSeller(name);
                            localStorage.setItem('guida_active_seller', name);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                            activeSeller === name
                              ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:border-zinc-500"
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Observação / Justificativa <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={statusObservation}
                      onChange={e => setStatusObservation(e.target.value)}
                      placeholder="Ex: Cliente fechou o roteiro por telefone. Entrada via Pix confirmada."
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm placeholder-zinc-600"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setPendingStatusChange(null)}
                      className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white text-sm transition-colors"
                      disabled={isSubmittingStatus}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      disabled={!statusObservation.trim() || !activeSeller.trim() || isSubmittingStatus}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-1.5"
                    >
                      {isSubmittingStatus ? 'Salvando...' : 'Confirmar e Atualizar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal with Observations History & Mandatory New Observation */}
      {isModalOpen && editingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div>
                <h3 className="text-xl font-bold text-zinc-100">Editar Lead: {editingLead.name}</h3>
                <p className="text-zinc-400 text-xs">Mantenha os dados atualizados e registre novas interações.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <form id="lead-edit-form" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Nome</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Telefone</label>
                    <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">E-mail ou Contato</label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Vendedor Responsável pelo Lead</label>
                    <input 
                      type="text" 
                      value={assignedTo} 
                      onChange={e => setAssignedTo(e.target.value)} 
                      placeholder="Sem vendedor atribuído" 
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 truncate">Data (Mês/Ano)</label>
                      <input type="text" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Pessoas</label>
                      <input type="number" min="1" value={groupSize} onChange={e => setGroupSize(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Seu Nome (Vendedor Atual) <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="text" 
                      value={activeSeller} 
                      onChange={e => {
                        setActiveSeller(e.target.value);
                        localStorage.setItem('guida_active_seller', e.target.value);
                      }} 
                      placeholder="Quem está escrevendo a nova observação?" 
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 text-sm mb-1.5" 
                    />
                    <div className="flex flex-wrap gap-1 items-center">
                      {["Yuri Guida", "Carlos", "Fernanda", "Mariana", "Pedro"].map(name => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setActiveSeller(name);
                            localStorage.setItem('guida_active_seller', name);
                          }}
                          className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                            activeSeller === name
                              ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:border-zinc-500"
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Historical Timeline of Notes & History */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-500" /> Histórico de Observações e Atividades
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {/* Render Lead Notes as clean history entries */}
                    {editingLead.notes && editingLead.notes.length > 0 ? (
                      editingLead.notes.map((note, index) => (
                        <div key={`note-${index}`} className="text-xs bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800 text-zinc-300 relative pl-6">
                          <span className="absolute left-2.5 top-3.5 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <p className="font-medium text-zinc-400 text-[10px] mb-0.5">Nota #{index + 1}</p>
                          {(() => {
                            const match = note.match(/^\[Vendedor:\s*([^\]]+)\]\s*(.*)$/s);
                            if (match) {
                              return (
                                <div>
                                  <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                    Vendedor: {match[1]}
                                  </span>
                                  <p className="whitespace-pre-wrap text-zinc-200 mt-1">{match[2]}</p>
                                </div>
                              );
                            }
                            return <p className="whitespace-pre-wrap">{note}</p>;
                          })()}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-500 italic py-2 text-center">Nenhuma nota anterior registrada.</p>
                    )}
                  </div>
                </div>

                {/* Mandatory New Observation Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Nova Observação (Obrigatória para salvar) <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-zinc-500 font-normal normal-case">Descreva o contato recente ou andamento da conversa</span>
                  </label>
                  <textarea 
                    required 
                    value={newObservation} 
                    onChange={e => setNewObservation(e.target.value)} 
                    placeholder="Adicione um novo comentário detalhado sobre este cliente..."
                    rows={3} 
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm placeholder-zinc-600"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/30">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors text-sm"
                disabled={isSavingEdit}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="lead-edit-form" 
                disabled={!newObservation.trim() || !activeSeller.trim() || isSavingEdit}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                {isSavingEdit ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
