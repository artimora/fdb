import type { APIRoute } from "../types";
import { default as directoryCreate } from "./directory/create";
import { default as directoryDelete } from "./directory/delete";
import { default as directoryExists } from "./directory/exists";
import { default as directoryFiles } from "./directory/files";
import { default as directoryFolderId } from "./directory/folderId";
import { default as directoryFolders } from "./directory/folders";
import { default as fileBytesRead } from "./file/bytes/read";
import { default as fileBytesWrite } from "./file/bytes/write";
import { default as fileCopy } from "./file/copy";
import { default as fileCreate } from "./file/create";
import { default as fileDelete } from "./file/delete";
import { default as fileExists } from "./file/exists";
import { default as fileMove } from "./file/move";
import { default as fileTextRead } from "./file/text/read";
import { default as fileTextWrite } from "./file/text/write";
import { default as root } from "./root";

const roots: {
	file: {
		bytes: {
			read: APIRoute;
			write: APIRoute;
		};
		text: {
			read: APIRoute;
			write: APIRoute;
		};
		copy: APIRoute;
		create: APIRoute;
		delete: APIRoute;
		exists: APIRoute;
		move: APIRoute;
	};
	directory: {
		create: APIRoute;
		delete: APIRoute;
		exists: APIRoute;
		files: APIRoute;
		folderId: APIRoute;
		folders: APIRoute;
	};
	root: APIRoute;
} = {
	file: {
		bytes: {
			read: fileBytesRead,
			write: fileBytesWrite,
		},
		text: {
			read: fileTextRead,
			write: fileTextWrite,
		},
		copy: fileCopy,
		create: fileCreate,
		delete: fileDelete,
		exists: fileExists,
		move: fileMove,
	},
	directory: {
		create: directoryCreate,
		delete: directoryDelete,
		exists: directoryExists,
		files: directoryFiles,
		folderId: directoryFolderId,
		folders: directoryFolders,
	},
	root: root,
};

export default roots;
