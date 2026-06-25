import ffmpeg from "fluent-ffmpeg"
import path from "path"
import os from "os"

// Informa o caminho do FFmpeg explicitamente
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe")

export async function extractAudio(videoPath: string): Promise<string> {
  const audioPath = path.join(os.tmpdir(), `audio-${Date.now()}.mp3`)

  console.log(`[ffmpeg] extraindo áudio de ${videoPath}`)

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .output(audioPath)
      .on("end", () => {
        console.log(`[ffmpeg] áudio salvo em ${audioPath}`)
        resolve(audioPath)
      })
      .on("error", (err) => {
        console.error("[ffmpeg] erro:", err.message)
        reject(err)
      })
      .run()
  })
}
