export class FileNotFoundError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, FileNotFoundError.prototype);
		this.name = "FileNotFoundError";
	}
}
