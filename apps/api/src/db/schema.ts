import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core"

export const videos = pgTable("videos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  filename: text("filename").notNull(),
  filesize: integer("filesize").notNull(),
  mimetype: text("mimetype").notNull(),
  platform: text("platform").notNull().default("youtube"),
  tone: text("tone").notNull().default("casual"),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  storageUrl: text("storage_url"),
  transcript: text("transcript"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
