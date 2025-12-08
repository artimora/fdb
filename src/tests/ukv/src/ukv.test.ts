import { describe, expect, test } from "bun:test";
import { alphanumericCharset, get } from "./util";

describe("ukv > default workspace", () => {
	test("set/get/exists/keys/remove for default workspace", async () => {
		const { ukv } = await get();

		const key = `key-${alphanumericCharset()}`;
		const value = `value-${alphanumericCharset()}`;

		expect(await ukv.exists(key)).toBeFalse();

		await ukv.set({ key, value });

		expect(await ukv.exists(key)).toBeTrue();
		expect(await ukv.get(key)).toEqual(value);
		expect(await ukv.keys()).toContain(key);

		const removedCount = await ukv.remove(key);

		expect(removedCount).toEqual(1n);
		expect(await ukv.get(key)).toBeUndefined();
		expect(await ukv.keys()).not.toContain(key);
	});

	test("updates existing key instead of inserting duplicates", async () => {
		const { ukv } = await get();

		const key = `key-${alphanumericCharset()}`;
		const firstValue = `value-${alphanumericCharset()}`;
		const secondValue = `value-${alphanumericCharset()}`;

		await ukv.set({ key, value: firstValue });
		await ukv.set({ key, value: secondValue });

		expect(await ukv.get(key)).toEqual(secondValue);

		const all = (await ukv.get()) as { key: string; value: string }[];
		const matches = all.filter((item) => item.key === key);

		expect(matches).toHaveLength(1);
	});
});

describe("ukv > custom workspace", () => {
	test("respects custom default workspace", async () => {
		const workspace = `workspace-${alphanumericCharset()}`;
		const { ukv } = await get({ defaultWorkspace: workspace });

		const key = `key-${alphanumericCharset()}`;
		const value = `value-${alphanumericCharset()}`;

		await ukv.set({ key, value });

		expect(await ukv.get(key)).toEqual(value);
		expect(await ukv.exists(key)).toBeTrue();

		const workspaceItems = (await ukv.get({
			workspace
		})) as { key: string; value: string }[];

		expect(workspaceItems).toEqual([{ key, value }]);
		expect(await ukv.keys(workspace)).toEqual([key]);
		expect(await ukv.get({ workspace: "default" })).toEqual([]);
	});
});

describe("ukv > multiple workspaces", () => {
	test("keeps workspace data isolated", async () => {
		const { ukv } = await get();

		const defaultKey = `key-${alphanumericCharset()}`;
		const defaultValue = `value-${alphanumericCharset()}`;

		const workspace = `workspace-${alphanumericCharset()}`;
		const workspaceKeyOne = `key-${alphanumericCharset()}`;
		const workspaceKeyTwo = `key-${alphanumericCharset()}`;
		const workspaceValueOne = `value-${alphanumericCharset()}`;
		const workspaceValueTwo = `value-${alphanumericCharset()}`;

		await ukv.set({ key: defaultKey, value: defaultValue });
		await ukv.set({
			key: workspaceKeyOne,
			value: workspaceValueOne,
			workspace
		});
		await ukv.set({
			key: workspaceKeyTwo,
			value: workspaceValueTwo,
			workspace
		});

		expect(await ukv.get(defaultKey)).toEqual(defaultValue);
		expect(await ukv.get({ key: defaultKey, workspace })).toBeUndefined();

		const workspaceItems = (await ukv.get({
			workspace
		})) as { key: string; value: string }[];

		expect(workspaceItems).toHaveLength(2);
		expect(workspaceItems).toEqual(
			expect.arrayContaining([
				{ key: workspaceKeyOne, value: workspaceValueOne },
				{ key: workspaceKeyTwo, value: workspaceValueTwo }
			])
		);
		expect(await ukv.keys(workspace)).toEqual(
			expect.arrayContaining([workspaceKeyOne, workspaceKeyTwo])
		);

		const allKeys = await ukv.keys();
		expect(allKeys).toHaveLength(3);
		expect(allKeys).toEqual(
			expect.arrayContaining([
				defaultKey,
				workspaceKeyOne,
				workspaceKeyTwo
			])
		);
	});

	test("get without input returns all workspaces", async () => {
		const { ukv } = await get();

		const defaultKey = `key-${alphanumericCharset()}`;
		const workspace = `workspace-${alphanumericCharset()}`;
		const workspaceKey = `key-${alphanumericCharset()}`;

		await ukv.set({ key: defaultKey, value: "default" });
		await ukv.set({ key: workspaceKey, value: "other", workspace });

		const allItems = (await ukv.get()) as { key: string; value: string }[];

		expect(allItems).toHaveLength(2);
		expect(allItems).toEqual(
			expect.arrayContaining([
				{ key: defaultKey, value: "default" },
				{ key: workspaceKey, value: "other" }
			])
		);
	});
});

describe("ukv > remove", () => {
	test("removes rows in specific workspace and across all workspaces", async () => {
		const { ukv } = await get();

		const workspace = `workspace-${alphanumericCharset()}`;

		const defaultKeyOne = `key-${alphanumericCharset()}`;
		const defaultKeyTwo = `key-${alphanumericCharset()}`;

		const workspaceKeyOne = `key-${alphanumericCharset()}`;
		const workspaceKeyTwo = `key-${alphanumericCharset()}`;

		await ukv.set({ key: defaultKeyOne, value: "default-one" });
		await ukv.set({ key: defaultKeyTwo, value: "default-two" });
		await ukv.set({ key: workspaceKeyOne, value: "ws-one", workspace });
		await ukv.set({ key: workspaceKeyTwo, value: "ws-two", workspace });

		const workspaceRemoved = await ukv.remove({ workspace });

		expect(workspaceRemoved).toEqual(2n);
		expect(await ukv.get({ workspace })).toEqual([]);
		expect(await ukv.keys()).toEqual(
			expect.arrayContaining([defaultKeyOne, defaultKeyTwo])
		);

		const totalRemoved = await ukv.remove();

		expect(totalRemoved).toEqual(2n);
		expect(await ukv.get()).toEqual([]);
	});
});
