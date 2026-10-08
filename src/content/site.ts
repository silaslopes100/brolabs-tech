/**
 * Arquivo: site.ts
 * Responsabilidade: configurações gerais da BROLABS TECH, redes sociais, contatos e flags do site.
 * Dados: Marca oficial BROLABS TECH
 * Como editar: altere URLs, e-mails ou mude a flag de exibição de projetos.
 */

// ===== [SEÇÃO: CONFIGURAÇÕES CENTRAIS DO SITE] =====
export const SITE_CONFIG = {
  // NÃO MEXER: nome canônico
  name: "BROLABS TECH",
  tagline: "Tecnologia que transforma ideias em resultados.",
  manifesto: "Tecnologia. Design. Resultados.",
  location: "São Paulo, SP — Brasil",

  // EDITAR AQUI: Redes sociais e canais de contato
  social: {
    instagram: "https://instagram.com/brolabs.tech",
    instagramHandle: "@brolabs.tech",
    // TODO(brolabs): Adicionar URL do LinkedIn da empresa
    linkedin: "https://linkedin.com/company/brolabs-tech",
    // TODO(brolabs): Adicionar URL do GitHub oficial da empresa
    github: "https://github.com/brolabs-tech",
    // TODO(brolabs): Configurar número WhatsApp corporativo real
    whatsapp: "https://wa.me/5511999999999",
  },

  contact: {
    email: "contato@brolabs.tech",
    supportEmail: "suporte@brolabs.tech",
  },

  // EDITAR AQUI: Decisão editorial da Seção 8 do briefing:
  // Se true, /projetos inclui projetos que também aparecem na Home.
  // Se false, a página de projetos mostra apenas os que NÃO estão na Home.
  PROJECTS_PAGE_INCLUDES_HOME_ITEMS: true,
};
