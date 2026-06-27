import Groq from "groq-sdk"

export async function generateMetadata(
  transcript: string,
  platform: string,
  tone: string
) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  console.log(`[groq] gerando metadados`)

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Você é um especialista em SEO para plataformas de vídeo.
Responda EXCLUSIVAMENTE com JSON válido. Sem texto antes ou depois.`,
      },
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
    temperature: 0.7,
  })

  const raw = response.choices[0].message.content || ""
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()

  return JSON.parse(cleaned)
}
