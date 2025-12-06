import { randomUUID } from "node:crypto";
import type { Kysely } from "kysely";
import { FileError, FileNotFoundError } from "../errors";
import type {
	DirectoryOperations,
	FDB,
	FileMoveOptions,
	FileOperations,
	Maybe,
	Potential
} from "../types";
import { cleanPath, splitPath } from "../util";

export default function getFileOperations(
	db: Kysely<FDB>,
	directory: DirectoryOperations
): FileOperations {
	async function getPathInfo(path: string) {
		const split = splitPath(path);

		if (split === undefined) throw new FileError("Path is undefined");

		const hasParent = split.length > 1;

		const parent = hasParent
			? split.slice(0, split.length - 1).join("/")
			: null;

		const parentId = await directory.getFolderId(parent);

		const name = (
			hasParent
				? split[split.length - 1]
				: cleanPath(path)!.startsWith("/")
				? path.slice(1)
				: path
		) as string;

		return {
			split,
			hasParent,
			parent,
			parentId,
			name
		};
	}

	return {
		writeAllText: async function (
			path: Potential<string>,
			text: Maybe<string>
		): Promise<void> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");

			if (text === undefined || text === null) {
				await this.create(path);
				return;
			}

			await this.writeAllBytes(path, new TextEncoder().encode(text));
		},
		readAllText: async function (path: Potential<string>): Promise<string> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			await this.create(path);

			const bytes = await this.readAllBytes(path);
			return new TextDecoder().decode(bytes);
		},
		writeAllBytes: async function (
			path: string | undefined,
			bytes: Maybe<Uint8Array>
		): Promise<void> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");

			if (bytes === undefined || bytes === null) {
				await this.create(path);
				return;
			}

			await this.create(path);

			const { parentId, name } = await getPathInfo(path);

			await db
				.updateTable("files")
				.set({
					data: Buffer.from(bytes)
				})
				.where("name", "=", name)
				.where("parent_folder", "is", parentId)
				.where("workspace_uuid", "=", "default")
				.executeTakeFirst();
		},
		readAllBytes: async function (
			path: Potential<string>
		): Promise<Uint8Array> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");

			await this.create(path);

			const { parentId, name } = await getPathInfo(path);

			const rawData = await db
				.selectFrom("files")
				.select(["data"])
				.where("name", "=", name)
				.where("parent_folder", "is", parentId)
				.where("workspace_uuid", "=", "default")
				.executeTakeFirst();

			if (rawData === undefined) {
				return new Uint8Array([]);
			}

			const data = rawData.data;

			if (data === null) {
				return new Uint8Array([]);
			}

			return data;
		},
		create: async function (path: Potential<string>): Promise<void> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			if (await this.exists(path)) return; // direct checking if it already exists

			let { hasParent, parent, parentId, name } = await getPathInfo(path);

			if (hasParent && parent !== null) {
				await directory.create(parent);
				parentId = await directory.getFolderId(parent);
			}

			const id = randomUUID() as string;

			await db
				.insertInto("files")
				.values({
					uuid: id,
					name: name,
					workspace_uuid: "default",
					parent_folder: parentId
				})
				.execute();
		},
		exists: async (path: Potential<string>): Promise<boolean> => {
			if (!path) return false;

			const { parentId, name } = await getPathInfo(path);

			if (parentId === undefined) return false;

			const row = await db
				.selectFrom("files")
				.select(["uuid"])
				.where("name", "=", name)
				.where("workspace_uuid", "=", "default")
				.where("parent_folder", "is", parentId)
				.executeTakeFirst();

			return row !== undefined && row !== null;
		},

		copy: async function (options: Maybe<FileMoveOptions>): Promise<void> {
			if (options === undefined || options === null)
				throw new FileError("Options is undefined");

			options.overwrite ??= true;
			options.createDirectories ??= true;

			if (options.originalPath === undefined)
				throw new FileNotFoundError("Original path is undefined");
			if (options.newPath === undefined)
				throw new FileNotFoundError("New path is undefined");

			if (!(await this.exists(options.originalPath)))
				throw new FileNotFoundError("Original path doesn't exist");
			if ((await this.exists(options.newPath)) && !options.overwrite)
				throw new FileNotFoundError("New path already exists");

			const originalPath = await getPathInfo(options.originalPath);
			const newPath = await getPathInfo(options.newPath);

			if (options.overwrite && (await this.exists(options.newPath))) {
				await this.delete(options.newPath);
			}

			await this.create(options.newPath);

			const fileData = await db
				.selectFrom("files")
				.select(["data"])
				.where("name", "=", originalPath.name)
				.where("parent_folder", "is", originalPath.parentId)
				.where("workspace_uuid", "=", "default")
				.executeTakeFirst();

			if (!fileData) {
				throw new FileNotFoundError(
					`File at path ${options.originalPath} not found`
				);
			}

			await db
				.updateTable("files")
				.set({
					data: fileData.data
				})
				.where("name", "=", newPath.name)
				.where("parent_folder", "is", newPath.parentId)
				.where("workspace_uuid", "=", "default")
				.executeTakeFirst();
		},
		move: async function (options: Maybe<FileMoveOptions>): Promise<void> {
			if (options === undefined || options === null)
				throw new FileError("Options is undefined");

			await this.copy(options);
			await this.delete(options.originalPath);
		},
		delete: async (path: string | undefined): Promise<void> => {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");

			const { parentId, name } = await getPathInfo(path);

			await db
				.deleteFrom("files")
				.where("name", "=", name)
				.where("parent_folder", "is", parentId)
				.where("workspace_uuid", "=", "default")
				.execute();
		}
	};
}
