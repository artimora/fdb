export class FileNotFoundError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, FileNotFoundError.prototype);
		this.name = "FileNotFoundError";
	}
}

export class DirectoryNotFoundError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, DirectoryNotFoundError.prototype);
		this.name = "DirectoryNotFoundError";
	}
}
