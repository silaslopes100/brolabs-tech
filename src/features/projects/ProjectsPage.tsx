/**
 * Arquivo: ProjectsPage.tsx
 * Responsabilidade: página de catálogo de projetos (/projetos) com abas de filtro por categoria, busca textual, contadores e respeito à constante PROJECTS_PAGE_INCLUDES_HOME_ITEMS.
 * Dados: api.getProjects(), SITE_CONFIG em content/site.ts
 */

import React, { useEffect, useState, useMemo } from 'react';
import { api, Project, ProjectCategory } from '../../lib/api';
import { SITE_CONFIG } from '../../content/site';
import { ProjectCard } from './ProjectCard';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .getProjects({ home: false, limit: 100 })
      .then((data) => {
        if (!isMounted) return;

        // Regra editorial da Seção 8:
        // Se PROJECTS_PAGE_INCLUDES_HOME_ITEMS for false, exibe apenas os que NÃO estão na home.
        let eligible = data;
        if (!SITE_CONFIG.PROJECTS_PAGE_INCLUDES_HOME_ITEMS) {
          eligible = data.filter((p) => !p.show_on_home);
        }

        setAllProjects(eligible);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { slug: 'todos', name: 'Todos' },
    { slug: 'sistemas', name: 'Sistemas' },
    { slug: 'automacoes', name: 'Automações' },
    { slug: 'sites', name: 'Sites' },
    { slug: 'design', name: 'Design' },
    { slug: 'diagramacao', name: 'Diagramação' },
  ];

  // Cálculo da contagem por categoria para as abas
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: allProjects.length };
    categories.forEach((cat) => {
      if (cat.slug !== 'todos') {
        counts[cat.slug] = allProjects.filter((p) => p.category === cat.slug).length;
      }
    });
    return counts;
  }, [allProjects]);

  // Filtro composto (categoria + termo de busca)
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'todos' || project.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        (project.client && project.client.toLowerCase().includes(q)) ||
        (project.technologies && project.technologies.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [allProjects, selectedCategory, searchQuery]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16">
      
      {/* ===== CABEÇALHO DA PÁGINA ===== */}
      <div className="max-w-4xl mb-10 sm:mb-14">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-['Sora'] text-[#D9D9D9]/70 hover:text-[#CAF000] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Início</span>
        </a>

        <div className="inline-flex items-center gap-2 text-xs font-['Sora'] font-bold text-[#CAF000] tracking-widest uppercase mb-3">
          <span>PORTFÓLIO DE PROJETOS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-['Sora'] text-[#F7F7F7] tracking-tight">
          Cases, sistemas e arquiteturas de marca.
        </h1>

        <p className="text-sm sm:text-base text-[#D9D9D9]/75 font-['Inter'] mt-3 leading-relaxed max-w-2xl">
          Navegue pelas soluções que construímos para clientes de tecnologia, indústria e serviços. Filtre por área de atuação ou busque por termos de interesse.
        </p>
      </div>

      {/* ===== CONTROLES: ABAS DE CATEGORIA E CAMPO DE BUSCA ===== */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-8 mb-8 border-b border-[rgba(247,247,247,0.08)]">
        
        {/* Abas interativas de categoria com botões funcionais */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const count = categoryCounts[cat.slug] || 0;
            const isActive = selectedCategory === cat.slug;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`
                  inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-['Sora'] font-medium
                  transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#CAF000] text-[#080808] font-bold shadow-sm'
                      : 'bg-[#161616] text-[#D9D9D9] border border-[rgba(247,247,247,0.1)] hover:border-[#CAF000]/40 hover:text-[#F7F7F7]'
                  }
                `}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#080808]/20 text-[#080808]' : 'bg-white/5 text-[#D9D9D9]/50'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Campo de busca textual */}
        <div className="relative min-w-[260px] sm:min-w-[300px]">
          <Search className="w-4 h-4 text-[#D9D9D9]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome, cliente ou stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none focus:ring-1 focus:ring-[#CAF000] placeholder:text-[#D9D9D9]/40"
          />
        </div>

      </div>

      {/* ===== LISTAGEM DE PROJETOS ===== */}
      {loading ? (
        <div className="py-20 text-center text-[#D9D9D9]/50 text-sm font-['Inter']">
          Carregando projetos...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#161616] border border-white/10 flex items-center justify-center mx-auto text-[#CAF000]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-['Sora'] text-[#F7F7F7]">
            Nenhum projeto encontrado
          </h3>
          <p className="text-xs text-[#D9D9D9]/60 font-['Inter']">
            Tente selecionar outra categoria ou limpar os termos da busca.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('todos');
              setSearchQuery('');
            }}
            className="text-xs text-[#CAF000] underline font-['Sora'] pt-2"
          >
            Ver todos os projetos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </div>
  );
};
