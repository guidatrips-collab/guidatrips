import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react';
import { Experience, Accommodation, getBrazilLocalDate } from '../types';

type PricingItem = Experience | Accommodation;

interface CalendarPricingViewProps {
  items: PricingItem[];
  onUpdateItem: (updatedItem: PricingItem) => void;
  title?: string;
  itemTypeLabel?: string;
}

export function CalendarPricingView({ items, onUpdateItem, title = "Tarifário e Disponibilidade", itemTypeLabel = "experiência" }: CalendarPricingViewProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  
  const selectedItem = useMemo(() => {
    return items.find(e => e.id === selectedItemId) || null;
  }, [items, selectedItemId]);

  const selectedRoom = useMemo(() => {
    if (selectedItem && 'roomTypes' in selectedItem && selectedItem.roomTypes) {
      return selectedItem.roomTypes.find(r => r.id === selectedRoomId) || null;
    }
    return null;
  }, [selectedItem, selectedRoomId]);

  const activeCalendarSource = selectedRoom || selectedItem;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
  // Pricing Form State
  const [isEditing, setIsEditing] = useState(false);
  const [adultPrice, setAdultPrice] = useState<number | "">("");
  const [childPrice, setChildPrice] = useState<number | "">("");
  const [babyPrice, setBabyPrice] = useState<number | "">("");
  const [status, setStatus] = useState<"open" | "closed">("open");

  // Format date to YYYY-MM-DD for storage
  const formatDate = (date: Date) => {
    return getBrazilLocalDate(date);
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

  const toggleDateSelection = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const selectAllMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const newSelection: string[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      newSelection.push(formatDate(new Date(year, month, i)));
    }
    
    // Merge without duplicates
    const merged = Array.from(new Set([...selectedDates, ...newSelection]));
    setSelectedDates(merged);
  };

  const clearSelection = () => {
    setSelectedDates([]);
  };

  const handleApplyToSelection = () => {
    if (!selectedItem || selectedDates.length === 0) return;
    
    // Ensure the calendar object exists
    const currentCalendar = activeCalendarSource?.calendar || {};
    
    const newCalendar = { ...currentCalendar };
    
    selectedDates.forEach(date => {
      const basePrice = 'priceFrom' in selectedItem ? selectedItem.priceFrom : ('sellRate' in selectedItem ? selectedItem.sellRate : 0);
      newCalendar[date] = {
        status: status,
        adultPrice: Number(adultPrice) || (selectedItem.pricing?.adultPrice ?? basePrice),
        childPrice: Number(childPrice) || (selectedItem.pricing?.childPrice ?? 0),
        babyPrice: Number(babyPrice) || (selectedItem.pricing?.babyPrice ?? 0),
      };
    });

    onUpdateItem({
      ...selectedItem,
      calendar: newCalendar
    } as any);
    
    clearSelection();
    setIsEditing(false);
  };

  // Generate calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* HEADER / SELECT ITEM */}
      <div className="bg-[#0D1B2A]/40 border border-white/5 p-6 rounded-lg space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#F4EFE6] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#E8711A]" /> {title}
        </h3>
        <p className="font-sans text-xs text-zinc-400">Selecione uma {itemTypeLabel} para gerenciar preços específicos por data e abrir/fechar o calendário.</p>
        
        <select 
          value={selectedItemId}
          onChange={(e) => {
            setSelectedItemId(e.target.value);
            setSelectedRoomId("");
            clearSelection();
          }}
          className="w-full md:w-1/2 bg-[#0D1B2A] border border-white/10 p-3 text-sm text-white rounded-md outline-none focus:border-[#E8711A]"
        >
          <option value="">-- Escolha --</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        {selectedItem && itemTypeLabel === 'hospedagem' && (
          <select
            value={selectedRoomId}
            onChange={(e) => {
              setSelectedRoomId(e.target.value);
              clearSelection();
            }}
            className="w-full md:w-1/2 mt-2 md:mt-0 md:ml-2 bg-[#0D1B2A] border border-white/10 p-3 text-sm text-white rounded-md outline-none focus:border-[#E8711A]"
          >
            <option value="">-- Selecione um Quarto --</option>
            {selectedItem && 'roomTypes' in selectedItem && selectedItem.roomTypes && selectedItem.roomTypes.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        )}
      </div>

      {selectedItem && itemTypeLabel === 'hospedagem' && (!('roomTypes' in selectedItem) || !selectedItem.roomTypes || selectedItem.roomTypes.length === 0) && (
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-sm">
          Esta hospedagem não possui quartos cadastrados. Para configurar o calendário, primeiro cadastre os quartos na edição da hospedagem.
        </div>
      )}

      {selectedItem && itemTypeLabel === 'hospedagem' && 'roomTypes' in selectedItem && selectedItem.roomTypes && selectedItem.roomTypes.length > 0 && !selectedRoomId && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-400 text-sm">
          Selecione um quarto no menu acima para configurar o tarifário e disponibilidade.
        </div>
      )}

      {selectedItem && (itemTypeLabel !== 'hospedagem' || (itemTypeLabel === 'hospedagem' && selectedRoomId)) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CALENDAR */}
          <div className="lg:col-span-2 bg-[#0D1B2A]/40 border border-white/5 p-6 rounded-lg">
            
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth} className="p-2 bg-white/5 rounded-md hover:bg-white/10 transition"><ChevronLeft className="w-4 h-4" /></button>
              <h4 className="font-serif text-lg font-bold uppercase tracking-widest text-white">
                {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h4>
              <button onClick={nextMonth} className="p-2 bg-white/5 rounded-md hover:bg-white/10 transition"><ChevronRight className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-accent text-[10px] uppercase text-zinc-500 tracking-widest">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="h-20 bg-transparent rounded-md border border-transparent"></div>
              ))}
              
              {days.map(day => {
                const dateStr = formatDate(new Date(year, month, day));
                const isSelected = selectedDates.includes(dateStr);
                const dayData = activeCalendarSource?.calendar?.[dateStr];
                
                const isClosed = dayData?.status === 'closed';
                
                return (
                  <div 
                    key={day} 
                    onClick={() => toggleDateSelection(dateStr)}
                    className={`h-20 rounded-md border p-1 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected 
                        ? "bg-[#E8711A]/20 border-[#E8711A]" 
                        : "bg-[#0D1B2A] border-white/5 hover:border-white/20"
                    } ${isClosed ? "opacity-50 grayscale" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-bold ${isSelected ? "text-[#E8711A]" : "text-white"}`}>{day}</span>
                      {dayData && (
                        <div className={`w-2 h-2 rounded-full ${isClosed ? "bg-red-500" : "bg-green-500"}`}></div>
                      )}
                    </div>
                    
                    {dayData && !isClosed && (
                      <div className="text-[9px] font-sans text-right">
                        <div className="text-zinc-400">Ad: <span className="text-white">R${dayData.adultPrice}</span></div>
                        <div className="text-zinc-500 text-[8px]">Cr: R${dayData.childPrice}</div>
                      </div>
                    )}
                    {isClosed && (
                      <div className="text-[9px] font-sans text-center text-red-400 font-bold mt-2 uppercase">Bloqueado</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={selectAllMonth}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-accent tracking-widest uppercase rounded-md transition"
              >
                Selecionar Mês Todo
              </button>
              {selectedDates.length > 0 && (
                <button 
                  onClick={clearSelection}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-accent tracking-widest uppercase rounded-md transition"
                >
                  Limpar Seleção ({selectedDates.length})
                </button>
              )}
            </div>
          </div>

          {/* EDIT PANEL */}
          <div className="bg-[#0D1B2A]/40 border border-[#E8711A]/30 p-6 rounded-lg self-start sticky top-24">
            <h4 className="font-serif text-sm font-bold text-[#E8711A] mb-4">Editar Tarifas</h4>
            
            {selectedDates.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-zinc-400" />
                <p className="text-xs text-zinc-400 font-sans">Selecione uma ou mais datas no calendário para editar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#E8711A]/10 text-[#E8711A] p-3 rounded-md text-xs font-bold">
                  {selectedDates.length} dia(s) selecionado(s)
                </div>

                <div className="space-y-1.5">
                  <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">Status do Dia</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "open" | "closed")}
                    className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white rounded outline-none"
                  >
                    <option value="open">Aberto (Disponível)</option>
                    <option value="closed">Fechado (Bloqueado)</option>
                  </select>
                </div>

                {status === "open" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">
                        {'sellRate' in selectedItem ? 'Valor da Diária (R$)' : 'Preço Adulto (R$)'}
                      </label>
                      <input
                        type="number"
                        placeholder={(
                          (activeCalendarSource as any).pricing?.adultPrice || 
                          ('basePrice' in activeCalendarSource ? (activeCalendarSource as any).basePrice : 
                           ('priceFrom' in activeCalendarSource ? (activeCalendarSource as any).priceFrom : 
                            ('sellRate' in activeCalendarSource ? (activeCalendarSource as any).sellRate : 0)))
                        )?.toString()}
                        value={adultPrice}
                        onChange={(e) => setAdultPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white rounded outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">
                        {'sellRate' in selectedItem ? 'Taxa Extra p/ Criança (R$)' : 'Preço Criança (R$)'}
                      </label>
                      <input
                        type="number"
                        placeholder={(activeCalendarSource as any).pricing?.childPrice?.toString() || "0"}
                        value={childPrice}
                        onChange={(e) => setChildPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white rounded outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-accent text-[9px] text-[#ffefe6]/90 tracking-widest uppercase">
                        {'sellRate' in selectedItem ? 'Taxa Extra p/ Bebê (R$)' : 'Preço Bebê (R$)'}
                      </label>
                      <input
                        type="number"
                        placeholder={(activeCalendarSource as any).pricing?.babyPrice?.toString() || "0"}
                        value={babyPrice}
                        onChange={(e) => setBabyPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-[#0D1B2A] border border-white/10 p-2 text-xs text-white rounded outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-2 mt-4">
                  <button 
                    onClick={handleApplyToSelection}
                    className="w-full py-3 bg-[#E8711A] hover:bg-[#C45E12] text-white text-xs font-accent tracking-widest uppercase font-bold rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Aplicar aos Dias ({selectedDates.length})
                  </button>

                  <button 
                    onClick={() => {
                      if (!selectedItem) return;
                      const newCalendar = { ...activeCalendarSource?.calendar };
                      selectedDates.forEach(d => delete newCalendar[d]);
                      if (selectedRoom && 'roomTypes' in selectedItem) {
                        const updatedRooms = (selectedItem.roomTypes || []).map(r => 
                          r.id === selectedRoom.id ? { ...r, calendar: newCalendar } : r
                        );
                        onUpdateItem({ ...selectedItem, roomTypes: updatedRooms } as any);
                      } else {
                        onUpdateItem({ ...selectedItem, calendar: newCalendar } as any);
                      }
                      clearSelection();
                    }}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-accent tracking-widest uppercase font-bold rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover Customização
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
