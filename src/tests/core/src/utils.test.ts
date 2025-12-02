import { cleanPath, splitPath } from "@artimora/fdb";
import { describe, expect, test } from "bun:test";
import nodePath from "node:path";

describe("splitPath", () => {
	test("root", () => {
		expect(splitPath("root")).toEqual(["root"]);
	});

	test("undefined", () => {
		expect(splitPath(undefined)).toBeUndefined();
	});

	test("null", () => {
		expect(splitPath(null)).toBeUndefined();
	});

	test("nested > forward", () => {
		expect(splitPath("root/test")).toEqual(["root", "test"]);
	});

	test("nested > double back", () => {
		expect(splitPath("root\\test")).toEqual(["root", "test"]);
	});

	test("nested > node sep", () => {
		expect(splitPath(`root${nodePath.sep}test`)).toEqual(["root", "test"]);
	});
});

describe("cleanPath", () => {
	test("root", () => {
		expect(cleanPath("root")).toEqual("root");
	});

	test("undefined", () => {
		expect(cleanPath(undefined)).toBeUndefined();
	});

	test("null", () => {
		expect(cleanPath(null)).toBeUndefined();
	});

	test("nested > forward", () => {
		expect(cleanPath("root/test")).toEqual("root/test");
	});

	test("nested > double back", () => {
		expect(cleanPath("root\\test")).toEqual("root/test");
	});

	test("nested > node sep", () => {
		expect(cleanPath(`root${nodePath.sep}test`)).toEqual("root/test");
	});
});
