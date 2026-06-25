import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export async function generateMetadata(
  transcript: string,
  platform: string,
  tone: string
) {
  console.log(`[claude] gerando metadados`)

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: `Você é um especialista em SEO para plataformas de vídeo.
Responda EXCLUSIVAMENTE com JSON válido. Sem texto antes ou depois.`,
    messages: [
      {
        role: "user",
        content: `Analise a transcrição e gere metadados otimizados.

Plataforma: ${platform}
Tom: ${tone}

TRANSCRIÇÃO:
${transcript}

Responda com este JSON exato:
{
  "titles": [
    { "text": "título", "style": "curiosity|direct|listicle|emotional" }
  ],
  "description": {
    "full": "descrição completa com emojis e hashtags",
    "short": "versão curta até 100 caracteres"
  },
  "tags": ["tag1", "tag2"],
  "chapters": [
    { "timestamp": "0:00", "title": "título do capítulo" }
  ],
  "summary": "resumo em 2-3 frases",
  "primary_keyword": "palavra-chave principal"
}

Gere 4 títulos, entre 10 e 15 tags.`,
      },
    ],
  })

  const raw = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")

  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()

  return JSON.parse(cleaned)
}
