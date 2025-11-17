import type { DirectoryOperations } from "../types";

export default function getDirectoryOperations(): DirectoryOperations {
	return {
		create: (path: string): void => {
			throw new Error("Function not implemented.");
		},
		delete: (path: string): void => {
			throw new Error("Function not implemented.");
		},
		exists: (path: string): boolean => {
			throw new Error("Function not implemented.");
		},
		getFiles: (path: string): string[] => {
			throw new Error("Function not implemented.");
		},
	};
}
