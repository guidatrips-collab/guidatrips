import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Loader2 } from 'lucide-react';
import { Lead } from '../types';
import { firestoreService } from '../firebase';
import { analytics } from '../lib/analytics';
import { v4 as uuidv4 } from 'uuid';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  defaultMessage: string;
  onLeadCaptured?: (lead: Lead) => void;
}

export function LeadCaptureModal({ 
  isOpen, 
  onClose, 
  whatsappNumber, 
  defaultMessage,
  onLeadCaptured 
}: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    
    try {
      const attribution = analytics.getAttributionData();
      
      const newLead: Lead = {
        id: uuidv4(),
        name,
        phone,
        status: "novo",
        origin: attribution.origin || "whatsapp",
        attribution: attribution.attribution,
        metadata: {
          ...attribution.metadata,
          channel: "WhatsApp",
          conversionPage: window.location.pathname
        },
        tags: ["WhatsApp", attribution.origin === "google" ? "Google" : "Direto"],
        history: [{
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          type: "system_log",
          description: "Lead criado via botão WhatsApp do site"
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await firestoreService.add("leads", newLead);
      await analytics.trackEvent("conversion", "whatsapp_conversion", { name, phone });

      if (onLeadCaptured) onLeadCaptured(newLead);

      // Format WhatsApp link
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(defaultMessage);
      const waLink = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
      
      // Open WhatsApp
      window.open(waLink, '_blank');
      
      onClose();
      setName('');
      setPhone('');
    } catch (err) {
      console.error("Error capturing lead:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-zinc-100 font-semibold text-lg">Quase lá!</h3>
                  <p className="text-zinc-400 text-sm">Fale agora com um especialista</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Qual seu nome?</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Seu WhatsApp</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-600/10"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Iniciar Conversa
                  </>
                )}
              </button>

              <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-2">
                Sua conexão é segura e privada
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
