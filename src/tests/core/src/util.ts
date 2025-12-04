import { Database } from "bun:sqlite";
import { createFDB, fdb, getProvider, type FDB } from "@artimora/fdb";
import { Kysely, Migrator } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";

export async function get(): Promise<{
	db: Kysely<FDB>;
	fdb: fdb;
}> {
	const db = await getDb();
	const fdb = createFDB(db);

	return { db, fdb };
}

// biome-ignore lint/suspicious/noExplicitAny: we dont need anything but the local
export async function getDb(): Promise<Kysely<FDB>> {
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

export function charsetPath(
	maxElements: number = 5,
	length: number = 12
): string {
	const alphanumericCharset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	const elements: string[] = [];
	const count = clamp(
		Math.floor(Math.random() * maxElements),
		1,
		maxElements
	);

	for (let index = 0; index < count; index++) {
		elements.push(charset(length, alphanumericCharset));
	}

	return elements.join("/");
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
