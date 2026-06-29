import Groq from "groq-sdk"

export async function generateMetadata(
  transcript: string,
  platform: string,
  tone: string
) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  console.log(`[groq] gerando metadados`)

  const platformGuide: Record<string, string> = {
    youtube: "Títulos entre 50-70 caracteres, descrição longa com timestamps, até 15 tags",
    instagram: "Títulos curtos e impactantes, descrição com até 2.200 caracteres, 30 hashtags",
    tiktok: "Títulos curtíssimos e virais, descrição informal com gírias, 5-10 hashtags trending",
    linkedin: "Títulos profissionais, descrição formal e objetiva, sem hashtags demais",
  }

  const toneGuide: Record<string, string> = {
    casual: "linguagem descontraída, próxima, como se fosse um amigo explicando",
    professional: "linguagem formal, objetiva, séria e confiável",
    educational: "linguagem didática, clara, que ensina passo a passo",
    entertaining: "linguagem divertida, animada, com humor e energia",
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Você é um especialista sênior em SEO e marketing de conteúdo digital, com foco em criadores brasileiros.

Suas respostas devem:
- Ser 100% em português brasileiro natural
- Usar palavras-chave que brasileiros realmente pesquisam
- Gerar títulos com alta taxa de clique (CTR)
- Seguir as melhores práticas de SEO de cada plataforma
- Nunca usar emojis em nenhum campo
- Responder EXCLUSIVAMENTE com JSON válido — sem texto antes ou depois, sem blocos de código`,
      },
      {
        role: "user",
        content: `Analise a transcrição abaixo e gere metadados altamente otimizados.

PLATAFORMA: ${platform}
GUIA DA PLATAFORMA: ${platformGuide[platform] || platformGuide.youtube}

TOM: ${tone}
GUIA DO TOM: ${toneGuide[tone] || toneGuide.casual}

TRANSCRIÇÃO:
${transcript}

INSTRUÇÕES:
- Títulos: crie 4 variações com estilos diferentes. Cada título deve ser único, específico ao conteúdo e irresistível para clicar.
- Descrição full: mínimo 150 palavras, SEM emojis, seção de timestamps se houver capítulos, hashtags no final
- Descrição short: máximo 100 caracteres, direto ao ponto, sem emojis
- Tags: específicas ao conteúdo, misture termos amplos e nichados
- Capítulos: só se o conteúdo tiver tópicos claramente distintos
- Summary: capture a essência do vídeo em 2-3 frases naturais, sem emojis
- primary_keyword: o termo exato que alguém pesquisaria para achar esse vídeo

FORMATO DE RESPOSTA (JSON exato):
{
  "titles": [
    { "text": "título aqui", "style": "curiosity" },
    { "text": "título aqui", "style": "listicle" },
    { "text": "título aqui", "style": "direct" },
    { "text": "título aqui", "style": "emotional" }
  ],
  "description": {
    "full": "descrição completa aqui",
    "short": "descrição curta aqui"
  },
  "tags": ["tag1", "tag2", "tag3"],
  "chapters": [
    { "timestamp": "0:00", "title": "título do capítulo" }
  ],
  "summary": "resumo aqui",
  "primary_keyword": "palavra-chave principal"
}`,
      },
    ],
    temperature: 0.75,
    max_tokens: 2048,
  })

  const raw = response.choices[0].message.content || ""
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error(`JSON inválido do Groq:\n${cleaned.slice(0, 300)}`)
  }
}
