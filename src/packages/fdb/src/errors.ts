export class FileNotFoundError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, FileNotFoundError.prototype);
		this.name = "FileNotFoundError";
	}
}

export class DirectoryError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, DirectoryError.prototype);
		this.name = "DirectoryError";
	}
}

export class DirectoryNotFoundError extends DirectoryError {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, DirectoryNotFoundError.prototype);
		this.name = "DirectoryNotFoundError";
	}
}
