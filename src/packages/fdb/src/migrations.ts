import type { Kysely, Migration, MigrationProvider } from "kysely";

export class FDBMigrationProvider implements MigrationProvider {
	getMigrations(): Promise<Record<string, Migration>> {
		const migrations: Record<string, Migration> = {
			"0000-fdb": creationMigration,
		};

		return Promise.resolve(migrations);
	}
}

export function getProvider(): FDBMigrationProvider {
	return new FDBMigrationProvider();
}

const creationMigration: Migration = {
	// biome-ignore lint/suspicious/noExplicitAny: kysely docs recommend using any (and we dont have a db type)
	up: async function up(db: Kysely<any>): Promise<void> {
		await db.schema
			.createTable("folders")
			.ifNotExists()
			.addColumn("uuid", "text", (col) => col.primaryKey())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("workspace_uuid", "text", (col) => col.notNull())
			.addColumn("parent_folder", "text") // NULL = root folder
			.addForeignKeyConstraint(
				"folders_parent_folder_fk",
				["parent_folder"],
				"folders",
				["uuid"],
			)
			.execute();

		await db.schema
			.createIndex("folders_parent_workspace_idx")
			.ifNotExists()
			.on("folders")
			.columns(["workspace_uuid", "parent_folder"])
			.execute();

		//
		// Create files table
		//
		await db.schema
			.createTable("files")
			.ifNotExists()
			.addColumn("uuid", "text", (col) => col.primaryKey())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("data", "blob") // we use blob cause we're working with arbitrary files
			.addColumn("workspace_uuid", "text", (col) => col.notNull())
			.addColumn("parent_folder", "text")
			.addForeignKeyConstraint(
				"files_parent_folder_fk",
				["parent_folder"],
				"folders",
				["uuid"],
			)
			.execute();

		await db.schema
			.createIndex("files_parent_workspace_idx")
			.ifNotExists()
			.on("files")
			.columns(["workspace_uuid", "parent_folder"])
			.execute();
	},

	// biome-ignore lint/suspicious/noExplicitAny: kysely docs recommend using any (and we dont have a db type)
	down: async function down(db: Kysely<any>): Promise<void> {
		await db.schema
			.dropIndex("files_parent_workspace_idx")
			.ifExists()
			.execute();
		await db.schema.dropTable("files").ifExists().execute();

		await db.schema
			.dropIndex("folders_parent_workspace_idx")
			.ifExists()
			.execute();
		await db.schema.dropTable("folders").ifExists().execute();
	},
};
