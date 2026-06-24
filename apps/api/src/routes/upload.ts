import { Hono } from "hono"
import { supabase } from "../lib/supabase"
import { db } from "../db"
import { videos } from "../db/schema"
import { eq } from "drizzle-orm"

const uploadRoute = new Hono()

// POST /upload/:videoId — recebe o arquivo e envia pro Supabase Storage
uploadRoute.post("/:videoId", async (c) => {
  const videoId = c.req.param("videoId")

  // Busca o job no banco
  const [video] = await db.select().from(videos).where(eq(videos.id, videoId))
  if (!video) {
    return c.json({ error: "Vídeo não encontrado" }, 404)
  }

  // Pega o arquivo do body
  const formData = await c.req.formData()
  const file = formData.get("file") as File
  if (!file) {
    return c.json({ error: "Arquivo não enviado" }, 400)
  }

  // Faz upload pro Supabase Storage
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

  // Atualiza o status no banco
  await db.update(videos)
    .set({ storageUrl: filename, status: "uploaded" })
    .where(eq(videos.id, videoId))

  return c.json({ success: true, path: filename })
})

export default uploadRoute
