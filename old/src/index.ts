import { Database } from "bun:sqlite";
import { randomUUIDv7 } from "bun";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

const sqlite = new Database("fdb.db", { create: true });
const db = drizzle({ client: sqlite });

const app = new Hono()

	.use(logger())
	.use(prettyJSON())

	.post("/api/file/upload/:name", async (c) => {
		const name = c.req.param("name");
		const path = c.req.query("path");
		const data = await c.req.raw.blob();

		return c.json({
			message: "File uploaded successfully",
			name: name,
			data: {
				size: data.size,
				type: data.type,
			},
			path: path,
			id: randomUUIDv7(),
		});
	})
	.get("/api/files/:path{.+}", (c) => {
		let filePath = c.req.param("path");

		if (filePath.startsWith("/")) {
			filePath = filePath.slice(1);
		}

		if (filePath.endsWith("/")) {
			filePath = filePath.slice(0, -1);
		}

		const paths = filePath.split("/");

		return c.json({ paths, id: randomUUIDv7() });
	});

export default app;
