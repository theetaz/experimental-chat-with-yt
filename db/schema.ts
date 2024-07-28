import {
  pgTable,
  serial,
  text,
  jsonb,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

export const subtitles = pgTable(
  "subtitles",
  {
    id: serial("id").primaryKey(),
    videoId: text("video_id").notNull(),
    subtitles: jsonb("subtitles").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => {
    return {
      videoIdIdx: uniqueIndex("video_id_idx").on(table.videoId)
    };
  }
);

export type Subtitle = typeof subtitles.$inferSelect;
