import { Hono } from "hono"
import { supabase } from "../lib/supabase"
import { db } from "../db"
import { videos } from "../db/schema"
import { eq } from "drizzle-orm"
import { spawn } from "child_process"
import path from "path"

const uploadRoute = new Hono()

uploadRoute.post("/:videoId", async (c) => {
  const videoId = c.req.param("videoId")

  const [video] = await db.select().from(videos).where(eq(videos.id, videoId))
  if (!video) {
    return c.json({ error: "Vídeo não encontrado" }, 404)
  }

  const formData = await c.req.formData()
  const file = formData.get("file") as File
  if (!file) {
    return c.json({ error: "Arquivo não enviado" }, 400)
  }

  const filename = `${videoId}/${Date.now()}-${file.name}`
  const buffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from("videos")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return c.json({ error: "Erro no upload: " + error.message }, 500)
  }

  await db.update(videos)
    .set({ storageUrl: filename, status: "uploaded" })
    .where(eq(videos.id, videoId))

  // Dispara o worker em segundo plano
  const workerPath = path.resolve(
    process.cwd(),
    "../../apps/worker/src/index.ts"
  )

  const envPath = path.resolve(
    process.cwd(),
    "../../apps/worker/.env"
  )

  const worker = spawn(
    "npx",
    ["tsx", workerPath, videoId],
    {
      detached: true,
      stdio: "pipe",
      env: {
        ...process.env,
        DOTENV_CONFIG_PATH: envPath,
      },
      shell: true,
    }
  )

  worker.stdout?.on("data", (data) => {
    console.log(`[worker] ${data.toString().trim()}`)
  })

  worker.stderr?.on("data", (data) => {
    console.error(`[worker:err] ${data.toString().trim()}`)
  })

  worker.unref()

  return c.json({ success: true, path: filename })
})

export default uploadRoute
