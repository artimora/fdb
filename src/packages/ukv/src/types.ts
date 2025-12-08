export type Options = {
	defaultWorkspace: string;
};

export interface UKVTable {
	key: string;
	value: string;
	workspace: string;
}

export interface UKV {
	ukv: UKVTable;
}

export interface Operations {
	get: (
		input?:
			| string // key of item in default workspace
			| { key: string; workspace: string } // item with key in certain workspace
			| { workspace: string } // all items in workspace
			| undefined // all items in all workspaces
	) => Promise<string | { key: string; value: string }[] | undefined>;

	set: (
		input:
			| { key: string; value: string }
			| { key: string; value: string; workspace: string }
	) => Promise<void>;

	remove: (
		input:
			| string // key of item in default workspace
			| { key: string; workspace: string } // item with key in certain workspace
			| { workspace: string } // all items in workspace
			| undefined // all items in all workspaces
	) => Promise<bigint>;

	exists: (
		input:
			| string // key of item in default workspace
			| { key: string; workspace: string } // item with key in certain workspace
	) => Promise<boolean>;

	keys: (workspace?: string) => Promise<string[]>;
}
