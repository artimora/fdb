import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const exists = await fdb.directory.exists(c.req.query("path"));

		return c.json(exists);
	},
	{
		summary: "Directory Exists",
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
				description: "Directory was checked successfully",
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
