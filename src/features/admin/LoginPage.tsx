/**
 * Arquivo: LoginPage.tsx
 * Responsabilidade: tela de login do painel administrativo da BROLABS TECH (sem cadastro público; credenciais geradas via seed).
 * Dados: api.login
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Logo } from '../../components/brand/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@brolabs.tech');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await api.login(email, password);
      navigate('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao autenticar. Verifique e-mail e senha.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F7F7F7] flex flex-col items-center justify-center p-4 font-['Inter'] relative">
      
      {/* Botão de retorno ao site público */}
      <div className="absolute top-6 left-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-['Sora'] text-[#D9D9D9]/70 hover:text-[#CAF000] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao site</span>
        </a>
      </div>

      <div className="w-full max-w-md">
        
        {/* Identidade */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex justify-center">
            <Logo variant="principal" size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-['Sora'] font-bold text-[#CAF000] uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            <span>ACESSO RESTRITO</span>
          </div>
        </div>

        {/* Card de Login */}
        <Card variant="surface-1" rounded="xl" className="p-6 sm:p-8 border border-[rgba(247,247,247,0.12)]">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            <Input
              label="E-mail corporativo"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@brolabs.tech"
            />

            <Input
              label="Senha"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {errorMessage && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Validando credenciais...' : 'Entrar no painel'}
              </Button>
            </div>

            <p className="text-[11px] text-center text-[#D9D9D9]/50 pt-2">
              Ambiente protegido. Tentativas não autorizadas são registradas para auditoria.
            </p>

          </form>
        </Card>

      </div>
    </div>
  );
};
