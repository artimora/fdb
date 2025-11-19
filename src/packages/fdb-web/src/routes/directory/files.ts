import { createRoute, getFDB } from "../../main";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const files = await fdb.directory.getFiles(c.req.query("path"));

		if (files === null) {
			c.status(404);
			return c.json(null);
		}

		return c.json(files);
	},
	{
		summary: "Get Files",
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
				description: "Files for given directory were retrieved successfully",
				content: {
					"application/json": {
						schema: {
							type: "array",
							items: {
								type: "string",
							},
						},
					},
				},
			},
			404: {
				description: "Files for given directory were not found",
				content: {
					"application/json": {
						schema: {
							type: "null",
						},
					},
				},
			},
		},
	},
);
