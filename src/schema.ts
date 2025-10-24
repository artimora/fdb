import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const files = sqliteTable('files', {
	id: text().notNull().primaryKey(),
    parentId: text().references(() => folders.id),
    name: text().notNull(),
    data: blob().notNull(),
    size: integer().notNull()
});

const folders = sqliteTable('folders', {
    id: text().notNull().primaryKey(),
    parentId: text(),
    name: text().notNull()
});

export { files, folders };