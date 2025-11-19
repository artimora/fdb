export type Potential<T> = T | undefined;
export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined | null;

export type MaybePromise<T> = Promise<T> | T;

// potential for input, nullable for output
export type FileOperations = {
	writeAllText: (path: Potential<string>, text: string) => MaybePromise<void>;
	appendAllText: (path: Potential<string>, text: string) => MaybePromise<void>;
	readAllText: (path: Potential<string>) => MaybePromise<string>;

	writeAllBytes: (
		path: Potential<string>,
		bytes: Uint8Array,
	) => MaybePromise<void>;
	appendAllBytes: (
		path: Potential<string>,
		bytes: Uint8Array,
	) => MaybePromise<void>;
	readAllBytes: (path: Potential<string>) => MaybePromise<Uint8Array>;

	create: (path: Potential<string>) => MaybePromise<void>;
	exists: (path: Potential<string>) => MaybePromise<boolean>;
	copy: (
		originalPath: Potential<string>,
		newPath: Potential<string>,
	) => MaybePromise<void>;
	move: (
		path: Potential<string>,
		newPath: Potential<string>,
	) => MaybePromise<void>;
	delete: (path: Potential<string>) => MaybePromise<void>;
};

export type DirectoryOperations = {
	create: (path: Potential<string>) => MaybePromise<void>;
	delete: (path: Potential<string>) => MaybePromise<void>;
	exists: (path: Maybe<string>) => MaybePromise<boolean>;
	getFiles: (path: Potential<string>) => MaybePromise<string[]>; // TODO: add filter option and subdirectories option
	getFolderId: (path: Maybe<string>) => MaybePromise<Nullable<string>>;
};

export interface FoldersTable {
	uuid: string; // PK
	name: string; // not null
	workspace_uuid: string; // not null
	parent_folder: string | null; // nullable FK → folders.uuid
}

export interface FilesTable {
	uuid: string; // PK
	name: string; // not null
	data: Uint8Array | null; // blob → Uint8Array (Kysely convention)
	workspace_uuid: string; // not null
	parent_folder: string | null; // nullable FK → folders.uuid
}

export interface FDB {
	folders: FoldersTable;
	files: FilesTable;
}
