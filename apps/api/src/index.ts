import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import "dotenv/config"
import uploadRoute from "./routes/upload"
import videos from "./routes/videos"

const app = new Hono()

// Middlewares
app.use("*", logger())
app.use("*", cors({ origin: "http://localhost:3000" }))

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", app: "voxly-api" })
})

// Rotas
app.get("/", (c) => {
  return c.json({ message: "Voxly API 🚀" })
})

app.route("/videos", videos)
app.route("/upload", uploadRoute)

const PORT = Number(process.env.PORT) || 3001

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`)
})

export default app
