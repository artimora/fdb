import { Database } from "bun:sqlite";
import { createUKV } from "@artimora/ukv";
import { Kysely } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { migrateToLatest } from "./migrations";

// biome-ignore lint/suspicious/noExplicitAny: we dont need anything but the local
const db = new Kysely<any>({
	dialect: new BunSqliteDialect({
		database: new Database("db.ukv.sqlite")
	})
});

await migrateToLatest(db);

const kv = createUKV(db);

await kv.set({ key: "key", value: "value" });
await kv.set({ key: "key1", value: "value1" });
await kv.set({ key: "key2", value: "value2" });
await kv.set({ key: "key3", value: "value3" });

await kv.set({ key: "otherkey1", value: "value1", workspace: "other" });
await kv.set({ key: "otherkey2", value: "value2", workspace: "other" });
await kv.set({ key: "otherkey3", value: "value3", workspace: "other" });

console.log(await kv.get("key"));

console.log(await kv.get({ workspace: "other" }));
