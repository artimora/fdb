import { Database } from "bun:sqlite";
import { createFDB, getProvider } from "@artimora/fdb";
import { getHandler } from "@artimora/fdb-web";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { Kysely } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { migrateToLatest } from "./migrations";
import { cors } from "hono/cors";

getProvider();

// biome-ignore lint/suspicious/noExplicitAny: we dont need anything but the local
const db = new Kysely<any>({
	dialect: new BunSqliteDialect({
		database: new Database("db.fdb.sqlite")
	})
});

await migrateToLatest(db);

const fileDB = getHandler(createFDB(db));

const app: Hono = new Hono()
	.use(logger())
	.use("/api/*", cors())
	.get(
		"/",
		Scalar({
			url: "/api/fdb/openapi",
			theme: "elysiajs",
			showSidebar: true,
			showToolbar: "never",
			defaultOpenAllTags: true,
			isEditable: true
		})
	)
	.mount("/", fileDB.fetch);

export default app;
