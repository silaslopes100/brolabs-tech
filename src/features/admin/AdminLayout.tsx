/**
 * Arquivo: AdminLayout.tsx
 * Responsabilidade: layout denso e funcional do painel administrativo da BROLABS TECH (sem a moldura 3D do site público, com noindex/nofollow e header operacional).
 * Dados: tokens.css
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, AdminUser } from '../../lib/api';
import { Logo } from '../../components/brand/Logo';
import { LogOut, ExternalLink, Plus, FolderKanban } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = 'Gestão de Projetos',
  actionButton,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Garante meta tags noindex, nofollow no painel
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  // Checagem de autenticação
  useEffect(() => {
    let isMounted = true;
    api
      .getMe()
      .then((admin) => {
        if (!isMounted) return;
        if (!admin) {
          navigate('/admin/login');
        } else {
          setUser(admin);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) navigate('/admin/login');
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-[#D9D9D9]/50 text-xs font-['Inter']">
        Autenticando sessão administrativa...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F7F7F7] flex flex-col font-['Inter']">
      
      {/* ===== BARRA SUPERIOR ADMINISTRATIVA ===== */}
      <header className="h-16 border-b border-[rgba(247,247,247,0.1)] bg-[#0F0F0F] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <a href="/admin" className="flex items-center gap-2">
            <Logo variant="horizontal" size="sm" />
          </a>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-['Sora'] font-bold bg-[#CAF000]/10 text-[#CAF000] border border-[#CAF000]/30 uppercase">
            Painel Admin
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#D9D9D9]/70 hover:text-[#CAF000] transition-colors"
          >
            <span>Ver site público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-['Sora'] font-semibold text-[#F7F7F7]">
                {user?.name || 'Administrador'}
              </span>
              <span className="block text-[10px] text-[#D9D9D9]/50">
                {user?.email || 'admin@brolabs.tech'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Encerrar sessão"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#D9D9D9]/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== CABEÇALHO DO CONTEÚDO ===== */}
      <div className="bg-[#0F0F0F]/60 border-b border-[rgba(247,247,247,0.06)] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Sora'] text-[#F7F7F7]">
              {title}
            </h1>
            <p className="text-xs text-[#D9D9D9]/60 mt-1">
              Gerencie a visibilidade dos cases na Home, ordem de exibição e estudos de caso.
            </p>
          </div>

          {actionButton && <div>{actionButton}</div>}
        </div>
      </div>

      {/* ===== CORPO DA PÁGINA ADMIN ===== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {children}
      </main>

    </div>
  );
};
