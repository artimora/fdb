import { getProvider } from "@artimora/ukv";
import { type Kysely, Migrator } from "kysely";

// biome-ignore lint/suspicious/noExplicitAny: generic function
export async function migrateToLatest(db: Kysely<any>): Promise<void> {
	const migrator = new Migrator({
		db,
		provider: getProvider()
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(
				`migration "${it.migrationName}" was executed successfully`
			);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}
}
