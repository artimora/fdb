import { cleanPath } from "@artimora/fdb";
import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);
		const path = cleanPath(c.req.query("path")!);

		if (await fdb.file.exists(path)) {
			c.status(400);
			return c.json(false);
		}
		fdb.file.create(path);

		return c.json(true);
	},
	{
		summary: "Create File",
		tags: ["File"],

		parameters: [
			{
				name: "path",
				in: "query",
				description: "Status values of the path of the file to create",
				required: true,
				schema: {
					type: "string",
				},
			},
		],
	},
) satisfies APIRoute as APIRoute;
