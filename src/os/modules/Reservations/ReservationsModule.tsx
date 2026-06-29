import React, { useState, useEffect } from 'react';
import { CalendarCheck, Search, Filter, Calendar as CalendarIcon, CheckCircle, Clock, Plus, Trash, Edit, X } from 'lucide-react';
import { ClientReservation, Experience } from '../../../types';
import { firestoreService } from '../../../firebase';

export function ReservationsModule({ reservations, experiences }: { reservations: ClientReservation[], experiences: Experience[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [userId, setUserId] = useState('');
  const [experienceId, setExperienceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [pax, setPax] = useState<number>(1);
  const [status, setStatus] = useState<ClientReservation["status"]>('confirmed');
  
  const getExperienceName = (id: string) => {
    const exp = experiences.find(e => e.id === id);
    return exp ? exp.name : 'Passeio não encontrado';
  };

  const getExperiencePrice = (id: string) => {
    const exp = experiences.find(e => e.id === id);
    return exp ? exp.priceFrom : 0;
  };

  const openCreate = () => {
    setEditingId(null);
    setUserId('');
    setExperienceId('');
    setDate('');
    setTime('');
    setPax(1);
    setStatus('confirmed');
    setIsModalOpen(true);
  };

  const openEdit = (res: ClientReservation) => {
    setEditingId(res.id);
    setUserId(res.userId || '');
    setExperienceId(res.experienceId || '');
    setDate(res.date || '');
    setTime(res.time || '');
    setPax(res.pax || 1);
    setStatus(res.status || 'confirmed');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const exp = experiences.find(e => e.id === experienceId);
    
    const resData: Partial<ClientReservation> = {
      userId,
      experienceId,
      date,
      time,
      pax,
      status,
      meetingPoint: exp?.meetingPoint || '',
      rules: [],
      bringItems: [],
      avoidItems: []
    };

    try {
      if (editingId) {
        await firestoreService.update("reservations", editingId, resData);
      } else {
        resData.id = `RES-${Math.floor(Math.random() * 10000)}`;
        resData.voucherCode = `VOUCHER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await firestoreService.set("reservations", resData.id, resData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar reserva.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta reserva?')) return;
    try {
      await firestoreService.delete("reservations", id);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Reservas</h2>
          <p className="text-zinc-400 text-sm">Gestão de reservas confirmadas, calendário e vouchers.</p>
        </div>
        <button 
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nova Reserva
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por código (ex: RES-)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Código / Cliente ID</th>
              <th className="px-6 py-4">Passeio</th>
              <th className="px-6 py-4">Data / Hora</th>
              <th className="px-6 py-4">Pax</th>
              <th className="px-6 py-4">Valor Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {reservations.filter(r => r && (r.id || "").toLowerCase().includes((searchTerm || "").toLowerCase())).map((res) => {
              const total = getExperiencePrice(res.experienceId) * (res.pax || 1);
              return (
                <tr key={res.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-zinc-500 text-xs mb-1">#{res.id}</div>
                    <div className="font-medium text-zinc-100">{res.userId || 'Cliente Local'}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{getExperienceName(res.experienceId)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-zinc-300"><CalendarIcon size={14} className="text-blue-500" /> {res.date}</div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-1"><Clock size={12} /> {res.time}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">{res.pax} Adultos</td>
                  <td className="px-6 py-4 font-mono font-medium text-zinc-100">R$ {total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                      res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                      res.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {res.status === 'confirmed' ? <CheckCircle size={12} /> : <Clock size={12} />} 
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(res)} className="text-zinc-400 hover:text-blue-400 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(res.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                  Nenhuma reserva encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Reserva' : 'Nova Reserva'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1">
              <form id="res-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">ID do Cliente</label>
                  <input type="text" value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Nome ou ID" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Passeio</label>
                  <select required value={experienceId} onChange={e => setExperienceId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="">Selecione...</option>
                    {experiences.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Data</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Horário</label>
                    <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Passageiros</label>
                    <input required type="number" min="1" value={pax} onChange={e => setPax(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="confirmed">Confirmada</option>
                      <option value="completed">Concluída</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="res-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Salvar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
