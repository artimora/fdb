import type { FileOperations } from "../types";

export default function getFileOperations(): FileOperations {
	return {
		writeAllText: (path: string, text: string): void => {
			throw new Error("Function not implemented.");
		},
		appendAllText: (path: string, text: string): void => {
			throw new Error("Function not implemented.");
		},
		readAllText: (path: string): string => {
			throw new Error("Function not implemented.");
		},
		writeAllBytes: (path: string, bytes: Uint8Array): void => {
			throw new Error("Function not implemented.");
		},
		appendAllBytes: (path: string, bytes: Uint8Array): void => {
			throw new Error("Function not implemented.");
		},
		readAllBytes: (path: string): Uint8Array => {
			throw new Error("Function not implemented.");
		},
		create: (path: string): void => {
			throw new Error("Function not implemented.");
		},
		exists: (path: string): boolean => {
			throw new Error("Function not implemented.");
		},
		copy: (originalPath: string, newPath: string): void => {
			throw new Error("Function not implemented.");
		},
		move: (path: string): void => {
			throw new Error("Function not implemented.");
		},
		delete: (path: string): void => {
			throw new Error("Function not implemented.");
		},
	};
}
