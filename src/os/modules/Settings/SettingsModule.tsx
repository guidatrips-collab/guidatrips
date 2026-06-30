import React, { useState, useEffect } from 'react';
import { Settings, Globe, Palette, Shield, CreditCard, Bell } from 'lucide-react';
import { GlobalSettings } from '../../../types';
import { firestoreService } from '../../../firebase';

export function SettingsModule({ settings: initialSettings, onUpdateSettings }: { settings: any, onUpdateSettings: (s: any) => void }) {
  const [localSettings, setLocalSettings] = useState<Partial<GlobalSettings>>(initialSettings || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setLocalSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleChange = (field: keyof GlobalSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdateSettings({ ...localSettings, id: "global" });
      alert("Configurações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Globe },
    { id: 'aparencia', label: 'Site / Vitrine', icon: Palette },
  ];
  
  const [activeTab, setActiveTab] = useState('geral');

  useEffect(() => {
    // Scroll parent container to top when tab changes
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Configurações do Guida OS</h2>
          <p className="text-zinc-400 text-sm">Preferências do sistema, site e integrações.</p>
        </div>
        <button disabled={loading} onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                activeTab === tab.id ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-500' : 'text-zinc-500'} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl p-8 overflow-y-auto">
          {activeTab === 'geral' && (
            <>
              <h3 className="text-lg font-semibold text-zinc-100 mb-6 border-b border-zinc-800 pb-4">Informações da Agência</h3>
              
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">WhatsApp de Atendimento</label>
                    <input type="text" value={localSettings.whatsappNumber || ''} onChange={e => handleChange('whatsappNumber', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="+55 22 9999-9999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Google Analytics ID</label>
                    <input type="text" value={localSettings.googleAnalyticsId || ''} onChange={e => handleChange('googleAnalyticsId', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="G-XXXXXXXX" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Mensagem Automática WhatsApp</label>
                  <textarea value={localSettings.whatsappGreeting || ''} onChange={e => handleChange('whatsappGreeting', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 h-24" placeholder="Olá, gostaria de saber mais sobre..." />
                </div>
              </div>
            </>
          )}

          {activeTab === 'aparencia' && (
            <>
              <h3 className="text-lg font-semibold text-zinc-100 mb-6 border-b border-zinc-800 pb-4">Vitrine do Site</h3>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Título do Hero (Home)</label>
                  <input type="text" value={localSettings.homeHeroTitle || ''} onChange={e => handleChange('homeHeroTitle', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Descubra Arraial do Cabo" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Descrição do Hero</label>
                  <textarea value={localSettings.homeHeroDesc || ''} onChange={e => handleChange('homeHeroDesc', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 h-24" placeholder="A capital do mergulho..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Imagem de Fundo Hero (URL)</label>
                  <input type="url" value={localSettings.homeHeroImgUrl || ''} onChange={e => handleChange('homeHeroImgUrl', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" placeholder="https://..." />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
