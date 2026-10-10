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
    role: "Especialista em Comunicação, Gestão, Branding e Sistemas",
    bio: "Publicitário com anos de experiência unindo o melhor de dois mundos: a Comunicação Estratégica e a Gestão em Tecnologia & Inteligência Artificial. Sempre em busca de soluções inovadoras e criativas para os desafios do mundo digital.",
    image: "/images/team/silas.png",
    socialLink: "https://www.linkedin.com/in/silaslopesdesousa/",
  },
  {
    name: "Marcos Sena",
    role: "Engenheiro de Software, Especialista em TI e Desenvolvimento",
    bio: "Cientista da Computação com especialização em arquitetura de sistemas COBOL, Mainframe e Python. Experiência em infraestrutura distribuída com Scrum, plataformas SaaS e automações inteligentes. Apaixonado por tecnologia, desenvolvimento de sistemas e resoluções problemas.",
    image: "/images/team/marcos.png",
    socialLink: "https://www.linkedin.com/in/marcos-sena",
  },
];
