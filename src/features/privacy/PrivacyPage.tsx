/**
 * Arquivo: PrivacyPage.tsx
 * Responsabilidade: página institucional de Política de Privacidade e Proteção de Dados (LGPD).
 * Dados: Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
 * Como editar: altere dados do controlador ou canal de DPO no bloco de contato.
 */

import React from 'react';
import { ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react';
import { SITE_CONFIG } from '../../content/site';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16 max-w-4xl mx-auto font-['Inter']">
      
      {/* Botão Voltar */}
      <div className="mb-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-['Sora'] text-[#D9D9D9]/70 hover:text-[#CAF000] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Início</span>
        </a>
      </div>

      {/* Cabeçalho */}
      <header className="space-y-4 mb-10 pb-8 border-b border-[rgba(247,247,247,0.08)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[rgba(247,247,247,0.1)] text-xs font-['Sora'] font-semibold text-[#CAF000]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CONFORMIDADE LGPD</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-['Sora'] text-[#F7F7F7] tracking-tight">
          Política de Privacidade
        </h1>

        <p className="text-xs sm:text-sm text-[#D9D9D9]/60">
          Última atualização: Outubro de 2026 · Versão 1.1
        </p>
      </header>

      {/* Conteúdo da Política */}
      <div className="space-y-8 text-sm text-[#D9D9D9]/80 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-['Sora'] text-[#F7F7F7]">
            1. Quem Somos (Controladora de Dados)
          </h2>
          <p>
            A <strong className="text-[#F7F7F7]">BROLABS TECH</strong> é um hub de inovação digital especializado no desenvolvimento de sistemas sob medida, SaaS, automações inteligentes com inteligência artificial e design estratégico, sediado em São Paulo, SP, Brasil.
          </p>
          <p>
            Esta Política de Privacidade descreve de forma clara e transparente como coletamos, utilizamos, armazenamos e protegemos os seus dados pessoais de acordo com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-['Sora'] text-[#F7F7F7]">
            2. Dados Coletados e Finalidade do Tratamento
          </h2>
          <p>
            Coletamos as informações fornecidas voluntariamente no briefing de projeto e no formulário de contato:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#D9D9D9]/75">
            <li><strong className="text-[#F7F7F7]">Nome Completo:</strong> para identificação e comunicação personalizada;</li>
            <li><strong className="text-[#F7F7F7]">E-mail Corporativo:</strong> para envio de respostas, diagnósticos preliminares e propostas comerciais;</li>
            <li><strong className="text-[#F7F7F7]">Empresa (opcional):</strong> para contextualizar o escopo de atuação e setor de mercado;</li>
            <li><strong className="text-[#F7F7F7]">Serviço de Interesse e Mensagem:</strong> para avaliação técnica da viabilidade do projeto;</li>
            <li><strong className="text-[#F7F7F7]">Mensagens do briefing:</strong> quando autorizado, para gerar um resumo inicial do projeto com auxílio de IA.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-['Sora'] text-[#F7F7F7]">
            3. Base Legal para o Tratamento
          </h2>
          <p>
            As mensagens enviadas no briefing são processadas por IA via OpenRouter para organizar as informações do projeto. O envio dos dados de contato e da mensagem à BROLABS TECH depende do consentimento LGPD no formulário final. Também tratamos informações para <strong className="text-[#F7F7F7]">procedimentos preliminares relacionados a contrato (Art. 7º, V)</strong> a seu pedido.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-['Sora'] text-[#F7F7F7]">
            4. Compartilhamento e Armazenamento Seguro
          </h2>
          <p>
            A BROLABS TECH <strong className="text-[#F7F7F7]">não comercializa nem aluga</strong> seus dados. Se você autorizar o briefing com IA, as mensagens dessa conversa são enviadas ao OpenRouter exclusivamente para gerar perguntas e organizar um resumo do projeto; não informe dados pessoais ou sigilosos nessa etapa. Os dados do formulário final são recebidos pelo backend da BROLABS TECH para atendimento do contato.
          </p>
          <p>
            Adotamos medidas técnicas e administrativas rigorosas, como tráfego criptografado via protocolo HTTPS (TLS), controle restrito de acesso por credenciais seguras e proteção contra robôs de spam para resguardar a integridade das comunicações.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-['Sora'] text-[#F7F7F7]">
            5. Direitos do Titular de Dados
          </h2>
          <p>
            Nos termos do Artigo 18 da LGPD, você possui o direito de solicitar a qualquer momento:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#D9D9D9]/75">
            <li>Confirmação da existência de tratamento dos seus dados;</li>
            <li>Acesso aos dados coletados;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Revogação do consentimento e eliminação completa dos dados armazenados em nossos registros.</li>
          </ul>
        </section>

        <section className="p-6 rounded-[20px] bg-[#161616] border border-[rgba(247,247,247,0.1)] space-y-3">
          <h2 className="text-base font-bold font-['Sora'] text-[#CAF000] flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>6. Canal de Contato e Encarregado (DPO)</span>
          </h2>
          <p className="text-xs text-[#D9D9D9]/80">
            Para exercer seus direitos como titular ou esclarecer qualquer dúvida sobre o tratamento de informações, entre em contato diretamente pelo e-mail:
          </p>
          <p className="font-['Sora'] text-sm font-semibold text-[#F7F7F7]">
            {SITE_CONFIG.contact.email}
          </p>
        </section>

      </div>
    </div>
  );
};
