import type { Kysely } from "kysely";
import type { Operations, UKV } from "./types";
import getOperations from "./operations";

export function createUKV<DB>(db: Kysely<DB>): ukv {
	return new ukv(db as unknown as Kysely<UKV>);
}

export class ukv implements Operations {
	private db: Kysely<UKV>;

	private operations: Operations;

	constructor(db: Kysely<UKV>) {
		this.db = db;
		this.operations = getOperations(this.db);

		this.get = this.operations.get;
		this.set = this.operations.set;
		this.remove = this.operations.remove;
		this.exists = this.operations.exists;
	}

	get: (
		input:
			| string
			| { key: string; workspace: string }
			| { workspace: string }
			| undefined
	) => Promise<string | { key: string; value: string }[] | undefined>;

	set: (
		input:
			| { key: string; value: string }
			| { key: string; value: string; workspace: string }
	) => Promise<void>;

	remove: (
		input:
			| string
			| { key: string; workspace: string }
			| { workspace: string }
			| undefined
	) => Promise<bigint>;

	exists: (
		input: string | { key: string; workspace: string }
	) => Promise<boolean>;
}
