/**
 * Arquivo: types.ts
 * Responsabilidade: definições de tipo TypeScript compartilhadas entre a camada de API (real e mock) e os componentes.
 */

export type ProjectCategory = 'sistemas' | 'automacoes' | 'sites' | 'design' | 'diagramacao';

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: ProjectCategory;
  category_label?: string;
  summary: string;
  description: string;
  cover_image: string;
  gallery: string[];
  technologies: string[];
  client?: string;
  year: number;
  external_url?: string;
  show_on_home: boolean;
  home_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategorySummary {
  slug: ProjectCategory;
  name: string;
  count: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  interest: string;
  message: string;
  consent_lgpd: boolean;
  honeypot?: string;
}

export interface ContactResult {
  success: boolean;
  message: string;
  received_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface AuthResult {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
}

export interface ProjectFormData {
  title: string;
  slug?: string;
  category: ProjectCategory;
  summary: string;
  description: string;
  cover_image: string;
  gallery?: string[];
  technologies: string[];
  client?: string;
  year?: number;
  external_url?: string;
  show_on_home?: boolean;
  home_order?: number;
  is_published?: boolean;
}

export interface ApiClientInterface {
  // Públicos
  getProjects(params?: { home?: boolean; category?: string; page?: number; limit?: number }): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project>;
  getCategories(): Promise<CategorySummary[]>;
  sendContact(payload: ContactPayload): Promise<ContactResult>;

  // Auth
  login(email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  getMe(): Promise<AdminUser | null>;

  // Admin
  getAdminProjects(params?: { search?: string; category?: string }): Promise<Project[]>;
  getAdminProjectById(id: number): Promise<Project>;
  createProject(data: ProjectFormData): Promise<Project>;
  updateProject(id: number, data: Partial<ProjectFormData>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  toggleHome(id: number, show_on_home: boolean): Promise<Project>;
  reorderProjects(items: Array<{ id: number; home_order: number }>): Promise<void>;
  uploadImage(file: File): Promise<{ url: string; '800w'?: string; '1600w'?: string }>;
}
