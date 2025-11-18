import { randomUUID } from "node:crypto";
import type { Kysely } from "kysely";
import type { DirectoryOperations, FDB } from "../types";
import { splitPath } from "../util";

export default function getDirectoryOperations(
	db: Kysely<FDB>,
): DirectoryOperations {
	return {
		create: async function (path: string | undefined): Promise<void> {
			if (path === undefined) return;
			if (await this.exists(path)) return; // direct checking

			const parts = splitPath(path);
			console.log(parts);

			let previous: string | null = null;
			let built: string = "";

			for (const v of parts) {
				built = `${built}/${v}`;

				const previousPart = await db
					.selectFrom("folders")
					.select(["uuid"])
					.where("name", "=", v)
					.where("workspace_uuid", "=", "default")
					.where("parent_folder", "is", previous)
					.executeTakeFirst();

				console.log(`built: ${built} | exists: ${previousPart !== undefined}`);

				if (previousPart === undefined) {
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
				} else {
					previous = previousPart.uuid;
				}
			}
		},
		delete: (path: string | undefined): void => {
			throw new Error("Function not implemented.");
		},
		exists: async (path: string | undefined): Promise<boolean> => {
			if (path === undefined) return false;

			const parts = splitPath(path);
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
		getFiles: (path: string | undefined): string[] => {
			throw new Error("Function not implemented.");
		},
	};
}
