// biome-ignore-all lint/complexity/useArrowFunction: consistency
import type { Kysely } from "kysely";
import type { Operations, Options, UKV } from "./types";

export default function getOperations(
	db: Kysely<UKV>,
	options: Options
): Operations {
	return {
		get: async function (
			input?:
				| string // key of item in default workspace
				| { key: string; workspace: string } // item with key in certain workspace
				| { workspace: string } // all items in workspace
				| undefined // all items in all workspaces
		): Promise<string | { key: string; value: string }[] | undefined> {
			async function singular(
				key: string,
				workspace?: string
			): Promise<string | undefined> {
				workspace ??= options.defaultWorkspace;

				const item = await db
					.selectFrom("ukv")
					.select("value")
					.where("key", "=", key)
					.where("workspace", "=", workspace)
					.executeTakeFirst();

				if (item === undefined) return undefined;
				return item.value;
			}

			async function all(workspace?: string) {
				if (workspace === undefined) {
					const items = await db
						.selectFrom("ukv")
						.select(["key", "value"])
						.execute();

					return items;
				} else {
					const items = await db
						.selectFrom("ukv")
						.select(["key", "value"])
						.where("workspace", "=", workspace)
						.execute();

					return items;
				}
			}

			if (typeof input === "string") {
				return await singular(input, options.defaultWorkspace); // key of item in default workspace
			} else {
				if (input === undefined) {
					return await all(); // all items in all workspaces
				} else {
					if ("key" in input) {
						return await singular(input.key, input.workspace); // item with key in certain workspace
					} else {
						return await all(input.workspace); // all items in workspace
					}
				}
			}
		},

		set: async function (
			input:
				| { key: string; value: string }
				| { key: string; value: string; workspace: string }
		): Promise<void> {
			let value: { key: string; value: string; workspace: string };

			if ("workspace" in input) {
				value = input;
			} else {
				value = { ...input, workspace: options.defaultWorkspace };
			}

			if (await this.exists(value))
				await db
					.updateTable("ukv")
					.set({ value: value.value })
					.where("key", "=", value.key)
					.where("workspace", "=", value.workspace)
					.execute();
			else await db.insertInto("ukv").values(value).execute();
		},

		remove: async function (
			input:
				| string // key of item in default workspace
				| { key: string; workspace: string } // item with key in certain workspace
				| { workspace: string } // all items in workspace
				| undefined // all items in all workspaces
		): Promise<bigint> {
			async function singular(
				key: string,
				workspace?: string
			): Promise<bigint> {
				workspace ??= options.defaultWorkspace;

				const count = await db
					.deleteFrom("ukv")
					.where("key", "=", key)
					.where("workspace", "=", workspace)
					.executeTakeFirst();

				return count.numDeletedRows;
			}

			async function all(workspace?: string): Promise<bigint> {
				const count =
					workspace === undefined
						? await db.deleteFrom("ukv").execute()
						: await db
								.deleteFrom("ukv")
								.where("workspace", "=", workspace)
								.execute();

				return count
					.map((r) => r.numDeletedRows)
					.reduce((total, current) => total + current, 0n);
			}

			if (typeof input === "string") {
				return await singular(input, options.defaultWorkspace); // key of item in default workspace
			} else {
				if (input === undefined) {
					return await all(); // all items in all workspaces
				} else {
					if ("key" in input) {
						return await singular(input.key, input.workspace); // item with key in certain workspace
					} else {
						return await all(input.workspace); // all items in workspace
					}
				}
			}
		},

		exists: async function (
			input: string | { key: string; workspace: string }
		): Promise<boolean> {
			let value: { key: string; workspace: string };

			if (typeof input === "string") {
				value = { key: input, workspace: options.defaultWorkspace };
			} else {
				value = input;
			}

			const item = await db
				.selectFrom("ukv")
				.selectAll()
				.where("key", "=", value.key)
				.where("workspace", "=", value.workspace)
				.executeTakeFirst();

			return item !== undefined;
		},

		keys: async function (workspace?: string): Promise<string[]> {
			const result = await (workspace === undefined
				? db.selectFrom("ukv").select("key").execute()
				: db
						.selectFrom("ukv")
						.select("key")
						.where("workspace", "=", workspace)
						.execute());

			const keys = result.map((i) => i.key);

			return keys;
		}
	};
}
