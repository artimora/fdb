import { Database } from "bun:sqlite";
import { createUKV } from "@artimora/ukv";
import { Kysely } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { migrateToLatest } from "./migrations";

// biome-ignore lint/suspicious/noExplicitAny: we dont need anything but the local
const db = new Kysely<any>({
	dialect: new BunSqliteDialect({
		database: new Database("db.ukv.sqlite")
	})
});

await migrateToLatest(db);

const kv = createUKV(db);
