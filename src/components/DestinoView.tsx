/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Info, Compass, HelpCircle, Heart, Star } from "lucide-react";
import { motion } from "motion/react";

interface DestinoViewProps {
  onNavigate: (view: string) => void;
}

export default function DestinoView({ onNavigate }: DestinoViewProps) {
  const places = [
    {
      id: "atalaia",
      name: "Pontal do Atalaia",
      category: "Encostas & Pôr do Sol",
      phrase: "A famosa escadaria de madeira que se descortina revela as areias incandescentes e um mar que se perde no horizonte azul. É o mirante definitivo de celebração do fim de tarde.",
      img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
      highlight: "Melhor momento: Cedo pela manhã ou ao entardecer"
    },
    {
      id: "farol",
      name: "Ilha do Farol",
      category: "Joia de Proteção Ambiental",
      phrase: "Protegida rigorosamente pela Marinha do Brasil, possui regras estritas de visitação. Suas águas puras e areia ultrafina branca a colocam entre as praias mais perfeitas do mundo.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      highlight: "Acesso controlado: Apenas por embarcações credenciadas"
    },
    {
      id: "azul",
      name: "Gruta Azul",
      category: "Formação Geológica Única",
      phrase: "Uma belíssima fenda milenar aberta nos paredões rochosos externos da península. Sob a luz dourada do sol d'água, as paredes pedregosas reluzem em incríveis tons de azul safira.",
      img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      highlight: "Observação náutica: Aproximação de barco segura"
    },
    {
      id: "prainhas",
      name: "Prainhas do Pontal",
      category: "Piscinas Naturais Calmas",
      phrase: "Com águas extremamente calmas, transparentes e abrigadas do vento leste, é perfeita para quem busca nadar livremente de máscara de mergulho para observar a fauna costeira e tartarugas gaivotas.",
      img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      highlight: "Dica: Ideal para famílias e banho sossegado"
    }
  ];

  const infoTips = [
    {
      title: "O Fenômeno da Ressurgência",
      desc: "Arraial do Cabo é famosa internacionalmente por possuir um fenômeno oceanográfico único no Brasil. Correntes de águas profundas e polares sobem à superfície bem em nossa península. Elas trazem nutrientes extraordinários que purificam as águas, gerando a incrível transparência azul-turquesa e uma biodiversidade marinha inigualável."
    },
    {
      title: "Preservação em Primeiro Lugar",
      desc: "Por ser uma Reserva Extrativista Marinha (RESEX), Arraial possui normas rígidas de conduta. Nós da Guida Trips operamos em absoluta sintonia com o ICMBio e a Marinha do Brasil. Não jogue lixo, evite alimentar os peixes selvagens e siga sempre as trilhas certificadas para manter esse paraíso intocado."
    },
    {
      title: "Previsibilidade do Vento",
      desc: "O vento leste é o motor da região, moldando a paisagem das dunas e limpando a atmosfera. Nossa equipe estuda diariamente o padrão dessas rajadas para adaptar o itinerário dos passeios. Se o vento do leste está forte no mar aberto, navegamos para as enseadas calmas do lado oeste, garantindo conforto e segurança integral."
    }
  ];

  return (
    <div id="destino-view" className="py-24 bg-[#FBF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase">
            📍 O Destino
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Arraial do Cabo: O Caribe Brasileiro
          </h1>
          <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
          <p className="font-sans text-xs sm:text-sm text-[#5C6874] leading-relaxed max-w-lg mx-auto">
            Uma península mágica repleta de fendas rochosas monumentais, dunas de areia fina, correntes transparentes e vida marinha exuberante que se conectam em harmonia.
          </p>
        </div>

        {/* ECO-FENOMENO HERO ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 bg-white border border-[#0D1B2A]/10 rounded shadow-[0_4px_25px_rgba(13,27,42,0.02)] p-6 sm:p-12">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#E8711A]" /> FENÔMENO ÚNICO DA RESSURGÊNCIA
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0D1B2A] leading-tight">
              O mistério científico por trás da transparência caribenha das nossas águas.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5C6874] leading-relaxed">
              Arraial do Cabo reside em um ponto geográfico muito particular na América do Sul. Correntes ricas em oxigênio e micro-organismos que viajam de forma profunda na Antártica colidem com nossa encosta e se elevam ao sol. 
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#5C6874] leading-relaxed">
              Esse abraço ecológico atua purificando constantemente a água, gerando matizes de azul exuberantes e sustentando populações gigantes de tartarugas, golfinhos, peixes e as majestosas baleias-jubarte. É a pureza da vida marinha em estado bruto.
            </p>
          </div>
          <div className="lg:col-span-5 h-[300px] relative overflow-hidden rounded border border-zinc-200">
            <img 
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" 
              alt="Mergulho em Arraial" 
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/85 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-xs font-accent tracking-widest text-white uppercase font-bold">
              Capital Nacional do Mergulho
            </div>
          </div>
        </div>

        {/* 4 LANDMARK POINTS IN HIGH QUALITY CARDS */}
        <div className="space-y-12 mb-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-accent text-[#5C6874] text-[10px] tracking-widest uppercase">Geografia do Paraíso</span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-[#0D1B2A] mt-1 tracking-tight">
              Os Cartões-Postais Naturais
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto mt-3"></div>
            <p className="font-sans text-xs text-[#5C6874] mt-2 leading-relaxed">
              Conheça os refúgios e encostas que tornam Arraial do Cabo conhecida mundialmente por sua incomparável beleza cênica selvagem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {places.map((place, idx) => (
              <div 
                key={place.id}
                className="bg-white border border-[#0D1B2A]/10 rounded shadow-[0_4px_20px_rgba(13,27,42,0.02)] overflow-hidden flex flex-col md:flex-row h-auto md:h-[280px] hover:border-[#0D1B2A] transition-all duration-350"
              >
                {/* Img Container */}
                <div className="w-full md:w-[45%] h-[200px] md:h-full relative overflow-hidden shrink-0">
                  <img 
                    src={place.img} 
                    alt={place.name} 
                    className="w-full h-full object-cover filter brightness-[0.96]"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D1B2A] px-2.5 py-1 rounded text-[8px] font-accent text-white font-extrabold tracking-wider uppercase shadow">
                    {place.category}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#0D1B2A] tracking-tight">{place.name}</h3>
                    <p className="font-sans text-xs text-[#5C6874] leading-relaxed line-clamp-4">{place.phrase}</p>
                  </div>
                  
                  <div className="text-[10px] font-accent text-[#E8711A] tracking-wider uppercase border-t border-zinc-100 pt-3 font-extrabold">
                    ✨ {place.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIPS AND TRAVEL ADVISORIES (Light boxes) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {infoTips.map((tip, idx) => (
            <div key={idx} className="bg-white border border-[#0D1B2A]/5 p-8 rounded shadow-[0_4px_25px_rgba(13,27,42,0.01)] space-y-4 text-left hover:border-[#0D1B2A] transition-colors duration-250">
              <div className="text-[#0D1B2A] font-extrabold text-xs font-accent uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E8711A] animate-pulse"></span>
                {tip.title}
              </div>
              <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>

        {/* INFORMATIVE CTA */}
        <div className="bg-[#0D1B2A] text-white rounded p-8 text-center max-w-3xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.02] [background-size:20px_20px]"></div>
          <div className="relative z-10 space-y-4">
            <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase block">
              Curte Conexões Reais?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              Não explore Arraial de forma apressada ou comum.
            </h3>
            <p className="font-sans text-xs text-zinc-355 max-w-xl mx-auto leading-relaxed">
              Nós mapeamos o trânsito de barcos e rajadas de vento de Arraial para desenhar passeios que dão a você o privilégio de conhecer esses lugares clássicos sem as multidões irritantes que estragam a atmosfera do paraíso.
            </p>
            <button
              onClick={() => onNavigate("experiencias")}
              className="px-6 py-3 bg-[#E8711A] hover:bg-white text-[#0D1B2A] font-accent text-xs font-bold tracking-widest uppercase rounded duration-200 cursor-pointer hover:scale-105 transition-transform"
            >
              Quero Conhecer com a Guida Trips &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
