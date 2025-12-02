import { describe, expect, test } from "bun:test";
import { createFDB, DirectoryNotFoundError } from "@artimora/fdb";
import { getDb } from "./util";

const fdb = createFDB(await getDb());

describe("directories > root", () => {
	test("create", async () => {
		await fdb.directory.create("root");
		expect(await fdb.directory.exists("root")).toBeTrue(); // this test relies on exists, which may be buggy?
	});

	test("delete", async () => {
		await fdb.directory.create("root"); // this test relies on create, which may be buggy?

		await fdb.directory.delete({ path: "root", onlyOnEmpty: false });
		expect(await fdb.directory.exists("root")).toBeFalse(); // this test relies on exists, which may be buggy?
	});

	test("delete > onlyOnEmpty w/ files", async () => {
		await fdb.directory.create("root"); // this test relies on create, which may be buggy?

		await fdb.file.create("root/file.test");

		try {
			await fdb.directory.delete({ path: "root", onlyOnEmpty: true });
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryError");
		}
	});

	test("exists", async () => {
		await fdb.directory.create("root"); // this test relies on create, which may be buggy?
		expect(await fdb.directory.exists("root")).toBeTrue();
	});

	test("getFiles > files", async () => {
		await fdb.directory.delete({ path: "root", onlyOnEmpty: false }); // this test relies on delete, which may be buggy?
		await fdb.directory.create("root"); // this test relies on create, which may be buggy?

		await fdb.file.create("root/file-1.test");
		await fdb.file.create("root/file-2.test");
		await fdb.file.create("root/file-3.test");

		const files = await fdb.directory.getFiles({ path: "root" });

		const filesParents = files.map((t) => t.parent_folder);
		const filesNames = files.map((t) => t.name);

		console.log(files);

		expect(files).toHaveLength(3);
		expect(filesParents).toEqual(["root", "root", "root"]);
		expect(filesNames).toEqual([
			"file-1.test",
			"file-2.test",
			"file-3.test"
		]);
	});

	test.todo("getFiles > empty", async () => {
		await fdb.directory.delete({ path: "root", onlyOnEmpty: false }); // this test relies on delete, which may be buggy?
		await fdb.directory.create("root"); // this test relies on create, which may be buggy?

		const files = await fdb.directory.getFiles({ path: "root" });

		const filesParents = files.map((t) => t.parent_folder);
		const filesNames = files.map((t) => t.name);

		expect(files).toHaveLength(0);
		expect(filesParents).toEqual([]);
		expect(filesNames).toEqual([]);
	});

	test.todo("getFolderId", () => {
		// unsure how to test for this? besides if it fails *almost everything* internally would fail regardless
	});

	test.todo("getFolders", () => {});
});

describe("directories > sub", () => {});

describe("directories > undefined", () => {
	test.todo("create", async () => {
		// there has got to be a better way to do this
		try {
			await fdb.directory.create(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryNotFoundError");
		}
	});
});
