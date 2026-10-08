/**
 * Arquivo: mockData.ts
 * Responsabilidade: dados mockados de alta fidelidade para execução autônoma do site e do painel admin sem backend.
 * Dados: Casos de uso reais alinhados aos serviços da BROLABS TECH.
 */

import { Project } from './types';

export const INITIAL_MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Plataforma de Gestão e Operações Logísticas",
    slug: "gestao-operacoes-logisticas",
    category: "sistemas",
    category_label: "Sistemas",
    summary: "Sistema operacional sob medida com rastreamento em tempo real, roteirização inteligente e painéis de controle unificados.",
    description: "Desenvolvimento de ponta a ponta de uma infraestrutura multi-terminal para centralizar despachos, conciliação e métricas de desempenho. A solução reduziu o tempo médio de faturamento e substituiu 4 ferramentas legadas por um fluxo integrado.",
    cover_image: "/images/services/sistemas-saas.webp",
    gallery: [
      "/images/services/sistemas-saas.webp",
      "/images/services/crm-gestao.webp"
    ],
    technologies: ["React", "FastAPI", "PostgreSQL", "Docker", "Tailwind CSS"],
    client: "Nexus Logística",
    year: 2026,
    external_url: "https://brolabs.tech",
    show_on_home: true,
    home_order: 1,
    is_published: true,
    created_at: "2026-03-10T12:00:00Z",
    updated_at: "2026-03-10T12:00:00Z"
  },
  {
    id: 2,
    title: "Agente Inteligente de Triagem e Suporte Técnico",
    slug: "agente-triagem-suporte",
    category: "automacoes",
    category_label: "Automações",
    summary: "Automação com IA conversacional integrada a ERP e Helpdesk para classificação e resolução de chamados de primeiro nível.",
    description: "Estruturação de pipeline com modelos generativos conectados à base de conhecimento corporativa. O agente compreende linguagem natural, valida permissões no sistema e soluciona ocorrências recorrentes em segundos com auditoria completa.",
    cover_image: "/images/services/automacao-ia.webp",
    gallery: [
      "/images/services/automacao-ia.webp"
    ],
    technologies: ["Python", "LangChain", "OpenAI", "Webhooks", "FastAPI"],
    client: "CoreTech Solutions",
    year: 2026,
    external_url: "https://brolabs.tech",
    show_on_home: true,
    home_order: 2,
    is_published: true,
    created_at: "2026-02-18T14:30:00Z",
    updated_at: "2026-02-18T14:30:00Z"
  },
  {
    id: 3,
    title: "Portal Corporativo e Experiência Digital",
    slug: "portal-corporativo-fintech",
    category: "sites",
    category_label: "Sites",
    summary: "Website de alto impacto, performance instantânea e arquitetura voltada para conversão institucional e captação de leads qualificados.",
    description: "Construção de interface cinematográfica focada em clareza de proposta de valor e credibilidade no mercado. Otimização técnica rigorosa atingindo nota máxima em métricas Core Web Vitals e renderização sob demanda.",
    cover_image: "/images/services/comunicacao-digital.webp",
    gallery: [
      "/images/services/comunicacao-digital.webp"
    ],
    technologies: ["React", "TypeScript", "Vite", "Motion", "Tailwind CSS"],
    client: "Vektor Capital",
    year: 2025,
    external_url: "https://brolabs.tech",
    show_on_home: true,
    home_order: 3,
    is_published: true,
    created_at: "2025-11-20T09:00:00Z",
    updated_at: "2025-11-20T09:00:00Z"
  },
  {
    id: 4,
    title: "Sistema de Identidade Visual e Design System",
    slug: "identidade-visual-design-system",
    category: "design",
    category_label: "Design",
    summary: "Criação de identidade de marca, tokens visuais, componentes escaláveis e diretrizes completas para produto e presença institucional.",
    description: "Desenvolvimento de manual de marca abrangente, tipografia autoral, paleta cromática com rigor de contraste e biblioteca de componentes Figma sincronizada com o código de produção.",
    cover_image: "/images/services/design-branding.webp",
    gallery: [
      "/images/services/design-branding.webp"
    ],
    technologies: ["Figma", "Design Tokens", "UI/UX", "Brand Guidelines"],
    client: "Lumina Labs",
    year: 2025,
    external_url: "https://brolabs.tech",
    show_on_home: true,
    home_order: 4,
    is_published: true,
    created_at: "2025-10-05T16:00:00Z",
    updated_at: "2025-10-05T16:00:00Z"
  },
  {
    id: 5,
    title: "Diagramação e Relatórios de Sustentabilidade Corporativa",
    slug: "diagramacao-relatorio-sustentabilidade",
    category: "diagramacao",
    category_label: "Diagramação",
    summary: "Projeto editorial e diagramação técnica de relatórios anuais, infográficos de dados complexos e materiais de relacionamento com investidores.",
    description: "Estruturação tipográfica hierárquica e gráficos editoriais de alta precisão para publicações institucionais. Tratamento de tabelas densas, paleta sóbria e formatos otimizados para impressão e circulação digital interativa.",
    cover_image: "/images/services/estrategia-digital.webp",
    gallery: [
      "/images/services/estrategia-digital.webp"
    ],
    technologies: ["InDesign", "Illustrator", "Infografia", "Design Editorial"],
    client: "Verde Invest",
    year: 2025,
    external_url: "https://brolabs.tech",
    show_on_home: false,
    home_order: 5,
    is_published: true,
    created_at: "2025-09-12T10:15:00Z",
    updated_at: "2025-09-12T10:15:00Z"
  },
  {
    id: 6,
    title: "Hub de CRM e Automação de Pipeline Comercial",
    slug: "crm-automacao-pipeline",
    category: "sistemas",
    category_label: "Sistemas",
    summary: "Centralização de negócios, pontuação preditiva de oportunidades e automação de follow-ups multicanal para times comerciais de alta performance.",
    description: "Painel intuitivo com visão Kanban e métricas de conversão por etapa do funil. O sistema unificou registros telefônicos, mensagens e propostas com relatórios gerenciais em tempo real.",
    cover_image: "/images/services/crm-gestao.webp",
    gallery: [
      "/images/services/crm-gestao.webp"
    ],
    technologies: ["React", "FastAPI", "PostgreSQL", "Webhooks"],
    client: "Athena B2B",
    year: 2025,
    external_url: "https://brolabs.tech",
    show_on_home: false,
    home_order: 6,
    is_published: true,
    created_at: "2025-08-01T11:00:00Z",
    updated_at: "2025-08-01T11:00:00Z"
  }
];
