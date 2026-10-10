# Prompt: Replicar a Arquitetura de IA deste Site

## Visão geral
Esta aplicação utiliza **funções server‑side** para interagir com um modelo de linguagem (ex.: GPT‑OSS 120B). As chamadas à IA são mantidas no servidor, expostas ao cliente através de `createServerFn` em arquivos `*.functions.ts`. Isso garante que **chaves de API e prompts** nunca são enviados ao navegador.

## Estrutura de diretórios
```
src/
 ├─ lib/
 │   ├─ ai.server.ts        # Implementação real das chamadas ao provedor de IA
 │   └─ other.server.ts     # Outras funções server‑side
 └─ functions/
     ├─ ai.functions.ts      # Exporta as funções usando createServerFn
     └─ other.functions.ts   # Exporta outras utilidades
```

## Passo a passo para reproduzir
1. **Criar o módulo server** (`src/lib/ai.server.ts`)
   ```ts
   import { fetch } from 'node-fetch'; // ou SDK do provedor

   // Função genérica que chama o modelo
   export async function callModel(prompt: string, temperature = 0.7) {
     const response = await fetch('https://api.provider.com/v1/completions', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.AI_API_KEY}`,
       },
       body: JSON.stringify({
         model: 'gpt-oss-120b',
         prompt,
         temperature,
       }),
     });
     const data = await response.json();
     return data.choices[0].text;
   }
   ```

2. **Exportar via `createServerFn`** (`src/functions/ai.functions.ts`)
   ```ts
   import { createServerFn } from 'some-framework'; // ajuste ao seu framework
   import { callModel } from '../lib/ai.server';

   // Exemplo de função que gera um resumo
   export const generateSummary = createServerFn(async (text: string) => {
     const prompt = `Resuma o seguinte texto em três frases concisas:\n\n${text}`;
     return await callModel(prompt);
   });
   ```

3. **Chamar do cliente** (ex.: React, Vanilla JS)
   ```js
   import { generateSummary } from './functions/ai.functions';

   async function showSummary() {
     const text = document.getElementById('article').innerText;
     const summary = await generateSummary(text);
     document.getElementById('summary').textContent = summary;
   }
   ```

## Controle de acesso
- **Roles**: mantenha um vetor `user_roles` na sessão do usuário.
- **Helper** `has_role(user, role)` verifica permissões.
- **Admin auto‑claim**: ao primeiro login, execute uma RPC `claim_first_admin()` que atribui o papel `admin` ao usuário corrente.
- Use essas verificações nas `*.functions.ts` para limitar quem pode acessar funções sensíveis (ex.: leitura de leads, imagens privadas).

## Segurança
- **Variáveis de ambiente** (`process.env.AI_API_KEY`) apenas no servidor.
- **CORS**: restrinja o acesso ao endpoint de funções apenas ao seu domínio.
- **Logs**: nunca registre o prompt completo nem a resposta do modelo em logs públicos.

## Checklist rápido
- [ ] Criar `ai.server.ts` com a chamada ao provedor.
- [ ] Exportar funções com `createServerFn`.
- [ ] Proteger rotas usando `has_role`.
- [ ] Configurar variáveis de ambiente com a chave da API.
- [ ] Testar localmente (`npm run dev`) e validar que a chave nunca aparece no cliente.

---
**Este documento pode ser usado como prompt de referência para criar a mesma arquitetura de IA em outro projeto.**

## Adaptação implementada neste projeto
Este repositório usa React/Vite no frontend e FastAPI no backend, portanto a chamada server-side
é exposta por `POST /api/contact/briefing` em vez de `createServerFn`. O endpoint conduz a
primeira etapa do contato, fazendo perguntas de qualificação e retornando um resumo para revisão
e envio no formulário da segunda etapa. O envio ao provedor requer consentimento explícito na
primeira etapa, com opção para continuar pelo formulário sem usar IA.

Configure `OPENROUTER_API_KEY` somente no ambiente do backend. O modelo padrão é
`openai/gpt-oss-120b` e pode ser alterado por `OPENROUTER_MODEL`. Consulte
[`backend/.env.example`](./backend/.env.example); nunca use `VITE_` para armazenar credenciais.
