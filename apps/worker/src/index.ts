import "dotenv/config"
import { eq } from "drizzle-orm"
import { db, videos } from "./db"
import { downloadVideo } from "./steps/download"
import { extractAudio } from "./steps/extractAudio"
import { transcribeAudio } from "./steps/transcribe"
import { generateMetadata } from "./steps/generateMetadata"
import fs from "fs"

async function processVideo(videoId: string) {
  console.log(`\n[worker] iniciando processamento do job ${videoId}`)

  // Busca o job no banco
  const [video] = await db.select().from(videos).where(eq(videos.id, videoId))
  if (!video || !video.storageUrl) {
    throw new Error("Job não encontrado ou sem arquivo")
  }

  try {
    // Atualiza status para processing
    await db.update(videos)
      .set({ status: "processing", progress: 10 })
      .where(eq(videos.id, videoId))

    // Step 1: Download
    const videoPath = await downloadVideo(video.storageUrl)
    await db.update(videos).set({ progress: 30 }).where(eq(videos.id, videoId))

    // Step 2: Extrair áudio
    const audioPath = await extractAudio(videoPath)
    await db.update(videos).set({ progress: 50 }).where(eq(videos.id, videoId))

    // Step 3: Transcrever
    const transcript = await transcribeAudio(audioPath)
    await db.update(videos)
      .set({ transcript, progress: 70 })
      .where(eq(videos.id, videoId))

    // Step 4: Gerar metadados
    const metadata = await generateMetadata(transcript, video.platform, video.tone)
    await db.update(videos)
      .set({ metadata, progress: 100, status: "done" })
      .where(eq(videos.id, videoId))

    // Limpa arquivos temporários
    fs.unlinkSync(videoPath)
    fs.unlinkSync(audioPath)

    console.log(`[worker] job ${videoId} concluído!`)

  } catch (err) {
    console.error(`[worker] erro no job ${videoId}:`, err)
    await db.update(videos)
      .set({ status: "error" })
      .where(eq(videos.id, videoId))
  }
}

// Pega o ID do job via argumento da linha de comando
const videoId = process.argv[2]
if (!videoId) {
  console.error("Uso: tsx src/index.ts <videoId>")
  process.exit(1)
}

processVideo(videoId)
