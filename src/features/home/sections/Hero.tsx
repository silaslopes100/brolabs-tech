/**
 * Arquivo: Hero.tsx
 * Responsabilidade: seção Hero bento grid inspirada na [REF-B] com card recortado, selo circular com o frasco da marca, card verde sólido, card Sobre e card de barras do processo.
 * Dados: Seção 6 do briefing
 * Como editar: textos dos títulos e botões em [SEÇÃO: CONTEÚDO DO HERO].
 */

import React from 'react';
import { Button } from '../../../components/ui/Button';
import { BrolabsFlaskIcon } from '../../../components/brand/Logo';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="w-full px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16">
      {/* Assinatura discreta no topo do Hero */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">

      </div>

      {/* ===== [SEÇÃO: BENTO GRID HERO (REF-B)] ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5">
        
        {/* ===== CARD 1: CARD PRINCIPAL COM RECORTE E SELO DO FRASCO (7 COLS LG) ===== */}
        <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[520px] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-[rgba(247,247,247,0.12)] bg-[#0F0F0F] flex flex-col justify-between p-6 sm:p-10 group">
          
          {/* Imagem de arquitetura/tecnologia escura de fundo */}
          <div className="absolute inset-0 z-0">
            <video
              className="absolute inset-0 w-full h-full object-cover opacity -0"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            >
              <source src="/videos/hero-background.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/40 to-transparent z-10" />
            {/* Padrão geométrico de arquitetura/código estilizado */}
            <svg
              className="w-full h-full object-cover filter grayscale contrast-[1.2] opacity-25"
              viewBox="0 0 800 600"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="facade" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E1E1E" />
                  <stop offset="100%" stopColor="#0A0A0A" />
                </linearGradient>
              </defs>
              <rect width="800" height="600" fill="url(#facade)" />
              {/* Linhas de fachada espelhada */}
              {Array.from({ length: 16 }).map((_, i) => (
                <path
                  key={i}
                  d={`M ${100 + i * 40} 0 L ${250 + i * 35} 600`}
                  stroke="rgba(247,247,247,0.08)"
                  strokeWidth="1.5"
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 50}
                  x2="800"
                  y2={i * 50 + 40}
                  stroke="rgba(247,247,247,0.04)"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>

          {/* ===== SELO CIRCULAR VERDE COM O FRASCO DA MARCA (CANTO SUPERIOR ESQUERDO) ===== */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[#CAF000] text-[#080808] flex items-center justify-center shadow-[0_0_25px_rgba(202,240,0,0.3)] transition-transform duration-300 group-hover:scale-105"
                title="BROLABS TECH Hub de Inovação"
              >
                <BrolabsFlaskIcon size={32} color="#080808" />
              </div>
              <div>
                <span className="block font-['Sora'] text-[10px] sm:text-[11px] font-bold text-[#CAF000] tracking-wider uppercase">
                  HUB DE INOVAÇÃO DIGITAL
                </span>
                <span className="block font-['Inter'] text-[11px] text-[#D9D9D9]/70">
                  São Paulo
                </span>
              </div>
            </div>

            {/* Seta discreta no canto superior direito */}
            <button
              onClick={() => scrollTo('servicos')}
              aria-label="Rolar para serviços"
              className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 text-[#D9D9D9] flex items-center justify-center hover:bg-[#CAF000] hover:border-[#CAF000] hover:text-[#080808] transition-all duration-200"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* ===== CONTEÚDO PRINCIPAL DO HERO ===== */}
          <div className="relative z-20 mt-16 sm:mt-24 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-bold font-['Sora'] leading-[1.08] tracking-tight text-[#F7F7F7]">
                Do conceito ao <span className="text-[#CAF000]">resultado.</span>
              </h1>
              <p className="text-base sm:text-xl font-['Sora'] font-medium text-[#D9D9D9]/90 tracking-tight">
                Design. Desenvolvimento. Estratégia.
              </p>
            </div>

            {/* Botões do Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => scrollTo('contato')}
              >
                Fale conosco
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => (window.location.href = '/projetos')}
                iconRight={<ArrowUpRight className="w-4 h-4" />}
              >
                Ver projetos
              </Button>
            </div>
          </div>
        </div>

        {/* ===== COLUNA DIREITA: GRID DE 3 CARDS DA REF-B (5 COLS LG) ===== */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4 lg:gap-5">
          
          {/* ===== CARD 2: VERDE-LIMÃO SÓLIDO (REF-B) ===== */}
          <div
            onClick={() => scrollTo('servicos')}
            className="group relative cursor-pointer min-h-[170px] sm:min-h-[190px] rounded-[24px] sm:rounded-[28px] bg-[#CAF000] text-[#080808] p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-sm transition-transform duration-300 hover:scale-[1.01]"
          >
            {/* Cabeçalho do Card Verde */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-['Inter'] text-[11px] font-bold uppercase tracking-widest text-[#080808]/75">
                HUB DE TRANSFORMAÇÃO
              </span>
              <div className="w-8 h-8 rounded-full bg-[#080808]/10 flex items-center justify-center group-hover:bg-[#080808] group-hover:text-[#CAF000] transition-colors duration-200">
                <ArrowUpRight className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            {/* Texto manifesto */}
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Sora'] tracking-tight text-[#080808]">
                Tecnologia. Design. Resultados.
              </h2>
            </div>
          </div>

          {/* ===== SUB-GRID INFERIOR: SOBRE NÓS + BARRAS DO PROCESSO ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 flex-1">
            
            {/* ===== CARD 3: SOBRE NÓS COM FORMA 3D EMPILHADA ===== */}
            <div
              onClick={() => scrollTo('sobre')}
              className="group cursor-pointer rounded-[24px] sm:rounded-[28px] bg-[#161616] border border-[rgba(247,247,247,0.12)] p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-[#CAF000]/40"
            >
              <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
                style={{
                  backgroundImage: "url('/images/founders-background.png')",
                  backgroundPosition: 'center 35%',
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 flex flex-1 flex-col justify-between">
                {/* Seta no topo */}
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-[#CAF000] group-hover:border-[#CAF000] group-hover:text-[#080808] transition-all duration-200">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2] group-hover:rotate-45 transition-transform duration-200" />
                  </div>
                </div>

                <div>
                  <h3 className="font-['Sora'] font-bold text-base text-[#F7F7F7] group-hover:text-[#CAF000] transition-colors">
                    Sobre nós
                  </h3>
                  <p className="text-[11px] text-[#D9D9D9]/70 font-['Inter'] mt-0.5">
                    Silas Lopes & Marcos Sena
                  </p>
                </div>
              </div>
            </div>

            {/* ===== CARD 4: CARD DE BARRAS ASCENDENTES (AS 4 ETAPAS DO PROCESSO 01-04) ===== */}
            <div
              onClick={() => scrollTo('processo')}
              className="group cursor-pointer rounded-[24px] sm:rounded-[28px] bg-[#161616] border border-[rgba(247,247,247,0.12)] p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-[#CAF000]/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-['Sora'] font-semibold text-[#CAF000] tracking-wider uppercase">
                  MÉTODO ÁGIL
                </span>
                <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-[#CAF000] group-hover:border-[#CAF000] group-hover:text-[#080808] transition-all duration-200">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2] group-hover:rotate-45 transition-transform duration-200" />
                </div>
              </div>

              {/* 4 Barras ascendentes representando as 4 etapas (01 Descoberta, 02 Estratégia, 03 Execução, 04 Lançamento) */}
              <div className="my-2 flex items-end justify-between gap-2.5 h-16 px-1">
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-5 rounded-t-sm bg-gradient-to-t from-[#2D2D2D] to-[#CAF000]/40 group-hover:to-[#CAF000] transition-all duration-300" />
                  <span className="text-[9px] font-['Sora'] text-[#D9D9D9]/60">01</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-8 rounded-t-sm bg-gradient-to-t from-[#2D2D2D] to-[#CAF000]/60 group-hover:to-[#CAF000] transition-all duration-300" />
                  <span className="text-[9px] font-['Sora'] text-[#D9D9D9]/60">02</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-11 rounded-t-sm bg-gradient-to-t from-[#2D2D2D] to-[#CAF000]/80 group-hover:to-[#CAF000] transition-all duration-300" />
                  <span className="text-[9px] font-['Sora'] text-[#D9D9D9]/60">03</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-15 rounded-t-sm bg-gradient-to-t from-[#2D2D2D] to-[#CAF000] transition-all duration-300" />
                  <span className="text-[9px] font-['Sora'] font-bold text-[#CAF000]">04</span>
                </div>
              </div>

              <div>
                <h3 className="font-['Sora'] font-bold text-base text-[#F7F7F7] group-hover:text-[#CAF000] transition-colors">
                  Como trabalhamos
                </h3>
                <p className="text-[11px] text-[#D9D9D9]/70 font-['Inter'] mt-0.5">
                  4 etapas: conceito ao deploy
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
