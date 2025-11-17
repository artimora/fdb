import type { fdb } from "@copperdevs/fdb";
import type { DescribeRouteOptions } from "hono-openapi";
import app from "./handler";
import routes from "./routes";
import type { APICallback, APIRoute, fdbWeb, MountingOptions } from "./types";

const defaultOptions: MountingOptions = { base: "/api/fdb" };

export function getHandler(
	fdb: fdb,
	mountingOptions?: MountingOptions,
): fdbWeb {
	return (fdb && {
		// biome-ignore lint/suspicious/noExplicitAny: generic
		mount: (request: Request, ...args: any) => {
			return app(mountingOptions ?? defaultOptions).fetch(request, args);
		},
		routes: routes,
	}) as fdbWeb;
}

export function createRoute(
	handle: APICallback,
	spec: DescribeRouteOptions,
): APIRoute {
	return { spec, handle };
}
