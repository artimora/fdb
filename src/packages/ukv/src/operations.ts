import type { Kysely } from "kysely";
import type {
	GetInput,
	MaybePromise,
	Operations,
	SetInput,
	UKV,
	UKVTable
} from "./types";

export default function getOperations(db: Kysely<UKV>): Operations {
	return {
		get: function (input: GetInput): MaybePromise<string> {
			throw new Error("Function not implemented.");
		},
		set: function (input: SetInput): MaybePromise<void> {
			throw new Error("Function not implemented.");
		}
	};
}
