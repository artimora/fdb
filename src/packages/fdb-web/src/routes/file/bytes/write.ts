import { cleanPath, FileNotFoundError } from "@artimora/fdb";
import { createRoute, getFDB } from "../../../main";
import type { APIRoute } from "../../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const path = cleanPath(c.req.query("path")!);
		const buffer = await c.req.arrayBuffer();

		try {
			await fdb.file.writeAllBytes(path, new Uint8Array(buffer));
		} catch (error) {
			if (error instanceof FileNotFoundError) {
				c.status(400);
				return c.json({ message: error.message });
			}
		}

		return c.json(true);
	},
	{
		summary: "Write Bytes",
		tags: ["File (Bytes)"],
		requestBody: {
			required: true,
			content: {
				"application/octet-stream": {},
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
