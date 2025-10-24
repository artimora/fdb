import { randomUUIDv7 } from "bun";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database("fdb.db", {create: true});
const db = drizzle({ client: sqlite });

console.log(randomUUIDv7());
