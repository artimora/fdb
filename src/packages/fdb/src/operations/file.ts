import type { Kysely } from "kysely";
import { FileNotFoundError } from "../errors";
import type { DirectoryOperations, FDB, FileOperations } from "../types";
import { splitPath } from "../util";

export default function getFileOperations(
	db: Kysely<FDB>,
	directory: DirectoryOperations,
): FileOperations {
	return {
		writeAllText: (path: string | undefined, text: string): void => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");

			const split = splitPath(path);

			const hasFolder = split.length > 1;

			let parentFolder: string | undefined;

			if (hasFolder) {
				directory.create(split.join("/"));
			}

			console.log("yes");
		},
		appendAllText: (path: string | undefined, text: string): void => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");
		},
		readAllText: (path: string | undefined): string => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");

			return "";
		},
		writeAllBytes: (path: string | undefined, bytes: Uint8Array): void => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");
		},
		appendAllBytes: (path: string | undefined, bytes: Uint8Array): void => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");
		},
		readAllBytes: (path: string | undefined): Uint8Array => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");

			return new Uint8Array();
		},
		create: (path: string | undefined): void => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");
		},
		exists: (path: string | undefined): boolean => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");

			return false;
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
			if (path === undefined) throw new FileNotFoundError("Path is undefined");
		},
		delete: (path: string | undefined): void => {
			if (path === undefined) throw new FileNotFoundError("Path is undefined");
		},
	};
}
