import { cleanPath, FileNotFoundError } from "@artimora/fdb";
import { createRoute, getFDB } from "../../../main";
import type { APIRoute } from "../../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const path = cleanPath(c.req.query("path")!);

		try {
			const text = await fdb.file.readAllBytes(path);
			c.header("Content-Type", "application/octet-stream");
			return c.body(new Uint8Array(text));
		} catch (error) {
			if (error instanceof FileNotFoundError) {
				c.status(400);
				return c.json({ message: error.message });
			}
		}

		// this could have a better return maybe?
		c.status(400);
		return c.json({ message: "generic" });
	},
	{
		summary: "Read Bytes",
		tags: ["File (Bytes)"],

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
					"application/octet-stream": {
						schema: {},
					},
				},
			},
			400: {
				description: "File attempting to be read doesn't exist",
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
