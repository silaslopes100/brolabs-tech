# BROLABS TECH — Hub de Inovação Digital

> *"Tecnologia. Design. Resultados."*  
> *"Tecnologia que transforma ideias em resultados."*

Site institucional e plataforma de portfólio da **BROLABS TECH**, hub de inovação digital fundado por Silas Lopes e Marcos Sena em São Paulo, Brasil. O projeto combina engenharia de software full-stack com direção de arte de estúdio ("Sem cara de IA"), contemplando landing page bento grid com recorte, catálogo completo de projetos, estudo de caso individual, política de privacidade LGPD e painel administrativo protegido para gestão em tempo real de cases e destaques.

---

## 1. Arquitetura da Solução

O projeto é organizado como um monorepo moderno e desacoplado:

- **Frontend (`/` e `src/`):** React 19, TypeScript (strict), Vite, Tailwind CSS com `@tailwindcss/vite`, React Router DOM, React Hook Form, Zod e Motion. Suporta execução 100% autônoma em modo mock (`VITE_USE_MOCK=true`) com persistência em `localStorage` ou conexão direta com a API.
- **Backend (`backend/`):** Python 3.12+, FastAPI, SQLAlchemy 2.0, Alembic, PyJWT, Bcrypt, Pydantic v2 e Pillow (para processamento de imagem em WebP).
- **Design Tokens (`src/styles/tokens.css`):** Fonte única de verdade de cores (`#080808`, `#CAF000`, `#2D2D2D`, `#D9D9D9`, `#F7F7F7`), tipografia (Sora e Inter locais sem CDN externa) e raios estruturais (`12px` a `32px` e `pill`).

---

## 2. Como Rodar Localmente

### A. Frontend (Vite)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (já configurado por padrão)
cp .env.example .env

# 3. Iniciar o servidor de desenvolvimento (porta 3000)
npm run dev
```

Abra no navegador em `http://localhost:3000`. O modo mock está ativo por padrão, permitindo utilizar todo o site público e o painel `/admin` imediatamente.

---

### B. Backend (FastAPI)

```bash
# 1. Entrar no diretório do backend
cd backend

# 2. Criar e ativar o ambiente virtual
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Criar arquivo de configuração
cp .env.example .env

# 5. Executar migrações do banco de dados (SQLite local)
alembic upgrade head

# 6. Executar o seed do primeiro administrador
python -m app.seed

# 7. Iniciar o servidor FastAPI
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

A documentação interativa Swagger estará disponível em `http://localhost:8000/docs`.

Para conectar o Frontend ao Backend FastAPI ativo, basta alterar no `.env` do frontend:
```bash
VITE_USE_MOCK="false"
VITE_API_URL="http://localhost:8000/api"
```

---

## 3. Testes Automatizados (Backend)

O backend possui uma suíte de testes em `backend/tests/` cobrindo a regra de exibição da Home, filtros por categoria, unicidade de slugs, proteção de rotas administrativas e formulário de contato:

```bash
cd backend
pytest -v
```

---

## 4. Estrutura de Rotas

| Rota | Descrição | Layout |
| :--- | :--- | :--- |
| `/` | Landing page completa (Hero [REF-B], Marquee, Serviços [REF-A], Destaques, Processo, Sobre, Contato) | Público (Moldura 3D, Navbar e Footer) |
| `/projetos` | Catálogo geral com abas de categoria, contadores e busca instantânea | Público |
| `/projetos/:slug` | Estudo de caso detalhado com galeria, tecnologias e CTA | Público |
| `/privacidade` | Política de Privacidade e Proteção de Dados (LGPD) | Público |
| `/admin/login` | Login administrativo restrito | Admin Denso |
| `/admin` | Tabela com busca, status inline da home, ordenação por teclado e exclusão segura | Admin Denso |
| `/admin/projetos/novo` | Cadastro de projeto com Zod + React Hook Form e preview ao vivo | Admin Denso |
| `/admin/projetos/:id` | Edição completa de projeto existente | Admin Denso |

---

## 5. Checklist de Critérios de Aceite

- [x] **Critério 1:** Com `VITE_USE_MOCK=true`, o site e o painel `/admin` funcionam com autonomia total sem depender do backend.
- [x] **Critério 2:** Com o backend ativo (ou mock store), marcar *"Mostrar na Home"* reflete instantaneamente o card na Home pública e desmarcar o retira.
- [x] **Critério 3:** Nenhuma cor, fonte ou raio arbitrário fora dos tokens em `src/styles/tokens.css`.
- [x] **Critério 4:** O site é 100% utilizável sem nenhuma imagem física (fallbacks procedurais pontilhados e gradientes garantem contraste AA).
- [x] **Critério 5:** Qualquer texto de serviço ou processo pode ser alterado editando apenas um arquivo em `src/content/`.
- [x] **Critério 6:** Nenhuma métrica, cliente ou depoimento falso na versão pública.
