/**
 * Arquivo: ProjectCard.tsx
 * Responsabilidade: card de apresentação de projeto na listagem geral (/projetos) com capa cinematográfica, metadados unboxed e microinterações.
 * Dados: types.ts
 */

import React from 'react';
import { Project } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <a href={`/projetos/${project.slug}`} className="group block h-full">
      <Card
        variant="surface-1"
        rounded="xl"
        hoverEffect
        className="h-full flex flex-col justify-between p-6 sm:p-7 border border-[rgba(247,247,247,0.1)] transition-all duration-300 hover:border-[#CAF000]/40"
      >
        <div>
          {/* Topo com categoria, ano e seta giratória */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-[#D9D9D9]/70 font-['Sora']">
              <span className="text-[#CAF000] font-bold uppercase tracking-wider text-[11px]">
                {project.category_label || project.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.year}</span>
              {project.client && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#D9D9D9]/50">{project.client}</span>
                </>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#D9D9D9] group-hover:bg-[#CAF000] group-hover:border-[#CAF000] group-hover:text-[#080808] transition-all duration-200">
              <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover:rotate-45 transition-transform duration-200" />
            </div>
          </div>

          {/* Imagem de Capa */}
          <div className="my-3 h-48 sm:h-52 w-full rounded-[20px] overflow-hidden relative bg-[#161616]">
            {project.cover_image ? (
              <img
                src={project.cover_image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover filter grayscale-[18%] contrast-[1.08] transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>

          {/* Título e Resumo */}
          <div className="space-y-2 mt-4">
            <h3 className="text-xl sm:text-2xl font-bold font-['Sora'] text-[#F7F7F7] group-hover:text-[#CAF000] transition-colors duration-250 leading-snug">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#D9D9D9]/75 font-['Inter'] line-clamp-3 leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>

        {/* Tecnologias unboxed no rodapé do card */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="pt-5 mt-4 border-t border-[rgba(247,247,247,0.06)] flex flex-wrap items-center gap-1.5 text-[11px] text-[#D9D9D9]/50 font-['Inter']">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span key={tech} className="inline-flex items-center gap-1.5">
                <span>{tech}</span>
                {i < Math.min(project.technologies.length, 4) - 1 && <span>·</span>}
              </span>
            ))}
          </div>
        )}
      </Card>
    </a>
  );
};
