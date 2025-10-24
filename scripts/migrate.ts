import { file } from "bun";
import { Database } from "bun:sqlite";
import { readdir } from "node:fs/promises";

const migrationFiles = (await readdir(`${import.meta.dir}/../drizzle/`)).filter(
  (f) => f.endsWith(".sql")
);

const migrationInfo = file(`${import.meta.dir}/../fdb.migrations.txt`);

const dbFile = file(`${import.meta.dir}/../fdb.db`);

let appliedMigrations: string[] = [];

if (await migrationInfo.exists()) {
  const content = await migrationInfo.text();
  appliedMigrations = content.split("\r\n").filter(Boolean);
}

let pendingMigrations = migrationFiles.filter(
  (f) => !appliedMigrations.includes(f)
);

if (!(await dbFile.exists())) {
  pendingMigrations = migrationFiles;
}

const sqlite = new Database("fdb.db", { create: true });

for (const migration of pendingMigrations) {
  const sql = await file(`${import.meta.dir}/../drizzle/${migration}`).text();
  console.log(`Applying migration: ${migration}`);
  sqlite.run(sql);
  appliedMigrations.push(migration);
}

await migrationInfo.write(appliedMigrations.join("\r\n"));