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
