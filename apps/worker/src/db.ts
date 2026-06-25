import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core"

export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  filesize: integer("filesize").notNull(),
  mimetype: text("mimetype").notNull(),
  platform: text("platform").notNull(),
  tone: text("tone").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").notNull(),
  storageUrl: text("storage_url"),
  transcript: text("transcript"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema: { videos } })
