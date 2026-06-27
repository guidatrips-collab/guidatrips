import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Map, 
  CalendarCheck, 
  DollarSign, 
  Share2, 
  Settings,
  LogOut,
  BrainCircuit,
  Hotel
} from 'lucide-react';
import { ProductsModule } from './modules/Products/ProductsModule';
import { CRMModule } from './modules/CRM/CRMModule';
import { SmartItineraryModule } from './modules/SmartItinerary/SmartItineraryModule';
import { AccommodationsModule } from './modules/Accommodations/AccommodationsModule';
import { PartnersModule } from './modules/Partners/PartnersModule';
import { ReservationsModule } from './modules/Reservations/ReservationsModule';
import { FinancialModule } from './modules/Financial/FinancialModule';
import { AffiliatesModule } from './modules/Affiliates/AffiliatesModule';
import { SettingsModule } from './modules/Settings/SettingsModule';
import { Experience, Lead } from '../types';

interface GuidaOSProps {
  onNavigateHome: () => void;
  experiences: Experience[];
  leads: Lead[];
  accommodations: any[];
  partners: any[];
  reservations: any[];
  financial: any[];
  affiliates: any[];
  budgets: any[];
  settings: any;
  onUpdateSettings: (s: any) => void;
}

export function GuidaOS({ 
  onNavigateHome, 
  experiences, 
  leads,
  accommodations,
  partners,
  reservations,
  financial,
  affiliates,
  budgets,
  settings,
  onUpdateSettings
}: GuidaOSProps) {
  const [activeModule, setActiveModule] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM & Leads', icon: Users },
    { id: 'smart-itinerary', label: 'Roteiro IA', icon: BrainCircuit },
    { id: 'products', label: 'Passeios', icon: Map },
    { id: 'accommodations', label: 'Hospedagens', icon: Hotel },
    { id: 'partners', label: 'Parceiros', icon: Briefcase },
    { id: 'reservations', label: 'Reservas', icon: CalendarCheck },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'affiliates', label: 'Afiliados', icon: Share2 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#121214] border-r border-zinc-800 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter">
              G
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Guida<span className="text-blue-500">OS</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3 mt-4">Principal</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                activeModule === item.id 
                  ? 'bg-blue-600/10 text-blue-500' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
              }`}
            >
              <item.icon size={18} className={activeModule === item.id ? 'text-blue-500' : 'text-zinc-500'} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">Admin</span>
              <span className="text-xs text-zinc-500">admin@guidatrips.com</span>
            </div>
          </div>
          <button 
            onClick={onNavigateHome}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sair do OS
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090b]">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md">
          <h1 className="text-xl font-semibold text-zinc-100 capitalize">
            {navItems.find(i => i.id === activeModule)?.label || activeModule}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar no sistema..." 
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-1.5 rounded-full text-sm focus:outline-none focus:border-blue-500 w-64 transition-colors"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors">
              <span className="relative flex h-2 w-2 absolute top-2 right-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
          </div>
        </header>

        {/* Content Module Space */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeModule === 'products' && <ProductsModule experiences={experiences} />}
            {activeModule === 'crm' && <CRMModule leads={leads} />}
            {activeModule === 'smart-itinerary' && <SmartItineraryModule experiences={experiences} budgets={budgets} />}
            {activeModule === 'accommodations' && <AccommodationsModule accommodations={accommodations} />}
            {activeModule === 'partners' && <PartnersModule partners={partners} />}
            {activeModule === 'reservations' && <ReservationsModule reservations={reservations} experiences={experiences} />}
            {activeModule === 'financial' && <FinancialModule transactions={financial} />}
            {activeModule === 'affiliates' && <AffiliatesModule affiliates={affiliates} />}
            {activeModule === 'settings' && <SettingsModule settings={settings} onUpdateSettings={onUpdateSettings} />}

            {activeModule === 'dashboard' && (
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <div className="bg-[#121214] border border-zinc-800/80 rounded-xl p-6 shadow-sm">
                  <h3 className="text-zinc-400 text-sm font-medium mb-2">Receita Total (Paga)</h3>
                  <p className="text-zinc-100 text-2xl font-semibold">
                    R$ {financial.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50 text-emerald-500 text-sm">
                    Fluxo consolidado
                  </div>
                </div>
                <div className="bg-[#121214] border border-zinc-800/80 rounded-xl p-6 shadow-sm">
                  <h3 className="text-zinc-400 text-sm font-medium mb-2">Novos Leads</h3>
                  <p className="text-zinc-100 text-2xl font-semibold">{leads.filter(l => l.status === 'novo').length}</p>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50 text-zinc-500 text-sm">
                    Aguardando contato
                  </div>
                </div>
                <div className="bg-[#121214] border border-zinc-800/80 rounded-xl p-6 shadow-sm">
                  <h3 className="text-zinc-400 text-sm font-medium mb-2">Orçamentos Pendentes</h3>
                  <p className="text-zinc-100 text-2xl font-semibold">{budgets.filter(b => b.status === 'draft' || b.status === 'sent').length}</p>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50 text-zinc-500 text-sm">
                    Aguardando aprovação
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'dashboard' && (
               <div className="mt-8 bg-[#121214] border border-zinc-800/80 rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                    <BrainCircuit size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-2">Guida OS Totalmente Inicializado</h2>
                  <p className="text-zinc-400 max-w-md">
                    Todos os módulos do Sistema Operacional foram instanciados. O Guida OS já é o cérebro da operação. Explore o menu lateral.
                  </p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
