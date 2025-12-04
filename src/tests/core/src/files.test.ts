import { describe, expect, test } from "bun:test";
import { charsetPath, get } from "./util";

//#region files > root

describe("files > root", () => {
	const path = "root";

	test.todo("writeAllText", async () => {
		const { fdb } = await get();
	});

	test.todo("readAllText", async () => {
		const { fdb } = await get();
	});

	test.todo("writeAllBytes", async () => {
		const { fdb } = await get();
	});

	test.todo("readAllBytes", async () => {
		const { fdb } = await get();
	});

	test.todo("create", async () => {
		const { fdb } = await get();
	});

	test.todo("exists", async () => {
		const { fdb } = await get();
	});

	test.todo("copy", async () => {
		const { fdb } = await get();
	});

	test.todo("move", async () => {
		const { fdb } = await get();
	});

	test.todo("delete", async () => {
		const { fdb } = await get();
	});
});

//#endregion files > root

//#region files > sub

describe("files > sub", () => {
	const path = `root/${charsetPath()}`;
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
