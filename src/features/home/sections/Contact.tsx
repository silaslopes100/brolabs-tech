/**
 * Arquivo: Contact.tsx
 * Responsabilidade: briefing de projeto com IA seguido por formulário de contato validado e compatível com LGPD.
 * Dados: briefing server-side e api.sendContact
 * Como editar: altere as instruções da entrevista em backend/app/services/ai_service.py.
 */

import React, { useState } from 'react';
import { api, ContactBriefingMessage, ContactPayload, generateContactBriefing } from '../../../lib/api';
import { Input, Textarea, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CheckCircle2, AlertCircle, ArrowUpRight, ArrowLeft, ArrowRight, Send } from 'lucide-react';

interface ContactProps {
  initialService?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialService = '' }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [conversation, setConversation] = useState<ContactBriefingMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Vou ajudar a organizar sua ideia em um briefing. Qual desafio ou oportunidade você quer resolver?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiConsent, setAiConsent] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  const [briefingComplete, setBriefingComplete] = useState(false);
  const [formData, setFormData] = useState<ContactPayload>({
    name: '',
    email: '',
    company: '',
    interest: initialService || 'Sistemas & SaaS',
    message: '',
    consent_lgpd: false,
    honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Sincroniza se o serviço for pré-selecionado a partir de um clique em serviços
  React.useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, interest: initialService }));
    }
  }, [initialService]);

  const serviceOptions = [
    { value: 'Sistemas & SaaS', label: 'Sistemas & SaaS' },
    { value: 'Automação com IA', label: 'Automação com IA' },
    { value: 'CRM & Gestão', label: 'CRM & Gestão' },
    { value: 'Comunicação Digital', label: 'Comunicação Digital' },
    { value: 'Estratégia Digital', label: 'Estratégia Digital' },
    { value: 'Design & Branding', label: 'Design & Branding' },
    { value: 'Outro', label: 'Outro assunto' },
  ];

  const handleBriefingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = chatInput.trim();
    if (!userMessage || briefingLoading) return;

    const nextMessages: ContactBriefingMessage[] = [
      ...conversation,
      { role: 'user', content: userMessage },
    ];
    setBriefingLoading(true);
    setBriefingError(null);
    setBriefingComplete(false);

    try {
      const result = await generateContactBriefing({
        messages: nextMessages,
        interest: formData.interest,
        consent_ai: aiConsent,
      });
      setConversation([
        ...nextMessages,
        { role: 'assistant', content: result.reply },
      ]);
      setChatInput('');
      if (result.completed && result.summary) {
        setFormData((prev) => ({
          ...prev,
          message: result.summary || '',
          interest: result.interest || prev.interest,
        }));
        setBriefingComplete(true);
      }
    } catch (err: unknown) {
      setBriefingError(
        err instanceof Error ? err.message : 'Não foi possível continuar o briefing. Tente novamente.',
      );
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.consent_lgpd) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor, aceite a Política de Privacidade para prosseguir com o envio.',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendContact(formData);
      setStatusMessage({
        type: 'success',
        text: res.message || 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        interest: 'Sistemas & SaaS',
        message: '',
        consent_lgpd: false,
        honeypot: '',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao enviar mensagem. Tente novamente.';
      setStatusMessage({
        type: 'error',
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="w-full px-4 sm:px-6 md:px-8 py-16 sm:py-24 border-t border-[rgba(247,247,247,0.08)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ===== COLUNA ESQUERDA: TEXTO DE CHAMADA / CTA ===== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-['Sora'] font-bold text-[#CAF000] tracking-widest uppercase">
            <span>VAMOS CONVERSAR</span>
          </div>

          {/* EDITAR AQUI: Título do formulário */}
          <h2 className="text-3xl sm:text-5xl font-bold font-['Sora'] text-[#F7F7F7] leading-tight tracking-tight">
            Vamos transformar sua ideia em resultado?
          </h2>

          <p className="text-sm sm:text-base text-[#D9D9D9]/80 font-['Inter'] leading-relaxed">
            Seja para criar um SaaS do zero, implementar automações inteligentes no seu fluxo de trabalho ou posicionar sua marca com autoridade, estamos prontos para ouvir o seu desafio.
          </p>

          <div className="pt-4 space-y-3 font-['Inter'] text-xs text-[#D9D9D9]/70">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#CAF000]" />
              <span>Resposta detalhada em até 24 horas úteis.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#CAF000]" />
              <span>Acordo de confidencialidade (NDA) garantido.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#CAF000]" />
              <span>Diagnóstico inicial sem custo de consultoria.</span>
            </div>
          </div>
        </div>

        {/* ===== COLUNA DIREITA: FORMULÁRIO DE CONTATO ===== */}
        <div className="lg:col-span-7">
          <Card variant="surface-1" rounded="xl" className="p-6 sm:p-10 border border-[rgba(247,247,247,0.12)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-['Sora'] font-bold text-[#CAF000] tracking-widest uppercase">
                  Etapa {step} de 2
                </span>
                <h3 className="mt-1 text-lg font-bold font-['Sora'] text-[#F7F7F7]">
                  {step === 1 ? 'Briefing do projeto' : 'Seus dados de contato'}
                </h3>
              </div>
              {step === 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  iconLeft={<ArrowLeft className="w-4 h-4" />}
                >
                  Voltar ao briefing
                </Button>
              )}
            </div>

            <div
              className="mb-6 flex gap-2"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={2}
              aria-valuenow={step}
              aria-label={`Etapa ${step} de 2`}
            >
              <div className="h-1 flex-1 rounded-full bg-[#CAF000]" />
              <div className={`h-1 flex-1 rounded-full ${step === 2 ? 'bg-[#CAF000]' : 'bg-[#2D2D2D]'}`} />
            </div>

            {step === 1 ? (
              <div className="space-y-5">
                <p className="text-sm text-[#D9D9D9]/75 font-['Inter'] leading-relaxed">
                  Converse com nosso assistente para organizar os objetivos e requisitos do projeto. Não informe dados pessoais nesta etapa.
                </p>

                <div
                  className="max-h-[360px] min-h-[180px] space-y-3 overflow-y-auto rounded-[20px] border border-[rgba(247,247,247,0.08)] bg-[#0F0F0F] p-4"
                  role="log"
                  aria-live="polite"
                  aria-label="Conversa de briefing"
                >
                  {conversation.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <p
                        className={`max-w-[88%] whitespace-pre-wrap rounded-[20px] px-4 py-3 text-sm font-['Inter'] leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-[#CAF000]/10 text-[#F7F7F7]'
                            : 'bg-[#161616] text-[#D9D9D9]'
                        }`}
                      >
                        {message.content}
                      </p>
                    </div>
                  ))}
                  {briefingLoading && (
                    <p className="text-xs text-[#D9D9D9]/60 font-['Inter']" role="status">
                      Organizando a próxima pergunta...
                    </p>
                  )}
                </div>

                {briefingError && (
                  <div
                    className="flex items-center gap-3 rounded-[12px] border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{briefingError}</span>
                  </div>
                )}

                <form onSubmit={handleBriefingSubmit} className="space-y-3">
                  <div className="flex items-start gap-3 rounded-[12px] border border-[rgba(247,247,247,0.08)] bg-[#0F0F0F] p-4">
                    <input
                      id="consent_ai"
                      name="consent_ai"
                      type="checkbox"
                      required
                      checked={aiConsent}
                      onChange={(e) => setAiConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#CAF000] focus:ring-[#CAF000]"
                    />
                    <label htmlFor="consent_ai" className="text-xs text-[#D9D9D9]/75 font-['Inter'] leading-relaxed">
                      Autorizo o envio das mensagens deste briefing ao OpenRouter para processamento por IA.
                      Não incluirei dados pessoais ou informações sigilosas. Consulte a{' '}
                      <a href="/privacidade" className="text-[#CAF000] underline hover:text-[#CAF000]/80">
                        Política de Privacidade
                      </a>.
                    </label>
                  </div>
                  <Textarea
                    label="Sua resposta"
                    name="briefing-answer"
                    required
                    rows={3}
                    maxLength={2000}
                    placeholder="Descreva com suas palavras..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={briefingLoading || briefingComplete || !aiConsent}
                  />
                  {!briefingComplete && (
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      disabled={briefingLoading || !aiConsent || !chatInput.trim()}
                      iconRight={<Send className="w-4 h-4" />}
                    >
                      {briefingLoading ? 'Analisando...' : 'Enviar resposta'}
                    </Button>
                  )}
                </form>

                {briefingComplete && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#CAF000] font-['Inter']">
                      Briefing concluído. Revise o resumo na próxima etapa antes de enviar.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setBriefingComplete(false)}
                    >
                      Refinar briefing
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => setStep(2)}
                      iconRight={<ArrowRight className="w-4 h-4" />}
                    >
                      Continuar para seus dados
                    </Button>
                  </div>
                )}
                {!briefingComplete && !briefingLoading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(2)}
                  >
                    Preencher formulário sem usar IA
                  </Button>
                )}
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Campo Honeypot invisível para enganar robôs */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot || ''}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome completo *"
                  name="name"
                  required
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Input
                  label="E-mail profissional *"
                  name="email"
                  type="email"
                  required
                  placeholder="voce@empresa.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Empresa (opcional)"
                  name="company"
                  placeholder="Nome da sua empresa"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />

                <Select
                  label="Serviço de interesse *"
                  name="interest"
                  options={serviceOptions}
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                />
              </div>

              <Textarea
                label="Conte sobre o projeto *"
                name="message"
                required
                rows={4}
                placeholder="O resumo do briefing aparecerá aqui para você revisar."
                helperText="Revise e complemente o resumo gerado no briefing antes de enviar."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />

              {/* Checkbox de consentimento LGPD */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  id="consent_lgpd"
                  name="consent_lgpd"
                  type="checkbox"
                  required
                  checked={formData.consent_lgpd}
                  onChange={(e) => setFormData({ ...formData, consent_lgpd: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-[rgba(247,247,247,0.2)] bg-[#161616] text-[#CAF000] accent-[#CAF000] focus:ring-[#CAF000]"
                />
                <label htmlFor="consent_lgpd" className="text-xs text-[#D9D9D9]/80 font-['Inter'] leading-relaxed">
                  Concordo com o tratamento dos meus dados conforme a{' '}
                  <a href="/privacidade" className="text-[#CAF000] underline hover:text-[#CAF000]/80">
                    Política de Privacidade
                  </a>{' '}
                  e autorizo o contato da BROLABS TECH sobre este projeto.
                </label>
              </div>

              {/* Alerta de status com aria-live acessível */}
              {statusMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-4 rounded-xl flex items-center gap-3 text-xs font-['Inter'] ${
                    statusMessage.type === 'success'
                      ? 'bg-[#CAF000]/10 border border-[#CAF000]/30 text-[#CAF000]'
                      : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#CAF000]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Botão de Envio */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={loading}
                  iconRight={<ArrowUpRight className="w-4 h-4" />}
                >
                  {loading ? 'Enviando proposta...' : 'Enviar mensagem'}
                </Button>
              </div>

            </form>
            )}
          </Card>
        </div>

      </div>
    </section>
  );
};
