/**
 * Arquivo: ProjectDetail.tsx
 * Responsabilidade: página de estudo de caso detalhado (/projetos/:slug) com breadcrumbs, galeria, metadados e CTA para contato.
 * Dados: api.getProjectBySlug(slug)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Project } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, ArrowUpRight, ExternalLink, Calendar, Building, Layers } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);

    api
      .getProjectBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setProject(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full py-32 text-center text-[#D9D9D9]/50 font-['Inter'] text-sm">
        Carregando detalhes do projeto...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full px-4 sm:px-8 py-24 text-center max-w-lg mx-auto space-y-4">
        <h2 className="text-2xl font-bold font-['Sora'] text-[#F7F7F7]">
          Projeto não encontrado
        </h2>
        <p className="text-xs sm:text-sm text-[#D9D9D9]/70 font-['Inter']">
          O projeto que você está procurando pode ter sido arquivado ou o link está incorreto.
        </p>
        <div className="pt-4">
          <Button variant="outline" size="md" onClick={() => navigate('/projetos')}>
            Voltar para todos os projetos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16 max-w-5xl mx-auto">
      
      {/* ===== BREADCRUMB E BOTÃO VOLTAR ===== */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate('/projetos')}
          className="inline-flex items-center gap-2 text-xs font-['Sora'] text-[#D9D9D9]/70 hover:text-[#CAF000] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Projetos</span>
        </button>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-[#D9D9D9]/50 font-['Inter']">
          <a href="/" className="hover:text-[#F7F7F7]">Início</a>
          <span>/</span>
          <a href="/projetos" className="hover:text-[#F7F7F7]">Projetos</a>
          <span>/</span>
          <span className="text-[#CAF000] font-medium truncate max-w-[200px]">{project.title}</span>
        </nav>
      </div>

      {/* ===== CABEÇALHO DO ESTUDO DE CASO ===== */}
      <header className="space-y-6 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[rgba(247,247,247,0.12)] text-xs font-['Sora'] font-semibold text-[#CAF000] uppercase tracking-wider">
          {project.category_label || project.category}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-['Sora'] text-[#F7F7F7] leading-tight tracking-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-xl text-[#D9D9D9]/85 font-['Inter'] leading-relaxed max-w-3xl">
          {project.summary}
        </p>

        {/* METADADOS DO PROJETO EM BARRAS DE ESTILO BENTO */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-b border-[rgba(247,247,247,0.08)] py-5 font-['Inter']">
          <div>
            <span className="block text-[11px] text-[#D9D9D9]/50 font-medium">Categoria</span>
            <span className="text-xs sm:text-sm font-semibold font-['Sora'] text-[#F7F7F7] mt-0.5 block">
              {project.category_label || project.category}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-[#D9D9D9]/50 font-medium">Ano de Execução</span>
            <span className="text-xs sm:text-sm font-semibold font-['Sora'] text-[#F7F7F7] mt-0.5 block">
              {project.year}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-[#D9D9D9]/50 font-medium">Cliente / Parceria</span>
            <span className="text-xs sm:text-sm font-semibold font-['Sora'] text-[#F7F7F7] mt-0.5 block">
              {project.client || 'BROLABS Tech'}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-[#D9D9D9]/50 font-medium">Status</span>
            <span className="text-xs sm:text-sm font-semibold font-['Sora'] text-[#CAF000] mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CAF000]" />
              Em Produção
            </span>
          </div>
        </div>

        {/* Botão de Link Externo se configurado */}
        {project.external_url && (
          <div className="pt-2">
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] border border-[rgba(247,247,247,0.18)] text-xs font-['Sora'] font-semibold text-[#F7F7F7] hover:border-[#CAF000] hover:text-[#CAF000] transition-colors"
            >
              <span>Visitar projeto em produção</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </header>

      {/* ===== IMAGEM PRINCIPAL DE CAPA ===== */}
      <div className="w-full rounded-[28px] overflow-hidden border border-[rgba(247,247,247,0.12)] bg-[#161616] mb-12 sm:mb-16">
        <img
          src={project.cover_image}
          alt={`Capa do projeto ${project.title}`}
          className="w-full h-auto max-h-[580px] object-cover filter contrast-[1.05]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* ===== ESTUDO DE CASO: TEXTO DETALHADO E STACK ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
        
        {/* Coluna Principal: Estudo de Caso */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-[#F7F7F7]">
            Visão Geral e Desafios
          </h2>
          
          <div className="prose prose-invert max-w-none text-[#D9D9D9]/85 text-sm sm:text-base font-['Inter'] leading-relaxed space-y-4">
            <p>{project.description}</p>
          </div>
        </div>

        {/* Coluna Lateral: Tecnologias e Metadados */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="surface-2" rounded="xl" className="p-6 border border-[rgba(247,247,247,0.1)]">
            <h3 className="text-sm font-bold font-['Sora'] text-[#CAF000] uppercase tracking-wider mb-4">
              Tecnologias Utilizadas
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-[#0F0F0F] border border-white/5 text-xs font-['Inter'] text-[#D9D9D9]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* ===== GALERIA DE TELAS (SE HOUVER MAIS DE UMA IMAGEM) ===== */}
      {project.gallery && project.gallery.length > 1 && (
        <div className="space-y-6 mb-16 pt-8 border-t border-[rgba(247,247,247,0.08)]">
          <h2 className="text-xl sm:text-2xl font-bold font-['Sora'] text-[#F7F7F7]">
            Galeria do Projeto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((imgUrl, i) => (
              <div
                key={i}
                className="rounded-[20px] overflow-hidden border border-[rgba(247,247,247,0.1)] bg-[#161616]"
              >
                <img
                  src={imgUrl}
                  alt={`Tela ${i + 1} de ${project.title}`}
                  loading="lazy"
                  className="w-full h-64 object-cover filter contrast-[1.05] hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== CTA FINAL DE CONVERSÃO ===== */}
      <div className="p-8 sm:p-12 rounded-[28px] bg-gradient-to-br from-[#161616] to-[#0F0F0F] border border-[rgba(202,240,0,0.3)] text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-[#F7F7F7]">
          Gostou deste resultado?
        </h3>
        <p className="text-xs sm:text-sm text-[#D9D9D9]/80 font-['Inter'] max-w-xl mx-auto leading-relaxed">
          Podemos desenvolver uma solução com o mesmo rigor técnico e design de impacto para o seu negócio.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => (window.location.href = '/#contato')}
            iconRight={<ArrowUpRight className="w-4 h-4" />}
          >
            Iniciar uma conversa
          </Button>
        </div>
      </div>

    </article>
  );
};
