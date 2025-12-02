import { describe, test } from "bun:test";
import { createFDB } from "@artimora/fdb";
import { getDb } from "./util";

const fdb = createFDB(await getDb("files"));

describe("files", () => {
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
