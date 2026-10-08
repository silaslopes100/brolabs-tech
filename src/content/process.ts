/**
 * Arquivo: process.ts
 * Responsabilidade: conteúdo exato das 4 etapas do processo "Como trabalhamos" (Seção 6 do briefing).
 * Como editar: altere as descrições ou etapas com segurança neste arquivo.
 */

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// ===== [SEÇÃO: ETAPAS DO PROCESSO] =====
export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Descoberta",
    description:
      "Mergulhamos no seu negócio, entendemos seus desafios, mapeamos oportunidades e alinhamos expectativas com precisão.",
  },
  {
    number: "02",
    title: "Estratégia",
    description:
      "Criamos um plano de ação detalhado com tecnologias escolhidas a dedo, cronograma realista e métricas claras de sucesso.",
  },
  {
    number: "03",
    title: "Execução",
    description:
      "Desenvolvimento ágil com entregas incrementais, feedback contínuo e total transparência sobre o andamento do projeto.",
  },
  {
    number: "04",
    title: "Lançamento",
    description:
      "Deploy cuidadoso, testes exaustivos, treinamento da equipe e suporte pós-lançamento para garantir um início impecável.",
  },
];
