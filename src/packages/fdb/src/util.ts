import nodePath from "node:path";

export function splitPath(path: string) {
	return path
		.replaceAll("\\", nodePath.sep)
		.replaceAll("/", nodePath.sep)
		.split(nodePath.sep)
		.filter(Boolean);
}
