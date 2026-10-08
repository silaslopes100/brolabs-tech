/**
 * Arquivo: mockClient.ts
 * Responsabilidade: cliente de API simulado com persistência em localStorage e memória para funcionamento autônomo.
 * Dados: mockData.ts
 * Como editar: altere os dados iniciais em mockData.ts ou adicione métodos se expandir a interface.
 */

import {
  ApiClientInterface,
  Project,
  CategorySummary,
  ContactPayload,
  ContactResult,
  AdminUser,
  AuthResult,
  ProjectFormData,
} from './types';
import { INITIAL_MOCK_PROJECTS } from './mockData';

const STORAGE_KEY = 'brolabs_projects_store';
const AUTH_KEY = 'brolabs_auth_session';

function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_PROJECTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_PROJECTS));
    return INITIAL_MOCK_PROJECTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_PROJECTS;
  }
}

function saveProjects(projects: Project[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
}

const CATEGORY_NAMES: Record<string, string> = {
  sistemas: 'Sistemas',
  automacoes: 'Automações',
  sites: 'Sites',
  design: 'Design',
  diagramacao: 'Diagramação',
};

export const mockClient: ApiClientInterface = {
  async getProjects({ home = false, category, limit = 20 } = {}): Promise<Project[]> {
    const list = getStoredProjects().filter((p) => p.is_published);

    if (home) {
      // Regra da Home: apenas publicados com show_on_home = true, ordenados por home_order
      return list
        .filter((p) => p.show_on_home)
        .sort((a, b) => a.home_order - b.home_order)
        .slice(0, Math.min(limit, 6));
    }

    let filtered = list;
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const found = getStoredProjects().find((p) => p.slug === slug && p.is_published);
    if (!found) {
      throw new Error(`Projeto com slug "${slug}" não encontrado.`);
    }
    return found;
  },

  async getCategories(): Promise<CategorySummary[]> {
    const list = getStoredProjects().filter((p) => p.is_published);
    const slugs = ['sistemas', 'automacoes', 'sites', 'design', 'diagramacao'] as const;

    return slugs.map((slug) => {
      const count = list.filter((p) => p.category === slug).length;
      return {
        slug,
        name: CATEGORY_NAMES[slug] || slug,
        count,
      };
    });
  },

  async sendContact(payload: ContactPayload): Promise<ContactResult> {
    // Simula delay de rede realista
    await new Promise((res) => setTimeout(res, 400));

    if (payload.honeypot && payload.honeypot.trim()) {
      return {
        success: true,
        message: 'Mensagem recebida com sucesso! Entraremos em contato em breve.',
        received_at: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'Mensagem recebida com sucesso! Nossa equipe analisará sua ideia e retornará em breve.',
      received_at: new Date().toISOString(),
    };
  },

  async login(email: string, password: string): Promise<AuthResult> {
    await new Promise((res) => setTimeout(res, 300));
    // Validação de credencial de desenvolvimento
    if (email.toLowerCase().includes('admin') || password.length >= 6) {
      const user: AdminUser = {
        id: 1,
        email,
        name: 'Silas / Marcos (Admin)',
        is_active: true,
        is_superuser: true,
        created_at: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      }
      return {
        access_token: 'mock_jwt_token_brolabs_preview_mode',
        token_type: 'bearer',
        expires_in_minutes: 1440,
      };
    }
    throw new Error('E-mail ou senha inválidos.');
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  async getMe(): Promise<AdminUser | null> {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async getAdminProjects({ search, category } = {}): Promise<Project[]> {
    let list = getStoredProjects();
    if (search) {
      const term = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.summary.toLowerCase().includes(term) ||
          (p.client && p.client.toLowerCase().includes(term))
      );
    }
    if (category) {
      list = list.filter((p) => p.category === category);
    }
    return list.sort((a, b) => a.home_order - b.home_order);
  },

  async getAdminProjectById(id: number): Promise<Project> {
    const found = getStoredProjects().find((p) => p.id === id);
    if (!found) throw new Error('Projeto não encontrado.');
    return found;
  },

  async createProject(data: ProjectFormData): Promise<Project> {
    const list = getStoredProjects();
    const newId = list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .trim();

    const newProject: Project = {
      id: newId,
      title: data.title,
      slug,
      category: data.category,
      category_label: CATEGORY_NAMES[data.category] || data.category,
      summary: data.summary,
      description: data.description,
      cover_image: data.cover_image,
      gallery: data.gallery || [data.cover_image],
      technologies: data.technologies || [],
      client: data.client,
      year: data.year || new Date().getFullYear(),
      external_url: data.external_url,
      show_on_home: data.show_on_home ?? false,
      home_order: data.home_order ?? list.length + 1,
      is_published: data.is_published ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newProject, ...list];
    saveProjects(updated);
    return newProject;
  },

  async updateProject(id: number, data: Partial<ProjectFormData>): Promise<Project> {
    const list = getStoredProjects();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Projeto não encontrado.');

    const current = list[index];
    const updatedProject: Project = {
      ...current,
      ...data,
      category_label: data.category ? CATEGORY_NAMES[data.category] : current.category_label,
      updated_at: new Date().toISOString(),
    };

    list[index] = updatedProject;
    saveProjects(list);
    return updatedProject;
  },

  async deleteProject(id: number): Promise<void> {
    const list = getStoredProjects().filter((p) => p.id !== id);
    saveProjects(list);
  },

  async toggleHome(id: number, show_on_home: boolean): Promise<Project> {
    return this.updateProject(id, { show_on_home });
  },

  async reorderProjects(items: Array<{ id: number; home_order: number }>): Promise<void> {
    const list = getStoredProjects();
    items.forEach((item) => {
      const project = list.find((p) => p.id === item.id);
      if (project) {
        project.home_order = item.home_order;
      }
    });
    saveProjects(list);
  },

  async uploadImage(file: File): Promise<{ url: string; '800w'?: string; '1600w'?: string }> {
    // No modo mock, gera Data URL para pré-visualização instantânea
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        resolve({
          url: resultUrl,
          '800w': resultUrl,
          '1600w': resultUrl,
        });
      };
      reader.readAsDataURL(file);
    });
  },
};
