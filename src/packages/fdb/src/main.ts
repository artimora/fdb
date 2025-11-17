import type { Kysely } from "kysely";
import type { Directory, File } from "./types";

export function createFDB<DB>(db: Kysely<DB>) {
	return new fdb<DB>(db);
}

export class fdb<DB> {
	private db: Kysely<DB>;

	public file: File = {};
	public directory: Directory = {};

	constructor(db: Kysely<DB>) {
		this.db = db;
	}
}
