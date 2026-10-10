/**
 * Arquivo: Manifesto.tsx
 * Responsabilidade: faixa de manifesto horizontal em marquee contínuo sutil com alternância de texto contornado e preenchido.
 * Dados: Seção 6 do briefing ("Tecnologia. Design. Resultados.").
 * Como editar: altere a velocidade de animação ou frases adicionais.
 */

import React from 'react';

export const Manifesto: React.FC = () => {
  const phrases = [
    { text: "Tecnologia.", outlined: false },
    { text: "Design.", outlined: false },
    { text: "Resultados.", outlined: false },
    { text: "Tecnologia que transforma.", outlined: false },
    { text: "Tecnologia.", outlined: false },
    { text: "Design.", outlined: false },
    { text: "Resultados.", outlined: false },
    { text: "Do conceito ao resultado.", outlined: false },
  ];

  return (
    <section className="w-full py-5 sm:py-7 border-y border-[rgba(247,247,247,0.08)] bg-[#0A0A0A]/60 overflow-hidden select-none">
      <div className="flex w-max animate-marquee gap-8 sm:gap-12 items-center">
        {/* Renderizado duas vezes para loop infinito sem cortes */}
        {[...phrases, ...phrases].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12 shrink-0">
            <span
              className={`
                text-2xl sm:text-4xl lg:text-5xl font-['Sora'] font-extrabold uppercase tracking-tight
                transition-colors duration-300
                ${
                  item.outlined
                    ? 'text-transparent [-webkit-text-stroke:1px_rgba(247,247,247,0.35)] hover:[-webkit-text-stroke:1px_#CAF000]'
                    : 'text-[#F7F7F7] hover:text-[#CAF000]'
                }
              `}
            >
              {item.text}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#CAF000] shrink-0" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
};
