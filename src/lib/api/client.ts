/**
 * Arquivo: client.ts
 * Responsabilidade: cliente HTTP real para comunicação com o backend FastAPI da BROLABS TECH.
 * Dados: VITE_API_URL
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
  ContactBriefingPayload,
  ContactBriefingResult,
} from './types';

const browserHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const browserProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
const defaultApiBase = import.meta.env.DEV
  ? `${browserProtocol}//${browserHost}:8000/api`
  : '/api';
const API_BASE = import.meta.env.VITE_API_URL || defaultApiBase;

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      credentials: 'include', // Envia e recebe cookies httpOnly
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar à API. Verifique se o backend está ativo e acessível pela rede.');
    }
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Erro na requisição (${response.status})`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export async function generateContactBriefing(
  payload: ContactBriefingPayload,
): Promise<ContactBriefingResult> {
  return fetchJson<ContactBriefingResult>('/contact/briefing', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export const realClient: ApiClientInterface = {
  async getProjects({ home = false, category, page = 1, limit = 20 } = {}): Promise<Project[]> {
    const params = new URLSearchParams();
    if (home) params.append('home', 'true');
    if (category) params.append('category', category);
    params.append('page', String(page));
    params.append('limit', String(limit));
    return fetchJson<Project[]>(`/projects?${params.toString()}`);
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    return fetchJson<Project>(`/projects/${slug}`);
  },

  async getCategories(): Promise<CategorySummary[]> {
    return fetchJson<CategorySummary[]>('/categories');
  },

  async sendContact(payload: ContactPayload): Promise<ContactResult> {
    return fetchJson<ContactResult>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(email: string, password: string): Promise<AuthResult> {
    return fetchJson<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<void> {
    await fetchJson('/auth/logout', { method: 'POST' });
  },

  async getMe(): Promise<AdminUser | null> {
    try {
      return await fetchJson<AdminUser>('/auth/me');
    } catch {
      return null;
    }
  },

  async getAdminProjects({ search, category } = {}): Promise<Project[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    return fetchJson<Project[]>(`/admin/projects?${params.toString()}`);
  },

  async getAdminProjectById(id: number): Promise<Project> {
    return fetchJson<Project>(`/admin/projects/${id}`);
  },

  async createProject(data: ProjectFormData): Promise<Project> {
    return fetchJson<Project>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id: number, data: Partial<ProjectFormData>): Promise<Project> {
    return fetchJson<Project>(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: number): Promise<void> {
    await fetchJson(`/admin/projects/${id}`, { method: 'DELETE' });
  },

  async toggleHome(id: number, show_on_home: boolean): Promise<Project> {
    return fetchJson<Project>(`/admin/projects/${id}/home`, {
      method: 'PATCH',
      body: JSON.stringify({ show_on_home }),
    });
  },

  async reorderProjects(items: Array<{ id: number; home_order: number }>): Promise<void> {
    await fetchJson('/admin/projects/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  },

  async uploadImage(file: File): Promise<{ url: string; '800w'?: string; '1600w'?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/admin/uploads`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Falha ao enviar imagem.');
    }

    return response.json();
  },
};
