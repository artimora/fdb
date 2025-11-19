import { default as directoryCreate } from "./directory/create";
import { default as directoryDelete } from "./directory/delete";
import { default as directoryExists } from "./directory/exists";
import { default as directoryFiles } from "./directory/files";
import { default as directoryFolderId } from "./directory/folderId";
import { default as fileBytesAppend } from "./file/bytes/append";
import { default as fileBytesRead } from "./file/bytes/read";
import { default as fileBytesWrite } from "./file/bytes/write";
import { default as fileCopy } from "./file/copy";
import { default as fileCreate } from "./file/create";
import { default as fileDelete } from "./file/delete";
import { default as fileExists } from "./file/exists";
import { default as fileMove } from "./file/move";
import { default as fileTextAppend } from "./file/text/append";
import { default as fileTextRead } from "./file/text/read";
import { default as fileTextWrite } from "./file/text/write";
import { default as root } from "./root";

export default {
	file: {
		bytes: {
			append: fileBytesAppend,
			read: fileBytesRead,
			write: fileBytesWrite,
		},
		text: {
			append: fileTextAppend,
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
	},
	root: root,
};
