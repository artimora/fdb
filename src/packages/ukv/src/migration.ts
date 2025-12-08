import type { Kysely, Migration, MigrationProvider } from "kysely";

export class UKVMigrationProvider implements MigrationProvider {
	getMigrations(): Promise<Record<string, Migration>> {
		const migrations: Record<string, Migration> = {
			"0000-ukv": creationMigration
		};

		return Promise.resolve(migrations);
	}
}

export function getProvider(): UKVMigrationProvider {
	return new UKVMigrationProvider();
}

const creationMigration: Migration = {
	// biome-ignore lint/suspicious/noExplicitAny: kysely docs recommend using any (and we dont have a db type)
	up: async function up(db: Kysely<any>): Promise<void> {
		await db.schema
			.createTable("ukv")
			.addColumn("key", "text", (col) => col.notNull())
			.addColumn("value", "text", (col) => col.notNull())
			.addColumn("workspace", "text", (col) => col.notNull())
			.addPrimaryKeyConstraint("ukv_pk", ["workspace", "key"])
			.execute();
	},

	// biome-ignore lint/suspicious/noExplicitAny: kysely docs recommend using any (and we dont have a db type)
	down: async function down(db: Kysely<any>): Promise<void> {
		await db.schema.dropTable("ukv").execute();
	}
};
