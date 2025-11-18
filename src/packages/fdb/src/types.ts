export type PotentialString = string | undefined;

export type FileOperations = {
	writeAllText: (path: PotentialString, text: string) => void;
	appendAllText: (path: PotentialString, text: string) => void;
	readAllText: (path: PotentialString) => string;

	writeAllBytes: (path: PotentialString, bytes: Uint8Array) => void;
	appendAllBytes: (path: PotentialString, bytes: Uint8Array) => void;
	readAllBytes: (path: PotentialString) => Uint8Array;

	create: (path: PotentialString) => void;
	exists: (path: PotentialString) => boolean;
	copy: (originalPath: PotentialString, newPath: PotentialString) => void;
	move: (path: PotentialString, newPath: PotentialString) => void;
	delete: (path: PotentialString) => void;
};

export type DirectoryOperations = {
	create: (path: PotentialString) => void;
	delete: (path: PotentialString) => void;
	exists: (path: PotentialString) => Promise<boolean>;
	getFiles: (path: PotentialString) => string[]; // TODO: add filter option and subdirectories option
	getFolderId: (path: PotentialString) => PotentialString;
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
