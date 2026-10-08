/**
 * Arquivo: team.ts
 * Responsabilidade: dados dos fundadores da BROLABS TECH (Silas Lopes e Marcos Sena).
 * Dados: Brand Guidelines e Seção 6 do briefing.
 * Como editar: altere cargos, bios ou fotos aqui.
 */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLink?: string;
}

// ===== [SEÇÃO: FUNDADORES DA BROLABS TECH] =====
export const FOUNDERS: TeamMember[] = [
  {
    name: "Silas Lopes",
    role: "Co-Founder & Head de Tecnologia",
    bio: "Especialista em arquitetura de sistemas, infraestrutura distribuída, plataformas SaaS e automações inteligentes com inteligência artificial.",
    image: "/images/team/silas.webp",
    socialLink: "https://linkedin.com",
  },
  {
    name: "Marcos Sena",
    role: "Co-Founder & Head de Design e Estratégia",
    bio: "Diretor criativo focado em design de produto, sistemas de identidade visual de alto padrão, branding digital e posicionamento de mercado.",
    image: "/images/team/marcos.webp",
    socialLink: "https://linkedin.com",
  },
];
