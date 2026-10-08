/**
 * Arquivo: Logo.tsx
 * Responsabilidade: componente de logotipo vetorial oficial da BROLABS TECH em suas 4 variantes oficiais.
 * Dados: Brand Guidelines da marca (Frasco de Erlenmeyer com contorno duplo e perfil 'B', wordmark BRO + LABS + TECH).
 * Como editar: altere tamanhos ou substitua os caminhos SVG se houver export direto em public/brand/.
 */

import React from 'react';

export type LogoVariant = 'principal' | 'horizontal' | 'simplificado' | 'negativo';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withLink?: boolean;
}

// ===== [SEÇÃO: ÍCONE GEOMÉTRICO DO FRASCO BROLABS] =====
// EDITAR AQUI: trocar pelo SVG oficial se exportado em public/brand/icone-frasco.svg
export const BrolabsFlaskIcon: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = '', color = '#CAF000', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Ícone Frasco BROLABS"
    >
      {/* Contorno externo do frasco e do perfil lateral em B */}
      <path
        d="M26 12H64V24L57 32V58L80 98H12L35 58V32L26 24V12Z"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Detalhe da borda superior / gargalo */}
      <path
        d="M38 12V20H52V12"
        stroke={color}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Linha interna vertical de deslocamento */}
      <path
        d="M36 28V58"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Linha de líquido / base interna com ângulo */}
      <path
        d="M17 93L37 58"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M20 93H72"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Perfil 'B' estilizado na lateral direita (Assinatura Ícone BRO.LABS) */}
      <path
        d="M68 18H80L96 36L96 52L86 62L96 72L96 90L84 100H68"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M72 26H78L90 40V48L82 56"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M82 68L90 76V86L80 94H74"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

// ===== [SEÇÃO: COMPONENTE PRINCIPAL DO LOGO] =====
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'md',
  withLink = false
}) => {
  // Ajuste de escalas
  const sizeMap = {
    sm: { icon: 28, text: 'text-sm', tech: 'text-[9px]' },
    md: { icon: 36, text: 'text-lg', tech: 'text-[11px]' },
    lg: { icon: 48, text: 'text-2xl', tech: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', tech: 'text-sm' },
  };

  const { icon: iconSize, text: textSize, tech: techSize } = sizeMap[size];

  // Variante Simplificada: apenas o frasco
  if (variant === 'simplificado') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <BrolabsFlaskIcon size={iconSize} />
      </div>
    );
  }

  // Variante Principal: frasco empilhado no topo, texto abaixo
  if (variant === 'principal') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        <BrolabsFlaskIcon size={iconSize * 1.3} />
        <div>
          <div className={`font-['Sora'] font-bold leading-none tracking-tight ${textSize} flex items-center justify-center`}>
            <span className="text-[#F7F7F7]">BRO</span>
            <span className="text-[#CAF000]">LABS</span>
          </div>
          <div className={`font-['Inter'] font-medium text-[#D9D9D9] tracking-[0.4em] uppercase mt-1 leading-none ${techSize}`}>
            T E C H
          </div>
        </div>
      </div>
    );
  }

  // Variante Negativa: para fundos claros ou aplicação monocromática
  if (variant === 'negativo') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <BrolabsFlaskIcon size={iconSize} color="#080808" />
        <div className="flex flex-col">
          <div className={`font-['Sora'] font-bold leading-none tracking-tight ${textSize} flex items-center`}>
            <span className="text-[#080808]">BRO</span>
            <span className="text-[#080808]">LABS</span>
          </div>
          <span className={`font-['Inter'] font-semibold text-[#2D2D2D] tracking-[0.35em] uppercase leading-none mt-1 ${techSize}`}>
            T E C H
          </span>
        </div>
      </div>
    );
  }

  // Padrão: Variante Horizontal (para navbar, cabeçalhos e pílulas)
  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrolabsFlaskIcon size={iconSize} />
      <div className="flex flex-col">
        <div className={`font-['Sora'] font-bold leading-none tracking-tight ${textSize} flex items-center`}>
          <span className="text-[#F7F7F7]">BRO</span>
          <span className="text-[#CAF000]">LABS</span>
        </div>
        <span className={`font-['Inter'] font-medium text-[#D9D9D9]/80 tracking-[0.35em] uppercase leading-none mt-1 ${techSize}`}>
          T E C H
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <a href="/" className="inline-flex hover:opacity-95 transition-opacity" aria-label="BROLABS TECH Início">
        {content}
      </a>
    );
  }

  return content;
};
