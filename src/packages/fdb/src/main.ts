import type { Kysely } from "kysely";
import getDirectoryOperations from "./operations/directory";
import getFileOperations from "./operations/file";
import type { DirectoryOperations, FileOperations } from "./types";

export function createFDB<DB>(db: Kysely<DB>) {
	return new fdb<DB>(db);
}

export class fdb<DB> {
	private db: Kysely<DB>;

	public file: FileOperations = getFileOperations();
	public directory: DirectoryOperations = getDirectoryOperations();

	constructor(db: Kysely<DB>) {
		this.db = db;
	}
}
