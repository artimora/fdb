import { describe, expect, test } from "bun:test";
import { alphanumericCharset, charsetPath, get } from "./util";

//#region directories > root

describe("directories > root", () => {
	const path = "root";

	test("create", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path);
		expect(await fdb.directory.exists(path)).toBeTrue(); // this test relies on exists, which may be buggy?
	});

	test("delete", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		await fdb.directory.delete({ path: path, onlyOnEmpty: false });
		expect(await fdb.directory.exists(path)).toBeFalse(); // this test relies on exists, which may be buggy?
	});

	test("delete > onlyOnEmpty w/ files", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		await fdb.file.create(`${path}/file.test`);

		try {
			await fdb.directory.delete({ path: path, onlyOnEmpty: true });
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryError");
		}
	});

	test("exists", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?
		expect(await fdb.directory.exists(path)).toBeTrue();
	});

	test("getFiles > files", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		await fdb.file.create(`${path}/file-1.test`);
		await fdb.file.create(`${path}/file-2.test`);
		await fdb.file.create(`${path}/file-3.test`);

		const files = await fdb.directory.getFiles({ path: path });

		const filesParents = files.map((t) => t.parent_folder);
		const filesNames = files.map((t) => t.name);

		const parentId = await fdb.directory.getFolderId(path);

		expect(files).toHaveLength(3);
		expect(filesParents).toEqual([parentId, parentId, parentId]);
		expect(filesNames).toEqual([
			"file-1.test",
			"file-2.test",
			"file-3.test"
		]);
	});

	test("getFiles > empty", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		const files = await fdb.directory.getFiles({ path: path });

		const filesParents = files.map((t) => t.parent_folder);
		const filesNames = files.map((t) => t.name);

		expect(files).toHaveLength(0);
		expect(filesParents).toEqual([]);
		expect(filesNames).toEqual([]);
	});

	test("getFolders > folders", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path);

		await fdb.directory.create(`${path}/sub-1`);
		await fdb.directory.create(`${path}/sub-2`);
		await fdb.directory.create(`${path}/sub-3`);

		const folders = await fdb.directory.getFolders({ path: path });

		const foldersParents = folders.map((t) => t.parent_folder);
		const foldersNames = folders.map((t) => t.name);

		const parent = await fdb.directory.getFolderId(path);

		expect(folders).toHaveLength(3);
		expect(foldersParents).toEqual([parent, parent, parent]);
		expect(foldersNames).toEqual(["sub-1", "sub-2", "sub-3"]);
	});

	test("getFolders > empty", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path);

		const folders = await fdb.directory.getFolders({ path: path });

		const foldersParents = folders.map((t) => t.parent_folder);
		const foldersNames = folders.map((t) => t.name);

		expect(folders).toHaveLength(0);
		expect(foldersParents).toEqual([]);
		expect(foldersNames).toEqual([]);
	});
});

//#endregion

//#region directories > sub

describe("directories > sub", () => {
	const path = `root/${charsetPath()}`;

	test("create", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path);
		expect(await fdb.directory.exists(path)).toBeTrue(); // this test relies on exists, which may be buggy?
	});

	test("delete", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		await fdb.directory.delete({ path: path, onlyOnEmpty: false });
		expect(await fdb.directory.exists(path)).toBeFalse(); // this test relies on exists, which may be buggy?
	});

	test("delete > onlyOnEmpty w/ files", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		await fdb.file.create(`${path}/file.test`);

		try {
			await fdb.directory.delete({ path: path, onlyOnEmpty: true });
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryError");
		}
	});

	test("exists", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?
		expect(await fdb.directory.exists(path)).toBeTrue();
	});

	test("getFiles > files", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		await fdb.file.create(`${path}/file-1.test`);
		await fdb.file.create(`${path}/file-2.test`);
		await fdb.file.create(`${path}/file-3.test`);

		const files = await fdb.directory.getFiles({ path: path });

		const filesParents = files.map((t) => t.parent_folder);
		const filesNames = files.map((t) => t.name);

		const parentId = await fdb.directory.getFolderId(path);

		expect(files).toHaveLength(3);
		expect(filesParents).toEqual([parentId, parentId, parentId]);
		expect(filesNames).toEqual([
			"file-1.test",
			"file-2.test",
			"file-3.test"
		]);
	});

	test("getFiles > empty", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path); // this test relies on create, which may be buggy?

		const files = await fdb.directory.getFiles({ path: path });

		const filesParents = files.map((t) => t.parent_folder);
		const filesNames = files.map((t) => t.name);

		expect(files).toHaveLength(0);
		expect(filesParents).toEqual([]);
		expect(filesNames).toEqual([]);
	});

	test("getFolders > folders", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path);

		await fdb.directory.create(`${path}/sub-1`);
		await fdb.directory.create(`${path}/sub-2`);
		await fdb.directory.create(`${path}/sub-3`);

		const folders = await fdb.directory.getFolders({ path: path });

		const foldersParents = folders.map((t) => t.parent_folder);
		const foldersNames = folders.map((t) => t.name);

		const parent = await fdb.directory.getFolderId(path);

		expect(folders).toHaveLength(3);
		expect(foldersParents).toEqual([parent, parent, parent]);
		expect(foldersNames).toEqual(["sub-1", "sub-2", "sub-3"]);
	});

	test("getFolders > empty", async () => {
		const { fdb } = await get();

		await fdb.directory.create(path);

		const folders = await fdb.directory.getFolders({ path: path });

		const foldersParents = folders.map((t) => t.parent_folder);
		const foldersNames = folders.map((t) => t.name);

		expect(folders).toHaveLength(0);
		expect(foldersParents).toEqual([]);
		expect(foldersNames).toEqual([]);
	});
});

//#endregion

//#region directories > recursive flags

describe("directories > recursive flags", () => {
	test("getFiles returns only current folder when recursive is false", async () => {
		const { fdb } = await get();

		const base = `root/${alphanumericCharset()}`;
		const child = `${base}/child`;
		const grandchild = `${child}/grandchild`;

		await fdb.directory.create(grandchild);

		await fdb.file.writeAllText(`${base}/file-root.test`, "root");
		await fdb.file.writeAllText(`${child}/file-child.test`, "child");
		await fdb.file.writeAllText(
			`${grandchild}/file-grandchild.test`,
			"grandchild"
		);

		const files = await fdb.directory.getFiles({
			path: base,
			recursive: false
		});

		const names = files.map((f) => f.name);

		expect(names).toEqual(
			expect.arrayContaining(["file-root.test", "file-child.test"])
		);
		expect(names).not.toContain("file-grandchild.test");
	});

	test("getFolders respects recursive flag", async () => {
		const { fdb } = await get();

		const base = `root/${alphanumericCharset()}`;
		const child = `${base}/child`;
		const grandchild = `${child}/grandchild`;

		await fdb.directory.create(grandchild);

		const folders = await fdb.directory.getFolders({
			path: base,
			recursive: false
		});

		const names = folders.map((f) => f.name);

		expect(names).toEqual(["child"]);
	});
});

//#endregion

//#region directories > undefined

describe("directories > undefined", () => {
	test("create", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.directory.create(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryNotFoundError");
		}
	});

	test("delete", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.directory.delete(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryError");
		}
	});

	test("exists", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.directory.exists(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryNotFoundError");
		}
	});

	test("getFiles", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.directory.getFiles(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryError");
		}
	});

	test("getFolders", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.directory.getFolders(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryError");
		}
	});
});

//#endregion

//#region directories > errors

describe("directories > errors", () => {
	test("delete rejects non-empty directory with nested contents", async () => {
		const { fdb } = await get();

		const base = `root/${alphanumericCharset()}`;
		const child = `${base}/child`;

		await fdb.directory.create(child);
		await fdb.file.create(`${child}/file.test`);

		try {
			await fdb.directory.delete({ path: base, onlyOnEmpty: true });
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryError");
		}

		expect(await fdb.directory.exists(base)).toBeTrue();
	});

	test("create throws on empty path", async () => {
		const { fdb } = await get();

		try {
			await fdb.directory.create("");
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("DirectoryNotFoundError");
		}
	});
});

//#endregion
