import { Database } from "bun:sqlite";
import { createFDB } from "@copperdevs/fdb";
import { Kysely } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { migrateToLatest } from "./migrations";

// biome-ignore lint/suspicious/noExplicitAny: we dont need anything but the local
const db = new Kysely<any>({
	dialect: new BunSqliteDialect({
		database: new Database("db.sqlite"),
	}),
});

await migrateToLatest(db);

const fileDB = createFDB(db);

fileDB.file.writeAllText("root/test/text.txt", "silly written text");
