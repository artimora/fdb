import { Database } from "bun:sqlite";
import { createUKV, getProvider, type ukv } from "@artimora/ukv";
import { Kysely, Migrator } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";

export async function get(
	options?: {
		defaultWorkspace?: string;
	}
): Promise<{
	db: Kysely<unknown>;
	ukv: ukv;
}> {
	const db = await getDb();
	const kv = createUKV(db, {
		defaultWorkspace: options?.defaultWorkspace
	});

	return { db, ukv: kv };
}

export async function getDb(): Promise<Kysely<unknown>> {
	// biome-ignore lint/suspicious/noExplicitAny: we dont need anything but the local
	const db = new Kysely<any>({
		dialect: new BunSqliteDialect({
			database: new Database(":memory:")
		})
	});

	await migrateToLatest(db);

	return db;
}

// biome-ignore lint/suspicious/noExplicitAny: generic function
export async function migrateToLatest(db: Kysely<any>): Promise<void> {
	const migrator = new Migrator({
		db,
		provider: getProvider()
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}
}

export function charset(length: number, charset: string): string {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return result;
}

export function alphanumericCharset(length: number = 12): string {
	return charset(
		length,
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	);
}
