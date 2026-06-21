/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Instagram, Youtube, Phone, Mail, MapPin} from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
  whatsappNumber: string;
}

export default function Footer({ onNavigate, whatsappNumber }: FooterProps) {
  return (
    <footer id="main-footer" className="bg-[#0A131C] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Coluna 1: Logo & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col select-none">
              <div className="flex items-baseline mb-0.5">
                <span className="font-serif text-2xl font-extrabold text-[#F4EFE6] tracking-tight">
                  GUID<span className="relative text-[#F4EFE6]">A<span className="absolute bottom-0 left-0 w-4 h-[3px] bg-[#E8711A] rounded-full transform rotate-[-12deg] translate-y-[2px]"></span></span>
                </span>
                <span className="font-accent text-[#E8711A] text-xs font-bold tracking-[0.2em] ml-1.5 uppercase">
                  &mdash; TRIPS &mdash;
                </span>
              </div>
              <span className="font-sans text-[7px] text-[#F4EFE6]/70 uppercase tracking-[0.25em] -mt-1 font-semibold">
                Experiências que conectam
              </span>
            </div>
            <p className="font-sans text-xs text-[#8A96A3] leading-relaxed max-w-sm">
              Não vendemos pacotes nem replicamos passeios de massa. Desenhamos roteiros e aventuras personalizadas sob medida para conectar de verdade você com a natureza e as histórias de Arraial do Cabo.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://instagram.com/guidatrips"
                target="_blank"
                referrerPolicy="no-referrer"
                className="p-2 bg-white/5 rounded-full text-[#8A96A3] hover:text-[#E8711A] hover:bg-white/10 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@guidatrips"
                target="_blank"
                referrerPolicy="no-referrer"
                className="p-2 bg-white/5 rounded-full text-[#8A96A3] hover:text-[#E8711A] hover:bg-white/10 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-4">
            <h4 className="font-accent text-xs font-bold text-[#F4EFE6] tracking-widest uppercase">
              Roteiros Rápidos
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="text-[#8A96A3] hover:text-[#E8711A] transition-colors"
                >
                  Início / Narrativa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("experiencias")}
                  className="text-[#8A96A3] hover:text-[#E8711A] transition-colors"
                >
                  Ver Experiências
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("destino")}
                  className="text-[#8A96A3] hover:text-[#E8711A] transition-colors"
                >
                  O Destino (Guia Arraial)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("sobre")}
                  className="text-[#8A96A3] hover:text-[#E8711A] transition-colors"
                >
                  Nosso Manifesto
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("blog")}
                  className="text-[#8A96A3] hover:text-[#E8711A] transition-colors"
                >
                  Revista de Viagem (Blog)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contato")}
                  className="text-[#8A96A3] hover:text-[#E8711A] transition-colors"
                >
                  Contactar Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Sede & Contato */}
          <div className="space-y-4">
            <h4 className="font-accent text-xs font-bold text-[#F4EFE6] tracking-widest uppercase">
              Contato & Sede
            </h4>
            <ul className="space-y-3 font-sans text-xs text-[#8A96A3]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8711A] shrink-0" />
                <span>Arraial do Cabo, RJ, Brasil</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E8711A] shrink-0" />
                <span>+55 (22) 99887-7666</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E8711A] shrink-0" />
                <span>concierge@guidatrips.com.br</span>
              </li>
              <li className="pt-2 font-accent text-[10px] text-[#E8711A] tracking-wider uppercase">
                Atendimento 24h em trânsito
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Final */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] text-[#8A96A3] text-center sm:text-left">
            &copy; 2026 Guida Trips. Todos os direitos reservados. Desenhado para Conectar Sentidos.
          </p>
          <div className="flex space-x-6 font-sans text-[10px] text-[#8A96A3]">
            <a href="#" className="hover:text-[#E8711A]">Políticas de Privacidade</a>
            <a href="#" className="hover:text-[#E8711A]">Termos de Curadoria</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
