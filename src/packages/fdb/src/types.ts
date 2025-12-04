export type Potential<T> = T | undefined;
export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined | null;

export type MaybePromise<T> = Promise<T> | T;

export type FileMoveOptions = {
	originalPath: Potential<string>;
	newPath: Potential<string>;

	overwrite?: Potential<boolean>;
	createDirectories?: Potential<boolean>;
};

export type DirectoryDeleteOptions = {
	path: Potential<string>;
	onlyOnEmpty?: Potential<boolean>;
};

export type DirectoryGetOptions = {
	path: Potential<string>;
	recursive?: Potential<boolean>;
};

export type FileGetOptions = {
	data?: Potential<boolean>;
} & DirectoryGetOptions;

// potential for input, nullable for output
export type FileOperations = {
	writeAllText: (path: Potential<string>, text: string) => MaybePromise<void>;
	readAllText: (path: Potential<string>) => MaybePromise<string>;

	writeAllBytes: (
		path: Potential<string>,
		bytes: Uint8Array
	) => MaybePromise<void>;
	readAllBytes: (path: Potential<string>) => MaybePromise<Uint8Array>;

	create: (path: Potential<string>) => MaybePromise<void>;
	exists: (path: Potential<string>) => MaybePromise<boolean>;
	copy: (options: FileMoveOptions) => MaybePromise<void>;
	move: (options: FileMoveOptions) => MaybePromise<void>;
	delete: (path: Potential<string>) => MaybePromise<void>;
};

export type DirectoryOperations = {
	create: (path: Potential<string>) => MaybePromise<void>;

	// TODO: give option to pass purey string path
	delete: (options: DirectoryDeleteOptions) => MaybePromise<void>;
	exists: (path: Maybe<string>) => MaybePromise<boolean>;

	// TODO: give option to pass purey string path
	// TODO: add filter option and subdirectories option
	getFiles: (options: FileGetOptions) => MaybePromise<FilesTable[]>;
	getFolderId: (path: Maybe<string>) => MaybePromise<Nullable<string>>;
	getFolderById: (
		path: Maybe<string>
	) => MaybePromise<Nullable<FoldersTable>>;

	// TODO: give option to pass purey string path
	getFolders: (options: DirectoryGetOptions) => MaybePromise<FoldersTable[]>;
};

export interface FoldersTable {
	uuid: string;
	name: string;
	workspace_uuid: string;
	parent_folder: string | null;
}

export interface FilesTable {
	uuid: string;
	name: string;
	workspace_uuid: string;
	parent_folder: string | null;
	data: Uint8Array<ArrayBufferLike> | null;
}

export interface FDB {
	folders: FoldersTable;
	files: FilesTable;
}
