/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, Search, Calendar, Clock, ArrowLeft, ArrowUpRight, Share2, MessageCircle } from "lucide-react";
import { BlogPost } from "../types";
import { motion } from "motion/react";

interface BlogViewProps {
  posts: BlogPost[];
  onNavigateToContact: () => void;
  selectedSlug: string | null;
  onSelectPost: (slug: string | null) => void;
}

export default function BlogView({ posts, onNavigateToContact, selectedSlug, onSelectPost }: BlogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const activePost = posts.find((p) => p.slug === selectedSlug && p.status === "published");

  // Increment view count simulated when post opens
  useEffect(() => {
    if (activePost) {
      activePost.views += 1;
      window.scrollTo(0, 0);
    }
  }, [selectedSlug]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      (post.title || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      (post.body || "").toLowerCase().includes((searchQuery || "").toLowerCase());
    return matchesSearch && post.status === "published";
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Render focused article details
  if (activePost) {
    const relatedPosts = posts
      .filter((p) => p.id !== activePost.id && p.status === "published")
      .slice(0, 2);

    return (
      <div id="blog-reading-view" className="pt-28 pb-24 bg-[#FBF9F6] min-h-screen text-[#0D1B2A] selection:bg-[#E8711A] selection:text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* Breadcrumb de Navegação */}
          <nav className="flex items-center gap-2 text-[10px] font-accent text-zinc-500 uppercase tracking-wider mb-8">
            <button onClick={() => onSelectPost(null)} className="hover:text-[#E8711A]">Início/Revista</button>
            <span>&gt;</span>
            <span className="text-zinc-500">{activePost.category}</span>
            <span>&gt;</span>
            <span className="text-[#0D1B2A] font-bold truncate max-w-[200px]">{activePost.title}</span>
          </nav>

          {/* Botão de Retrocesso */}
          <button 
            onClick={() => onSelectPost(null)}
            className="flex items-center gap-2 text-xs font-accent font-bold text-[#E8711A] hover:text-[#0D1B2A] uppercase tracking-widest mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a Revista
          </button>

          {/* Cabeçalho do Post */}
          <div className="space-y-4 mb-8">
            <span className="bg-[#E8711A]/10 border border-[#E8711A]/20 text-[#E8711A] font-accent text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-full inline-block">
              {activePost.category}
            </span>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
              {activePost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-zinc-500 border-t border-b border-zinc-200 py-4 mt-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E8711A]" />
                <span>{formatDate(activePost.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E8711A]" />
                <span>{activePost.readTime} min de leitura</span>
              </div>
              <div className="sm:ml-auto flex items-center gap-2 bg-zinc-100 px-3 py-1 rounded-xl border border-zinc-200 font-accent text-[10px]">
                <span className="font-bold text-[#0D1B2A]">👁 {activePost.views} visualizações</span>
              </div>
            </div>
          </div>

          {/* Banner de Capa */}
          <div className="relative h-64 sm:h-[450px] overflow-hidden rounded-2xl border border-zinc-200 mb-10 select-none shadow-sm">
            <img 
              src={activePost.coverImage} 
              className="w-full h-full object-cover" 
              alt={activePost.title} 
            />
          </div>

          {/* Corpo do Artigo e Tabela de Conteúdo Sticking Lateral */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Outline Guia (Sidebar 4 colunas) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h4 className="font-accent text-xs font-bold text-[#0D1B2A] tracking-widest uppercase">CONTEÚDO DA VIAGEM</h4>
                <ul className="space-y-4 font-sans text-xs text-zinc-500">
                  <li className="flex items-center gap-2 hover:text-[#E8711A] cursor-pointer">
                    <span className="w-1.5 h-1.5 bg-[#E8711A] rounded-full"></span>
                    <span className="font-bold text-[#0D1B2A]">Análise do Cenário</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-[#E8711A] cursor-pointer">
                    <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></span>
                    <span>Planejamento tático</span>
                  </li>
                  <li className="flex items-center gap-2 hover:text-[#E8711A] cursor-pointer">
                    <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></span>
                    <span>O Roteiro Secreto</span>
                  </li>
                </ul>
              </div>

              {/* Botão de Destaque para conversão direta */}
              <div className="bg-[#E8711A]/5 border border-[#E8711A]/20 p-6 rounded-2xl space-y-4 text-center shadow-sm">
                <span className="font-accent text-[9px] text-[#E8711A] font-bold tracking-widest uppercase block">CONVERSA CURADA</span>
                <p className="font-sans text-xs text-zinc-600">
                  Deseja montar um roteiro em cima das dicas deste artigo com guias exclusivos?
                </p>
                <button
                  onClick={onNavigateToContact}
                  className="w-full py-3 bg-[#E8711A] hover:bg-[#C45E12] text-white font-accent text-xs font-bold tracking-widest uppercase rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> FALAR COM CONCIERGE
                </button>
              </div>
            </div>

            {/* Texto Editorial (8 colunas) */}
            <div className="lg:col-span-8 space-y-8">
              <article className="prose max-w-none text-left">
                {/* Process text paragraphs beautifully */}
                <div className="font-sans text-xs sm:text-base text-zinc-700 leading-relaxed whitespace-pre-line space-y-6">
                  {activePost.body}
                </div>
              </article>
              
              {/* Box Compartilhar */}
              <div className="border-t border-b border-zinc-200 py-4 flex items-center justify-between text-xs font-sans text-zinc-500">
                <span>Curtiu as referências de Arraial?</span>
                <button
                  onClick={() => alert("Link de compartilhamento copiado para a área de transferência!")}
                  className="flex items-center gap-1 hover:text-[#E8711A] font-accent font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Compartilhar roteiro
                </button>
              </div>
            </div>

          </div>

          {/* MATÉRIAS RELACIONADAS */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-zinc-200 space-y-8 text-left">
              <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">Outros Diários de Viagem Recomendados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => onSelectPost(post.slug)}
                    className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden p-4 flex gap-4 cursor-pointer hover:border-[#E8711A] transition-colors shadow-sm"
                  >
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                      <img src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
                    </div>
                    <div className="space-y-1">
                      <span className="font-accent text-[8px] text-[#E8711A] uppercase tracking-wider block font-bold">{post.category}</span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#0D1B2A] group-hover:text-[#E8711A] line-clamp-2 transition-colors">
                        {post.title}
                      </h4>
                      <span className="font-accent text-[9px] text-zinc-500">{post.readTime} min de leitura</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Render grid list
  return (
    <div id="blog-magazine-view" className="pt-28 pb-24 bg-[#FBF9F6] min-h-screen text-[#0D1B2A] selection:bg-[#E8711A] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-accent text-[#E8711A] text-xs font-bold tracking-widest uppercase">
            Revista de Bordo Digital
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-tight">
            Diários, trilhas e segredos do mar.
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto">
            Textos autorais escritos por nossos curadores, pescadores locais e biólogos para subsidiar seu planejamento.
          </p>
        </div>

        {/* PESQUISA */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 mb-12 gap-4">
          <span className="font-accent text-zinc-500 text-xs font-bold tracking-widest uppercase">Artigos de Capa ({filteredPosts.length})</span>
          <div className="relative w-72 h-10">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Pesquisar boletins de viagem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A] shadow-xs"
            />
          </div>
        </div>

        {/* GRID PRINCIPAL DE MATÉRIAS */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => onSelectPost(post.slug)}
                className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-[#E8711A] transition-all duration-300 flex flex-col justify-between cursor-pointer h-full shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Capa */}
                  <div className="h-52 relative overflow-hidden select-none mb-4 rounded-t-2xl">
                    <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" alt={post.title} />
                    <span className="absolute bottom-4 left-4 font-accent text-[9px] font-bold tracking-widest text-[#E8711A] bg-white/95 border border-[#E8711A]/20 px-2 py-0.5 uppercase rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div className="px-6 pb-2 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-[#0D1B2A] group-hover:text-[#E8711A] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-sans text-xs text-zinc-500 leading-relaxed line-clamp-3 select-none">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="px-6 pb-6 pt-4 border-t border-zinc-150 mt-4 flex items-center justify-between text-[10px] font-accent text-zinc-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E8711A]" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E8711A]" />
                    <span>{post.readTime} min de leitura</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <p className="font-sans text-xs text-zinc-500 mb-4">Sem artigos com esses filtros.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2 bg-transparent border border-[#E8711A] text-[#E8711A] hover:bg-[#E8711A] hover:text-white font-accent text-xs font-bold uppercase transition-colors rounded-xl cursor-pointer"
            >
              Resetar busca
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
