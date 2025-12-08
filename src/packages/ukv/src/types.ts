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

// potential for input, nullable for output
export interface Operations {
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
	getAll: (workspace?: Potential<string>) => MaybePromise<string[]>;

	// managment
	remove: (
		input: string | { key: string; workspace: string }
	) => MaybePromise<void>;
	removeAll: (workspace?: Potential<string>) => MaybePromise<void>;
}
