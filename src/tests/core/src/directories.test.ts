import { describe, test } from "bun:test";
import { createFDB } from "@artimora/fdb";
import { getDb } from "./util";

const fdb = createFDB(await getDb("directories"));

describe("directories", () => {
	test.todo("create", () => {});

	test.todo("delete", () => {});

	test.todo("exists", () => {});

	test.todo("getFiles", () => {});

	test.todo("getFolderId", () => {});

	test.todo("getFolders", () => {});
});
