export type Potential<T> = T | undefined;
export type Nullable<T> = T | null;

export type MaybePromise<T> = Promise<T> | T;

export type FileOperations = {
	writeAllText: (path: Potential<string>, text: string) => void;
	appendAllText: (path: Potential<string>, text: string) => void;
	readAllText: (path: Potential<string>) => string;

	writeAllBytes: (path: Potential<string>, bytes: Uint8Array) => void;
	appendAllBytes: (path: Potential<string>, bytes: Uint8Array) => void;
	readAllBytes: (path: Potential<string>) => Uint8Array;

	create: (path: Potential<string>) => void;
	exists: (path: Potential<string>) => boolean;
	copy: (originalPath: Potential<string>, newPath: Potential<string>) => void;
	move: (path: Potential<string>, newPath: Potential<string>) => void;
	delete: (path: Potential<string>) => void;
};

export type DirectoryOperations = {
	create: (path: Potential<string>) => void;
	delete: (path: Potential<string>) => void;
	exists: (path: Potential<string>) => MaybePromise<boolean>;
	getFiles: (path: Potential<string>) => string[]; // TODO: add filter option and subdirectories option
	getFolderId: (path: Potential<string>) => MaybePromise<Potential<string>>;
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
