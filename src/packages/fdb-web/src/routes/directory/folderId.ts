import { splitPath } from "@copperdevs/fdb/src/util";
import { createRoute, getFDB } from "../../main";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const exists = await fdb.directory.getFolderId(c.req.query("path"));

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
	},
);
