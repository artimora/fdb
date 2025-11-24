import type { fdb, MaybePromise } from "@artimora/fdb";
import type { Context, TypedResponse } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { InvalidJSONValue, JSONParsed, JSONValue } from "hono/utils/types";
import type { DescribeRouteOptions } from "hono-openapi";
import type routes from "./routes";

// hono mimic type
type JSONRespondReturn<
	// biome-ignore lint/complexity/noBannedTypes: hono type mimic
	T extends JSONValue | {} | InvalidJSONValue,
	U extends ContentfulStatusCode,
> = Response & TypedResponse<JSONParsed<T>, U, "json">;

export type APICallbackContext =
	// biome-ignore lint/suspicious/noExplicitAny: hono type mimc
	Context<BlankEnv, string, any> | Context<BlankEnv, string, BlankInput>;

// hono mimic type
type Data = string | ArrayBuffer | ReadableStream | Uint8Array<ArrayBuffer>;

export type APICallbackResponse = Response &
	(
		| TypedResponse<Data, ContentfulStatusCode, "text">
		| TypedResponse<Data, ContentfulStatusCode, "body">
		// biome-ignore lint/suspicious/noExplicitAny: generic
		| TypedResponse<Data, ContentfulStatusCode, any>
		// biome-ignore lint/suspicious/noExplicitAny: generic
		| JSONRespondReturn<any, ContentfulStatusCode>
	);

export type APICallback = (
	c: APICallbackContext,
) => MaybePromise<APICallbackResponse>;

export type APIRoute = {
	handle: APICallback;
	spec: DescribeRouteOptions;
};

export type MountingOptions = {
	base: string | undefined;
};

export type fdbWeb = fdb & {
	fetch: (
		request: Request,
		// biome-ignore lint/suspicious/noExplicitAny: generic
		...args: any
	) => MaybePromise<Response>;
	routes: typeof routes;
};

export type FileInfo = {
	path: string;
};
