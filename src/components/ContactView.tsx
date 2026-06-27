/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MessageSquare, Phone, Mail, MapPin, Send, CheckCircle2, Navigation } from "lucide-react";
import { Lead } from "../types";
import { motion } from "motion/react";

interface ContactViewProps {
  onAddLead: (leadData: Omit<Lead, "id" | "origin" | "status" | "createdAt" | "updatedAt">) => void;
  whatsappNumber: string;
  onWhatsAppContact?: (message?: string) => void;
}

export default function ContactView({ onAddLead, whatsappNumber, onWhatsAppContact }: ContactViewProps) {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [groupSize, setGroupSize] = useState(2);
  const [interest, setInterest] = useState("passeio-barco-premium");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddLead({
      name,
      email,
      phone,
      preferredDate,
      groupSize,
      experienceInterest: [interest],
      notes: message ? [message] : []
    });

    setSubmitted(true);
    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setPreferredDate("");
    setGroupSize(2);
    setMessage("");
  };

  return (
    <div id="contact-view" className="pt-28 pb-24 bg-[#FBF9F6] min-h-screen text-[#0D1B2A] selection:bg-[#E8711A] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase">
            Canal de Atendimento
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Pronto para desenhar sua próxima história?
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto">
            Fale diretamente com nossa equipe de curadores locais ou envie um boletim estruturado de interesse abaixo para receber um orçamento detalhado no e-mail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LADO ESQUERDO: CONTATOS & MAPA (5 colunas) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            {/* Box Contato Direto */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">Conexão Instantânea</h3>
              <p className="font-sans text-xs text-zinc-500">Atendimento exclusivo com concierge humano em horários estendidos.</p>

              <div className="space-y-4 font-sans text-xs">
                
                {/* Whatsapp CTA */}
                <button 
                  onClick={() => onWhatsAppContact?.("Olá! Gostaria de falar com um concierge.")}
                  className="w-full flex items-center gap-4 p-4 bg-[#E8711A]/5 hover:bg-[#E8711A] hover:text-white text-[#0D1B2A] rounded-xl border border-[#E8711A]/20 transition-all cursor-pointer group text-left"
                >
                  <MessageSquare className="w-5 h-5 text-[#E8711A] group-hover:text-white shrink-0" />
                  <div>
                    <h4 className="font-accent font-bold tracking-wider text-[10px] uppercase">Falar no WhatsApp</h4>
                    <span className="text-xs font-sans text-zinc-500 group-hover:text-white/90">Mandar mensagem agora (Resposta imediata)</span>
                  </div>
                </button>

                {/* Email Direct */}
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-150">
                  <Mail className="w-5 h-5 text-[#E8711A] shrink-0" />
                  <div>
                    <h4 className="font-accent font-bold tracking-wider text-[10px] uppercase text-[#0D1B2A]">Enviar E-mail</h4>
                    <span className="text-zinc-500 font-medium">concierge@guidatrips.com.br</span>
                  </div>
                </div>

                {/* Sede */}
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-150">
                  <MapPin className="w-5 h-5 text-[#E8711A] shrink-0" />
                  <div>
                    <h4 className="font-accent font-bold tracking-wider text-[10px] uppercase text-[#0D1B2A]">Sede de Embarque</h4>
                    <span className="text-zinc-500 font-medium">Praia dos Anjos, Arraial do Cabo - RJ</span>
                  </div>
                </div>

              </div>
            </div>

            {/* MAP EMBED STYLE (Handcrafted Map Mockup) */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-[#0D1B2A]">Nosso Porto de Saída</h4>
                <div className="flex items-center gap-1 font-accent text-[9px] text-[#E8711A] uppercase tracking-wider">
                  <Navigation className="w-3 h-3" /> GPS ATIVO
                </div>
              </div>

              {/* Representação visual do mapa */}
              <div className="h-44 bg-[#0D1B2A] relative rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                
                {/* Linhas cartográficas fictícias para estética premium editorial */}
                <div className="absolute inset-0 border border-white/[0.02] bg-[radial-gradient(#e8711a_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sky-900/30"></div> {/* oceano */}
                <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-neutral-800/40"></div> {/* rua */}

                {/* Pin flutuante */}
                <div className="relative z-10 flex flex-col items-center justify-center animate-pulse">
                  <div className="bg-[#E8711A] text-[#0D1B2A] h-10 w-10 rounded-full flex items-center justify-center font-accent font-bold shadow-lg text-lg">
                    ⚓
                  </div>
                  <span className="bg-black/80 text-[#F4EFE6] font-accent text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border border-white/10 mt-1">
                    Cabo dos Anjos
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 font-accent text-[8px] text-[#8A96A3] tracking-widest">
                  -22.9715 &deg; S / -42.0224 &deg; W
                </div>
              </div>
            </div>

          </div>

          {/* LADO DIREITO: FORMULÁRIO DE CAPTAÇÃO DE LEADS (7 colunas) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-8 text-left shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#0D1B2A] mb-2">Descreva Sua Preferência</h3>
            <p className="font-sans text-xs text-zinc-500 mb-8">Monte um roteiro personalizado, nosso concierge retornará em menos de 1 hora.</p>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#E8711A]/5 border border-[#E8711A]/20 p-8 rounded-xl text-center py-12 space-y-4"
              >
                <div className="flex justify-center">
                  <CheckCircle2 className="w-12 h-12 text-[#E8711A]" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#0D1B2A]">Boletim de Interesse Recebido!</h4>
                <p className="font-sans text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
                  Perfeito. Registramos o seu interesse em nossa base e enviamos o alerta ao comissariado da Guida Trips. Um de nossos curadores entrará em contato via telefone/WhatsApp muito brevemente.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-transparent border border-[#E8711A] text-[#E8711A] hover:bg-[#E8711A] hover:text-white font-accent text-xs font-bold uppercase tracking-wider rounded-lg transition-colors mt-4 cursor-pointer"
                >
                  Enviar Novo Formulário
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#0D1B2A] tracking-widest uppercase font-bold">Seu Nome *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#0D1B2A] tracking-widest uppercase font-bold">E-mail para Orçamento *</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: joao@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#0D1B2A] tracking-widest uppercase font-bold">WhatsApp com DDD *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (21) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#0D1B2A] tracking-widest uppercase font-bold">Previsão da Viagem</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#0D1B2A] tracking-widest uppercase font-bold">Experiência Desejada</label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="passeio-barco-premium">🚤 Passeio de Barco Premium</option>
                      <option value="buggy-massambaba">🚙 Expedição Buggy Off-Road</option>
                      <option value="temporada-baleias-avistamento">🐋 Safári Ambiental (Jubartes)</option>
                      <option value="batismo-mergulho-autonomo">🤿 Batismo de Mergulho</option>
                      <option value="sunset-pontal-cultural">✨ Sunset no Pontal com Espumante</option>
                      <option value="gourmet-praia-dos-anjos">🍴 Jantar à Luz de Velas</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-accent text-[9px] text-[#0D1B2A] tracking-widest uppercase font-bold">Acompanhantes</label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={groupSize}
                      onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-accent text-[9px] text-[#0D1B2A] tracking-widest uppercase font-bold">Restrições Alimentares ou Observações</label>
                  <textarea
                    rows={4}
                    placeholder="Nos diga o perfil do group, alergias alimentares ou pedidos especiais."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-[#E8711A] hover:bg-[#C45E12] text-white font-accent text-xs font-bold tracking-widest uppercase rounded-xl duration-200 cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Enviar Boletim de Interesse
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
