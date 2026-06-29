import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Building2, Phone, Mail, MoreHorizontal, X, Edit, Trash2 } from 'lucide-react';
import { Partner } from '../../../types';
import { firestoreService } from '../../../firebase';

export function PartnersModule({ partners }: { partners: Partner[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [companyName, setCompanyName] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [type, setType] = useState<Partner["type"]>('passeio');
  const [cnpj_cpf, setCnpjCpf] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [commissionType, setCommissionType] = useState<"percent" | "fixed">('percent');
  const [commissionValue, setCommissionValue] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "inactive">('active');

  const resetForm = () => {
    setCompanyName('');
    setTradingName('');
    setType('passeio');
    setCnpjCpf('');
    setContactName('');
    setPhone('');
    setEmail('');
    setCommissionType('percent');
    setCommissionValue(0);
    setStatus('active');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const openEdit = (partner: Partner) => {
    setCompanyName(partner.companyName);
    setTradingName(partner.tradingName);
    setType(partner.type);
    setCnpjCpf(partner.cnpj_cpf);
    setContactName(partner.contactName);
    setPhone(partner.phone);
    setEmail(partner.email);
    setCommissionType(partner.commissionType);
    setCommissionValue(partner.commissionValue);
    setStatus(partner.status);
    setEditingId(partner.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const partnerData: Partial<Partner> = {
      companyName,
      tradingName,
      type,
      cnpj_cpf,
      contactName,
      phone,
      whatsapp: phone, // using phone for whatsapp too here
      email,
      address: '',
      commissionType,
      commissionValue,
      status,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await firestoreService.update("partners", editingId, partnerData);
      } else {
        partnerData.id = Math.random().toString(36).substring(2, 9);
        partnerData.createdAt = new Date().toISOString();
        await firestoreService.set("partners", partnerData.id, partnerData);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving partner", err);
      alert("Erro ao salvar parceiro.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este parceiro?")) return;
    try {
      await firestoreService.delete("partners", id);
    } catch (err) {
      console.error("Error deleting partner", err);
      alert("Erro ao excluir.");
    }
  };

  const filtered = partners.filter(p => 
    p && (
      (p.companyName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) || 
      (p.tradingName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (p.contactName || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    )
  );

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Parceiros e Fornecedores</h2>
          <p className="text-zinc-400 text-sm">Gestão de empresas, comissões e contratos.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Novo Parceiro
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar parceiro..."
            className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex-1">
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
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Nenhum parceiro encontrado.</td></tr>
            ) : (
              filtered.map(partner => (
                <tr key={partner.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-100 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      {partner.tradingName || partner.companyName}
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span className="text-zinc-400">{partner.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-300">{partner.contactName}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> {partner.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-400 font-medium">
                    {partner.commissionType === 'percent' ? `${partner.commissionValue}%` : `R$ ${partner.commissionValue}`}
                  </td>
                  <td className="px-6 py-4">
                    {partner.status === 'active' ? (
                      <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-medium">Ativo</span>
                    ) : (
                      <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs font-medium">Inativo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(partner)} className="text-zinc-400 hover:text-blue-400 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(partner.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Parceiro' : 'Novo Parceiro'}</h3>
              <button onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="partner-form" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Razão Social</label>
                    <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nome Fantasia</label>
                    <input required type="text" value={tradingName} onChange={e => setTradingName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Categoria</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="passeio">Passeio</option>
                      <option value="hospedagem">Hospedagem</option>
                      <option value="transporte">Transporte</option>
                      <option value="fotografo">Fotógrafo</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">CNPJ / CPF</label>
                    <input required type="text" value={cnpj_cpf} onChange={e => setCnpjCpf(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Contato (Nome)</label>
                    <input required type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Telefone / WhatsApp</label>
                    <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">E-mail</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Tipo de Comissão</label>
                    <select value={commissionType} onChange={e => setCommissionType(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="percent">Percentual (%)</option>
                      <option value="fixed">Fixo (R$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Valor da Comissão</label>
                    <input required type="number" step="0.01" value={commissionValue} onChange={e => setCommissionValue(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="partner-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                {editingId ? 'Salvar Alterações' : 'Cadastrar Parceiro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
