import nodePath from "node:path";
import type { Maybe, Potential } from "./types";

export function splitPath(path: string): string[] {
  return path
    .replaceAll("\\", nodePath.sep)
    .replaceAll("/", nodePath.sep)
    .split(nodePath.sep)
    .filter(Boolean);
}

export function cleanPath(path: Maybe<string>): Potential<string> {
  if (path === undefined || path === null) return undefined;

  // some bs lowkey
  return path
    .replaceAll("\\", nodePath.sep)
    .replaceAll("/", nodePath.sep)
    .replaceAll(nodePath.sep, "/");
}
