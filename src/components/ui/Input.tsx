/**
 * Arquivo: Input.tsx
 * Responsabilidade: componentes acessíveis de entrada de texto, seleção e área de texto com estilos nos tokens da marca.
 * Dados: tokens.css
 */

import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & BaseInputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 rounded-[12px] bg-[#161616] text-[#F7F7F7]
          border border-[rgba(247,247,247,0.12)] text-sm
          placeholder:text-[#D9D9D9]/40
          transition-colors duration-200
          focus:border-[#CAF000] focus:outline-none focus:ring-1 focus:ring-[#CAF000]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/80 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-400 font-medium" role="alert">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[#D9D9D9]/60">{helperText}</span>
      ) : null}
    </div>
  );
};

export const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement> & BaseInputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  rows = 4,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-[12px] bg-[#161616] text-[#F7F7F7]
          border border-[rgba(247,247,247,0.12)] text-sm
          placeholder:text-[#D9D9D9]/40
          transition-colors duration-200
          focus:border-[#CAF000] focus:outline-none focus:ring-1 focus:ring-[#CAF000]
          disabled:opacity-50 disabled:cursor-not-allowed resize-y
          ${error ? 'border-red-500/80 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-400 font-medium" role="alert">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[#D9D9D9]/60">{helperText}</span>
      ) : null}
    </div>
  );
};

export const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement> & BaseInputProps & {
  options: Array<{ value: string; label: string }>;
}> = ({
  label,
  error,
  helperText,
  options,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`
          w-full px-4 py-3 rounded-[12px] bg-[#161616] text-[#F7F7F7]
          border border-[rgba(247,247,247,0.12)] text-sm
          transition-colors duration-200
          focus:border-[#CAF000] focus:outline-none focus:ring-1 focus:ring-[#CAF000]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/80 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#161616] text-[#F7F7F7]">
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-xs text-red-400 font-medium" role="alert">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[#D9D9D9]/60">{helperText}</span>
      ) : null}
    </div>
  );
};
