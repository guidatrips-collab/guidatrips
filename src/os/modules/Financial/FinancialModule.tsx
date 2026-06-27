import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, FileText, Plus, X, Edit, Trash2 } from 'lucide-react';
import { FinancialTransaction } from '../../../types';
import { firestoreService } from '../../../firebase';

export function FinancialModule() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState<FinancialTransaction["type"]>('receita');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<FinancialTransaction["status"]>('pago');
  const [paymentMethod, setPaymentMethod] = useState<FinancialTransaction["paymentMethod"]>('pix');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await firestoreService.getAll<FinancialTransaction>("financial");
      // Sort descending by date
      setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType('receita');
    setDescription('');
    setAmount(0);
    setDate(new Date().toISOString().split('T')[0]);
    setStatus('pago');
    setPaymentMethod('pix');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const openEdit = (trx: FinancialTransaction) => {
    setType(trx.type);
    setDescription(trx.description);
    setAmount(trx.amount);
    setDate(trx.date.split('T')[0]);
    setStatus(trx.status);
    setPaymentMethod(trx.paymentMethod || 'pix');
    setEditingId(trx.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trxData: Partial<FinancialTransaction> = {
      type,
      description,
      amount,
      date,
      status,
      paymentMethod,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await firestoreService.update("financial", editingId, trxData);
      } else {
        trxData.id = Math.random().toString(36).substring(2, 9);
        trxData.createdAt = new Date().toISOString();
        await firestoreService.set("financial", trxData.id, trxData);
      }
      await fetchTransactions();
      resetForm();
    } catch (err) {
      console.error("Error saving", err);
      alert("Erro ao salvar lançamento.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lançamento?")) return;
    try {
      await firestoreService.delete("financial", id);
      await fetchTransactions();
    } catch (err) {
      console.error("Error deleting", err);
      alert("Erro ao excluir.");
    }
  };

  // Summaries
  const receitas = transactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const despesas = transactions.filter(t => (t.type === 'despesa' || t.type === 'comissao_parceiro' || t.type === 'comissao_afiliado' || t.type === 'imposto') && t.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0);
  const saldo = receitas - despesas;

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Financeiro</h2>
          <p className="text-zinc-400 text-sm">Fluxo de caixa, conciliação e comissões.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { resetForm(); setType('despesa'); setIsModalOpen(true); }} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Plus size={16} /> Nova Despesa
          </button>
          <button onClick={() => { resetForm(); setType('receita'); setIsModalOpen(true); }} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Plus size={16} /> Nova Receita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Receitas (Pagas)</h3>
            <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><TrendingUp size={16} /></div>
          </div>
          <p className="text-emerald-400 text-2xl font-bold font-mono">R$ {receitas.toFixed(2)}</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Despesas (Pagas)</h3>
            <div className="w-8 h-8 rounded bg-red-500/10 text-red-500 flex items-center justify-center"><TrendingDown size={16} /></div>
          </div>
          <p className="text-red-400 text-2xl font-bold font-mono">R$ {despesas.toFixed(2)}</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">Saldo Atual / Lucro</h3>
            <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center"><Wallet size={16} /></div>
          </div>
          <p className={`text-2xl font-bold font-mono ${saldo >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            R$ {saldo.toFixed(2)}
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Lançamentos</h3>
      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex-1">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Tipo / Categoria</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Carregando...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Nenhum lançamento encontrado.</td></tr>
            ) : (
              transactions.map(trx => (
                <tr key={trx.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-400">{new Date(trx.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-100">{trx.description}</div>
                    <div className="text-xs text-zinc-500 uppercase">{trx.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">{trx.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trx.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500' :
                      trx.status === 'pendente' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-medium flex items-center justify-end gap-2 ${
                    trx.type === 'receita' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trx.type === 'receita' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trx.type === 'receita' ? '+' : '-'} R$ {trx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(trx)} className="text-zinc-400 hover:text-blue-400 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(trx.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
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
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Lançamento' : (type === 'receita' ? 'Nova Receita' : 'Nova Despesa')}</h3>
              <button onClick={resetForm} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1">
              <form id="fin-form" onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Descrição</label>
                  <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Valor (R$)</label>
                    <input required type="number" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Data</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Tipo / Categoria</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="receita">Receita</option>
                      <option value="despesa">Despesa (Geral)</option>
                      <option value="comissao_parceiro">Comissão p/ Parceiro</option>
                      <option value="comissao_afiliado">Comissão p/ Afiliado</option>
                      <option value="imposto">Imposto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="pago">Pago / Recebido</option>
                      <option value="pendente">Pendente</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Método de Pagamento</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                    <option value="pix">PIX</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="boleto">Boleto</option>
                    <option value="transfer">Transferência Bancária</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="fin-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                {editingId ? 'Salvar Alterações' : 'Salvar Lançamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
