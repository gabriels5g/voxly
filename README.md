# Voxly

Faça upload do seu vídeo e gere títulos, descrição, tags, capítulos e posts para redes sociais com IA — em segundos.

## Como funciona

1. Usuário faz upload do vídeo na tela de upload
2. API registra o job no banco e envia o arquivo pro Supabase Storage
3. Worker é disparado automaticamente pela API
4. FFmpeg extrai o áudio do vídeo
5. Groq Whisper transcreve o áudio em português
6. Groq LLM gera metadados otimizados para SEO
7. Frontend exibe os resultados em tempo real via polling

## Stack

| Camada | Tecnologia | Observação |
|--------|-----------|------------|
| Frontend | Next.js 15 + Tailwind CSS | App Router |
| API | Hono + Node.js | porta 3001 |
| Banco | PostgreSQL via Neon | Drizzle ORM |
| Storage | Supabase Storage | bucket: `videos` |
| Transcrição | Groq Whisper | `whisper-large-v3` |
| IA | Groq LLM | `llama-3.3-70b-versatile` |
| Monorepo | Turborepo + npm workspaces | |

## Estrutura

```
voxly/
├── apps/
│   ├── web/        # Frontend Next.js
│   │   ├── app/
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── upload/           # Tela de upload
│   │   │   └── resultado/[id]/   # Tela de resultados
│   ├── api/        # Backend Hono
│   │   └── src/
│   │       ├── routes/
│   │       │   ├── videos.ts     # POST /videos, GET /videos/:id
│   │       │   └── upload.ts     # POST /upload/:videoId
│   │       ├── db/
│   │       │   ├── schema.ts     # Schema da tabela videos
│   │       │   └── index.ts      # Conexão com Neon
│   │       └── lib/
│   │           └── supabase.ts   # Cliente do Supabase
│   └── worker/     # Processamento em segundo plano
│       └── src/
│           ├── steps/
│           │   ├── download.ts         # Baixa vídeo do Supabase
│           │   ├── extractAudio.ts     # FFmpeg extrai áudio
│           │   ├── transcribe.ts       # Groq Whisper transcreve
│           │   └── generateMetadata.ts # Groq LLM gera metadados
│           ├── db.ts             # Conexão com banco
│           ├── supabase.ts       # Cliente do Supabase
│           └── index.ts          # Orquestra o pipeline
└── packages/
    ├── shared/            # Tipos TypeScript compartilhados
    ├── ui/                # Componentes React compartilhados
    ├── eslint-config/
    └── typescript-config/
```

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- npm 9+
- FFmpeg instalado — https://ffmpeg.org/download.html

### Instalação

```bash
git clone https://github.com/gabriels5g/voxly.git
cd voxly
npm install
```

### Variáveis de ambiente

Cria `apps/api/.env`:

```env
DATABASE_URL=sua_url_do_neon
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_KEY=sua_service_key
PORT=3001
```

Cria `apps/worker/.env`:

```env
DATABASE_URL=sua_url_do_neon
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_KEY=sua_service_key
GROQ_API_KEY=sua_chave_do_groq
```

Cria `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Desenvolvimento

```bash
# Frontend — http://localhost:3000
npx turbo dev --filter=web

# API — http://localhost:3001
npx turbo dev --filter=api
```

O worker é disparado automaticamente pela API após o upload.

## API

### Rotas

```
GET  /health              → status da API
GET  /                    → mensagem de boas vindas
POST /videos              → cria um novo job no banco
GET  /videos/:id          → busca status e dados de um job
POST /upload/:videoId     → recebe arquivo e envia ao Supabase
```

### Exemplo — criar job

```bash
curl -X POST http://localhost:3001/videos \
  -H "Content-Type: application/json" \
  -d '{"filename":"video.mp4","filesize":10485760,"mimetype":"video/mp4","platform":"youtube","tone":"casual"}'
```

### Status do job

| Status | Descrição |
|--------|-----------|
| `pending` | Job criado, aguardando upload |
| `uploaded` | Arquivo no storage, worker iniciando |
| `processing` | FFmpeg + Whisper + Groq rodando |
| `done` | Metadados prontos |
| `error` | Erro durante o processamento |

### Plataformas suportadas

`youtube` `instagram` `tiktok` `linkedin`

### Tons disponíveis

`casual` `professional` `educational` `entertaining`

## Metadados gerados

Para cada vídeo o Voxly gera automaticamente:

- **4 títulos** com estilos diferentes (curiosity, listicle, direct, emotional)
- **Descrição completa** com emojis, hashtags e timestamps
- **Descrição curta** para Shorts/Reels (máx. 100 caracteres)
- **10-15 tags** relevantes para SEO
- **Capítulos** com timestamps automáticos
- **Resumo** do conteúdo em 2-3 frases
- **Palavra-chave principal** para SEO

## Roadmap

- [x] Monorepo com Turborepo
- [x] Landing page
- [x] Tela de upload com drag & drop
- [x] API com Hono + validação Zod
- [x] Banco de dados PostgreSQL (Neon + Drizzle)
- [x] Upload para Supabase Storage
- [x] Worker automático disparado pela API
- [x] Extração de áudio com FFmpeg
- [x] Transcrição com Groq Whisper
- [x] Geração de metadados com Groq LLM
- [x] Tela de resultados com polling em tempo real
- [x] Copiar títulos, descrição, tags com um clique
- [ ] Autenticação com Clerk
- [ ] Histórico de vídeos por usuário
- [ ] Extração de áudio no browser (suporte a vídeos grandes)
- [ ] Planos e pagamento com Stripe
- [ ] Deploy (Vercel + Render)
