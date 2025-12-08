export type Potential<T> = T | undefined;
export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined | null;

export type MaybePromise<T> = Promise<T> | T;

export interface UKVTable {
	key: string;
	value: string;
	workspace: string;
}

export interface UKV {
	ukv: UKVTable;
}

export type GetInput = string | { key: string; workspace: string };
export type SetInput =
	| { key: string; value: string }
	| { key: string; value: string; workspace: string };

// potential for input, nullable for output
export interface Operations {
	get: (input: GetInput) => MaybePromise<string>;
	set: (input: SetInput) => MaybePromise<void>;
}
