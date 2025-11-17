import type { Kysely } from "kysely";
import type { DirectoryOperations, FDB } from "../types";

export default function getDirectoryOperations(
	db: Kysely<FDB>,
): DirectoryOperations {
	return {
		create: (path: string): void => {
			throw new Error("Function not implemented.");
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
