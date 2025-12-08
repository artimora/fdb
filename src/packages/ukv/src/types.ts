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
