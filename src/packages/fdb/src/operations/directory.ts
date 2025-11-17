import { randomUUID } from "node:crypto";
import nodePath from "node:path";
import type { Kysely } from "kysely";
import type { DirectoryOperations, FDB } from "../types";

export default function getDirectoryOperations(
	db: Kysely<FDB>,
): DirectoryOperations {
	return {
		create: async (path: string): Promise<void> => {
			const parts = path.split(nodePath.sep);
			console.log(parts);

			let previous: string | null = null;

			parts.forEach(async (v) => {
				const id = randomUUID() as string;
				await db
					.insertInto("folders")
					.values({
						uuid: id,
						name: v,
						workspace_uuid: "default",
						parent_folder: previous,
					})
					.execute();

				previous = id;
			});
		},
		delete: (path: string): void => {
			throw new Error("Function not implemented.");
		},
		exists: (path: string): boolean => {
			throw new Error("Function not implemented.");
		},
		getFiles: (path: string): string[] => {
			throw new Error("Function not implemented.");
		},
	};
}
