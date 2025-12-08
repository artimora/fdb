import type { Kysely } from "kysely";
import type {
	GetInput,
	MaybePromise,
	Operations,
	SetInput,
	UKV
} from "./types";
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
	}

	get: (input: GetInput) => MaybePromise<string>;
	set: (input: SetInput) => MaybePromise<void>;
}
