/**
 * Arquivo: Footer.tsx
 * Responsabilidade: rodapé institucional em barra de pílulas (Seção 4: Política de Privacidade à esquerda, direitos autorais ao centro, ícones sociais à direita).
 * Dados: content/site.ts
 */

import React from 'react';
import { SITE_CONFIG } from '../../content/site';
import { Instagram, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-10 sm:pt-16 mt-auto">
      {/* ===== [SEÇÃO: BARRA DE PÍLULAS DO RODAPÉ (REF-A/REF-B)] ===== */}
      <div
        className="
          mx-auto max-w-5xl py-3 px-4 sm:px-6
          bg-[#0F0F0F]/80 backdrop-blur-md
          rounded-full border border-[rgba(247,247,247,0.12)]
          flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4
          text-xs text-[#D9D9D9]/70 font-['Inter']
        "
      >
        {/* Pílula 'Política de Privacidade' à esquerda */}
        <div className="flex items-center">
          <a
            href="/privacidade"
            className="
              px-3.5 py-1.5 rounded-full
              border border-[rgba(247,247,247,0.1)]
              hover:border-[#CAF000] hover:text-[#CAF000]
              transition-colors duration-200 text-[11px] font-['Sora']
            "
          >
            Política de Privacidade
          </a>
        </div>

        {/* Direitos autorais ao centro */}
        <div className="text-center text-[11px] sm:text-xs text-[#D9D9D9]/60">
          <span>© All rights reserved {currentYear} · </span>
          <span className="font-['Sora'] font-semibold text-[#F7F7F7]">BROLABS TECH</span>
        </div>

        {/* Ícones sociais em círculos à direita */}
        <div className="flex items-center gap-2">
          {SITE_CONFIG.social.instagram && (
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da BROLABS TECH"
              className="
                w-7 h-7 rounded-full flex items-center justify-center
                border border-[rgba(247,247,247,0.14)]
                text-[#D9D9D9] hover:text-[#080808] hover:bg-[#CAF000] hover:border-[#CAF000]
                transition-all duration-200
              "
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          )}

          {SITE_CONFIG.social.linkedin && (
            <a
              href={SITE_CONFIG.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn da BROLABS TECH"
              className="
                w-7 h-7 rounded-full flex items-center justify-center
                border border-[rgba(247,247,247,0.14)]
                text-[#D9D9D9] hover:text-[#080808] hover:bg-[#CAF000] hover:border-[#CAF000]
                transition-all duration-200
              "
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}

          {SITE_CONFIG.social.github && (
            <a
              href={SITE_CONFIG.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub da BROLABS TECH"
              className="
                w-7 h-7 rounded-full flex items-center justify-center
                border border-[rgba(247,247,247,0.14)]
                text-[#D9D9D9] hover:text-[#080808] hover:bg-[#CAF000] hover:border-[#CAF000]
                transition-all duration-200
              "
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
