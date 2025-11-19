import { FileNotFoundError } from "@copperdevs/fdb";
import { createRoute, getFDB } from "../../../main";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const path = c.req.query("path");
		const text = await c.req.text();

		try {
			await fdb.file.writeAllText(path, text);
		} catch (error) {
			if (error instanceof FileNotFoundError) {
				c.status(400);
				return c.json(false);
			}
		}

		return c.json(true);
	},
	{
		summary: "Write Text",
		tags: ["File (Text)"],
		requestBody: {
			required: true,
			content: {
				"text/plain": {
					schema: { type: "string" },
				},
			},
		},
		parameters: [
			{
				name: "path",
				in: "query",
				required: true,
				schema: { type: "string" },
				description: "Path where the text will be written",
			},
		],
	},
);
