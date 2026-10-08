/**
 * Arquivo: Card.tsx
 * Responsabilidade: componente base de superfície do Bento Grid com cantos arredondados (24-32px) e traço de 1px.
 * Dados: tokens.css
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface-1' | 'surface-2' | 'graphite' | 'lime' | 'black';
  rounded?: 'md' | 'lg' | 'xl';
  hoverEffect?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface-1',
  rounded = 'xl',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const roundedClasses = {
    md: 'rounded-[20px]',
    lg: 'rounded-[28px]',
    xl: 'rounded-[32px]',
  }[rounded];

  const variantClasses = {
    'surface-1': 'bg-[#0F0F0F] text-[#F7F7F7] border border-[rgba(247,247,247,0.1)]',
    'surface-2': 'bg-[#161616] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)]',
    graphite: 'bg-[#2D2D2D]/60 text-[#F7F7F7] border border-[rgba(247,247,247,0.12)]',
    lime: 'bg-[#CAF000] text-[#080808] border border-[#CAF000]',
    black: 'bg-[#080808] text-[#F7F7F7] border border-[rgba(247,247,247,0.08)]',
  }[variant];

  const hoverClass = hoverEffect
    ? 'transition-all duration-300 hover:border-[rgba(202,240,0,0.35)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
    : '';

  return (
    <div
      className={`
        relative overflow-hidden
        ${roundedClasses}
        ${variantClasses}
        ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
