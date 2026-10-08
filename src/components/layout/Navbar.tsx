/**
 * Arquivo: Navbar.tsx
 * Responsabilidade: barra de navegação em pílula flutuante interna ao contêiner; esconde ao rolar para baixo e reaparece ao subir.
 * Dados: content/site.ts
 * Como editar: adicione ou altere itens de navegação na lista navItems.
 */

import React, { useState, useEffect } from 'react';
import { Logo } from '../brand/Logo';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Controle inteligente de visibilidade ao rolar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Sempre visível no topo
      if (currentScrollY < 60) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 8) {
        // Rolando para baixo: recolhe
        setIsVisible(false);
      } else if (lastScrollY - currentScrollY > 8) {
        // Rolando para cima: exibe
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Itens de navegação solicitados no briefing
  const navItems = [
    { label: 'Serviços', href: '/#servicos' },
    { label: 'Projetos', href: '/projetos' },
    { label: 'Processo', href: '/#processo' },
    { label: 'Sobre', href: '/#sobre' },
    { label: 'Contato', href: '/#contato' },
  ];

  const scrollToContact = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('contato');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`
        sticky top-3 sm:top-5 z-50 w-full px-4 sm:px-6 md:px-8
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-24 pointer-events-none'}
      `}
    >
      {/* ===== [SEÇÃO: PÍLULA CENTRAL DA NAVBAR] ===== */}
      <nav
        aria-label="Navegação principal"
        className="
          mx-auto max-w-5xl h-14 sm:h-16 px-3 sm:px-4
          bg-[#0F0F0F]/85 backdrop-blur-md
          rounded-full border border-[rgba(247,247,247,0.12)]
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]
          flex items-center justify-between gap-2 pointer-events-auto
        "
      >
        {/* Logo em pílula à esquerda */}
        <div className="flex items-center">
          <a
            href="/"
            className="flex items-center px-2 py-1 rounded-full hover:opacity-90 transition-opacity"
            aria-label="Ir para página inicial da BROLABS TECH"
          >
            <Logo variant="horizontal" size="sm" />
          </a>
        </div>

        {/* Links de navegação em pílulas com borda fina (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`
                  px-3.5 py-1.5 rounded-full text-xs font-['Sora'] font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'text-[#CAF000] bg-white/[0.05] border border-[rgba(202,240,0,0.3)]'
                      : 'text-[#D9D9D9] border border-transparent hover:border-[rgba(247,247,247,0.14)] hover:text-[#F7F7F7] hover:bg-white/[0.03]'
                  }
                `}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Botão final 'Fale conosco' em pílula com contorno verde (hover: preenchimento verde) */}
        <div className="flex items-center gap-2">
          <a
            href="/#contato"
            onClick={scrollToContact}
            className="
              group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
              text-xs sm:text-xs font-['Sora'] font-semibold
              text-[#F7F7F7] border border-[#CAF000]
              bg-transparent transition-all duration-250 ease-out
              hover:bg-[#CAF000] hover:text-[#080808] active:scale-95
            "
          >
            <span>Fale conosco</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2] transition-transform duration-200 group-hover:rotate-45" />
          </a>

          {/* Botão Hamburger (Mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#D9D9D9] hover:text-[#CAF000] hover:bg-white/[0.05] transition-colors"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ===== [SEÇÃO: MENU MOBILE DROPDOWN] ===== */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-sm p-4 bg-[#0F0F0F]/95 backdrop-blur-lg rounded-[24px] border border-[rgba(247,247,247,0.14)] shadow-2xl flex flex-col gap-2 pointer-events-auto">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-['Sora'] font-medium text-[#D9D9D9] hover:text-[#CAF000] hover:bg-white/[0.04] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[rgba(247,247,247,0.08)]">
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-xs text-[#D9D9D9]/50 hover:text-[#D9D9D9]"
            >
              Acesso Restrito (Admin)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
