import { describe, test } from "bun:test";
import { createFDB } from "@artimora/fdb";
import { getDb } from "./util";

const fdb = createFDB(await getDb());

//#region files > root

describe("files > root", () => {
	test.todo("writeAllText", () => {});

	test.todo("readAllText", () => {});

	test.todo("writeAllBytes", () => {});

	test.todo("readAllBytes", () => {});

	test.todo("create", () => {});

	test.todo("exists", () => {});

	test.todo("copy", () => {});

	test.todo("move", () => {});

	test.todo("delete", () => {});
});

//#endregion files > root

//#region files > sub

describe("files > sub", () => {
	test.todo("writeAllText", () => {});

	test.todo("readAllText", () => {});

	test.todo("writeAllBytes", () => {});

	test.todo("readAllBytes", () => {});

	test.todo("create", () => {});

	test.todo("exists", () => {});

	test.todo("copy", () => {});

	test.todo("move", () => {});

	test.todo("delete", () => {});
});

//#endregion files > sub

//#region files > undefined

describe("files > undefined", () => {
	test.todo("writeAllText", () => {});

	test.todo("readAllText", () => {});

	test.todo("writeAllBytes", () => {});

	test.todo("readAllBytes", () => {});

	test.todo("create", () => {});

	test.todo("exists", () => {});

	test.todo("copy", () => {});

	test.todo("move", () => {});

	test.todo("delete", () => {});
});

//#endregion files > undefined
