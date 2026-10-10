/**
 * Arquivo: Process.tsx
 * Responsabilidade: seção "Como trabalhamos" com linha do tempo vertical no desktop, numerais grandes em Sora verde e textos exatos.
 * Dados: content/process.ts
 */

import React from 'react';
import { PROCESS_STEPS } from '../../../content/process';
import { Card } from '../../../components/ui/Card';

export const Process: React.FC = () => {
  return (
    <section id="processo" className="w-full px-4 sm:px-6 md:px-8 py-16 sm:py-24 border-t border-[rgba(247,247,247,0.08)]">
      {/* Cabeçalho da Seção */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-['Sora'] font-bold text-[#CAF000] tracking-widest uppercase mb-3">
          <span>PROCESSO CLARO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-['Sora'] text-[#F7F7F7] tracking-tight">
          Como transformamos ideias em produtos reais.
        </h2>
        <p className="text-sm sm:text-base text-[#D9D9D9]/75 font-['Inter'] mt-3 leading-relaxed">
          Sem burocracia ou promessas vagas. Um método estruturado em quatro etapas claras com previsibilidade, transparência e entrega contínua.
        </p>
      </div>

      {/* ===== [SEÇÃO: LINHA DO TEMPO VERTICAL] ===== */}
      <div className="relative">
        {/* Linha vertical contínua no desktop */}
        <div className="hidden lg:block absolute left-8 top-10 bottom-10 w-[1px] bg-gradient-to-b from-[#CAF000] via-[#CAF000]/40 to-[rgba(247,247,247,0.1)] pointer-events-none" />

        <div className="space-y-6 sm:space-y-8">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={step.number} className="relative lg:pl-24 group">
              {/* Marcador circular alinhado na linha guia */}
              <div className="hidden lg:flex absolute left-5.5 top-8 -translate-x-1/2 w-6 h-6 rounded-full bg-[#080808] border-2 border-[#CAF000] items-center justify-center group-hover:scale-125 group-hover:bg-[#CAF000] transition-all duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CAF000] group-hover:bg-[#080808]" />
              </div>

              {/* Card da Etapa */}
              <Card
                variant="surface-1"
                rounded="xl"
                hoverEffect
                className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start sm:items-center gap-6">
                  {/* Numeral grande em Sora verde */}
                  <span className="text-4xl sm:text-5xl font-extrabold font-['Sora'] text-[#CAF000] shrink-0 leading-none">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-['Sora'] text-[#F7F7F7]">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D9D9D9]/80 font-['Inter'] mt-2 leading-relaxed max-w-2xl">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
