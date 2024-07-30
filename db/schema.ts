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

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    messageId: text("message_id").notNull(),
    userType: text("user_type").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => {
    return {
      messageIdIdx: uniqueIndex("message_id_idx").on(table.messageId)
    };
  }
);

export type Subtitle = typeof subtitles.$inferSelect;
export type Message = typeof messages.$inferSelect;
