import { FileNotFoundError } from "@copperdevs/fdb";
import { createRoute, getFDB } from "../../../main";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const path = c.req.query("path");

		try {
			const text = await fdb.file.readAllText(path);
			return c.text(text);
		} catch (error) {
			if (error instanceof FileNotFoundError) {
				c.status(400);
				return c.json(false);
			}
		}

		// this could have a better return maybe?
		c.status(400);
		return c.json(false);
	},
	{
		summary: "Read Text",
		tags: ["File (Text)"],

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
				description: "File was successfully read",
				content: {
					"application/json": {
						schema: {
							type: "string",
						},
					},
				},
			},
			400: {
				description: "File attempting to be read doesn't exist",
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
);
