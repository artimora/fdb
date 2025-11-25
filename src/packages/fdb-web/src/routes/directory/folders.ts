import { cleanPath, type DirectoryGetOptions } from "@artimora/fdb";
import { createRoute, getFDB } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	async (c) => {
		const fdb = getFDB(c);
		const path = cleanPath(c.req.query("path")!);

		const options: DirectoryGetOptions = {
			path,
			recursive: JSON.parse(c.req.query("recursive") ?? "true"),
		};
		const folders = await fdb.directory.getFolders(options);

		if (folders === null) {
			c.status(404);
			return c.json(null);
		}

		return c.json(folders);
	},
	{
		summary: "Get Folders",
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
		],
		responses: {
			200: {
				description: "Folders for given directory were retrieved successfully",
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
								},
							},
						},
					},
				},
			},
			404: {
				description: "Folders for given directory were not found",
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
