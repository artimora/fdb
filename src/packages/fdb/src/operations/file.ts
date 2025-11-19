import { randomUUID } from "node:crypto";
import type { Kysely } from "kysely";
import { FileNotFoundError } from "../errors";
import type { DirectoryOperations, FDB, FileOperations } from "../types";
import { cleanPath, splitPath } from "../util";

export default function getFileOperations(
	db: Kysely<FDB>,
	directory: DirectoryOperations,
): FileOperations {
	async function getPathInfo(path: string) {
		const split = splitPath(path);

		const hasParent = split.length > 1;

		const parent = hasParent
			? split.slice(0, split.length - 1).join("/")
			: null;
		const parentId = await directory.getFolderId(parent);
		const name = (
			hasParent
				? split[split.length - 1]
				: cleanPath(path).startsWith("/")
					? path.slice(1)
					: path
		) as string;

		return {
			split,
			hasParent,
			parent,
			parentId,
			name,
		};
	}

	return {
		writeAllText: async function (
			path: string | undefined,
			text: string,
		): Promise<void> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			await this.writeAllBytes(path, new TextEncoder().encode(text));
		},
		appendAllText: async function (
			path: string | undefined,
			text: string,
		): Promise<void> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			await this.create(path);
		},
		readAllText: async function (path: string | undefined): Promise<string> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			await this.create(path);

			return "";
		},
		writeAllBytes: async function (
			path: string | undefined,
			bytes: Uint8Array,
		): Promise<void> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			await this.create(path);

			const { parentId, name } = await getPathInfo(path);

			await db
				.updateTable("files")
				.set({
					data: Buffer.from(bytes),
				})
				.where("name", "=", name)
				.where("parent_folder", "is", parentId)
				.executeTakeFirst();
		},
		appendAllBytes: async function (
			path: string | undefined,
			bytes: Uint8Array,
		): Promise<void> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			await this.create(path);
		},
		readAllBytes: async function (
			path: string | undefined,
		): Promise<Uint8Array> {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
			await this.create(path);

			return new Uint8Array();
		},
		create: async function (path: string | undefined): Promise<void> {
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
					parent_folder: parentId,
				})
				.execute();
		},
		exists: async (path: string | undefined): Promise<boolean> => {
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

		copy: (
			originalPath: string | undefined,
			newPath: string | undefined | undefined,
		): void => {
			if (originalPath === undefined)
				throw new FileNotFoundError("Original path is undefined");
			if (newPath === undefined)
				throw new FileNotFoundError("New path is undefined");
		},
		move: (path: string | undefined): void => {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
		},
		delete: (path: string | undefined): void => {
			if (path === undefined || path === "")
				throw new FileNotFoundError("Path is undefined");
		},
	};
}
