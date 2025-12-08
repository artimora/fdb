import { randomUUID } from "node:crypto";
import path from "node:path";
import type { Kysely } from "kysely";
import { DirectoryError, DirectoryNotFoundError } from "../errors";
import type {
	DirectoryDeleteOptions,
	DirectoryGetOptions,
	DirectoryOperations,
	FDB,
	FileGetOptions,
	FilesTable,
	FoldersTable,
	Maybe,
	Nullable,
	Potential
} from "../types";
import { splitPath } from "../util";

export default function getDirectoryOperations(
		db: Kysely<FDB>
	): DirectoryOperations {
		return {
			create: async function (path: Potential<string>): Promise<void> {
				if (path === undefined || path === "")
					throw new DirectoryNotFoundError("Path is undefined");
				if (await this.exists(path)) return; // direct checking if it already exists

				const parts = splitPath(path);

			if (parts === undefined)
				throw new DirectoryError("Path is undefined");

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

				if (previousPart === undefined) {
					const id = randomUUID() as string;

					await db
						.insertInto("folders")
						.values({
							uuid: id,
							name: v,
							workspace_uuid: "default",
							parent_folder: previous
						})
						.execute();

					previous = id; // safe now
				} else {
					previous = previousPart.uuid;
				}
			}
		},
		delete: async function (
			options: Maybe<DirectoryDeleteOptions>
		): Promise<void> {
			if (options === null || options === undefined)
				throw new DirectoryError("options is null");

			if (options.path === undefined)
				throw new DirectoryNotFoundError("Path is undefined");

			if (!(await this.exists(options.path)))
				throw new DirectoryNotFoundError("Directory doesn't exist");

			const id = await this.getFolderId(options.path);

			if (
				(await this.getFiles({ path: options.path, data: false }))
					.length > 0 &&
				options.onlyOnEmpty
			) {
				throw new DirectoryError(
					"Directry attempting to delete isn't empty."
				);
			}

			await db.deleteFrom("folders").where("uuid", "=", id).execute();
		},
		exists: async (path: Maybe<string>): Promise<boolean> => {
			if (path === null) return false;
			if (path === undefined) return false;

			const parts = splitPath(path);

			if (parts === undefined) return false;

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
		getFiles: async function (
			options: Maybe<FileGetOptions>
		): Promise<FilesTable[]> {
			if (options === null || options === undefined)
				throw new DirectoryError("options is null");

			options.recursive ??= true;
			options.data ??= false;

			let files: FilesTable[] = [];

			const rawFolders = await this.getFolders(options);
			const uuids: (string | null)[] = rawFolders.map((f) => f.uuid);

			const current = await this.getFolderId(options.path);

			if (uuids.length > 0) {
				if (options.data) {
					files = await db
						.selectFrom("files")
						.selectAll()
						.where("parent_folder", "is", uuids)
						.execute();
				} else {
					files = (
						await db
							.selectFrom("files")
							.select([
								"name",
								"uuid",
								"workspace_uuid",
								"parent_folder"
							])
							.where("parent_folder", "is", uuids)
							.execute()
					).map((f) => {
						return {
							data: null,
							uuid: f.uuid,
							name: f.name,
							parent_folder: f.parent_folder,
							workspace_uuid: f.workspace_uuid
						};
					});
				}
			}

			if (options.data) {
				const currentFile = await db
					.selectFrom("files")
					.selectAll()
					.where("parent_folder", "is", current)
					.execute();

				if (currentFile !== undefined) files.push(...currentFile);
			} else {
				const currentFile = await db
					.selectFrom("files")
					.select(["name", "uuid", "workspace_uuid", "parent_folder"])
					.where("parent_folder", "is", current)
					.execute();

				if (currentFile !== undefined)
					files.push(
						...currentFile.map((f) => {
							return {
								data: null,
								uuid: f.uuid,
								name: f.name,
								parent_folder: f.parent_folder,
								workspace_uuid: f.workspace_uuid
							};
						})
					);
			}

			return files;
		},
		getFolders: async function (
			options: Maybe<DirectoryGetOptions>
		): Promise<FoldersTable[]> {
			if (options === null || options === undefined)
				throw new DirectoryError("options is null");

			options.recursive ??= true;

			async function get(
				parent: Nullable<string>
			): Promise<FoldersTable[]> {
				const rawFolders = await db
					.selectFrom("folders")
					.selectAll()
					.where("parent_folder", "is", parent)
					.execute();

				const folders: FoldersTable[] = [];

				for (const folder of rawFolders) {
					folders.push(folder);
					if (options!.recursive) {
						folders.push(...(await get(folder.uuid)));
					}
				}

				return folders;
			}

			const folderId = await this.getFolderId(options.path);

			const folders: FoldersTable[] = [];

			folders.push(...(await get(folderId)));

			return folders;
		},
		getFolderId: async (path: Maybe<string>): Promise<Nullable<string>> => {
			if (path === null) return null;
			if (path === undefined)
				throw new DirectoryNotFoundError("Path is undefined");

			const parts = splitPath(path);

			if (parts === undefined)
				throw new DirectoryError("Path is undefined");

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
		getFolderById: async (
			uuid: Maybe<string>
		): Promise<Nullable<FoldersTable>> => {
			if (uuid == null) return null;
			const folder = await db
				.selectFrom("folders")
				.selectAll()
				.where("uuid", "=", uuid)
				.executeTakeFirst();
			return folder ?? null;
		}
	};
}
