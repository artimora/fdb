export type FileOperations = {
	writeAllText: (path: string, text: string) => void;
	appendAllText: (path: string, text: string) => void;
	readAllText: (path: string) => string;

	writeAllBytes: (path: string, bytes: Uint8Array) => void;
	appendAllBytes: (path: string, bytes: Uint8Array) => void;
	readAllBytes: (path: string) => Uint8Array;

	create: (path: string) => void;
	exists: (path: string) => boolean;
	copy: (originalPath: string, newPath: string) => void;
	move: (path: string) => void;
	delete: (path: string) => void;
};

export type DirectoryOperations = {
	create: (path: string) => void;
	delete: (path: string) => void;
	exists: (path: string) => boolean;
	getFiles: (path: string) => string[]; // TODO: add filter option and subdirectories option
};
