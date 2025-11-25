import { cleanPath, FileNotFoundError } from "@artimora/fdb";
import { createRoute, getFDB } from "../../../main";
import type { APIRoute } from "../../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const path = cleanPath(c.req.query("path")!);
		const text = await c.req.text();

		try {
			await fdb.file.writeAllText(path, text);
		} catch (error) {
			if (error instanceof FileNotFoundError) {
				c.status(400);
				return c.json({ message: error.message });
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
		responses: {
			200: {
				description: "File was successfully written to",
				content: {
					"application/json": {
						schema: {
							type: "boolean",
						},
					},
				},
			},
			400: {
				description: "File attempted to be written to does not exist",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								message: { type: "string" },
							},
						},
					},
				},
			},
		},
	},
) satisfies APIRoute as APIRoute;
