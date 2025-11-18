import type { Kysely } from "kysely";
import getDirectoryOperations from "./operations/directory";
import getFileOperations from "./operations/file";
import type { DirectoryOperations, FDB, FileOperations } from "./types";

export function createFDB<DB>(db: Kysely<DB>) {
	return new fdb(db as unknown as Kysely<FDB>);
}

export class fdb {
	private db: Kysely<FDB>;

	public file: FileOperations;
	public directory: DirectoryOperations;

	constructor(db: Kysely<FDB>) {
		this.db = db;
		this.directory = getDirectoryOperations(this.db);
		this.file = getFileOperations(this.db, this.directory);
	}
}
