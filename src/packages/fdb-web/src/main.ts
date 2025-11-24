import type { fdb } from "@artimora/fdb";
import type { DescribeRouteOptions } from "hono-openapi";
import app from "./handler";
import routes from "./routes";
import type {
	APICallback,
	APICallbackContext,
	APIRoute,
	fdbWeb,
	MountingOptions,
} from "./types";

const defaultOptions: MountingOptions = { base: "/api/fdb" };

export function getHandler(
	fdb: fdb,
	mountingOptions?: MountingOptions,
): fdbWeb {
	return (fdb && {
		// biome-ignore lint/suspicious/noExplicitAny: generic
		fetch: (request: Request, ...args: any) => {
			return app(mountingOptions ?? defaultOptions, fdb).fetch(request, args);
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

export function getFDB(c: APICallbackContext) {
	// @ts-expect-error
	return c.get("fdb") as fdb;
}
