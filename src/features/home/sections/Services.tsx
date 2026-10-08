/**
 * Arquivo: Services.tsx
 * Responsabilidade: seção de Serviços com Bento Grid assimétrico da [REF-A] (12 col no topo, 4/4/4 no centro, 5/7 na base) e MediaCard.
 * Dados: content/services.ts
 * Como editar: textos e caminhos de imagens em content/services.ts; layout de grade em [GRID].
 */

import React from 'react';
import { SERVICES_DATA, ServiceItem } from '../../../content/services';
import { MediaCard } from '../../../components/ui/MediaCard';
import { Pill } from '../../../components/ui/Pill';

interface ServicesProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const handleServiceClick = (service: ServiceItem) => {
    if (onSelectService) {
      onSelectService(service.title);
    }
    const el = document.getElementById('contato');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="servicos" className="w-full px-4 sm:px-6 md:px-8 py-16 sm:py-24">
      {/* ===== [SEÇÃO: CABEÇALHO DA SEÇÃO] ===== */}
      <div className="max-w-3xl mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-['Sora'] font-bold text-[#CAF000] tracking-widest uppercase mb-3">
          <span>01 · NOSSAS SOLUÇÕES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-['Sora'] text-[#F7F7F7] tracking-tight">
          Especialidades que aceleram o seu negócio.
        </h2>
        <p className="text-sm sm:text-base text-[#D9D9D9]/75 font-['Inter'] mt-3 leading-relaxed">
          Combinamos engenharia de software de ponta, inteligência artificial aplicada e design de padrão internacional para criar produtos que geram valor tangível.
        </p>
      </div>

      {/* ===== [SEÇÃO: BENTO GRID ASSIMÉTRICO (REF-A)] ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {SERVICES_DATA.map((service) => {
          // Altura balanceada para cada linha
          const heightClass =
            service.gridSpan.includes('col-span-12 lg:col-span-12')
              ? 'min-h-[380px] sm:min-h-[440px]'
              : 'min-h-[360px] sm:min-h-[400px]';

          return (
            <div
              key={service.id}
              className={`${service.gridSpan} col-span-12`}
              onClick={() => handleServiceClick(service)}
            >
              <MediaCard
                imageSrc={service.image}
                imageAlt={service.title}
                className={`w-full ${heightClass} cursor-pointer`}
              >
                {/* Numeração editorial e tag de serviço */}
                <div className="flex items-center justify-between mb-auto pb-6">
                  <span className="font-['Sora'] font-bold text-sm sm:text-base text-[#CAF000] tracking-tight">
                    {service.number}
                  </span>
                  <Pill
                    label="Saiba mais"
                    size="sm"
                    onClick={() => handleServiceClick(service)}
                  />
                </div>

                {/* Título e descrição do serviço */}
                <div className="space-y-2 mt-auto">
                  <h3 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-[#F7F7F7] group-hover:text-[#CAF000] transition-colors duration-250">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D9D9D9]/80 font-['Inter'] leading-relaxed max-w-2xl">
                    {service.description}
                  </p>
                </div>
              </MediaCard>
            </div>
          );
        })}
      </div>
    </section>
  );
};
