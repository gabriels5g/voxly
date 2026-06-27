import fs from "fs"
import Groq from "groq-sdk"

export async function transcribeAudio(audioPath: string): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  console.log(`[whisper] transcrevendo ${audioPath}`)

  const response = await groq.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-large-v3",
    language: "pt",
  })

  const text = response.text

  console.log(`[whisper] transcrição concluída — ${text.length} caracteres`)
  return text
}
