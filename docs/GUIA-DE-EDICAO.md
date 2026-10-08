# Guia de Edição — BROLABS TECH

Este guia orienta como alterar com facilidade textos, mídias, cores e comportamentos do site institucional e painel administrativo da BROLABS TECH.

---

## 1. Tabela Rápida: "Quero Mudar... → Arquivo → Marcador"

| Quero mudar... | Arquivo | Marcador no Código (Ctrl+F) | O que editar |
| :--- | :--- | :--- | :--- |
| **Textos dos Serviços** (título, descrição, número) | `src/content/services.ts` | `[SEÇÃO: DADOS DOS SERVIÇOS]` | Modifique o array `SERVICES_DATA` |
| **Textos do Processo** (as 4 etapas de trabalho) | `src/content/process.ts` | `[SEÇÃO: ETAPAS DO PROCESSO]` | Modifique o array `PROCESS_STEPS` |
| **Cores da Marca** (verde, preto, grafite, offwhite) | `src/styles/tokens.css` | `[SEÇÃO: VARIÁVEIS CSS DE DESIGN TOKENS]` | Modifique as variáveis `--color-lime`, `--color-bg`, etc. |
| **Fontes Tipográficas** | `src/styles/tokens.css` e `src/index.css` | `/* FONTES */` | Altere `--font-heading` ou `--font-body` |
| **Logotipo e Ícone do Frasco** | `src/components/brand/Logo.tsx` | `[SEÇÃO: ÍCONE GEOMÉTRICO DO FRASCO BROLABS]` | Substitua o SVG em `BrolabsFlaskIcon` ou use `/brand/` |
| **Imagens dos Cards de Serviço** | `src/content/services.ts` | `image:` | Altere o caminho apontando para a pasta `public/images/services/` |
| **Hero** (títulos, subtítulo, botões de ação) | `src/features/home/sections/Hero.tsx` | `[SEÇÃO: BENTO GRID HERO (REF-B)]` | Modifique os textos do H1 e botões |
| **Rodapé e Redes Sociais** (Instagram, LinkedIn, GitHub) | `src/content/site.ts` | `social:` | Atualize os links em `SITE_CONFIG.social` |
| **Categorias de Projeto** (sistemas, automações, etc.) | `src/lib/api/types.ts` e `backend/app/schemas/project.py` | `[SEÇÃO: CATEGORIAS FIXAS]` | Modifique os enums `ProjectCategory` e `ProjectCategoryEnum` |
| **Limite de Projetos na Home** | `src/features/home/sections/FeaturedProjects.tsx` | `api.getProjects({ home: true, limit: 6 })` | Altere o parâmetro `limit` (padrão máx. 6) |
| **Regra da Lista de Projetos** (incluir ou não os da Home) | `src/content/site.ts` | `PROJECTS_PAGE_INCLUDES_HOME_ITEMS` | Mude para `true` (mostra todos) ou `false` (só os que não estão na home) |
| **E-mail de Destino do Formulário de Contato** | `src/content/site.ts` e `backend/.env` | `CONTACT_DEST_EMAIL` | Altere o e-mail que receberá os contatos |
| **Dados dos Fundadores** (Silas Lopes e Marcos Sena) | `src/content/team.ts` | `[SEÇÃO: FUNDADORES DA BROLABS TECH]` | Modifique nomes, cargos, bios e fotos |
| **Política de Privacidade** (Termos LGPD) | `src/features/privacy/PrivacyPage.tsx` | `[SEÇÃO: CONTEÚDO DA POLÍTICA]` | Atualize os textos jurídicos |

---

## 2. Decisão Editorial: `PROJECTS_PAGE_INCLUDES_HOME_ITEMS`

No arquivo `src/content/site.ts`:

- **Quando `true` (padrão):** A página `/projetos` exibe todos os projetos publicados, inclusive aqueles que já foram destacados na página inicial.
- **Quando `false`:** A página `/projetos` exclui automaticamente da listagem os projetos que já estão visíveis no grid da Home, servindo como uma seção exclusiva para os demais projetos do portfólio.

---

## 3. Gestão de Projetos pelo Painel Admin

1. Acesse `/admin` (redireciona para `/admin/login`).
2. Utilize o e-mail configurado no `.env` (ex: `admin@brolabs.tech`).
3. Para colocar um projeto na Home: clique no botão **"Oculto"** na linha correspondente da tabela para alternar para **"Na Home"**.
4. Para ajustar a ordem dos cards na Home: use as setas **↑** e **↓** na coluna *Ordem Home*.
5. Para cadastrar um case: clique em **"Novo Projeto"**, preencha os dados (com preview em tempo real ao lado) e anexe a capa.
