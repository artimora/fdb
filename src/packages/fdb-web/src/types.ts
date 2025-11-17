import type { Context, TypedResponse } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { DescribeRouteOptions } from "hono-openapi";

// Aliases for Hono API callback and description
export type APICallback = (
	c: Context<BlankEnv, string, any> | Context<BlankEnv, string, BlankInput>,
) => Response & TypedResponse<string, ContentfulStatusCode, "text">;

export type APIRoute = {
	handle: APICallback;
	spec: DescribeRouteOptions;
};

export function createRoute(
	handle: APICallback,
	spec: DescribeRouteOptions,
): APIRoute {
	return { spec, handle };
}
