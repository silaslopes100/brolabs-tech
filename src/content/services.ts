/**
 * Arquivo: services.ts
 * Responsabilidade: conteúdo tipado e centralizado dos 6 serviços da BROLABS TECH (Seção 7 do briefing).
 * Como editar: altere títulos, descrições ou caminhos de imagem diretamente neste arquivo.
 */

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  categorySlug: string;
  gridSpan: string; // Para montar a proporção bento da REF-A (12 col, 4/4/4, 5/7)
}

// ===== [SEÇÃO: DADOS DOS SERVIÇOS] =====
export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "sistemas-saas",
    number: "01",
    title: "Sistemas & SaaS",
    description:
      "Desenvolvimento de sistemas sob medida, plataformas SaaS escaláveis e produtos digitais com arquitetura robusta para crescer sem limites.",
    image: "/images/services/sistemas-saas.webp",
    categorySlug: "sistemas",
    gridSpan: "col-span-12", // Linha 1: card largo (12 col)
  },
  {
    id: "automacao-ia",
    number: "02",
    title: "Automação com IA",
    description:
      "Agentes inteligentes, automações de processos e integrações com LLMs que eliminam tarefas repetitivas e multiplicam a produtividade.",
    image: "/images/services/automacao-ia.webp",
    categorySlug: "automacoes",
    gridSpan: "col-span-12 lg:col-span-4", // Linha 2: 4/4/4
  },
  {
    id: "crm-gestao",
    number: "03",
    title: "CRM & Gestão",
    description:
      "Implementação e customização de CRMs, fluxos de vendas, dashboards analíticos e ferramentas de gestão que transformam dados em decisões.",
    image: "/images/services/crm-gestao.webp",
    categorySlug: "sistemas",
    gridSpan: "col-span-12 lg:col-span-4", // Linha 2: 4/4/4
  },
  {
    id: "comunicacao-digital",
    number: "04",
    title: "Comunicação Digital",
    description:
      "Estratégias de conteúdo, gestão de redes sociais, campanhas pagas e presença digital que geram autoridade e conexão real com o público.",
    image: "/images/services/comunicacao-digital.webp",
    categorySlug: "sites",
    gridSpan: "col-span-12 lg:col-span-4", // Linha 2: 4/4/4
  },
  {
    id: "estrategia-digital",
    number: "05",
    title: "Estratégia Digital",
    description:
      "Planejamento estratégico, análise de mercado, posicionamento de marca e roadmap de transformação digital para empresas que querem liderar.",
    image: "/images/services/estrategia-digital.webp",
    categorySlug: "sites",
    gridSpan: "col-span-12 lg:col-span-5", // Linha 3: 5/7
  },
  {
    id: "design-branding",
    number: "06",
    title: "Design & Branding",
    description:
      "Identidade visual, UI/UX, design systems e experiências de marca memoráveis que diferenciam e criam valor tangível no mercado.",
    image: "/images/services/design-branding.webp",
    categorySlug: "design",
    gridSpan: "col-span-12 lg:col-span-7", // Linha 3: 5/7
  },
];
