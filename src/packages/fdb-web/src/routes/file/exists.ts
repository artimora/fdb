import { cleanPath } from "@artimora/fdb";
import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);
		const path = cleanPath(c.req.query("path")!);

		const exists = await fdb.file.exists(path);

		return c.json(exists);
	},
	{
		summary: "File Exists",
		tags: ["File"],

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
	},
) satisfies APIRoute as APIRoute;
