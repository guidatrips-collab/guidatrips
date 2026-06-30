import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, ShieldCheck, Ticket, Calendar, Compass } from "lucide-react";

interface ConfirmacaoRoteiroViewProps {
  onNavigate: (view: string) => void;
  clientName?: string;
  totalEstimate?: number;
  itemsCount?: number;
}

export default function ConfirmacaoRoteiroView({
  onNavigate,
  clientName = "Explorador",
  totalEstimate = 0,
  itemsCount = 0
}: ConfirmacaoRoteiroViewProps) {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 3 seconds auto-redirect countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNavigate("cliente");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onNavigate]);

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#FBF9F6]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full space-y-8 text-center"
      >
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 shadow-md space-y-8 relative overflow-hidden">
          {/* Top orange brand highlight bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#E8711A]" />

          {/* Icon Area */}
          <div className="flex justify-center">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-emerald-500/10 rounded-full scale-125"
              />
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-full relative z-10 text-emerald-600">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-4.5xl font-black text-[#0D1B2A] leading-tight tracking-tight">
              🎉 Seu roteiro foi enviado com sucesso!
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 font-sans max-w-lg mx-auto leading-relaxed">
              Estamos preparando seu atendimento e liberando seu acesso ao painel.
            </p>
          </div>

          {/* Loading Animation Area */}
          <div className="space-y-4 py-2 max-w-md mx-auto">
            <div className="flex justify-between items-center text-xs text-zinc-400 font-bold uppercase tracking-wider">
              <span>Carregando Painel</span>
              <span className="font-mono">{countdown > 0 ? `Redirecionando em ${countdown}s...` : "Redirecionando..."}</span>
            </div>
            
            {/* Elegant glowing progress bar */}
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-gradient-to-r from-[#E8711A] to-[#C45E12] rounded-full"
              />
            </div>
          </div>

          {/* Main Action Button */}
          <div className="pt-2 max-w-md mx-auto space-y-3">
            <button
              onClick={() => onNavigate("cliente")}
              className="w-full py-4 bg-[#E8711A] hover:bg-[#0D1B2A] text-[#0D1B2A] hover:text-white font-accent text-sm font-black tracking-widest uppercase rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <span>Acessar meu painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-zinc-400">
              Clique no botão caso o redirecionamento automático não aconteça.
            </p>
          </div>

          {/* Explanatory Message Box */}
          <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-zinc-150 text-left space-y-4 max-w-md mx-auto">
            <div className="flex gap-2.5 items-start">
              <Compass className="w-5 h-5 text-[#E8711A] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0D1B2A] uppercase tracking-wider">O que esperar no painel?</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  No painel, você poderá ver seu roteiro, acompanhar suas informações e acessar tudo o que foi preparado para sua viagem.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Recap snippet */}
          {itemsCount > 0 && (
            <div className="pt-4 border-t border-zinc-100 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-zinc-400" />
                {itemsCount} {itemsCount === 1 ? "passeio selecionado" : "passeios selecionados"}
              </span>
              {totalEstimate > 0 && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Valor estimado: <strong className="text-zinc-800">{formatBRL(totalEstimate)}</strong>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Back to Home safety button */}
        <button
          onClick={() => onNavigate("home")}
          className="text-xs font-bold text-zinc-450 hover:text-[#0D1B2A] transition-colors underline cursor-pointer"
        >
          Voltar para a página inicial
        </button>
      </motion.div>
    </div>
  );
}
