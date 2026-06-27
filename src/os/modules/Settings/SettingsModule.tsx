import React from 'react';
import { Settings, Globe, Palette, Shield, CreditCard, Bell } from 'lucide-react';

export function SettingsModule() {
  const tabs = [
    { id: 'geral', label: 'Geral', icon: Globe },
    { id: 'aparencia', label: 'Site / Vitrine', icon: Palette },
    { id: 'seguranca', label: 'Acessos e Equipe', icon: Shield },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Configurações do Guida OS</h2>
          <p className="text-zinc-400 text-sm">Preferências do sistema, site e integrações.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Salvar Alterações
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                tab.id === 'geral' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <tab.icon size={18} className={tab.id === 'geral' ? 'text-blue-500' : 'text-zinc-500'} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl p-8 overflow-y-auto">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6 border-b border-zinc-800 pb-4">Informações da Agência</h3>
          
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Nome Oficial</label>
              <input type="text" defaultValue="Guida Trips" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">WhatsApp de Atendimento</label>
                <input type="text" defaultValue="+5522999999999" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Email de Contato</label>
                <input type="email" defaultValue="contato@guidatrips.com.br" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Moeda Principal</label>
              <select className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar Americano ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
