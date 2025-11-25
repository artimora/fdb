import { cleanPath, type FileGetOptions } from "@artimora/fdb";
import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);
		
		const path = cleanPath(c.req.query("path")!);

		const options: FileGetOptions = {
			path,
			recursive: JSON.parse(c.req.query("recursive") ?? "true"),
			data: JSON.parse(c.req.query("data") ?? "false"),
		};

		const files = await fdb.directory.getFiles(options);

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
				schema: {
					type: "string",
				},
			},
			{
				name: "recursive",
				in: "query",
				description: "Whether to recursively get files",
				schema: {
					type: "boolean",
					default: true,
				},
			},
			{
				name: "data",
				in: "query",
				description: "Whether to include file data",
				schema: {
					type: "boolean",
					default: false,
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
								type: "object",
								properties: {
									uuid: { type: "string" },
									name: { type: "string" },
									workspace_uuid: { type: "string" },
									parent_folder: { type: "string" },
									data: { type: "string", format: "byte" },
								},
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
) satisfies APIRoute as APIRoute;
