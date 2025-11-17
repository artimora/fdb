import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono/quick";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";

const app = new Hono().basePath("/api/fdb");

// general
app.get(
	"/openapi",
	openAPIRouteHandler(app, {
		documentation: {
			info: {
				title: "FDB API",
				version: "1.0.0",
				description: "Greeting API",
			},
			servers: [{ url: "http://localhost:3000", description: "Local Server" }],
		},
	}),
);

app.get("/", (c) => c.text("fdb"), describeRoute({}));

// file operations
const fileText = new Hono()
	.get("/read", describeRoute({}))
	.post("/write", describeRoute({}))
	.patch("/append", describeRoute({}));

const fileBytes = new Hono()
	.get("/read", describeRoute({}))
	.post("/write", describeRoute({}))
	.patch("/append", describeRoute({}));

const fileBase = new Hono()
	.route("/text", fileText)
	.route("/bytes", fileBytes)
	.post("/create", describeRoute({}))
	.get("/exists", describeRoute({}))
	.post("/copy", describeRoute({}))
	.post("/move", describeRoute({}))
	.delete("/delete", describeRoute({}));

// directory operations

const directoryBase = new Hono()
	.post("/create", describeRoute({}))
	.delete("/delete", describeRoute({}))
	.get("/exists", describeRoute({}))
	.get("/files", describeRoute({}));

// mount
app.route("/files", fileBase);
app.route("/directory", directoryBase);

export default app;
