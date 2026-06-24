import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const videos = new Hono()

// Schema de validação
const createVideoSchema = z.object({
  filename: z.string().min(1),
  filesize: z.number().max(500 * 1024 * 1024), // max 500MB
  mimetype: z.string().refine((v) =>
    ["video/mp4", "video/quicktime", "video/x-msvideo", "audio/mpeg", "audio/wav"].includes(v),
    { message: "Formato não suportado" }
  ),
  platform: z.enum(["youtube", "instagram", "tiktok", "linkedin"]).default("youtube"),
  tone: z.enum(["casual", "professional", "educational", "entertaining"]).default("casual"),
})

// POST /videos — registra um novo vídeo e retorna um job
videos.post("/", zValidator("json", createVideoSchema), async (c) => {
  const body = c.req.valid("json")

  // Por enquanto retorna um job fake — depois vai salvar no banco
  const job = {
    id: crypto.randomUUID(),
    status: "pending",
    filename: body.filename,
    filesize: body.filesize,
    platform: body.platform,
    tone: body.tone,
    createdAt: new Date().toISOString(),
  }

  return c.json({ job }, 201)
})

// GET /videos/:id — retorna o status do job
videos.get("/:id", async (c) => {
  const id = c.req.param("id")

  // Fake por enquanto — depois vai buscar no banco
  return c.json({
    job: {
      id,
      status: "processing",
      progress: 45,
      createdAt: new Date().toISOString(),
    },
  })
})

export default videos
