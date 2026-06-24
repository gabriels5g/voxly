import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { db } from "../db"
import { videos } from "../db/schema"
import { eq } from "drizzle-orm"

const videosRoute = new Hono()

const createVideoSchema = z.object({
  filename: z.string().min(1),
  filesize: z.number().max(500 * 1024 * 1024),
  mimetype: z.string().refine((v) =>
    ["video/mp4", "video/quicktime", "video/x-msvideo", "audio/mpeg", "audio/wav"].includes(v),
    { message: "Formato não suportado" }
  ),
  platform: z.enum(["youtube", "instagram", "tiktok", "linkedin"]).default("youtube"),
  tone: z.enum(["casual", "professional", "educational", "entertaining"]).default("casual"),
})

// POST /videos — cria um novo job no banco
videosRoute.post("/", zValidator("json", createVideoSchema), async (c) => {
  const body = c.req.valid("json")

  const [video] = await db.insert(videos).values({
    filename: body.filename,
    filesize: body.filesize,
    mimetype: body.mimetype,
    platform: body.platform,
    tone: body.tone,
    status: "pending",
  }).returning()

  return c.json({ job: video }, 201)
})

// GET /videos/:id — busca o job no banco
videosRoute.get("/:id", async (c) => {
  const id = c.req.param("id")

  const [video] = await db.select().from(videos).where(eq(videos.id, id))

  if (!video) {
    return c.json({ error: "Vídeo não encontrado" }, 404)
  }

  return c.json({ job: video })
})

export default videosRoute
