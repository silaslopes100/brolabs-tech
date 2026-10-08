/**
 * Arquivo: Pill.tsx
 * Responsabilidade: componente de pílula interativa (botão 'Saiba mais' com seta ↗ giratória e pílulas de navegação).
 * Dados: tokens.css
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface PillProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'outline' | 'filled' | 'minimal';
  showArrow?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Pill: React.FC<PillProps> = ({
  label,
  onClick,
  href,
  variant = 'outline',
  showArrow = true,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] py-1.5 px-3.5' : 'text-xs py-2 px-4';

  const variantClasses = {
    outline:
      'border border-[rgba(247,247,247,0.14)] text-[#D9D9D9] hover:border-[#CAF000] hover:text-[#CAF000] bg-black/20 backdrop-blur-sm',
    filled:
      'bg-[#CAF000] text-[#080808] font-bold border border-[#CAF000] hover:bg-[#b8db00]',
    minimal:
      'text-[#D9D9D9]/80 hover:text-[#CAF000] bg-transparent border-transparent',
  }[variant];

  const content = (
    <span
      className={`
        group inline-flex items-center gap-2 rounded-full font-['Sora'] font-medium
        transition-all duration-250 ease-out select-none cursor-pointer
        ${sizeClasses}
        ${variantClasses}
        ${className}
      `}
    >
      <span>{label}</span>
      {showArrow && (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#CAF000] group-hover:border-[#CAF000] group-hover:text-[#080808] text-[#D9D9D9] transition-all duration-200">
          <ArrowUpRight className="w-3 h-3 stroke-[2] transition-transform duration-200 group-hover:rotate-45" />
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <a href={href} className="inline-block" onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block bg-transparent p-0 border-none">
      {content}
    </button>
  );
};
