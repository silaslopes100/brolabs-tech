# Diretrizes Permanentes do Projeto — BROLABS TECH

## 1. Identidade e Tokens de Design
- Nenhuma cor, raio ou espaçamento arbitrário ou mágico fora dos tokens declarados em `src/styles/tokens.css`.
- Paleta estrita:
  - Fundo principal: `--color-bg: #080808`
  - Acento e luz de contorno: `--color-lime: #CAF000` (máximo ~10% de ocupação visual na tela)
  - Superfícies e cards: `--surface-1: #0F0F0F`, `--surface-2: #161616`, `--color-graphite: #2D2D2D`
  - Texto principal: `--color-offwhite: #F7F7F7`
  - Texto secundário: `--color-gray: #D9D9D9`
- Tipografia: **Sora** para títulos, números e botões; **Inter** para corpo e UI.
- Escala de raios: `--r-sm: 12px`, `--r-md: 20px`, `--r-lg: 28px`, `--r-xl: 32px`, `--r-pill: 9999px`.

## 2. Regras "Sem Cara de IA" (Anti-Slop)
- Proibidos gradientes roxos/azuis, efeitos neon exagerados e glassmorphism artificial.
- Proibido grid simétrico e repetitivo de 3 cards iguais; aplicar sempre bento grid assimétrico.
- Zero-pill para metadados estáticos: categorias, anos e tags devem ser renderizados como texto limpo unboxed com separadores tipográficos (`·`), nunca cápsulas ou badges coloridos fechados. Pílulas são exclusivas para controles de clique/ação.
- Proibido inventar métricas fictícias, depoimentos ou clientes inexistentes na versão pública.
- Microinterações físicas com transições suaves entre 200ms e 350ms.

## 3. Estrutura de Conteúdo e Marcadores
- Todo arquivo deve conter o cabeçalho padronizado informando responsabilidade, dados e forma de edição.
- Utilize os marcadores de busca rápida:
  - `// ===== [SEÇÃO: NOME] =====`
  - `// EDITAR AQUI:`
  - `// NÃO MEXER:`
  - `// TODO(brolabs):`
- Textos institucionais, serviços, etapas e membros da equipe ficam estritamente em `src/content/`.

## 4. Regra de Negócio de Projetos
- Home: exibe apenas projetos com `is_published == true AND show_on_home == true`, ordenados por `home_order ASC`.
- Catálogo `/projetos`: obedece à constante `PROJECTS_PAGE_INCLUDES_HOME_ITEMS`.
