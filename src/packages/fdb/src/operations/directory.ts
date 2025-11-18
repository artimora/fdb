import { randomUUID } from "node:crypto";
import nodePath from "node:path";
import type { Kysely } from "kysely";
import type { DirectoryOperations, FDB } from "../types";

export default function getDirectoryOperations(
	db: Kysely<FDB>,
): DirectoryOperations {
	return {
		create: async function (path: string): Promise<void> {
			if (await this.exists(path)) return;

			const parts = path.split(nodePath.sep);
			console.log(parts);

			let previous: string | null = null;

			for (const v of parts) {
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

				previous = id; // safe now
			}
		},
		delete: (path: string): void => {
			throw new Error("Function not implemented.");
		},
		exists: async (path: string): Promise<boolean> => {
			const parts = path.split(nodePath.sep).filter(Boolean);
			let previous: string | null = null;

			for (const v of parts) {
				// Try to find the folder at this level
				const row = await db
					.selectFrom("folders")
					.select(["uuid"])
					.where("name", "=", v)
					.where("workspace_uuid", "=", "default")
					.where("parent_folder", "is", previous)
					.executeTakeFirst();

				if (!row) return false;

				previous = row.uuid;
			}

			return true;
		},
		getFiles: (path: string): string[] => {
			throw new Error("Function not implemented.");
		},
	};
}
