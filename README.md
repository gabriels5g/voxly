# Voxly

Faça upload do seu vídeo e gere títulos, descrição, tags, capítulos e posts para redes sociais com IA — em segundos.

## Como funciona

1. Usuário faz upload do vídeo
2. API registra o job no banco e envia o arquivo pro Supabase Storage
3. Worker extrai o áudio com FFmpeg e transcreve com Whisper
4. Claude gera os metadados otimizados para SEO
5. Frontend exibe os resultados em tempo real

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, Tailwind CSS |
| API | Hono, Node.js |
| Banco | PostgreSQL (Neon) + Drizzle ORM |
| Storage | Supabase Storage |
| Transcrição | OpenAI Whisper |
| IA | Claude (Anthropic) |
| Monorepo | Turborepo + npm workspaces |

## Estrutura

```
voxly/
├── apps/
│   ├── web/        # Frontend Next.js
│   ├── api/        # Backend Hono
│   └── worker/     # Processamento FFmpeg + Whisper + Claude
└── packages/
    ├── shared/     # Tipos TypeScript compartilhados
    ├── ui/         # Componentes React compartilhados
    ├── eslint-config/
    └── typescript-config/
```

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
git clone https://github.com/seu-usuario/voxly.git
cd voxly
npm install
```

### Variáveis de ambiente

Cria o arquivo `apps/api/.env`:

```env
DATABASE_URL=sua_url_do_neon
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_KEY=sua_chave_secreta
PORT=3001
```

Cria o arquivo `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Desenvolvimento

Roda o frontend e a API ao mesmo tempo:

```bash
npm run dev
```

Ou separadamente:

```bash
# Só o frontend — http://localhost:3000
npx turbo dev --filter=web

# Só a API — http://localhost:3001
npx turbo dev --filter=api
```

## API

### Rotas disponíveis

```
GET  /health              → status da API
POST /videos              → registra um novo job
GET  /videos/:id          → busca o status de um job
POST /upload/:videoId     → faz upload do arquivo de vídeo
```

### Exemplo de uso

Criar um job:

```bash
curl -X POST http://localhost:3001/videos \
  -H "Content-Type: application/json" \
  -d '{"filename":"meu-video.mp4","filesize":10485760,"mimetype":"video/mp4","platform":"youtube","tone":"casual"}'
```

Fazer upload do arquivo:

```bash
curl -X POST http://localhost:3001/upload/{videoId} \
  -F "file=@/caminho/do/video.mp4"
```

### Status do job

| Status | Descrição |
|--------|-----------|
| `pending` | Job criado, aguardando processamento |
| `uploaded` | Arquivo salvo no storage |
| `processing` | Worker transcrevendo e gerando metadados |
| `done` | Metadados prontos |
| `error` | Erro durante o processamento |

## Roadmap

- [x] Monorepo configurado
- [x] Landing page
- [x] API com Hono
- [x] Banco de dados com Drizzle + Neon
- [x] Upload para Supabase Storage
- [ ] Worker com FFmpeg + Whisper
- [ ] Geração de metadados com Claude
- [ ] Autenticação com Clerk
- [ ] Planos e pagamento com Stripe
- [ ] Deploy (Vercel + Railway)
