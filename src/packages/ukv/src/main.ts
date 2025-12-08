import type { Kysely } from "kysely";
import type { UKV } from "./types";

export function createUKV<DB>(db: Kysely<DB>): ukv {
	return new ukv(db as unknown as Kysely<UKV>);
}

export class ukv {
	private db: Kysely<UKV>;

	constructor(db: Kysely<UKV>) {
		this.db = db;
	}
}
