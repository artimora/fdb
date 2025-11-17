import { Database } from "bun:sqlite";
import { createFDB, getProvider } from "@copperdevs/fdb";
import { getHandler } from "@copperdevs/fdb-web";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { logger } from "hono/logger";
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

const fileDB = getHandler(createFDB(db));

const app = new Hono()
	.use(logger())
	.get("/", (c) => c.text("Hono!"))
	.get(
		"/scalar",
		Scalar({
			url: "/api/fdb/openapi",
			theme: "elysiajs",
			showSidebar: true,
			showToolbar: "never",
			defaultOpenAllTags: true,
			hideClientButton: true,
		}),
	)
	.mount("/", fileDB.mount);

export default app;
