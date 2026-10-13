/**
 * Arquivo: App.tsx
 * Responsabilidade: roteador principal dividindo as rotas públicas (dentro do Frame 3D, Navbar e Footer) e o painel administrativo (layout denso e direto sem moldura 3D).
 */

import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Frame } from './components/layout/Frame';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

const HomePage = lazy(() => import('./features/home/HomePage').then(({ HomePage }) => ({ default: HomePage })));
const ProjectsPage = lazy(() => import('./features/projects/ProjectsPage').then(({ ProjectsPage }) => ({ default: ProjectsPage })));
const ProjectDetail = lazy(() => import('./features/projects/ProjectDetail').then(({ ProjectDetail }) => ({ default: ProjectDetail })));
const PrivacyPage = lazy(() => import('./features/privacy/PrivacyPage').then(({ PrivacyPage }) => ({ default: PrivacyPage })));
const LoginPage = lazy(() => import('./features/admin/LoginPage').then(({ LoginPage }) => ({ default: LoginPage })));
const ProjectsTable = lazy(() => import('./features/admin/ProjectsTable').then(({ ProjectsTable }) => ({ default: ProjectsTable })));
const ProjectForm = lazy(() => import('./features/admin/ProjectForm').then(({ ProjectForm }) => ({ default: ProjectForm })));

// Restaura o scroll no topo ao transitar entre rotas
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper para as páginas públicas que compartilham a moldura 3D do estúdio
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Frame>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </Frame>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <div
            className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-[var(--color-gray)]"
            role="status"
          >
            Carregando...
          </div>
        }
      >
        <Routes>
          {/* ===== ROTAS PÚBLICAS (COM MOLDURA 3D E NAVEGAÇÃO) ===== */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/projetos"
            element={
              <PublicLayout>
                <ProjectsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/projetos/:slug"
            element={
              <PublicLayout>
                <ProjectDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/privacidade"
            element={
              <PublicLayout>
                <PrivacyPage />
              </PublicLayout>
            }
          />

          {/* ===== ROTAS ADMINISTRATIVAS (DENSO, SEM MOLDURA 3D) ===== */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProjectsTable />} />
          <Route path="/admin/projetos/novo" element={<ProjectForm />} />
          <Route path="/admin/projetos/:id" element={<ProjectForm />} />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
