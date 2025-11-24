import { type FileMoveOptions, FileNotFoundError } from "@artimora/fdb";
import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);

		const originalPath = c.req.query("originalPath");
		const newPath = c.req.query("newPath");
		const overwrite = c.req.query("overwrite");
		const createDirectories = c.req.query("createDirectories");

		const options: FileMoveOptions = {
			originalPath,
			newPath,
			overwrite: JSON.parse(overwrite ?? "true"),
			createDirectories: JSON.parse(createDirectories ?? "true"),
		};

		console.log(options);

		try {
			await fdb.file.move(options);
			return c.json(true);
		} catch (error) {
			if (error instanceof FileNotFoundError) {
				c.status(400);
				return c.json({ message: error.message });
			}
		}

		c.status(400);
		return c.json({ message: "generic" });
	},
	{
		summary: "Move File",
		tags: ["File"],

		parameters: [
			{
				name: "originalPath",
				in: "query",
				description: "Target path to move from",
				required: true,
				schema: {
					type: "string",
				},
			},
			{
				name: "newPath",
				in: "query",
				description: "Target path to move to",
				required: true,
				schema: {
					type: "string",
				},
			},
			{
				name: "overwrite",
				in: "query",
				description: "Whether to overwrite the file if it already exists",
				required: false,
				schema: {
					type: "boolean",
					default: true,
				},
			},
			{
				name: "createDirectories",
				in: "query",
				description: "Whether to create directories if they don't exist",
				required: false,
				schema: {
					type: "boolean",
					default: true,
				},
			},
		],
		responses: {
			200: {
				description: "File was successfully moved",
				content: {
					"application/json": {
						schema: {
							type: "boolean",
						},
					},
				},
			},
			400: {
				description: "File could not be moved",
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
