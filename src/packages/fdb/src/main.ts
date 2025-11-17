import type { Kysely } from "kysely";

export function createFDB<DB>(db: Kysely<DB>) {
	return new fdb<DB>(db);
}

export class fdb<DB> {
	private db: Kysely<DB>;

	constructor(db: Kysely<DB>) {
		this.db = db;
	}
}
