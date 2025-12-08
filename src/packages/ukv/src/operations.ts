import type { Kysely } from "kysely";
import type { MaybePromise, Operations, Potential, UKV } from "./types";

export default function getOperations(db: Kysely<UKV>): Operations {
	return {
		get: function (
			input: string | { key: string; workspace: string }
		): MaybePromise<string> {
			throw new Error("Function not implemented.");
		},
		set: function (
			input:
				| { key: string; value: string }
				| { key: string; value: string; workspace: string }
		): MaybePromise<void> {
			throw new Error("Function not implemented.");
		},
		getAll: function (workspace?: Potential<string>): MaybePromise<void> {
			throw new Error("Function not implemented.");
		},
		remove: function (
			input: string | { key: string; workspace: string }
		): MaybePromise<void> {
			throw new Error("Function not implemented.");
		},
		removeAll: function (
			workspace?: Potential<string>
		): MaybePromise<void> {
			throw new Error("Function not implemented.");
		}
	};
}
