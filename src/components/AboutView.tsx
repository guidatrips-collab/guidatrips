/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Compass, Heart, Award, ArrowUpRight } from "lucide-react";

export default function AboutView() {
  const team = [
    {
      name: "Guida",
      role: "Fundadora & Concierge Curadora",
      bio: "Cria de Arraial do Cabo, mapeou cada fenda e enseada da península. Amante de vinhos, boas risadas e defensora fervorosa do turismo regenerativo de preservação.",
      avatar: "G"
    },
    {
      name: "Capitão Gabriel",
      role: "Diretor de Operações Náuticas",
      bio: "Mais de 15 anos comandando embarcações na Região dos Lagos. Especialista em navegação sutil e rotas costeiras secretas sem barulho.",
      avatar: "C"
    },
    {
      name: "Dra. Letícia",
      role: "Bióloga Marinha Consultora",
      bio: "Lidera nossas expedições de Safári Científico em temporada de jubartes. Sua missão é traduzir a ciência das baleias em conexões emocionais.",
      avatar: "D"
    }
  ];

  const pilares = [
    {
      icon: Compass,
      title: "Curadoria Estrita",
      desc: "Nós escolhemos caminhos, horários e paradas a dedo. Se uma praia está superlotada, alteramos a rota; se o vento sopra forte, buscamos a calmaria de enseadas misteriosas."
    },
    {
      icon: Heart,
      title: "Relacionamento Humano",
      desc: "Não gostamos da palavra 'cliente'. Preferimos 'viajante' ou 'amigo'. Atendemos de forma artesanal, entendendo alergias, desejos infantis e sonhos de brinde."
    },
    {
      icon: ShieldCheck,
      title: "Segurança e Conforto",
      desc: "Todas as embarcações e buggies são segurados individualmente, operados por profissionais homologados pela Marinha ou órgãos ambientais rígidos."
    }
  ];

  const partners = [
    "PADI Global",
    "Prefeitura de Arraial do Cabo",
    "Bênção Mar Bistrô",
    "Espumante Ponto Nero",
    "ICMBio Conservação",
    "Associação Turística Região dos Lagos"
  ];

  return (
    <div id="about-view" className="pt-28 pb-24 bg-[#FBF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase">
            Nosso Manifesto
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Uma conexão profunda com o mar e com você.
          </h1>
          <div className="h-0.5 w-16 bg-[#E8711A] mx-auto"></div>
          <p className="font-sans text-xs sm:text-sm text-[#5C6874] leading-relaxed max-w-lg mx-auto">
            A Guida Trips não é apenas um facilitador de transporte comum. Somos curadores de silêncios, sabores e aventuras desenhados com profundo afeto.
          </p>
        </div>

        {/* SEÇÃO MANIFESTO EDITORIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-zinc-200 pb-16 mb-16">
          
          {/* Lado Esquerdo: Grandes aspas e citação */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[#E8711A] font-serif text-7xl select-none leading-none block h-8">“</span>
            <blockquote className="font-serif text-xl sm:text-2xl text-[#0D1B2A] italic leading-relaxed font-bold">
              Viajar não é tirar fotos de cartões-postais iguais aos de todo mundo. É se aproximar da alma de um porto.
            </blockquote>
            <div className="h-0.5 w-12 bg-[#E8711A] mt-6"></div>
          </div>

          {/* Lado Direito: Texto Editorial */}
          <div className="lg:col-span-8 font-sans text-xs sm:text-sm text-[#5C6874] leading-relaxed space-y-6">
            <p>
              A Guida Trips nasceu de uma inquietude saudável com o mercado de turismo tradicional. Percebemos que, ao se industrializar o contato com a exuberante costa de Arraial do Cabo, perdeu-se a poesia do balanço das ondas, o respeito ao pescador artesanal e a calmaria de contemplar o azul profundo sob o murmúrio do vento nas dunas.
            </p>
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#E8711A] first-letter:mr-2.5 first-letter:float-left first-letter:font-extrabold">
              Nossa missão é resgatar essa poesia. Construímos itinerários onde o tempo não corre; ele desacelera de propósito. Quando você embarca conosco em um passeio náutico ou off-road, entra num roteiro que foi desenhado após meses de estudos de correntes costeiras, tráfego de banhistas e curadoria de sabores de bistrôs locais parceiros.
            </p>
            <p>
              Queremos que ao fim das suas férias, você não leve apenas arquivos digitais no celular, mas histórias genuínas para contar aos filhos. Que você recorde do cheiro de maresia no Pontal, do brinde ao pôr do sol, ou da emoção absoluta de ver a cauda de uma Jubarte emergir majestosa no breu azul das águas de Arraial.
            </p>
          </div>

        </div>

        {/* PILARES DA FILOSOFIA */}
        <div className="space-y-8 mb-20">
          <div className="text-center">
            <span className="font-accent text-[#5C6874] text-[10px] tracking-widest uppercase">Os Pilares</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D1B2A] tracking-tight mt-1">
              Como Pensamos e Operamos
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pilares.map((pilar, idx) => {
              const Icon = pilar.icon;
              return (
                <div key={idx} className="bg-white border border-[#0D1B2A]/10 p-8 rounded shadow-[0_4px_25px_rgba(13,27,42,0.01)] hover:border-[#0D1B2A] transition-colors duration-250 space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#E8711A]/10 border border-[#E8711A]/20 flex items-center justify-center text-[#E8711A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">
                    {pilar.title}
                  </h3>
                  <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                    {pilar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* NOSSA EQUIPE */}
        <div className="space-y-10 border-b border-zinc-200 pb-16 mb-16">
          <div className="text-center">
            <span className="font-accent text-[#5C6874] text-[10px] tracking-widest uppercase">Curadores de Bordo</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D1B2A] tracking-tight mt-1">
              Pessoas que Recebem você como Amigo
            </h2>
            <div className="h-0.5 w-16 bg-[#E8711A] mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((membro, idx) => (
              <div key={idx} className="bg-white border border-[#0D1B2A]/10 rounded shadow-[0_4px_25px_rgba(13,27,42,0.01)] p-6 space-y-4 flex flex-col justify-between hover:border-[#0D1B2A] transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#0D1B2A] text-white flex items-center justify-center font-accent font-bold text-lg select-none">
                    {membro.avatar}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#0D1B2A]">{membro.name}</h3>
                    <span className="font-accent text-[9px] text-[#E8711A] tracking-wider uppercase block font-extrabold">{membro.role}</span>
                  </div>
                  <p className="font-sans text-xs text-[#5C6874] leading-relaxed">
                    {membro.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARCEIROS */}
        <div className="space-y-8 text-center pb-8">
          <span className="font-accent text-[#5C6874] text-[10px] tracking-widest uppercase">Certificação e Parcerias</span>
          <h2 className="font-serif text-2xl font-bold text-[#0D1B2A] tracking-tight">
            Parceiros de Confiança que Validam Nossa Rota
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2">
            {partners.map((partner, idx) => (
              <div 
                key={idx} 
                className="font-accent text-xs font-bold text-[#0D1B2A] border border-[#0D1B2A]/10 px-6 py-3 rounded bg-white hover:text-[#E8711A] hover:border-[#E8711A] transition-all cursor-default shadow-[0_2px_15px_rgba(13,27,42,0.01)]"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
