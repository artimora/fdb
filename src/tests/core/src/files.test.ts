import { describe, expect, test } from "bun:test";
import { alphanumericCharset, charset, charsetPath, get } from "./util";

//#region files > root

describe("files > root", () => {
	function getPath(): string {
		return `root/${alphanumericCharset()}.test`;
	}

	test("writeAllText", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.writeAllText(path, alphanumericCharset());

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("readAllText", async () => {
		const { fdb } = await get();
		const path = getPath();

		const contents = alphanumericCharset();

		await fdb.file.writeAllText(path, contents);

		expect(await fdb.file.exists(path)).toBeTrue();
		expect(await fdb.file.readAllText(path)).toEqual(contents);
	});

	test("writeAllBytes", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.writeAllBytes(
			path,
			new TextEncoder().encode(alphanumericCharset())
		);

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("readAllBytes", async () => {
		const { fdb } = await get();
		const path = getPath();

		const contents = alphanumericCharset();

		await fdb.file.writeAllBytes(path, new TextEncoder().encode(contents));

		expect(await fdb.file.exists(path)).toBeTrue();
		expect(
			new TextDecoder().decode(await fdb.file.readAllBytes(path))
		).toEqual(contents);
	});

	test("create", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.create(path);

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("exists", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.create(path);

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("copy", async () => {
		const { fdb } = await get();
		const oldPath = getPath();
		const newPath = getPath();

		await fdb.file.create(oldPath);

		expect(await fdb.file.exists(oldPath)).toBeTrue();
		expect(await fdb.file.exists(newPath)).toBeFalse();

		await fdb.file.copy({ originalPath: oldPath, newPath: newPath });

		expect(await fdb.file.exists(oldPath)).toBeTrue();
		expect(await fdb.file.exists(newPath)).toBeTrue();
	});

	test("move", async () => {
		const { fdb } = await get();
		const oldPath = getPath();
		const newPath = getPath();

		await fdb.file.create(oldPath);

		expect(await fdb.file.exists(oldPath)).toBeTrue();
		expect(await fdb.file.exists(newPath)).toBeFalse();

		await fdb.file.move({ originalPath: oldPath, newPath: newPath });

		expect(await fdb.file.exists(oldPath)).toBeFalse();
		expect(await fdb.file.exists(newPath)).toBeTrue();
	});

	test("delete", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.create(path);

		expect(await fdb.file.exists(path)).toBeTrue();

		await fdb.file.delete(path);

		expect(await fdb.file.exists(path)).toBeFalse();
	});
});

//#endregion files > root

//#region files > sub

describe("files > sub", () => {
	function getPath(): string {
		return `root/${alphanumericCharset()}/${alphanumericCharset()}.test`;
	}

	test("writeAllText", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.writeAllText(path, alphanumericCharset());

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("readAllText", async () => {
		const { fdb } = await get();
		const path = getPath();

		const contents = alphanumericCharset();

		await fdb.file.writeAllText(path, contents);

		expect(await fdb.file.exists(path)).toBeTrue();
		expect(await fdb.file.readAllText(path)).toEqual(contents);
	});

	test("writeAllBytes", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.writeAllBytes(
			path,
			new TextEncoder().encode(alphanumericCharset())
		);

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("readAllBytes", async () => {
		const { fdb } = await get();
		const path = getPath();

		const contents = alphanumericCharset();

		await fdb.file.writeAllBytes(path, new TextEncoder().encode(contents));

		expect(await fdb.file.exists(path)).toBeTrue();
		expect(
			new TextDecoder().decode(await fdb.file.readAllBytes(path))
		).toEqual(contents);
	});

	test("create", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.create(path);

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("exists", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.create(path);

		expect(await fdb.file.exists(path)).toBeTrue();
	});

	test("copy", async () => {
		const { fdb } = await get();
		const oldPath = getPath();
		const newPath = getPath();

		await fdb.file.create(oldPath);

		expect(await fdb.file.exists(oldPath)).toBeTrue();
		expect(await fdb.file.exists(newPath)).toBeFalse();

		await fdb.file.copy({ originalPath: oldPath, newPath: newPath });

		expect(await fdb.file.exists(oldPath)).toBeTrue();
		expect(await fdb.file.exists(newPath)).toBeTrue();
	});

	test("move", async () => {
		const { fdb } = await get();
		const oldPath = getPath();
		const newPath = getPath();

		await fdb.file.create(oldPath);

		expect(await fdb.file.exists(oldPath)).toBeTrue();
		expect(await fdb.file.exists(newPath)).toBeFalse();

		await fdb.file.move({ originalPath: oldPath, newPath: newPath });

		expect(await fdb.file.exists(oldPath)).toBeFalse();
		expect(await fdb.file.exists(newPath)).toBeTrue();
	});

	test("delete", async () => {
		const { fdb } = await get();
		const path = getPath();

		await fdb.file.create(path);

		expect(await fdb.file.exists(path)).toBeTrue();

		await fdb.file.delete(path);

		expect(await fdb.file.exists(path)).toBeFalse();
	});
});

//#endregion files > sub

//#region files > undefined

describe("files > undefined", () => {
	test("writeAllText", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.writeAllText(undefined, undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileNotFoundError");
		}
	});

	test("readAllText", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.readAllText(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileNotFoundError");
		}
	});

	test("writeAllBytes", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.writeAllBytes(undefined, undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileNotFoundError");
		}
	});

	test("readAllBytes", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.readAllBytes(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileNotFoundError");
		}
	});

	test("create", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.create(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileNotFoundError");
		}
	});

	test("exists", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.exists(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileNotFoundError");
		}
	});

	test("copy", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.copy(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileError");
		}
	});

	test("move", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.move(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileError");
		}
	});

	test("delete", async () => {
		const { fdb } = await get();

		// there has got to be a better way to do this
		try {
			await fdb.file.delete(undefined);
		} catch (err) {
			const error = err as Error;
			expect(error.name).toEqual("FileNotFoundError");
		}
	});
});

//#endregion files > undefined
