import React, { useState } from 'react';
import { Share2, Users, Link as LinkIcon, DollarSign, ArrowRight, Plus, Search, Filter, Trash, Edit, X, Settings } from 'lucide-react';
import { firestoreService } from '../../../firebase';
import { Affiliate, GlobalSettings, User } from '../../../types';

interface AffiliatesModuleProps {
  affiliates: Affiliate[];
  currentUser: User;
  settings: GlobalSettings;
  onUpdateSettings: (s: GlobalSettings) => void;
  reservations: any[];
  experiences: any[];
}

export function AffiliatesModule({ affiliates, currentUser, settings, onUpdateSettings, reservations, experiences }: AffiliatesModuleProps) {
  const isAdmin = currentUser.roles.includes('admin') || currentUser.roles.includes('equipe');
  
  if (isAdmin) {
    return <AdminAffiliatesView affiliates={affiliates} settings={settings} onUpdateSettings={onUpdateSettings} reservations={reservations} experiences={experiences} />;
  }

  // Find the affiliate record for this user
  const affiliateRecord = affiliates.find(a => a.userId === currentUser.id);

  if (!affiliateRecord) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400">
        <Share2 size={48} className="mb-4 text-zinc-600" />
        <h2 className="text-xl font-medium mb-2">Conta de Afiliado não configurada</h2>
        <p>Por favor, entre em contato com o suporte para vincular sua conta de afiliado.</p>
      </div>
    );
  }

  return <AffiliateDashboardView affiliate={affiliateRecord} settings={settings} reservations={reservations} experiences={experiences} />;
}

function AdminAffiliatesView({ affiliates, settings, onUpdateSettings, reservations, experiences }: { affiliates: Affiliate[], settings: GlobalSettings, onUpdateSettings: (s: GlobalSettings) => void, reservations: any[], experiences: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [slug, setSlug] = useState('');
  const [commissionRate, setCommissionRate] = useState(10);
  const [status, setStatus] = useState<Affiliate["status"]>('active');
  const [userId, setUserId] = useState('');

  // Settings State
  const [cookieDays, setCookieDays] = useState(settings.affiliateCookieDurationDays || 30);

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPhone('');
    setSlug('');
    setCommissionRate(10);
    setStatus('active');
    setUserId('');
    setIsModalOpen(true);
  };

  const openEdit = (a: Affiliate) => {
    setEditingId(a.id);
    setName(a.name);
    setEmail(a.email || '');
    setPhone(a.phone || '');
    setSlug(a.slug);
    setCommissionRate(a.commissionRate || 10);
    setStatus(a.status);
    setUserId(a.userId || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const aData: Partial<Affiliate> = {
      name,
      email,
      phone,
      slug,
      commissionRate,
      status,
      userId: userId || undefined,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await firestoreService.update("affiliates", editingId, aData);
      } else {
        aData.id = Math.random().toString(36).substring(2, 9);
        aData.clicks = 0;
        aData.uniqueVisitors = 0;
        aData.conversions = 0;
        aData.revenueGenerated = 0;
        aData.commissionsAccrued = 0;
        aData.commissionsPaid = 0;
        aData.createdAt = new Date().toISOString();
        await firestoreService.set("affiliates", aData.id, aData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar afiliado.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir afiliado?')) return;
    try {
      await firestoreService.delete("affiliates", id);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir afiliado.');
    }
  };

  const saveSettings = async () => {
    try {
      const updated = { ...settings, affiliateCookieDurationDays: cookieDays };
      await firestoreService.update("settings", "global", updated);
      onUpdateSettings(updated);
      setIsSettingsModalOpen(false);
    } catch(e) {
      console.error(e);
      alert('Erro ao salvar configurações.');
    }
  };

  const extendedAffiliates = affiliates.map(affiliate => {
    let dynamicConversions = 0;
    let dynamicRevenue = 0;
    
    reservations.forEach(res => {
      if (res.affiliateRef === affiliate.slug && res.status === 'confirmed') {
        dynamicConversions++;
        if (res.amount) {
          dynamicRevenue += res.amount;
        } else {
          const exp = experiences.find(e => e.id === res.experienceId);
          if (exp) {
            const pax = res.pax || 2;
            const price = exp.promotionalPrice || exp.priceFrom || 0;
            dynamicRevenue += (pax * price);
          }
        }
      }
    });

    const displayConversions = affiliate.conversions || dynamicConversions;
    const displayRevenue = affiliate.revenueGenerated || dynamicRevenue;
    const displayCommissions = affiliate.commissionsAccrued || (displayRevenue * ((affiliate.commissionRate || 10) / 100));

    return {
      ...affiliate,
      displayConversions,
      displayRevenue,
      displayCommissions
    };
  });

  const totalClicks = extendedAffiliates.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalConversions = extendedAffiliates.reduce((acc, curr) => acc + curr.displayConversions, 0);
  const totalCommissions = extendedAffiliates.reduce((acc, curr) => acc + curr.displayCommissions, 0);

  const filteredAffiliates = extendedAffiliates.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.email && a.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Programa de Afiliados</h2>
          <p className="text-zinc-400 text-sm">Gestão de links, comissionamento e indicações.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsSettingsModalOpen(true)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Settings size={18} />
            Configurações
          </button>
          <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Novo Afiliado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-5 text-center">
          <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2"><Users size={20} /></div>
          <h3 className="text-xl font-bold text-zinc-100">{affiliates.length}</h3>
          <p className="text-zinc-400 text-xs">Afiliados Ativos</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2"><Share2 size={20} /></div>
          <h3 className="text-xl font-bold text-zinc-100">{totalClicks}</h3>
          <p className="text-zinc-400 text-xs">Cliques Totais</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-center">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2"><ArrowRight size={20} /></div>
          <h3 className="text-xl font-bold text-zinc-100">{totalConversions}</h3>
          <p className="text-zinc-400 text-xs">Conversões Totais</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 text-center">
          <div className="w-10 h-10 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-2"><DollarSign size={20} /></div>
          <h3 className="text-xl font-bold text-zinc-100">R$ {totalCommissions.toFixed(2)}</h3>
          <p className="text-zinc-400 text-xs">Comissões Geradas</p>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar afiliado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800 text-zinc-100 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="text-zinc-400 text-xs uppercase font-semibold border-b border-zinc-800 bg-zinc-900/50">
            <tr>
              <th className="px-6 py-4">Afiliado</th>
              <th className="px-6 py-4">Desempenho</th>
              <th className="px-6 py-4 text-right">Comissões</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredAffiliates.map((a) => (
              <tr key={a.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-100">{a.name}</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1"><LinkIcon size={10} />/?ref={a.slug}</div>
                  <div className="text-xs text-zinc-500 mt-1">{a.commissionRate || 10}% de comissão</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-zinc-400">Cliques: <span className="font-mono text-zinc-300">{a.clicks || 0}</span></div>
                  <div className="text-xs text-zinc-400 mt-0.5">Visitas Únicas: <span className="font-mono text-zinc-300">{a.uniqueVisitors || 0}</span></div>
                  <div className="text-xs text-zinc-400 mt-0.5">Conversões: <span className="font-mono text-zinc-300">{a.displayConversions}</span></div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-mono text-emerald-400 font-medium">R$ {a.displayCommissions.toFixed(2)} gerado</div>
                  <div className="font-mono text-zinc-500 text-xs mt-1">R$ {(a.commissionsPaid || 0).toFixed(2)} pago</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openEdit(a)} className="text-zinc-400 hover:text-blue-400 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(a.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {affiliates.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  Nenhum afiliado encontrado.
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
              <h3 className="text-xl font-bold text-zinc-100">{editingId ? 'Editar Afiliado' : 'Novo Afiliado'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <form id="affiliate-form" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Ex: João" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">E-mail</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="email@exemplo.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Telefone</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">ID Usuário (Login)</label>
                    <input type="text" value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="ID no sistema (opcional)" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Slug (Link único)</label>
                  <input required type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="ex: joao-viajante" />
                  <p className="text-xs text-zinc-500 mt-1">Link: {window.location.origin}/?ref={slug || '...'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Comissão (%)</label>
                    <input required type="number" min="0" max="100" step="0.01" value={commissionRate} onChange={e => setCommissionRate(parseFloat(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="affiliate-form" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Salvar Afiliado
              </button>
            </div>
          </div>
        </div>
      )}

      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-100">Configurações (Afiliados)</h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Janela de Conversão (Cookie em dias)</label>
              <select value={cookieDays} onChange={e => setCookieDays(parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                <option value={1}>1 dia</option>
                <option value={7}>7 dias</option>
                <option value={15}>15 dias</option>
                <option value={30}>30 dias</option>
                <option value={60}>60 dias</option>
                <option value={90}>90 dias</option>
              </select>
              <p className="text-xs text-zinc-500 mt-2">
                Tempo que o sistema lembrará que o cliente veio pelo link do afiliado.
              </p>
            </div>
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button onClick={() => setIsSettingsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                Cancelar
              </button>
              <button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AffiliateDashboardView({ affiliate, settings, reservations, experiences }: { affiliate: Affiliate, settings: GlobalSettings, reservations: any[], experiences: any[] }) {
  const affiliateLink = `${window.location.origin}/?ref=${affiliate.slug}`;
  const affiliateLinkAlt = `${window.location.origin}/ref/${affiliate.slug}`;

  // Calculate dynamic stats
  let dynamicConversions = 0;
  let dynamicRevenue = 0;
  
  reservations.forEach(res => {
    if (res.affiliateRef === affiliate.slug && res.status === 'confirmed') {
      dynamicConversions++;
      if (res.amount) {
        dynamicRevenue += res.amount;
      } else {
        const exp = experiences.find(e => e.id === res.experienceId);
        if (exp) {
          const pax = res.pax || 2;
          const price = exp.promotionalPrice || exp.priceFrom || 0;
          dynamicRevenue += (pax * price);
        }
      }
    }
  });

  const displayConversions = affiliate.conversions || dynamicConversions;
  const displayRevenue = affiliate.revenueGenerated || dynamicRevenue;
  const displayCommissions = affiliate.commissionsAccrued || (displayRevenue * ((affiliate.commissionRate || 10) / 100));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link copiado para a área de transferência!");
  };

  return (
    <div className="w-full h-full flex flex-col relative space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Olá, {affiliate.name.split(' ')[0]}!</h2>
        <p className="text-zinc-400 text-sm">Bem-vindo(a) ao seu painel de afiliado.</p>
      </div>

      {/* Links de Divulgação */}
      <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <LinkIcon size={20} className="text-blue-500" />
          Seus Links de Divulgação
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-400 mb-1.5">Link Principal</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-emerald-400 text-sm font-mono overflow-x-auto">
                {affiliateLink}
              </code>
              <button onClick={() => copyToClipboard(affiliateLink)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                Copiar
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm text-zinc-400 mb-1.5">Link Alternativo</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-emerald-400 text-sm font-mono overflow-x-auto">
                {affiliateLinkAlt}
              </code>
              <button onClick={() => copyToClipboard(affiliateLinkAlt)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                Copiar
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400">
            <strong>Dica:</strong> Compartilhe seus links em redes sociais, blogs ou envie diretamente para seus contatos.
            As indicações ficam vinculadas a você por <strong>{settings.affiliateCookieDurationDays || 30} dias</strong> após o primeiro clique.
            Sua comissão atual é de <strong>{affiliate.commissionRate || 10}%</strong>.
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
        <DollarSign size={20} className="text-emerald-500" />
        Desempenho Geral
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <h4 className="text-zinc-400 text-sm font-medium mb-1">Cliques em Links</h4>
          <p className="text-2xl font-bold text-zinc-100">{affiliate.clicks || 0}</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <h4 className="text-zinc-400 text-sm font-medium mb-1">Visitantes Únicos</h4>
          <p className="text-2xl font-bold text-zinc-100">{affiliate.uniqueVisitors || 0}</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <h4 className="text-zinc-400 text-sm font-medium mb-1">Reservas Aprovadas</h4>
          <p className="text-2xl font-bold text-zinc-100">{displayConversions}</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
          <h4 className="text-zinc-400 text-sm font-medium mb-1">Receita Gerada</h4>
          <p className="text-2xl font-bold text-emerald-400">R$ {displayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <h4 className="text-emerald-400 text-sm font-medium mb-2">Comissões Acumuladas</h4>
          <p className="text-3xl font-bold text-emerald-500">R$ {displayCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-zinc-400 mt-2">Valor total gerado por indicações</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <h4 className="text-zinc-400 text-sm font-medium mb-2">Comissões Recebidas</h4>
          <p className="text-3xl font-bold text-zinc-100">R$ {(affiliate.commissionsPaid || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-zinc-500 mt-2">Valor já pago pela administração</p>
        </div>
      </div>
    </div>
  );
}
