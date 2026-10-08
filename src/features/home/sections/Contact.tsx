/**
 * Arquivo: Contact.tsx
 * Responsabilidade: formulário de contato com seleção de serviços, validação acessível, honeypot invisível e consentimento LGPD.
 * Dados: api.sendContact
 * Como editar: altere o título final em [SEÇÃO: TÍTULO DO CONTATO].
 */

import React, { useState } from 'react';
import { api, ContactPayload } from '../../../lib/api';
import { Input, Textarea, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ContactProps {
  initialService?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialService = '' }) => {
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
            <span>05 · VAMOS CONVERSAR</span>
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
                placeholder="Qual problema você precisa resolver? Qual o objetivo do produto ou da automação?"
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
          </Card>
        </div>

      </div>
    </section>
  );
};
