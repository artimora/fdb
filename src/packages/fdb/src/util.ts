import nodePath from "node:path";

export function splitPath(path: string): string[] {
	return path
		.replaceAll("\\", nodePath.sep)
		.replaceAll("/", nodePath.sep)
		.split(nodePath.sep)
		.filter(Boolean);
}

export function cleanPath(path: string): string {
	// some bs lowkey
	return path
		.replaceAll("\\", nodePath.sep)
		.replaceAll("/", nodePath.sep)
		.replaceAll(nodePath.sep, "/");
}
