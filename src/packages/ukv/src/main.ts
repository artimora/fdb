import type { Kysely } from "kysely";
import getOperations from "./operations";
import type { Operations, Options, UKV } from "./types";

export function createUKV<DB>(
	db: Kysely<DB>,
	options?:
		| {
				defaultWorkspace?: string;
		  }
		| Options
): ukv {
	return new ukv(db as unknown as Kysely<UKV>, {
		defaultWorkspace: [undefined, null, ""].includes(
			options?.defaultWorkspace
		)
			? "default"
			: options?.defaultWorkspace ?? "default"
	});
}

export class ukv implements Operations {
	private db: Kysely<UKV>;

	private operations: Operations;

	private options: Options;

	constructor(db: Kysely<UKV>, options: Options) {
		this.db = db;
		this.options = options;
		this.operations = getOperations(this.db, this.options);

		this.get = this.operations.get;
		this.set = this.operations.set;
		this.remove = this.operations.remove;
		this.exists = this.operations.exists;
		this.keys = this.operations.keys;
	}
	get: (
		input?:
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
		input?:
			| string
			| { key: string; workspace: string }
			| { workspace: string }
			| undefined
	) => Promise<bigint>;
	exists: (
		input: string | { key: string; workspace: string }
	) => Promise<boolean>;
	keys: (workspace?: string) => Promise<string[]>;
}
