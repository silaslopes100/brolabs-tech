/**
 * Arquivo: Frame.tsx
 * Responsabilidade: contêiner principal "Tela como Objeto" (Seção 4: cantos de 32px com traço de 1px flutuando sobre fundo escuro com forma 3D abstrata em listras como a [REF-A]).
 * Dados: tokens.css
 * Como editar: ajuste as margens externas de desktop ou o raio do contêiner central.
 */

import React from 'react';

interface FrameProps {
  children: React.ReactNode;
}

export const Frame: React.FC<FrameProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#040404] text-[#F7F7F7] flex flex-col items-center justify-start p-0 sm:p-3 md:p-5 lg:p-6 overflow-x-hidden">
      
      {/* ===== [SEÇÃO: FORMAS 3D ABSTRATAS EM LISTRAS DE FUNDO (REF-A)] ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Forma orgânica estriada no canto superior esquerdo */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-[0.25] filter blur-[1px]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <pattern id="stripes1" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#333333" strokeWidth="2.5" />
              </pattern>
            </defs>
            <path
              fill="url(#stripes1)"
              d="M38.8,-53.4C50.9,-46.8,61.7,-36.4,66.8,-23.4C71.8,-10.5,71.1,5,66.3,19.3C61.4,33.5,52.4,46.5,40.1,54.8C27.8,63.1,12.2,66.7,-2.8,70.5C-17.7,74.3,-32,78.4,-43.8,72.6C-55.7,66.9,-65.1,51.4,-70.6,35.1C-76.1,18.8,-77.6,1.8,-73.4,-13.6C-69.2,-29,-59.4,-42.8,-46.7,-49.2C-34,-55.7,-18.4,-54.7,-2.7,-51C13,-47.3,26.7,-60.1,38.8,-53.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Forma orgânica estriada no canto inferior direito com sopro verde-limão */}
        <div className="absolute -bottom-36 -right-36 w-[700px] h-[700px] opacity-[0.28]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <pattern id="stripes2" width="10" height="10" patternTransform="rotate(-30 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#2D2D2D" strokeWidth="3" />
                <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(202,240,0,0.12)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <path
              fill="url(#stripes2)"
              d="M45.5,-63.4C59.6,-54.6,72.1,-43.3,77.9,-28.9C83.7,-14.6,82.8,2.7,77.5,18.8C72.2,34.8,62.5,49.5,49.2,59.3C35.9,69.1,19,74,1.4,72.1C-16.3,70.2,-31.6,61.5,-44.6,51.2C-57.7,40.9,-68.5,29.1,-74.2,14.6C-79.8,-0.1,-80.3,-17.5,-73.4,-31.6C-66.5,-45.8,-52.1,-56.6,-37.2,-64.9C-22.3,-73.1,-6.9,-78.9,6.7,-88C20.3,-97.2,31.4,-72.1,45.5,-63.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Luz de contorno e gradientes volumétricos */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(202,240,0,0.025),transparent_70%)] pointer-events-none" />
      </div>

      {/* ===== [SEÇÃO: OBJETO CENTRAL (TELA FLUTUANTE DE 32PX)] ===== */}
      <div className="relative z-10 w-full max-w-[1440px] min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] bg-[#080808] rounded-none sm:rounded-[28px] md:rounded-[32px] border-0 sm:border sm:border-[rgba(247,247,247,0.12)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        {children}
      </div>

    </div>
  );
};
