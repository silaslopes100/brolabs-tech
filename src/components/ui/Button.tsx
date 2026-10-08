/**
 * Arquivo: Button.tsx
 * Responsabilidade: componente de botão polimórfico com resposta física (200-350ms) e anel de foco verde.
 * Dados: tokens.css
 * Como editar: adicione variantes ou ajuste espaçamentos preservando a proporção horizontal ~2x vertical.
 */

import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'pill-outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconRight,
  iconLeft,
  className = '',
  disabled,
  ...props
}) => {
  // Tamanhos com proporção matemática de padding horizontal ~2x vertical
  const sizeClasses = {
    sm: 'text-xs py-2 px-4 gap-1.5',
    md: 'text-sm py-2.5 px-6 gap-2',
    lg: 'text-base py-3.5 px-8 gap-2.5',
  }[size];

  // Variantes estritas baseadas nos tokens da marca
  const variantClasses = {
    primary:
      'bg-[#CAF000] text-[#080808] font-bold hover:bg-[#b8db00] active:scale-[0.98] shadow-sm',
    outline:
      'bg-transparent text-[#F7F7F7] border border-[rgba(247,247,247,0.18)] hover:border-[#CAF000] hover:text-[#CAF000] active:scale-[0.98]',
    'pill-outline':
      'bg-transparent text-[#D9D9D9] border border-[rgba(247,247,247,0.12)] hover:border-[#CAF000] hover:text-[#CAF000] active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#D9D9D9] hover:text-[#F7F7F7] hover:bg-white/[0.04]',
  }[variant];

  return (
    <button
      className={`
        inline-flex items-center justify-center font-['Sora']
        rounded-[9999px] cursor-pointer select-none transition-all duration-250 ease-out
        focus-visible:outline-2 focus-visible:outline-[#CAF000] focus-visible:outline-offset-3
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${fullWidth ? 'w-full' : ''}
        ${sizeClasses}
        ${variantClasses}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{iconRight}</span>}
    </button>
  );
};
