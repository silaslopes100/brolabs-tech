/**
 * Arquivo: ProjectsTable.tsx
 * Responsabilidade: tabela de gerenciamento de projetos com busca, filtros, toggle inline de Home e Publicado, reordenação acessível por teclado e modal de confirmação de exclusão.
 * Dados: api.getAdminProjects(), api.toggleHome(), api.updateProject(), api.reorderProjects(), api.deleteProject()
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Project } from '../../lib/api';
import { AdminLayout } from './AdminLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export const ProjectsTable: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [loading, setLoading] = useState(true);

  // Estado para modal de exclusão
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadProjects = async () => {
    try {
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch {
      // Ignora erro se sessão expirar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Toggle rápido de Exibição na Home
  const handleToggleHome = async (project: Project) => {
    const nextState = !project.show_on_home;
    // Otimista
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, show_on_home: nextState } : p))
    );
    try {
      await api.toggleHome(project.id, nextState);
    } catch {
      // Reverte em caso de falha
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, show_on_home: !nextState } : p))
      );
    }
  };

  // Toggle rápido de Publicação
  const handleTogglePublished = async (project: Project) => {
    const nextState = !project.is_published;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, is_published: nextState } : p))
    );
    try {
      await api.updateProject(project.id, { is_published: nextState });
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_published: !nextState } : p))
      );
    }
  };

  // Reordenação acessível por teclado (Subir / Descer)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const homeProjects = [...projects].filter((p) => p.show_on_home);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= homeProjects.length) return;

    // Troca as posições
    const current = homeProjects[index];
    const target = homeProjects[targetIdx];

    const tempOrder = current.home_order;
    current.home_order = target.home_order;
    target.home_order = tempOrder;

    // Se as ordens forem iguais, atribui sequência 1 e 2
    if (current.home_order === target.home_order) {
      if (direction === 'up') {
        current.home_order -= 1;
      } else {
        current.home_order += 1;
      }
    }

    const reorderPayload = homeProjects.map((p, i) => ({
      id: p.id,
      home_order: i + 1,
    }));

    // Atualiza estado local
    const updatedMap = new Map(reorderPayload.map((item) => [item.id, item.home_order]));
    setProjects((prev) =>
      prev
        .map((p) => (updatedMap.has(p.id) ? { ...p, home_order: updatedMap.get(p.id)! } : p))
        .sort((a, b) => a.home_order - b.home_order)
    );

    try {
      await api.reorderProjects(reorderPayload);
    } catch {
      loadProjects();
    }
  };

  // Exclusão definitiva após confirmação
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeleteLoading(true);
    try {
      await api.deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch {
      // Trata erro
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtros de busca e categoria
  const filtered = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'todos' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      (p.client && p.client.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const categories = [
    { slug: 'todos', label: 'Todas Categorias' },
    { slug: 'sistemas', label: 'Sistemas' },
    { slug: 'automacoes', label: 'Automações' },
    { slug: 'sites', label: 'Sites' },
    { slug: 'design', label: 'Design' },
    { slug: 'diagramacao', label: 'Diagramação' },
  ];

  return (
    <AdminLayout
      title="Gestão de Projetos"
      actionButton={
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/admin/projetos/novo')}
          iconLeft={<Plus className="w-4 h-4" />}
        >
          Novo Projeto
        </Button>
      }
    >
      {/* ===== CONTROLES DE FILTRO E PESQUISA ===== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#D9D9D9]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por título ou cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#161616] text-xs font-['Inter'] text-[#F7F7F7] border border-[rgba(247,247,247,0.12)] focus:border-[#CAF000] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug} className="bg-[#161616]">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#D9D9D9]/60 font-['Sora'] self-end sm:self-center">
          Total de {filtered.length} projeto(s) encontrado(s)
        </div>

      </div>

      {/* ===== TABELA DE PROJETOS ===== */}
      <Card variant="surface-1" rounded="lg" className="border border-[rgba(247,247,247,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[rgba(247,247,247,0.08)] bg-[#161616]/70 text-[#D9D9D9]/70 font-['Sora']">
                <th className="py-3 px-4 w-14">Capa</th>
                <th className="py-3 px-4">Título & Estudo de Caso</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4 text-center">Mostrar na Home</th>
                <th className="py-3 px-4 text-center">Ordem Home</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(247,247,247,0.06)] font-['Inter']">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#D9D9D9]/50">
                    Carregando base de projetos...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#D9D9D9]/50">
                    Nenhum projeto encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filtered.map((project, idx) => (
                  <tr
                    key={project.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Capa miniatura */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#2D2D2D]/50 border border-white/5 flex items-center justify-center shrink-0">
                        {project.cover_image ? (
                          <img
                            src={project.cover_image}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-[10px] text-[#D9D9D9]/40">S/ capa</span>
                        )}
                      </div>
                    </td>

                    {/* Título & Cliente */}
                    <td className="py-3 px-4">
                      <div className="font-['Sora'] font-semibold text-[#F7F7F7] text-sm">
                        {project.title}
                      </div>
                      <div className="text-[11px] text-[#D9D9D9]/50 flex items-center gap-2 mt-0.5">
                        <span>slug: /{project.slug}</span>
                        {project.client && (
                          <>
                            <span>·</span>
                            <span>Cliente: {project.client}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#161616] border border-white/10 text-[11px] font-['Sora'] font-medium text-[#CAF000]">
                        {project.category_label || project.category}
                      </span>
                    </td>

                    {/* Toggle Mostrar na Home */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleHome(project)}
                        title={project.show_on_home ? 'Remover da Home' : 'Destacar na Home'}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-['Sora'] font-semibold cursor-pointer transition-colors
                          ${
                            project.show_on_home
                              ? 'bg-[#CAF000]/15 text-[#CAF000] border border-[#CAF000]/40'
                              : 'bg-white/5 text-[#D9D9D9]/40 border border-white/10 hover:text-[#D9D9D9]'
                          }
                        `}
                      >
                        {project.show_on_home ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Na Home</span>
                          </>
                        ) : (
                          <span>Oculto</span>
                        )}
                      </button>
                    </td>

                    {/* Reordenação Home (Acessível por teclado) */}
                    <td className="py-3 px-4 text-center">
                      {project.show_on_home ? (
                        <div className="inline-flex items-center gap-1">
                          <span className="w-6 text-center font-['Sora'] font-bold text-[#CAF000]">
                            #{project.home_order}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(idx, 'up')}
                            aria-label={`Mover ${project.title} para cima`}
                            className="p-1 rounded bg-white/5 hover:bg-[#CAF000] hover:text-[#080808] text-[#D9D9D9] transition-colors"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(idx, 'down')}
                            aria-label={`Mover ${project.title} para baixo`}
                            className="p-1 rounded bg-white/5 hover:bg-[#CAF000] hover:text-[#080808] text-[#D9D9D9] transition-colors"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#D9D9D9]/30">—</span>
                      )}
                    </td>

                    {/* Status de Publicação */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(project)}
                        className={`
                          px-2.5 py-1 rounded-full text-[11px] font-['Sora'] font-medium transition-colors
                          ${
                            project.is_published
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                              : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                          }
                        `}
                      >
                        {project.is_published ? 'Publicado' : 'Rascunho'}
                      </button>
                    </td>

                    {/* Ações (Editar, Excluir, Pré-visualizar) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/projetos/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Visualizar no site"
                          className="p-2 rounded-lg text-[#D9D9D9]/60 hover:text-[#CAF000] hover:bg-white/5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/projetos/${project.id}`)}
                          title="Editar projeto"
                          className="p-2 rounded-lg text-[#D9D9D9]/60 hover:text-[#F7F7F7] hover:bg-white/5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          title="Excluir projeto"
                          className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===== MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (ACESSÍVEL) ===== */}
      {projectToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full rounded-[24px] bg-[#161616] border border-red-500/30 p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 id="modal-delete-title" className="text-lg font-bold font-['Sora'] text-[#F7F7F7]">
                Excluir projeto definitivamente?
              </h3>
              <p className="text-xs text-[#D9D9D9]/80 font-['Inter'] leading-relaxed">
                Você está prestes a remover o projeto{' '}
                <strong className="text-[#F7F7F7]">"{projectToDelete.title}"</strong>. Essa ação é irreversível e o case deixará de existir no site público.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(247,247,247,0.08)]">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-full text-xs font-['Sora'] text-[#D9D9D9] hover:text-[#F7F7F7] bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full text-xs font-['Sora'] font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-sm"
              >
                {deleteLoading ? 'Excluindo...' : 'Sim, excluir projeto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
