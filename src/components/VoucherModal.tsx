import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, QrCode, MapPin, Calendar, Clock, CheckCircle2, 
  ShieldCheck, AlertCircle, Phone, Navigation, Sun, Waves,
  Download, Share2, Compass, ArrowRight, Users
} from "lucide-react";
import { ClientReservation, Experience } from "../types";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ClientReservation | null;
  experience?: Experience | null;
  onOpenDashboard?: () => void;
  onOpenCommunity?: () => void;
}

export default function VoucherModal({
  isOpen,
  onClose,
  reservation,
  experience,
  onOpenDashboard,
  onOpenCommunity
}: VoucherModalProps) {
  if (!isOpen || !reservation) return null;

  const totalPax = reservation.pax || ((reservation.adults || 1) + (reservation.children || 0));
  const meetingPointText = reservation.meetingPoint || experience?.meetingPoint || "Cais de Embarque Principal, Arraial do Cabo - RJ";
  const voucherCode = reservation.voucherCode || `GTR-${reservation.id.slice(-6).toUpperCase()}`;
  const qrCodeUrl = reservation.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(voucherCode)}`;

  const totalAmount = reservation.totalAmount || (experience ? experience.priceFrom * totalPax : 0);
  const depositAmount = reservation.depositAmount || Math.round(totalAmount * 0.3);
  const remainingBalance = reservation.remainingBalance ?? (totalAmount - depositAmount);

  // Simulated live marine/weather forecast for destination
  const marineForecast = {
    temp: "26°C",
    condition: "Ensolarado com poucas nuvens",
    wind: "12 kts SO",
    waterTemp: "21°C",
    waves: "0.8m",
    visibility: "Excelente (15m)"
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Voucher Guida Trips - ${experience?.name || "Passeio"}`,
        text: `Confira meu Voucher Confirmado da Guida Trips para ${experience?.name || "passeio"} no dia ${reservation.date}! Código: ${voucherCode}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Voucher Guida Trips (${voucherCode}): ${experience?.name || "Passeio"} - Data: ${reservation.date}`);
      alert("Link e informações do voucher copiados para a área de transferência!");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#0D1B2A]/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 my-8"
        >
          {/* Top Brand Banner */}
          <div className="bg-[#0D1B2A] text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8711A] opacity-20 blur-[90px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10 mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-accent text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" /> Voucher Inteligente Oficial
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {experience?.name || "Voucher de Reserva"}
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-medium text-zinc-300 relative z-10">
              <div>
                <span className="text-[10px] font-accent text-zinc-400 uppercase tracking-wider block">Código do Voucher</span>
                <span className="font-mono text-sm font-bold text-emerald-400">{voucherCode}</span>
              </div>
              <div>
                <span className="text-[10px] font-accent text-zinc-400 uppercase tracking-wider block">Status da Reserva</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confirmada & Garantida
                </span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* QR Code & Key Info Grid */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm text-center shrink-0">
                <img src={qrCodeUrl} alt="QR Code Voucher" className="w-32 h-32 mx-auto" />
                <span className="text-[9px] font-accent font-bold text-zinc-400 uppercase tracking-widest mt-1 block">
                  Apresente no Embarque
                </span>
              </div>

              <div className="flex-1 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-zinc-200">
                    <span className="text-[10px] font-accent text-zinc-400 uppercase font-bold block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#E8711A]" /> Data
                    </span>
                    <span className="font-bold text-[#0D1B2A]">{reservation.date}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-zinc-200">
                    <span className="text-[10px] font-accent text-zinc-400 uppercase font-bold block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E8711A]" /> Horário de Saída
                    </span>
                    <span className="font-bold text-[#0D1B2A]">{reservation.time || "08:00"}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-zinc-200">
                  <span className="text-[10px] font-accent text-zinc-400 uppercase font-bold block flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-[#E8711A]" /> Passageiros ({totalPax})
                  </span>
                  <span className="font-medium text-[#0D1B2A] text-xs">
                    {reservation.adults || totalPax} Adulto(s) {reservation.children ? `, ${reservation.children} Criança(s)` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial & Deposit Breakdown */}
            <div className="bg-[#0D1B2A]/5 border border-[#0D1B2A]/10 rounded-2xl p-5 space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#0D1B2A] flex items-center gap-2">
                Resumo Financeiro & Pagamento Parcial
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-zinc-200">
                  <span className="text-[9px] font-accent text-zinc-400 uppercase font-bold block">Valor Total</span>
                  <span className="font-bold text-[#0D1B2A]">R$ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="text-[9px] font-accent text-emerald-800 uppercase font-bold block">Sinal Pago Online</span>
                  <span className="font-extrabold text-emerald-700">R$ {depositAmount.toFixed(2)}</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <span className="text-[9px] font-accent text-amber-800 uppercase font-bold block">Saldo no Embarque</span>
                  <span className="font-extrabold text-amber-700">R$ {remainingBalance.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 text-center font-medium">
                * O saldo restante (R$ {remainingBalance.toFixed(2)}) deverá ser quitado no local de embarque via Dinheiro ou PIX.
              </p>
            </div>

            {/* Ponto de Encontro & Location */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-[#0D1B2A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E8711A]" /> Ponto de Encontro e Check-in
                </h4>
                {reservation.googleMapsUrl && (
                  <a 
                    href={reservation.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-accent font-bold text-[#E8711A] hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Navigation className="w-3 h-3" /> Abrir no Maps
                  </a>
                )}
              </div>
              <p className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200 font-medium">
                {meetingPointText}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> Recomendamos chegar com 30 minutos de antecedência para o check-in e tolerância de embarque.
              </p>
            </div>

            {/* Live Weather & Marine Forecast Widget */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-[#0D1B2A] flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" /> Previsão do Tempo & Náutica
                </h4>
                <span className="text-[9px] font-accent font-bold text-sky-700 bg-sky-200/60 px-2 py-0.5 rounded-full uppercase">
                  Boletim em Tempo Real
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl">
                  <span className="text-[9px] text-zinc-400 block font-bold">Temperatura</span>
                  <span className="font-bold text-[#0D1B2A]">{marineForecast.temp}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl">
                  <span className="text-[9px] text-zinc-400 block font-bold">Vento</span>
                  <span className="font-bold text-[#0D1B2A]">{marineForecast.wind}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl">
                  <span className="text-[9px] text-zinc-400 block font-bold">Água</span>
                  <span className="font-bold text-[#0D1B2A]">{marineForecast.waterTemp}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl col-span-3 sm:col-span-1">
                  <span className="text-[9px] text-zinc-400 block font-bold">Visibilidade</span>
                  <span className="font-bold text-[#0D1B2A]">{marineForecast.visibility}</span>
                </div>
              </div>
            </div>

            {/* What to bring / Rules */}
            {reservation.bringItems && reservation.bringItems.length > 0 && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-accent font-bold text-zinc-500 uppercase tracking-widest block">
                  O que levar para a experiência:
                </span>
                <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
                  {reservation.bringItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8711A]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer CTAs */}
          <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={handleShare}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-accent text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Compartilhar Voucher
            </button>

            {onOpenDashboard && (
              <button 
                onClick={() => { onClose(); onOpenDashboard(); }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-[#0D1B2A] hover:bg-[#E8711A] text-white hover:text-[#0D1B2A] font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Compass className="w-4 h-4" /> Meu Dashboard da Viagem
              </button>
            )}

            {onOpenCommunity && (
              <button 
                onClick={() => { onClose(); onOpenCommunity(); }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-accent text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4" /> Comunidade de Viajantes
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
