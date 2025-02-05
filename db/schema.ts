import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  title: text('title'),
  content: text('content'),
  created_at: int('created_at').notNull(),
  updated_at: int('updated_at').notNull(),
  is_deleted: int('is_deleted').notNull().default(0),
  last_synced_at: int('last_synced_at'),
  is_dirty: int('is_dirty').notNull().default(1),
});