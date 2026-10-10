/**
 * Arquivo: FeaturedProjects.tsx
 * Responsabilidade: seção dinâmica de Projetos em Destaque na Home (somente com show_on_home=true). Se não houver projetos marcados, a seção se auto-oculta completamente.
 * Dados: api.getProjects({ home: true })
 * Como editar: para incluir/remover projetos, acesse o painel /admin.
 */

import React, { useEffect, useState } from 'react';
import { api, Project } from '../../../lib/api';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowUpRight } from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api
      .getProjects({ home: true, limit: 6 })
      .then((data) => {
        if (isMounted) {
          setProjects(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Se estiver carregando ou não houver nenhum projeto selecionado para a home, não exibe placeholder falso
  if (loading) {
    return null;
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projetos-destaque" className="w-full px-4 sm:px-6 md:px-8 py-16 sm:py-24 border-t border-[rgba(247,247,247,0.08)]">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-['Sora'] font-bold text-[#CAF000] tracking-widest uppercase mb-3">
            <span>CASES DE SUCESSO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-['Sora'] text-[#F7F7F7] tracking-tight">
            Projetos construídos para o mundo real.
          </h2>
          <p className="text-sm sm:text-base text-[#D9D9D9]/75 font-['Inter'] mt-3 leading-relaxed">
            Conheça alguns dos produtos digitais, sistemas empresariais e arquiteturas de marca desenvolvidos pela nossa equipe.
          </p>
        </div>

        <div>
          <Button
            variant="outline"
            size="md"
            onClick={() => (window.location.href = '/projetos')}
            iconRight={<ArrowUpRight className="w-4 h-4" />}
          >
            Ver todos os projetos
          </Button>
        </div>
      </div>

      {/* Grid Bento de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, index) => {
          // O primeiro card ganha destaque mais largo em telas grandes se houver múltiplos
          const isFeaturedSpan = index === 0 && projects.length >= 3 ? 'md:col-span-2 lg:col-span-2' : 'col-span-1';

          return (
            <a
              key={project.id}
              href={`/projetos/${project.slug}`}
              className={`group block ${isFeaturedSpan}`}
            >
              <Card
                variant="surface-1"
                rounded="xl"
                hoverEffect
                className="h-full flex flex-col justify-between p-6 sm:p-8 min-h-[360px]"
              >
                {/* Topo do card com categoria e seta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs text-[#D9D9D9]/70 font-['Sora']">
                    <span className="text-[#CAF000] font-bold uppercase">{project.category_label || project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.year}</span>
                    {project.client && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{project.client}</span>
                      </>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-[#CAF000] group-hover:border-[#CAF000] group-hover:text-[#080808] transition-all duration-200">
                    <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover:rotate-45 transition-transform duration-200" />
                  </div>
                </div>

                {/* Imagem de capa tratada se existir */}
                <div className="my-4 h-44 sm:h-52 w-full rounded-[20px] overflow-hidden relative bg-[#161616]">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover filter grayscale-[20%] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80 pointer-events-none" />
                </div>

                {/* Conteúdo inferior */}
                <div className="space-y-2 mt-auto">
                  <h3 className="text-xl sm:text-2xl font-bold font-['Sora'] text-[#F7F7F7] group-hover:text-[#CAF000] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D9D9D9]/75 font-['Inter'] line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Tags unboxed com separadores tipográficos (Anti-AI slop rule) */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="pt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-[#D9D9D9]/50 font-['Inter']">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={tech} className="inline-flex items-center gap-1.5">
                          {tech}
                          {i < Math.min(project.technologies.length, 4) - 1 && <span>·</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </section>
  );
};
