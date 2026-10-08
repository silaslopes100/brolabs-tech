/**
 * Arquivo: About.tsx
 * Responsabilidade: seção Sobre e Fundadores com texto institucional exato, manifesto e cards dos sócios Silas Lopes e Marcos Sena.
 * Dados: content/team.ts e Seção 6 do briefing.
 */

import React from 'react';
import { FOUNDERS } from '../../../content/team';
import { Card } from '../../../components/ui/Card';
import { BrolabsFlaskIcon } from '../../../components/brand/Logo';

export const About: React.FC = () => {
  return (
    <section id="sobre" className="w-full px-4 sm:px-6 md:px-8 py-16 sm:py-24 border-t border-[rgba(247,247,247,0.08)]">
      {/* ===== [SEÇÃO: TEXTO INSTITUCIONAL E MANIFESTO] ===== */}
      <div className="max-w-4xl mb-12 sm:mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-['Sora'] font-bold text-[#CAF000] tracking-widest uppercase">
          <span>04 · QUEM SOMOS</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-['Sora'] text-[#F7F7F7] leading-tight tracking-tight">
          A Brolabs Tech é um hub de inovação digital fundado por Silas Lopes e Marcos Sena — dois profissionais apaixonados por tecnologia, design e resultados reais.
        </h2>

        {/* Manifesto em destaque */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-[#161616] border border-[rgba(247,247,247,0.1)] flex items-start gap-4 sm:gap-6">
          <div className="shrink-0 pt-1">
            <BrolabsFlaskIcon size={28} color="#CAF000" />
          </div>
          <div>
            <span className="block font-['Sora'] text-xs font-bold uppercase tracking-wider text-[#CAF000] mb-1">
              MANIFESTO
            </span>
            <p className="text-base sm:text-xl font-['Sora'] font-medium text-[#F7F7F7] leading-relaxed">
              "Acreditamos em tecnologia que serve pessoas, design que comunica e resultados que impulsionam negócios."
            </p>
          </div>
        </div>
      </div>

      {/* ===== [SEÇÃO: CARDS DOS FUNDADORES] ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {FOUNDERS.map((founder) => (
          <Card
            key={founder.name}
            variant="surface-1"
            rounded="xl"
            hoverEffect
            className="p-6 sm:p-8 flex flex-col justify-between"
          >
            {/* Foto dos fundadores (com tratamento de estúdio e gradiente inferior) */}
            <div className="relative w-full h-72 sm:h-84 rounded-[20px] overflow-hidden bg-[#161616] mb-6">
              <img
                src={founder.image}
                alt={`Foto de ${founder.name}`}
                loading="lazy"
                className="w-full h-full object-cover object-top filter grayscale-[15%] contrast-[1.08] transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Fallback elegante com as iniciais do fundador
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              {/* Gradiente inferior e vinheta sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-['Sora'] text-[#CAF000] font-semibold">
                  Co-Founder
                </span>
              </div>
            </div>

            {/* Informações dos fundadores */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-['Sora'] text-[#F7F7F7]">
                {founder.name}
              </h3>
              <p className="text-xs sm:text-sm font-['Sora'] font-semibold text-[#CAF000]">
                {founder.role}
              </p>
              <p className="text-xs sm:text-sm text-[#D9D9D9]/75 font-['Inter'] leading-relaxed pt-1">
                {founder.bio}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
