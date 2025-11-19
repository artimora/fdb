import { Database } from "bun:sqlite";
import { createFDB, getProvider } from "@copperdevs/fdb";
import { getHandler } from "@copperdevs/fdb-web";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { html } from "hono/html";
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
	.get("/", (c) => {
		return c.html(html`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<title>fdb api testing</title>
				<link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
			</head>
			<body>
				<a href="http://localhost:3000/api/fdb/openapi">openapi</a>
				<a href="http://localhost:3000/scalar">scalar</a>
			</body>
			</html>`);
	})
	.get(
		"/scalar",
		Scalar({
			url: "/api/fdb/openapi",
			theme: "elysiajs",
			showSidebar: true,
			showToolbar: "never",
			defaultOpenAllTags: true,
			isEditable: true,
		}),
	)
	.mount("/", fileDB.mount);

export default app;
