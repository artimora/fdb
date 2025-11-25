import { cleanPath } from "@artimora/fdb";
import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const path = cleanPath(c.req.query("path")!);

		if (await fdb.directory.exists(path)) {
			c.status(400);
			return c.json(false);
		}

		fdb.directory.create(path);

		return c.json(true);
	},
	{
		summary: "Create Directory",
		tags: ["Directory"],

		parameters: [
			{
				name: "path",
				in: "query",
				description: "Status values that needs to be created",
				required: true,
				schema: {
					type: "string",
				},
			},
		],
		responses: {
			200: {
				description: "Directory created successfully",
				content: {
					"application/json": {
						schema: {
							type: "boolean",
						},
					},
				},
			},
			400: {
				description: "Directory already exists",
				content: {
					"application/json": {
						schema: {
							type: "boolean",
						},
					},
				},
			},
		},
	},
) satisfies APIRoute as APIRoute;
