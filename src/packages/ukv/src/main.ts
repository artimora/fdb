import type { Kysely } from "kysely";
import type { MaybePromise, Operations, Potential, UKV } from "./types";
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
		this.getAll = this.operations.getAll;
		this.remove = this.operations.remove;
		this.removeAll = this.operations.removeAll;
	}

	// base
	get: (
		input: string | { key: string; workspace: string }
	) => MaybePromise<string>;
	set: (
		input:
			| { key: string; value: string }
			| { key: string; value: string; workspace: string }
	) => MaybePromise<void>;

	// extra
	getAll: (workspace?: Potential<string>) => MaybePromise<void>;

	// managment
	remove: (
		input: string | { key: string; workspace: string }
	) => MaybePromise<void>;
	removeAll: (workspace?: Potential<string>) => MaybePromise<void>;
}
