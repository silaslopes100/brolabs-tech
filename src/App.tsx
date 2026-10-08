/**
 * Arquivo: App.tsx
 * Responsabilidade: roteador principal dividindo as rotas públicas (dentro do Frame 3D, Navbar e Footer) e o painel administrativo (layout denso e direto sem moldura 3D).
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Frame } from './components/layout/Frame';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './features/home/HomePage';
import { ProjectsPage } from './features/projects/ProjectsPage';
import { ProjectDetail } from './features/projects/ProjectDetail';
import { PrivacyPage } from './features/privacy/PrivacyPage';
import { LoginPage } from './features/admin/LoginPage';
import { ProjectsTable } from './features/admin/ProjectsTable';
import { ProjectForm } from './features/admin/ProjectForm';

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
    </BrowserRouter>
  );
}
