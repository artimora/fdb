import { Database } from "bun:sqlite";
import { createFDB, getProvider } from "@copperdevs/fdb";
import { Hono } from "hono";
import { Kysely } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { migrateToLatest } from "./migrations";

getProvider();

// biome-ignore lint/suspicious/noExplicitAny: we dont need anything but the local
const db = new Kysely<any>({
	dialect: new BunSqliteDialect({
		database: new Database("db.sqlite"),
	}),
});

await migrateToLatest(db);

const fileDB = createFDB(db);
const app = new Hono();

app.get("/", (c) => c.text("Hono!"));

export default app;
