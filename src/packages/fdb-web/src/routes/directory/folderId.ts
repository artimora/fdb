import { cleanPath } from "@artimora/fdb";
import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);
		const path = cleanPath(c.req.query("path")!);

		const exists = await fdb.directory.getFolderId(path);

		if (exists === null) {
			c.status(404);
			return c.json(null);
		}

		return c.json(exists);
	},
	{
		summary: "Get Folder ID",
		tags: ["Directory"],

		parameters: [
			{
				name: "path",
				in: "query",
				description: "Status values that need to be searched for",
				required: true,
				schema: {
					type: "string",
				},
			},
		],
		responses: {
			200: {
				description: "Directory ID was retrieved successfully",
				content: {
					"application/json": {
						schema: {
							type: "boolean",
						},
					},
				},
			},
			404: {
				description: "Directory ID was not found",
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
