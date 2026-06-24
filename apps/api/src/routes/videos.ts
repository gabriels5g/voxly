import { Hono } from "hono"
import { z } from "zod"
import { db } from "../db"
import { videos } from "../db/schema"
import { eq } from "drizzle-orm"

const videosRoute = new Hono()

const createVideoSchema = z.object({
  filename: z.string().min(1),
  filesize: z.number().max(500 * 1024 * 1024),
  mimetype: z.enum(["video/mp4", "video/quicktime", "video/x-msvideo", "audio/mpeg", "audio/wav"]),
  platform: z.enum(["youtube", "instagram", "tiktok", "linkedin"]).default("youtube"),
  tone: z.enum(["casual", "professional", "educational", "entertaining"]).default("casual"),
})

// POST /videos
videosRoute.post("/", async (c) => {
  const body = await c.req.json()
  const result = createVideoSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: result.error.flatten() }, 400)
  }

  const data = result.data

  const [video] = await db.insert(videos).values({
    filename: data.filename,
    filesize: data.filesize,
    mimetype: data.mimetype,
    platform: data.platform,
    tone: data.tone,
    status: "pending",
  }).returning()

  return c.json({ job: video }, 201)
})

// GET /videos/:id
videosRoute.get("/:id", async (c) => {
  const id = c.req.param("id")

  const [video] = await db.select().from(videos).where(eq(videos.id, id))

  if (!video) {
    return c.json({ error: "Vídeo não encontrado" }, 404)
  }

  return c.json({ job: video })
})

export default videosRoute
