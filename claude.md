# CLAUDE.md — Voxly

Contexto do projeto para assistência por IA.

## O que é o Voxly

SaaS que recebe o upload de um vídeo, transcreve automaticamente e gera metadados otimizados para SEO — títulos, descrição, tags, capítulos, posts para redes sociais — usando IA.

## Estrutura do monorepo

```
voxly/
├── apps/
│   ├── web/        # Frontend — Next.js 15, Tailwind CSS
│   ├── api/        # Backend — Hono, Node.js, porta 3001
│   └── worker/     # Processamento — FFmpeg, Whisper, Claude/Groq
└── packages/
    ├── shared/     # Tipos TypeScript compartilhados
    ├── ui/         # Componentes React compartilhados
    ├── eslint-config/
    └── typescript-config/
```

## Stack completa

| Camada | Tecnologia | Observação |
|--------|-----------|------------|
| Frontend | Next.js 15 + Tailwind CSS | App Router |
| API | Hono + Node.js | porta 3001 |
| Banco | PostgreSQL via Neon | Drizzle ORM |
| Storage | Supabase Storage | bucket: `videos` |
| Transcrição | Groq Whisper | gratuito |
| IA | Groq LLM | gratuito, substitui Claude |
| Monorepo | Turborepo + npm workspaces | |
| Deploy | Vercel (web) + Render (api/worker) | gratuito |

## Banco de dados

**Tabela: `videos`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | text (UUID) | chave primária, gerado automaticamente |
| filename | text | nome do arquivo original |
| filesize | integer | tamanho em bytes |
| mimetype | text | formato do arquivo |
| platform | text | youtube, instagram, tiktok, linkedin |
| tone | text | casual, professional, educational, entertaining |
| status | text | pending, uploaded, processing, done, error |
| progress | integer | 0 a 100 |
| storage_url | text | caminho no Supabase Storage |
| transcript | text | texto transcrito pelo Whisper |
| metadata | jsonb | JSON com títulos, tags, descrição gerados pela IA |
| created_at | timestamp | data de criação |
| updated_at | timestamp | data de atualização |

## API — rotas disponíveis

```
GET  /health                → status da API
GET  /                      → mensagem de boas vindas
POST /videos                → cria um novo job no banco
GET  /videos/:id            → busca status e dados de um job
POST /upload/:videoId       → recebe arquivo e envia ao Supabase Storage
```

### Exemplo POST /videos

```json
{
  "filename": "meu-video.mp4",
  "filesize": 10485760,
  "mimetype": "video/mp4",
  "platform": "youtube",
  "tone": "casual"
}
```

### Status do job

```
pending     → job criado, aguardando upload
uploaded    → arquivo no storage, aguardando worker
processing  → worker processando
done        → metadados prontos
error       → erro durante processamento
```

## Worker — pipeline de processamento

Roda separado da API. Executado via:

```bash
npx tsx src/index.ts <videoId>
```

**Etapas:**

```
1. download.ts       → baixa o vídeo do Supabase Storage para /tmp
2. extractAudio.ts   → FFmpeg extrai o áudio em MP3
3. transcribe.ts     → Groq Whisper transcreve o áudio
4. generateMetadata  → Groq LLM gera títulos, tags, descrição
5. Salva no banco    → status = "done", metadata preenchido
```

**FFmpeg:** instalado em `C:\ffmpeg\bin\ffmpeg.exe` (Windows local).
Em produção (Linux/Render) o caminho é `/usr/bin/ffmpeg`.

## Variáveis de ambiente

### apps/api/.env

```env
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
SUPABASE_URL=https://gqxxgksbjfdefljseasj.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_...
PORT=3001
```

### apps/worker/.env

```env
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
SUPABASE_URL=https://gqxxgksbjfdefljseasj.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_...
GROQ_API_KEY=gsk_...
```

## O que já foi feito

- [x] Monorepo com Turborepo + npm workspaces
- [x] Landing page (Next.js + Tailwind)
- [x] API com Hono
- [x] Banco de dados com Drizzle + Neon
- [x] Rota POST /videos com validação Zod
- [x] Rota GET /videos/:id
- [x] Upload para Supabase Storage
- [x] Worker — download do vídeo
- [x] Worker — extração de áudio com FFmpeg
- [ ] Worker — transcrição com Groq Whisper
- [ ] Worker — geração de metadados com Groq LLM
- [ ] Frontend — tela de upload
- [ ] Frontend — tela de resultados com polling
- [ ] Autenticação com Clerk
- [ ] Planos e pagamento com Stripe
- [ ] Deploy (Vercel + Render)

## Convenções do projeto

- Linguagem: **TypeScript** em todos os apps
- Validação: **Zod** (sem @hono/zod-validator — conflito de versão)
- ORM: **Drizzle** (sem magic, schemas em TS puro)
- Sem pnpm — usar **npm** puro
- Commits em português: `feat:`, `fix:`, `docs:`, `chore:`
- Worker roda como processo separado (não dentro da API)
- Nunca expor chaves de API no código — sempre via `.env`

## Como rodar localmente

```bash
# instalar dependências
npm install

# frontend — http://localhost:3000
npx turbo dev --filter=web

# api — http://localhost:3001
npx turbo dev --filter=api

# worker (manualmente com um videoId)
cd apps/worker
npx tsx src/index.ts <videoId>
```

## Próximos passos

1. Atualizar worker para usar Groq (Whisper + LLM)
2. Testar pipeline completo de ponta a ponta
3. Criar frontend de upload e resultados
4. Adicionar autenticação com Clerk
5. Deploy no Vercel + Render
