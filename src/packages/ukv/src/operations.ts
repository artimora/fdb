import type { Kysely } from "kysely";
import type { MaybePromise, Operations, Potential, UKV } from "./types";

export default function getOperations(db: Kysely<UKV>): Operations {
	return {
		get: function (
			input: string | { key: string; workspace: string }
		): Promise<string> {},

		set: async function (
			input:
				| { key: string; value: string }
				| { key: string; value: string; workspace: string }
		): Promise<void> {
			let value: { key: string; value: string; workspace: string };

			if ("workspace" in input) {
				value = input;
			} else {
				value = { ...input, workspace: "default" };
			}

			await db.insertInto("ukv").values(value).execute();
		},

		getAll: function (workspace?: Potential<string>): Promise<string[]> {},

		remove: function (
			input: string | { key: string; workspace: string }
		): Promise<void> {},

		removeAll: function (workspace?: Potential<string>): Promise<void> {}
	};
}
