import type { fdb } from "@copperdevs/fdb";
import { Hono } from "hono/quick";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";
import routes from "./routes";
import type { MountingOptions } from "./types";

function getApp(options: MountingOptions, fdb: fdb) {
	const app = new Hono<{
		Variables: {
			fdb: fdb;
		};
	}>().basePath(options.base ?? "/api/fdb");

	app.use("*", async (c, next) => {
		c.set("fdb", fdb);
		await next();
	});

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
				servers: [
					{ url: "http://localhost:3000", description: "Local Server" },
				],
			},
		}),
	);

	app.get("/", routes.root.handle, describeRoute(routes.root.spec));

	// file operations
	const fileText = new Hono()
		.get(
			"/read",
			routes.file.text.read.handle,
			describeRoute(routes.file.text.read.spec),
		)
		.post(
			"/write",
			routes.file.text.write.handle,
			describeRoute(routes.file.text.write.spec),
		)
		.patch(
			"/append",
			routes.file.text.append.handle,
			describeRoute(routes.file.text.append.spec),
		);

	const fileBytes = new Hono()
		.get(
			"/read",
			routes.file.bytes.read.handle,
			describeRoute(routes.file.bytes.read.spec),
		)
		.post(
			"/write",
			routes.file.bytes.write.handle,
			describeRoute(routes.file.bytes.write.spec),
		)
		.patch(
			"/append",
			routes.file.bytes.append.handle,
			describeRoute(routes.file.bytes.append.spec),
		);

	const fileBase = new Hono()
		.route("/text", fileText)
		.route("/bytes", fileBytes)
		.post(
			"/create",
			routes.file.create.handle,
			describeRoute(routes.file.create.spec),
		)
		.get(
			"/exists",
			routes.file.exists.handle,
			describeRoute(routes.file.exists.spec),
		)
		.post(
			"/copy",
			routes.file.copy.handle,
			describeRoute(routes.file.copy.spec),
		)
		.post(
			"/move",
			routes.file.move.handle,
			describeRoute(routes.file.move.spec),
		)
		.delete(
			"/delete",
			routes.file.delete.handle,
			describeRoute(routes.file.delete.spec),
		);

	// directory operations

	const directoryBase = new Hono()
		.post(
			"/create",
			routes.directory.create.handle,
			describeRoute(routes.directory.create.spec),
		)
		.delete(
			"/delete",
			routes.directory.delete.handle,
			describeRoute(routes.directory.delete.spec),
		)
		.get(
			"/exists",
			routes.directory.exists.handle,
			describeRoute(routes.directory.exists.spec),
		)
		.get(
			"/files",
			routes.directory.files.handle,
			describeRoute(routes.directory.files.spec),
		);

	// mount
	app.route("/files", fileBase);
	app.route("/directory", directoryBase);

	return app;
}

export default getApp;
