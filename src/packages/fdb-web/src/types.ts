import type { fdb } from "@copperdevs/fdb";
import type { Context, TypedResponse } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { DescribeRouteOptions } from "hono-openapi";
import type routes from "./routes";

export type APICallbackContext =
	| Context<BlankEnv, string, any>
	| Context<BlankEnv, string, BlankInput>;

export type APICallbackResponse = Response &
	TypedResponse<string, ContentfulStatusCode, "text">;

export type APICallback = (
	c: APICallbackContext,
) => Promise<APICallbackResponse> | APICallbackResponse;

export type APIRoute = {
	handle: APICallback;
	spec: DescribeRouteOptions;
};

export type MountingOptions = {
	base: string | undefined;
};

export type fdbWeb = fdb & {
	mount: (
		request: Request,
		// biome-ignore lint/suspicious/noExplicitAny: generic
		...args: any
	) => Response | Promise<Response>;
	routes: typeof routes;
};

export type FileInfo = {
	path: string;
};
