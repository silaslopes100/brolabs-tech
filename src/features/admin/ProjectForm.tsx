/**
 * Arquivo: ProjectForm.tsx
 * Responsabilidade: formulário de cadastro e edição de projetos com validação Zod, upload de imagens (capa e galeria), contador de caracteres e preview em tempo real do card da Home.
 * Dados: api.createProject(), api.updateProject(), api.uploadImage()
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, ProjectCategory, Project } from '../../lib/api';
import { AdminLayout } from './AdminLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Upload, Image as ImageIcon, ArrowUpRight, Check, X } from 'lucide-react';

// ===== ESQUEMA DE VALIDAÇÃO ZOD =====
const projectSchema = z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres').max(200),
  slug: z.string().min(2, 'Slug obrigatório').max(220),
  category: z.enum(['sistemas', 'automacoes', 'sites', 'design', 'diagramacao'] as const),
  summary: z.string().min(10, 'Resumo muito curto').max(200, 'Máximo 200 caracteres'),
  description: z.string().min(20, 'Descrição detalhada obrigatória (mínimo 20 caracteres)'),
  cover_image: z.string().min(1, 'A imagem de capa é obrigatória'),
  client: z.string().optional(),
  year: z.number().int().min(2020).max(2035),
  external_url: z.string().url('URL inválida').optional().or(z.literal('')),
  show_on_home: z.boolean(),
  home_order: z.number().int().min(0),
  is_published: z.boolean(),
  technologiesText: z.string().optional(), // entrada separada por vírgula
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id && id !== 'novo');
  const projectId = isEditing ? parseInt(id!, 10) : null;

  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: 'sistemas',
      summary: '',
      description: '',
      cover_image: '',
      client: '',
      year: new Date().getFullYear(),
      external_url: '',
      show_on_home: false,
      home_order: 1,
      is_published: true,
      technologiesText: 'React, TypeScript, FastAPI',
    },
  });

  const watchedValues = watch();

  // Slug automático gerado do título se o slug estiver vazio
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val, { shouldValidate: true });
    if (!isEditing || !watchedValues.slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .trim();
      setValue('slug', generated, { shouldValidate: true });
    }
  };

  // Carrega dados se estiver no modo de edição
  useEffect(() => {
    if (!isEditing || !projectId) return;

    api
      .getAdminProjectById(projectId)
      .then((project) => {
        reset({
          title: project.title,
          slug: project.slug,
          category: project.category,
          summary: project.summary,
          description: project.description,
          cover_image: project.cover_image,
          client: project.client || '',
          year: project.year,
          external_url: project.external_url || '',
          show_on_home: project.show_on_home,
          home_order: project.home_order,
          is_published: project.is_published,
          technologiesText: project.technologies?.join(', ') || '',
        });
        setInitialLoading(false);
      })
      .catch(() => {
        navigate('/admin');
      });
  }, [isEditing, projectId, reset, navigate]);

  // Upload de capa
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);
    try {
      const res = await api.uploadImage(file);
      setValue('cover_image', res.url, { shouldValidate: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha no upload da imagem.';
      setUploadError(msg);
    } finally {
      setUploadLoading(false);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    setSubmitting(true);
    const techArray = (values.technologiesText || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: values.title,
      slug: values.slug,
      category: values.category as ProjectCategory,
      summary: values.summary,
      description: values.description,
      cover_image: values.cover_image,
      gallery: [values.cover_image],
      technologies: techArray,
      client: values.client || undefined,
      year: values.year,
      external_url: values.external_url || undefined,
      show_on_home: values.show_on_home,
      home_order: values.home_order,
      is_published: values.is_published,
    };

    try {
      if (isEditing && projectId) {
        await api.updateProject(projectId, payload);
      } else {
        await api.createProject(payload);
      }
      navigate('/admin');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar projeto.');
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Carregando projeto...">
        <div className="py-24 text-center text-[#D9D9D9]/50 text-xs">
          Carregando informações do projeto...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditing ? `Editar: ${watchedValues.title || 'Projeto'}` : 'Cadastrar Novo Projeto'}
      actionButton={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin')}
          iconLeft={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar para lista
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ===== COLUNA 1: FORMULÁRIO DE EDIÇÃO (7 COLS) ===== */}
        <div className="lg:col-span-7">
          <Card variant="surface-1" rounded="xl" className="p-6 sm:p-8 border border-[rgba(247,247,247,0.1)]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              
              {/* Título */}
              <div className="space-y-1.5">
                <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Plataforma SaaS de Conciliação"
                  value={watchedValues.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                />
                {errors.title && (
                  <p className="text-xs text-red-400">{errors.title.message}</p>
                )}
              </div>

              {/* Slug e Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                    Slug da URL *
                  </label>
                  <input
                    type="text"
                    {...register('slug')}
                    placeholder="ex: plataforma-saas"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                  />
                  {errors.slug && (
                    <p className="text-xs text-red-400">{errors.slug.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                    Categoria *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                  >
                    <option value="sistemas">Sistemas</option>
                    <option value="automacoes">Automações</option>
                    <option value="sites">Sites</option>
                    <option value="design">Design</option>
                    <option value="diagramacao">Diagramação</option>
                  </select>
                </div>
              </div>

              {/* Resumo com Contador de Caracteres */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                    Resumo do Card (máx. 200 caracteres) *
                  </label>
                  <span
                    className={`text-[11px] font-['Sora'] ${
                      (watchedValues.summary?.length || 0) > 190
                        ? 'text-amber-400'
                        : 'text-[#D9D9D9]/50'
                    }`}
                  >
                    {watchedValues.summary?.length || 0} / 200
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={200}
                  {...register('summary')}
                  placeholder="Descrição concisa para os cards da Home e listagem..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none resize-none"
                />
                {errors.summary && (
                  <p className="text-xs text-red-400">{errors.summary.message}</p>
                )}
              </div>

              {/* Descrição Longa */}
              <div className="space-y-1.5">
                <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                  Estudo de Caso Completo *
                </label>
                <textarea
                  rows={5}
                  {...register('description')}
                  placeholder="Detalhamento da solução, desafios superados e resultados atingidos..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none resize-y"
                />
                {errors.description && (
                  <p className="text-xs text-red-400">{errors.description.message}</p>
                )}
              </div>

              {/* Imagem de Capa e Upload */}
              <div className="space-y-2">
                <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                  Imagem de Capa *
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    {...register('cover_image')}
                    placeholder="URL ou envie um arquivo abaixo..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                  />
                  
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#CAF000] text-xs font-['Sora'] text-[#D9D9D9] hover:text-[#CAF000] transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadLoading ? 'Enviando...' : 'Fazer Upload'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploadLoading}
                    />
                  </label>
                </div>
                {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                {errors.cover_image && (
                  <p className="text-xs text-red-400">{errors.cover_image.message}</p>
                )}
              </div>

              {/* Metadados: Cliente, Ano, Tecnologias */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                    Cliente (opcional)
                  </label>
                  <input
                    type="text"
                    {...register('client')}
                    placeholder="Ex: Apex Fin"
                    className="w-full px-4 py-2 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                    Ano
                  </label>
                  <input
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    className="w-full px-4 py-2 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                    Link Externo (opcional)
                  </label>
                  <input
                    type="url"
                    {...register('external_url')}
                    placeholder="https://exemplo.com"
                    className="w-full px-4 py-2 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tecnologias (separadas por vírgula) */}
              <div className="space-y-1.5">
                <label className="text-xs font-['Sora'] font-medium text-[#D9D9D9]">
                  Tecnologias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  {...register('technologiesText')}
                  placeholder="React, TypeScript, FastAPI, PostgreSQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
                />
              </div>

              {/* Toggles da Home e Publicação */}
              <div className="p-4 rounded-xl bg-[#161616] border border-[rgba(247,247,247,0.08)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    id="show_on_home"
                    type="checkbox"
                    {...register('show_on_home')}
                    className="w-4 h-4 rounded text-[#CAF000] accent-[#CAF000] bg-[#0F0F0F]"
                  />
                  <label htmlFor="show_on_home" className="text-xs font-['Sora'] font-semibold text-[#F7F7F7]">
                    Mostrar na grade da Home
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="home_order" className="text-xs font-['Sora'] text-[#D9D9D9]/70">
                    Ordem na Home:
                  </label>
                  <input
                    id="home_order"
                    type="number"
                    min={0}
                    {...register('home_order', { valueAsNumber: true })}
                    className="w-16 px-2 py-1 rounded bg-[#0F0F0F] text-xs font-['Sora'] text-[#CAF000] text-center border border-white/10"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="is_published"
                    type="checkbox"
                    {...register('is_published')}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 bg-[#0F0F0F]"
                  />
                  <label htmlFor="is_published" className="text-xs font-['Sora'] font-semibold text-[#F7F7F7]">
                    Publicado
                  </label>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[rgba(247,247,247,0.08)]">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/admin')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting}
                >
                  {submitting ? 'Salvando projeto...' : isEditing ? 'Atualizar Projeto' : 'Cadastrar Projeto'}
                </Button>
              </div>

            </form>
          </Card>
        </div>

        {/* ===== COLUNA 2: PRÉ-VISUALIZAÇÃO DO CARD EM TEMPO REAL (5 COLS) ===== */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['Sora'] font-bold text-[#CAF000] uppercase tracking-wider">
              PRÉ-VISUALIZAÇÃO AO VIVO
            </span>
            <span className="text-[11px] text-[#D9D9D9]/50 font-['Inter']">
              Como aparecerá na Home
            </span>
          </div>

          {/* Card Mock da Home */}
          <Card
            variant="surface-1"
            rounded="xl"
            hoverEffect
            className="p-6 border border-[rgba(247,247,247,0.12)] min-h-[360px] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-[#D9D9D9]/70 font-['Sora']">
                  <span className="text-[#CAF000] font-bold uppercase text-[11px]">
                    {watchedValues.category || 'sistemas'}
                  </span>
                  <span>·</span>
                  <span>{watchedValues.year || 2026}</span>
                  {watchedValues.client && (
                    <>
                      <span>·</span>
                      <span className="text-[#D9D9D9]/50">{watchedValues.client}</span>
                    </>
                  )}
                </div>

                <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#CAF000]">
                  <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                </div>
              </div>

              {/* Capa */}
              <div className="my-3 h-44 w-full rounded-[16px] overflow-hidden relative bg-[#161616]">
                {watchedValues.cover_image ? (
                  <img
                    src={watchedValues.cover_image}
                    alt=""
                    className="w-full h-full object-cover filter contrast-[1.05]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#D9D9D9]/30 gap-2">
                    <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                    <span className="text-[10px]">Sem imagem de capa</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>

              {/* Título e Resumo */}
              <div className="space-y-1.5 mt-2">
                <h3 className="text-xl font-bold font-['Sora'] text-[#F7F7F7]">
                  {watchedValues.title || 'Título do Projeto'}
                </h3>
                <p className="text-xs text-[#D9D9D9]/75 font-['Inter'] line-clamp-3 leading-relaxed">
                  {watchedValues.summary || 'Resumo do projeto exibido para os visitantes...'}
                </p>
              </div>
            </div>

            {/* Tecnologias */}
            <div className="pt-4 mt-3 border-t border-[rgba(247,247,247,0.06)] flex flex-wrap items-center gap-1.5 text-[10px] text-[#D9D9D9]/50 font-['Inter']">
              {(watchedValues.technologiesText || 'React, TypeScript')
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 4)
                .map((t, i, arr) => (
                  <span key={t}>
                    {t}
                    {i < arr.length - 1 && ' ·'}
                  </span>
                ))}
            </div>
          </Card>
        </div>

      </div>
    </AdminLayout>
  );
};
