import { supabase } from "../supabase"
import fs from "fs"
import path from "path"
import os from "os"

export async function downloadVideo(storageUrl: string): Promise<string> {
  console.log(`[download] baixando ${storageUrl}`)

  const { data, error } = await supabase.storage
    .from("videos")
    .download(storageUrl)

  if (error || !data) {
    throw new Error("Erro ao baixar vídeo: " + error?.message)
  }

  // Salva em arquivo temporário
  const tmpDir = os.tmpdir()
  const filename = path.basename(storageUrl)
  const tmpPath = path.join(tmpDir, filename)

  const buffer = Buffer.from(await data.arrayBuffer())
  fs.writeFileSync(tmpPath, buffer)

  console.log(`[download] salvo em ${tmpPath}`)
  return tmpPath
}
