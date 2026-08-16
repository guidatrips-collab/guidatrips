import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Info,
  CalendarDays,
  X,
  Layers,
  Check
} from 'lucide-react';
import { Experience, Accommodation } from '../types';

type PricingItem = Experience | Accommodation;

interface CalendarPricingViewProps {
  items: PricingItem[];
  onUpdateItem: (updatedItem: PricingItem) => void;
  title?: string;
  itemTypeLabel?: string;
}

export function CalendarPricingView({ 
  items, 
  onUpdateItem, 
  title = "Tarifário e Disponibilidade", 
  itemTypeLabel = "experiência" 
}: CalendarPricingViewProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  
  // Local synchronous state cache to ensure zero latency and immediate visual feedback when clearing
  const [localItemMap, setLocalItemMap] = useState<Record<string, PricingItem>>({});

  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return localItemMap[selectedItemId] || items.find(e => e.id === selectedItemId) || null;
  }, [items, selectedItemId, localItemMap]);

  const selectedRoom = useMemo(() => {
    if (selectedItem && 'roomTypes' in selectedItem && selectedItem.roomTypes) {
      return selectedItem.roomTypes.find(r => r.id === selectedRoomId) || selectedItem.roomTypes[0] || null;
    }
    return null;
  }, [selectedItem, selectedRoomId]);

  const activeCalendarSource = selectedRoom || selectedItem;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
  // Pricing Form State
  const [adultPrice, setAdultPrice] = useState<number | "">("");
  const [childPrice, setChildPrice] = useState<number | "">("");
  const [babyPrice, setBabyPrice] = useState<number | "">("");
  const [status, setStatus] = useState<"open" | "closed">("open");

  // Notification toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Clear modal confirmation state
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearScope, setClearScope] = useState<'all_room' | 'all_accommodation' | 'month' | 'all_and_periods'>('all_room');

  // Format date to strictly deterministic YYYY-MM-DD
  const formatDateStr = (year: number, month: number, day: number) => {
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const jumpToMonth = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
  };

  const toggleDateSelection = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const selectCurrentMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const newSelection: string[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      newSelection.push(formatDateStr(year, month, i));
    }
    
    setSelectedDates(newSelection);
  };

  const selectNextNMonths = (monthCount: number) => {
    const startYear = currentMonth.getFullYear();
    const startMonth = currentMonth.getMonth();
    const newSelection: string[] = [];

    for (let m = 0; m < monthCount; m++) {
      const targetDate = new Date(startYear, startMonth + m, 1);
      const targetY = targetDate.getFullYear();
      const targetM = targetDate.getMonth();
      const days = getDaysInMonth(targetY, targetM);
      for (let d = 1; d <= days; d++) {
        newSelection.push(formatDateStr(targetY, targetM, d));
      }
    }
    setSelectedDates(newSelection);
  };

  const selectFullYear = () => {
    selectNextNMonths(12);
  };

  const selectWeekendsCurrentMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const newSelection: string[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(year, month, i).getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) { // Fri, Sat, Sun
        newSelection.push(formatDateStr(year, month, i));
      }
    }
    setSelectedDates(newSelection);
  };

  const selectWeekendsFullYear = () => {
    const startYear = currentMonth.getFullYear();
    const startMonth = currentMonth.getMonth();
    const newSelection: string[] = [];

    for (let m = 0; m < 12; m++) {
      const targetDate = new Date(startYear, startMonth + m, 1);
      const targetY = targetDate.getFullYear();
      const targetM = targetDate.getMonth();
      const days = getDaysInMonth(targetY, targetM);
      for (let d = 1; d <= days; d++) {
        const dayOfWeek = new Date(targetY, targetM, d).getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) { // Sex, Sáb, Dom
          newSelection.push(formatDateStr(targetY, targetM, d));
        }
      }
    }
    setSelectedDates(newSelection);
  };

  const selectWeekdaysCurrentMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const newSelection: string[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(year, month, i).getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Mon to Thu
        newSelection.push(formatDateStr(year, month, i));
      }
    }
    setSelectedDates(newSelection);
  };

  const clearSelection = () => {
    setSelectedDates([]);
  };

  // Base fallback price
  const getBaseFallbackPrice = () => {
    if (!activeCalendarSource) return 0;
    if ('basePrice' in activeCalendarSource && typeof activeCalendarSource.basePrice === 'number') {
      return activeCalendarSource.basePrice;
    }
    if ('sellRate' in activeCalendarSource && typeof activeCalendarSource.sellRate === 'number') {
      return activeCalendarSource.sellRate;
    }
    if ('priceFrom' in activeCalendarSource && typeof activeCalendarSource.priceFrom === 'number') {
      return activeCalendarSource.priceFrom;
    }
    if (activeCalendarSource.pricing?.adultPrice) {
      return activeCalendarSource.pricing.adultPrice;
    }
    return 0;
  };

  const basePrice = getBaseFallbackPrice();

  const handleApplyToSelection = () => {
    if (!selectedItem || selectedDates.length === 0) return;
    
    const currentCalendar = { ...(activeCalendarSource?.calendar || {}) };
    
    selectedDates.forEach(date => {
      const ap = adultPrice !== "" ? Number(adultPrice) : basePrice;
      const cp = childPrice !== "" ? Number(childPrice) : 0;
      const bp = babyPrice !== "" ? Number(babyPrice) : 0;
      
      currentCalendar[date] = {
        status: status,
        adultPrice: ap,
        childPrice: cp,
        babyPrice: bp
      };
    });

    let updatedItem: any;
    if (selectedRoom && 'roomTypes' in selectedItem) {
      const updatedRooms = (selectedItem.roomTypes || []).map(r => 
        r.id === selectedRoom.id ? { ...r, calendar: currentCalendar } : r
      );
      updatedItem = {
        ...selectedItem,
        roomTypes: updatedRooms
      };
    } else {
      updatedItem = {
        ...selectedItem,
        calendar: currentCalendar
      };
    }

    setLocalItemMap(prev => ({ ...prev, [updatedItem.id]: updatedItem }));
    onUpdateItem(updatedItem);
    
    showToast(`✓ Sucesso: ${selectedDates.length} data(s) salvas com sucesso no tarifário!`);
    clearSelection();
  };

  // Clear specific selected dates from calendar
  const handleRemoveCustomizationFromSelection = () => {
    if (!selectedItem || selectedDates.length === 0) return;
    const newCalendar = { ...(activeCalendarSource?.calendar || {}) };
    selectedDates.forEach(d => delete newCalendar[d]);
    
    let updatedItem: any;
    if (selectedRoom && 'roomTypes' in selectedItem) {
      const updatedRooms = (selectedItem.roomTypes || []).map(r => 
        r.id === selectedRoom.id ? { ...r, calendar: newCalendar } : r
      );
      updatedItem = { ...selectedItem, roomTypes: updatedRooms };
    } else {
      updatedItem = { ...selectedItem, calendar: newCalendar };
    }

    setLocalItemMap(prev => ({ ...prev, [updatedItem.id]: updatedItem }));
    onUpdateItem(updatedItem);
    showToast(`✓ ${selectedDates.length} data(s) restauradas para a diária padrão.`);
    clearSelection();
  };

  // Clear entire tariff (reset) for room or item
  const handleExecuteClearTariff = (scope: 'month' | 'all_room' | 'all_accommodation' | 'all_and_periods') => {
    if (!selectedItem) return;

    let updatedItem: any;

    if (scope === 'all_accommodation' && 'roomTypes' in selectedItem && selectedItem.roomTypes) {
      // Complete wipe of all calendar dates AND seasonal periods across ALL rooms of this accommodation
      const updatedRooms = (selectedItem.roomTypes || []).map(r => ({
        ...r,
        calendar: {},
        pricingPeriods: []
      }));
      updatedItem = {
        ...selectedItem,
        calendar: {},
        pricingPeriods: [],
        roomTypes: updatedRooms
      };
      setLocalItemMap(prev => ({ ...prev, [updatedItem.id]: updatedItem }));
      onUpdateItem(updatedItem);
      showToast(`✓ Zerado com Sucesso: Todos os quartos de "${selectedItem.name}" tiveram o tarifário 100% resetado para a diária base!`);
    } else if (scope === 'all_and_periods' || scope === 'all_room') {
      // Wipe calendar AND pricing periods for current room or item
      if (selectedRoom && 'roomTypes' in selectedItem) {
        const updatedRooms = (selectedItem.roomTypes || []).map(r => 
          r.id === selectedRoom.id ? { ...r, calendar: {}, pricingPeriods: [] } : r
        );
        updatedItem = {
          ...selectedItem,
          roomTypes: updatedRooms
        };
      } else {
        updatedItem = {
          ...selectedItem,
          calendar: {},
          pricingPeriods: []
        };
      }
      setLocalItemMap(prev => ({ ...prev, [updatedItem.id]: updatedItem }));
      onUpdateItem(updatedItem);
      showToast(`✓ Zerado com Sucesso: Todo o tarifário (${selectedRoom ? selectedRoom.name : selectedItem.name}) voltou para a diária base padrão!`);
    } else {
      // Wipe only dates matching the currently displayed year-month (YYYY-MM)
      const year = currentMonth.getFullYear();
      const monthPrefix = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      let newCalendar = { ...(activeCalendarSource?.calendar || {}) };
      Object.keys(newCalendar).forEach(d => {
        if (d.startsWith(monthPrefix)) {
          delete newCalendar[d];
        }
      });

      if (selectedRoom && 'roomTypes' in selectedItem) {
        const updatedRooms = (selectedItem.roomTypes || []).map(r => 
          r.id === selectedRoom.id ? { ...r, calendar: newCalendar } : r
        );
        updatedItem = {
          ...selectedItem,
          roomTypes: updatedRooms
        };
      } else {
        updatedItem = {
          ...selectedItem,
          calendar: newCalendar
        };
      }
      setLocalItemMap(prev => ({ ...prev, [updatedItem.id]: updatedItem }));
      onUpdateItem(updatedItem);
      showToast(`✓ Tarifário do mês de ${currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} zerado!`);
    }

    clearSelection();
    setShowClearModal(false);
  };

  // Generate calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Month stats calculation
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const totalCustomDatesInMonth = Object.keys(activeCalendarSource?.calendar || {}).filter(d => d.startsWith(monthPrefix)).length;
  const totalCustomDatesOverall = Object.keys(activeCalendarSource?.calendar || {}).length;

  const monthNamesShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HEADER / SELECT ITEM */}
      <div className="bg-[#0D1B2A]/40 border border-white/5 p-6 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#F4EFE6] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#E8711A]" /> {title}
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Gerencie valores específicos por data e datas bloqueadas. Cada quarto e cada mês possuem tarifários 100% isolados.
            </p>
          </div>

          {activeCalendarSource && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setClearScope('all_room');
                  setShowClearModal(true);
                }}
                className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Zerar tarifário de todos os meses do ano ou deste mês"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                Zerar Tarifário / Limpar Tudo
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
              1. Selecione a {itemTypeLabel === 'hospedagem' ? 'Hospedagem' : 'Experiência'}:
            </label>
            <select 
              value={selectedItemId}
              onChange={(e) => {
                setSelectedItemId(e.target.value);
                setSelectedRoomId("");
                clearSelection();
              }}
              className="w-full bg-[#0D1B2A] border border-white/10 p-3 text-sm text-white rounded-md outline-none focus:border-[#E8711A]"
            >
              <option value="">-- Escolha --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          {selectedItem && itemTypeLabel === 'hospedagem' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                2. Selecione o Quarto / Categoria:
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => {
                  setSelectedRoomId(e.target.value);
                  clearSelection();
                }}
                className="w-full bg-[#0D1B2A] border border-white/10 p-3 text-sm text-white rounded-md outline-none focus:border-[#E8711A]"
              >
                <option value="">-- Selecione um Quarto --</option>
                {selectedItem && 'roomTypes' in selectedItem && selectedItem.roomTypes && selectedItem.roomTypes.map(room => {
                  const roomCustomCount = Object.keys(room.calendar || {}).length;
                  return (
                    <option key={room.id} value={room.id}>
                      {room.name} (Capacidade: {room.maxGuests} {room.maxGuests > 1 ? 'hóspedes' : 'hóspede'}) {roomCustomCount > 0 ? `• [${roomCustomCount} tarifas personalizadas]` : '• [Tarifa Padrão]'}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {selectedItem && itemTypeLabel === 'hospedagem' && (!('roomTypes' in selectedItem) || !selectedItem.roomTypes || selectedItem.roomTypes.length === 0) && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Esta hospedagem ainda não possui quartos cadastrados. Cadastre os quartos na aba de edição da hospedagem para gerenciar o tarifário.</span>
        </div>
      )}

      {selectedItem && itemTypeLabel === 'hospedagem' && 'roomTypes' in selectedItem && selectedItem.roomTypes && selectedItem.roomTypes.length > 0 && !selectedRoomId && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-300 text-sm flex items-center gap-3">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>Selecione um quarto no menu acima para visualizar e editar o tarifário isolado daquele quarto.</span>
        </div>
      )}

      {selectedItem && (itemTypeLabel !== 'hospedagem' || (itemTypeLabel === 'hospedagem' && selectedRoomId)) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CALENDAR */}
          <div className="lg:col-span-2 bg-[#0D1B2A]/40 border border-white/5 p-6 rounded-lg">
            
            {/* MONTH QUICK-JUMP TABS */}
            <div className="mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  Navegação Rápida pelos Meses ({year})
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {totalCustomDatesOverall} datas personalizadas cadastradas no total
                </span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
                {monthNamesShort.map((mName, idx) => {
                  const mPrefix = `${year}-${String(idx + 1).padStart(2, '0')}`;
                  const customInThisMonth = Object.keys(activeCalendarSource?.calendar || {}).filter(d => d.startsWith(mPrefix)).length;
                  const isCurrentActive = currentMonth.getMonth() === idx;
                  return (
                    <button
                      key={mName}
                      onClick={() => jumpToMonth(idx)}
                      className={`px-1.5 py-1.5 rounded text-[10px] font-bold uppercase transition flex flex-col items-center justify-center cursor-pointer ${
                        isCurrentActive 
                          ? 'bg-[#E8711A] text-white shadow-md' 
                          : customInThisMonth > 0 
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40' 
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{mName}</span>
                      {customInThisMonth > 0 && (
                        <span className={`text-[8px] px-1 rounded-full ${isCurrentActive ? 'bg-black/30 text-white' : 'bg-emerald-500/20 text-emerald-400 font-extrabold'}`}>
                          {customInThisMonth}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MONTH HEADER & STATS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <button onClick={prevMonth} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-md transition cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <h4 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="text-[11px] text-zinc-400">
                    Diária Base Padrão: <span className="text-emerald-400 font-bold">R$ {basePrice.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={nextMonth} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-md transition cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Month summary pills */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  {totalCustomDatesInMonth} dia(s) alterados neste mês
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setClearScope('all_room');
                    setShowClearModal(true);
                  }}
                  className="px-2.5 py-1 rounded bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Limpar ou zerar tarifário"
                >
                  <Trash2 className="w-3 h-3" />
                  Zerar Tarifário ({totalCustomDatesOverall})
                </button>
              </div>
            </div>

            {/* LEGEND EXPLANATION */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500"></div>
                  <span className="text-zinc-200 font-medium">Tarifa Personalizada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-[#0D1B2A] border border-dashed border-zinc-700"></div>
                  <span className="text-zinc-400">Diária Base Padrão (Sem alteração)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500"></div>
                  <span className="text-red-400">Data Bloqueada</span>
                </div>
              </div>
              <div className="text-zinc-400 italic text-[10px]">
                * Dias sem tarifário fixado utilizam a diária base padrão
              </div>
            </div>

            {/* WEEKDAY HEADERS */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-accent text-[10px] uppercase text-zinc-400 font-bold tracking-wider">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* DAYS GRID */}
            <div className="grid grid-cols-7 gap-2">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="h-20 bg-transparent rounded-md border border-transparent"></div>
              ))}
              
              {days.map(day => {
                const dateStr = formatDateStr(year, month, day);
                const isSelected = selectedDates.includes(dateStr);
                const dayData = activeCalendarSource?.calendar?.[dateStr];
                
                const hasCustomTariff = Boolean(dayData && (dayData.adultPrice !== undefined || dayData.status));
                const isClosed = dayData?.status === 'closed';
                const displayedPrice = hasCustomTariff && dayData?.adultPrice !== undefined 
                  ? dayData.adultPrice 
                  : basePrice;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => toggleDateSelection(dateStr)}
                    className={`h-20 rounded-md border p-1.5 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      isSelected 
                        ? "bg-[#E8711A]/20 border-[#E8711A] ring-1 ring-[#E8711A]" 
                        : hasCustomTariff
                          ? isClosed 
                            ? "bg-red-950/30 border-red-500/50 hover:border-red-400" 
                            : "bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-400"
                          : "bg-[#0D1B2A] border-white/5 hover:border-white/20 border-dashed"
                    } ${isClosed ? "opacity-75" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-bold ${
                        isSelected 
                          ? "text-[#E8711A]" 
                          : hasCustomTariff 
                            ? "text-emerald-300 font-extrabold" 
                            : "text-zinc-300"
                      }`}>
                        {day}
                      </span>
                      
                      {hasCustomTariff && (
                        <span className={`text-[8px] font-bold px-1 rounded uppercase tracking-tighter ${
                          isClosed ? "bg-red-500 text-white" : "bg-emerald-500 text-black"
                        }`}>
                          {isClosed ? "Bloq" : "Tarifa"}
                        </span>
                      )}
                    </div>
                    
                    {!isClosed ? (
                      <div className="text-[9px] font-sans text-right">
                        <div className={`font-semibold ${hasCustomTariff ? "text-emerald-400 font-bold" : "text-zinc-400"}`}>
                          R$ {displayedPrice}
                        </div>
                        <div className="text-[8px] text-zinc-500">
                          {hasCustomTariff ? "Personalizado" : "Padrão Base"}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[9px] font-sans text-center text-red-400 font-bold uppercase py-1 bg-red-500/10 rounded">
                        Bloqueado
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ADVANCED SELECTION SHORTCUTS (MONTH & ALL MONTHS) */}
            <div className="mt-6 border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8711A] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Seleção Rápida em Lote (Mês Atual ou Todos os Meses)
                </span>
                {selectedDates.length > 0 && (
                  <button 
                    onClick={clearSelection}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded transition cursor-pointer"
                  >
                    Desmarcar Seleção ({selectedDates.length} dias)
                  </button>
                )}
              </div>

              {/* Selection buttons grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  onClick={selectCurrentMonth}
                  className="px-2.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-accent tracking-wider uppercase rounded-md transition text-center font-bold"
                >
                  Mês Atual ({daysInMonth}d)
                </button>
                <button 
                  onClick={() => selectNextNMonths(3)}
                  className="px-2.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-accent tracking-wider uppercase rounded-md transition text-center font-bold"
                >
                  Próximos 3 Meses
                </button>
                <button 
                  onClick={() => selectNextNMonths(6)}
                  className="px-2.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-accent tracking-wider uppercase rounded-md transition text-center font-bold"
                >
                  Próximos 6 Meses
                </button>
                <button 
                  onClick={selectFullYear}
                  className="px-2.5 py-2 bg-[#E8711A]/20 hover:bg-[#E8711A]/30 text-[#E8711A] border border-[#E8711A]/40 text-xs font-accent tracking-wider uppercase rounded-md transition text-center font-extrabold shadow-sm"
                >
                  🌟 Ano Todo (12 Meses)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  onClick={selectWeekendsCurrentMonth}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] rounded-md transition text-center"
                >
                  Fins de Semana (Mês)
                </button>
                <button 
                  onClick={selectWeekendsFullYear}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[#E8711A] text-[11px] font-semibold rounded-md transition text-center"
                >
                  Fins de Semana (Ano Todo)
                </button>
                <button 
                  onClick={selectWeekdaysCurrentMonth}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] rounded-md transition text-center"
                >
                  Dias de Semana (Mês)
                </button>
                <button 
                  onClick={() => {
                    setClearScope('all_room');
                    setShowClearModal(true);
                  }}
                  className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-bold rounded-md transition text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Zerar Tudo
                </button>
              </div>
            </div>
          </div>

          {/* EDIT PANEL */}
          <div className="bg-[#0D1B2A]/40 border border-[#E8711A]/30 p-6 rounded-lg self-start sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-[#E8711A] flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Aplicar Tarifas
              </h4>
              {selectedDates.length > 0 && (
                <span className="bg-[#E8711A] text-white px-2 py-0.5 rounded text-[11px] font-extrabold shadow">
                  {selectedDates.length} dia(s) selecionados
                </span>
              )}
            </div>
            
            {selectedDates.length === 0 ? (
              <div className="text-center py-8 opacity-75 space-y-3">
                <CalendarDays className="w-10 h-10 mx-auto mb-2 text-[#E8711A]" />
                <p className="text-xs text-zinc-200 font-sans font-medium">
                  Selecione datas no calendário ou clique em <strong>"Mês Atual"</strong> ou <strong>"Ano Todo (12 Meses)"</strong> para aplicar valores em lote.
                </p>
                <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={selectFullYear}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-accent tracking-wider uppercase rounded-md transition cursor-pointer"
                  >
                    Selecionar Ano Inteiro (12 Meses)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setClearScope('all_room');
                      setShowClearModal(true);
                    }}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Zerar Todo o Tarifário
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#E8711A]/10 border border-[#E8711A]/20 text-[#E8711A] p-2.5 rounded-md text-xs font-medium">
                  Configurando <strong>{selectedDates.length} data(s)</strong> no total
                </div>

                <div className="space-y-1.5">
                  <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Disponibilidade dos Dias Selecionados</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "open" | "closed")}
                    className="w-full bg-[#0D1B2A] border border-white/10 p-2.5 text-xs text-white rounded outline-none focus:border-[#E8711A]"
                  >
                    <option value="open">🟢 Aberto para Reserva (Disponível)</option>
                    <option value="closed">🔴 Fechado / Bloqueado</option>
                  </select>
                </div>

                {status === "open" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">
                        {'sellRate' in selectedItem || selectedRoom ? 'Valor da Diária (R$)' : 'Preço Adulto (R$)'}
                      </label>
                      <input
                        type="number"
                        placeholder={`Padrão: R$ ${basePrice}`}
                        value={adultPrice}
                        onChange={(e) => setAdultPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-[#0D1B2A] border border-white/10 p-2.5 text-xs text-white rounded outline-none focus:border-[#E8711A] font-mono"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">
                        {'sellRate' in selectedItem || selectedRoom ? 'Taxa Extra p/ Criança (R$)' : 'Preço Criança (R$)'}
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={childPrice}
                        onChange={(e) => setChildPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-[#0D1B2A] border border-white/10 p-2.5 text-xs text-white rounded outline-none focus:border-[#E8711A] font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">
                        {'sellRate' in selectedItem || selectedRoom ? 'Taxa Extra p/ Bebê (R$)' : 'Preço Bebê (R$)'}
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={babyPrice}
                        onChange={(e) => setBabyPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-[#0D1B2A] border border-white/10 p-2.5 text-xs text-white rounded outline-none focus:border-[#E8711A] font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={handleApplyToSelection}
                    className="w-full py-3 bg-[#E8711A] hover:bg-[#C45E12] text-white text-xs font-accent tracking-widest uppercase font-bold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Salvar {selectedDates.length} Dia(s)
                  </button>

                  <button 
                    onClick={handleRemoveCustomizationFromSelection}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-accent tracking-wider uppercase font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Restaurar Padrão dos Selecionados
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setClearScope('all_room');
                      setShowClearModal(true);
                    }}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Zerar Tudo (Todos os Meses)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* CLEAR TARIFF CONFIRMATION MODAL WITH ALL SCOPE CHOICES */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121214] border border-red-500/40 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                <Trash2 className="w-5 h-5" />
                Zerar Tarifário / Limpar Tudo
              </div>
              <button 
                onClick={() => setShowClearModal(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-zinc-300 space-y-3">
              <p>
                Escolha exatamente o que deseja zerar para:
                <br />
                <strong className="text-white text-base">
                  {selectedRoom ? `${selectedItem?.name} — ${selectedRoom.name}` : selectedItem?.name}
                </strong>
              </p>

              <div className="space-y-2.5 pt-2">
                
                {/* 1. Zerar Todo o Ano (Deste Quarto/Item) */}
                <label 
                  onClick={() => setClearScope('all_room')}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${
                    clearScope === 'all_room' 
                      ? 'bg-red-500/15 border-red-500/50 text-white shadow' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="clearScope" 
                    checked={clearScope === 'all_room'} 
                    onChange={() => setClearScope('all_room')}
                    className="mt-1 text-red-500 focus:ring-red-500"
                  />
                  <div>
                    <div className="font-bold text-xs text-red-400 flex items-center gap-1.5">
                      <span>🗑️ Zerar TODO o ano (Todos os 12 meses)</span>
                      <span className="bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded text-[10px]">Recomendado</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-0.5">
                      Apaga todas as tarifas e bloqueios de todos os meses do ano deste {selectedRoom ? 'quarto' : 'item'}, retornando 100% dos dias para o valor base padrão (R$ {basePrice}).
                    </div>
                  </div>
                </label>

                {/* 2. Zerar apenas o mês atual */}
                <label 
                  onClick={() => setClearScope('month')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    clearScope === 'month' 
                      ? 'bg-red-500/15 border-red-500/50 text-white' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="clearScope" 
                    checked={clearScope === 'month'} 
                    onChange={() => setClearScope('month')}
                    className="mt-1 text-red-500 focus:ring-red-500"
                  />
                  <div>
                    <div className="font-bold text-xs text-white">
                      Limpar apenas este mês ({currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Remove apenas as {totalCustomDatesInMonth} tarifas personalizadas deste mês específico. Os demais meses do ano permanecem intocados.
                    </div>
                  </div>
                </label>

                {/* 3. Se for hospedagem com múltiplos quartos: Zerar TODOS OS QUARTOS */}
                {selectedItem && 'roomTypes' in selectedItem && selectedItem.roomTypes && selectedItem.roomTypes.length > 1 && (
                  <label 
                    onClick={() => setClearScope('all_accommodation')}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${
                      clearScope === 'all_accommodation' 
                        ? 'bg-red-500/20 border-red-500 text-white shadow-lg ring-1 ring-red-500' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="clearScope" 
                      checked={clearScope === 'all_accommodation'} 
                      onChange={() => setClearScope('all_accommodation')}
                      className="mt-1 text-red-500 focus:ring-red-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-amber-300">
                        ⚡ Zerar TODOS OS QUARTOS desta Pousada ({selectedItem.name})
                      </div>
                      <div className="text-[11px] text-zinc-300 mt-0.5">
                        Zera de uma só vez o calendário do ano inteiro de todas as {selectedItem.roomTypes.length} categorias de quartos desta hospedagem.
                      </div>
                    </div>
                  </label>
                )}

                {/* 4. Zerar tudo incluindo períodos sazonais */}
                <label 
                  onClick={() => setClearScope('all_and_periods')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    clearScope === 'all_and_periods' 
                      ? 'bg-red-500/15 border-red-500/50 text-white' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="clearScope" 
                    checked={clearScope === 'all_and_periods'} 
                    onChange={() => setClearScope('all_and_periods')}
                    className="mt-1 text-red-500 focus:ring-red-500"
                  />
                  <div>
                    <div className="font-bold text-xs text-white">
                      Zerar Tarifário + Períodos Sazonais
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Apaga as personalizações do calendário e também exclui os períodos de alta/baixa temporada cadastrados no quarto.
                    </div>
                  </div>
                </label>

              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleExecuteClearTariff(clearScope)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Confirmar e Zerar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
