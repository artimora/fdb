import { randomUUID } from "node:crypto";
import type { Kysely } from "kysely";
import { DirectoryNotFoundError } from "../errors";
import type {
	DirectoryOperations,
	FDB,
	Maybe,
	Nullable,
	Potential,
} from "../types";
import { splitPath } from "../util";

export default function getDirectoryOperations(
	db: Kysely<FDB>,
): DirectoryOperations {
	return {
		create: async function (path: Potential<string>): Promise<void> {
			if (path === undefined)
				throw new DirectoryNotFoundError("Path is undefined");
			if (await this.exists(path)) return; // direct checking if it already exists

			const parts = splitPath(path);
			console.log(parts);

			let previous: Nullable<string> = null;
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
		delete: (path: Potential<string>): void => {
			throw new Error("Function not implemented.");
		},
		exists: async (path: Maybe<string>): Promise<boolean> => {
			if (path === null) return false;
			if (path === undefined) return false;

			const parts = splitPath(path);

			if (parts.length <= 0) return false;

			let previous: Nullable<string> = null;

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
		getFiles: (path: Potential<string>): string[] => {
			if (path === undefined)
				throw new DirectoryNotFoundError("Path is undefined");
			throw new Error("Function not implemented.");
		},
		getFolderId: async (path: Maybe<string>): Promise<Nullable<string>> => {
			if (path === null) return null;
			if (path === undefined)
				throw new DirectoryNotFoundError("Path is undefined");

			const parts = splitPath(path);
			let previous: Nullable<string> = null;

			for (const v of parts) {
				// Try to find the folder at this level
				const row = await db
					.selectFrom("folders")
					.select(["uuid"])
					.where("name", "=", v)
					.where("workspace_uuid", "=", "default")
					.where("parent_folder", "is", previous)
					.executeTakeFirst();

				if (!row) return null;

				previous = row.uuid;
			}

			return previous;
		},
	};
}
