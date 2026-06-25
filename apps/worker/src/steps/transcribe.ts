import fs from "fs"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function transcribeAudio(audioPath: string): Promise<string> {
  console.log(`[whisper] transcrevendo ${audioPath}`)

  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
    language: "pt",
    response_format: "text",
  })

  console.log(`[whisper] transcrição concluída — ${response.length} caracteres`)
  return response
}
