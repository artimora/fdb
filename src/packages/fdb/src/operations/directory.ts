import { randomUUID } from "node:crypto";
import path from "node:path";
import type { Kysely } from "kysely";
import { DirectoryNotFoundError } from "../errors";
import type {
  DirectoryDeleteOptions,
  DirectoryGetOptions,
  DirectoryOperations,
  FDB,
  FileGetOptions,
  FilesTable,
  FoldersTable,
  Maybe,
  Nullable,
  Potential,
} from "../types";
import { splitPath } from "../util";

export default function getDirectoryOperations(
  db: Kysely<FDB>
): DirectoryOperations {
  return {
    create: async function (path: Potential<string>): Promise<void> {
      if (path === undefined)
        throw new DirectoryNotFoundError("Path is undefined");
      if (await this.exists(path)) return; // direct checking if it already exists

      const parts = splitPath(path);

      let previous: Nullable<string> = null;
      let built: string = "";

      for (const v of parts) {
        built = `${built}/${v}`;

        const previousPart = await db
          .selectFrom("folders")
          .select(["uuid"])
          .where("name", "=", v)
          .where("workspace_uuid", "=", "default")
          .where("parent_folder", "is", previous)
          .executeTakeFirst();

        if (previousPart === undefined) {
          const id = randomUUID() as string;

          await db
            .insertInto("folders")
            .values({
              uuid: id,
              name: v,
              workspace_uuid: "default",
              parent_folder: previous,
            })
            .execute();

          previous = id; // safe now
        } else {
          previous = previousPart.uuid;
        }
      }
    },
    delete: async function (options: DirectoryDeleteOptions): Promise<void> {
      if (options.path === undefined)
        throw new DirectoryNotFoundError("Path is undefined");

      if (!(await this.exists(options.path)))
        throw new DirectoryNotFoundError("Directory doesn't exist");

      const id = await this.getFolderId(options.path);

      await db.deleteFrom("folders").where("uuid", "=", id).execute();
    },
    exists: async (path: Maybe<string>): Promise<boolean> => {
      if (path === null) return false;
      if (path === undefined) return false;

      const parts = splitPath(path);

      if (parts.length <= 0) return false;

      let previous: Nullable<string> = null;

      for (const v of parts) {
        // Try to find the folder at this level
        const row = await db
          .selectFrom("folders")
          .select(["uuid"])
          .where("name", "=", v)
          .where("workspace_uuid", "=", "default")
          .where("parent_folder", "is", previous)
          .executeTakeFirst();

        if (!row) return false;

        previous = row.uuid;
      }

      return true;
    },
    getFiles: async function (options: FileGetOptions): Promise<FilesTable[]> {
      options.recursive ??= true;
      options.data ??= false;

      const files: FilesTable[] = [];

      if ([undefined, "/", ""].includes(options.path)) {
        // all files, so get all

        const dbFiles = db.selectFrom("files");

        // biome-ignore lint/suspicious/noExplicitAny: selection
        let selected: any;

        if (options.data) {
          selected = dbFiles.selectAll();
        } else {
          selected = dbFiles.select([
            "name",
            "uuid",
            "workspace_uuid",
            "parent_folder",
          ]);
        }

        const folderId = await this.getFolderId(
          options.path === undefined ? null : options.path
        );

        if (!options.recursive) {
          selected = selected.where("parent_folder", "is", folderId);
        }

        const rows = await selected.execute();

        files.push(...(rows as FilesTable[]));
      } else {
        const folders: FoldersTable[] = await this.getFolders(options);

        if (folders.length === 0) return files;

        const dbFiles = db.selectFrom("files");

        // biome-ignore lint/suspicious/noExplicitAny: selection
        let selected: any;

        if (options.data) {
          selected = dbFiles.selectAll();
        } else {
          selected = dbFiles.select([
            "name",
            "uuid",
            "workspace_uuid",
            "parent_folder",
          ]);
        }

        const rows = await selected
          .where(
            "parent_folder",
            "in",
            folders.map((f) => f.uuid)
          )
          .execute();

        files.push(...rows);
      }

      return files;
    },
    getFolders: async function (
      options: DirectoryGetOptions
    ): Promise<FoldersTable[]> {
      options.recursive ??= true;

      console.log(options);

      async function getFolderById(
        uuid: Nullable<string>
      ): Promise<FoldersTable | null> {
        if (uuid == null) return null;
        const folder = await db
          .selectFrom("folders")
          .selectAll()
          .where("uuid", "=", uuid)
          .executeTakeFirst();
        return folder ?? null;
      }

      async function get(parent: Nullable<string>): Promise<FoldersTable[]> {
        const rawFolders = await db
          .selectFrom("folders")
          .selectAll()
          .where("parent_folder", "is", parent)
          .execute();

        const folders: FoldersTable[] = [];

        for (const folder of rawFolders) {
          folders.push(folder);
          if (options.recursive) {
            folders.push(...(await get(folder.uuid)));
          }
        }

        return folders;
      }

      const folderId = await this.getFolderId(options.path);

      console.log({ folderId, options });

      // if (options.path !== undefined && folderId === null) {
      //   return [];
      // }

      const folders: FoldersTable[] = [];

      // Optionally include the root folder itself if it exists
      // if (options.path !== undefined && folderId !== null) {
      //   const rootFolder = await getFolderById(folderId);

      //   console.log(rootFolder);

      //   if (rootFolder) {
      //     folders.push(rootFolder);
      //   }
      // }

      folders.push(...(await get(folderId)));

      return folders;
    },
    getFolderId: async (path: Maybe<string>): Promise<Nullable<string>> => {
      if (path === null) return null;
      if (path === undefined)
        throw new DirectoryNotFoundError("Path is undefined");

      const parts = splitPath(path);
      let previous: Nullable<string> = null;

      for (const v of parts) {
        // Try to find the folder at this level
        const row = await db
          .selectFrom("folders")
          .select(["uuid"])
          .where("name", "=", v)
          .where("workspace_uuid", "=", "default")
          .where("parent_folder", "is", previous)
          .executeTakeFirst();

        if (!row) return null;

        previous = row.uuid;
      }

      return previous;
    },
  };
}
