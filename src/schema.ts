import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const files = sqliteTable("files", {
  id: text().notNull().unique().primaryKey(),
  parentId: text().references(() => folders.id),
  name: text().notNull().unique(),
  data: blob().notNull(),
  size: integer().notNull(),
});

const folders = sqliteTable("folders", {
  id: text().notNull().unique().primaryKey(),
  parentId: text(),
  name: text().notNull().unique(),
});

export { files, folders };
