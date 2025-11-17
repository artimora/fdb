import type { fdb } from "@copperdevs/fdb";
import app from "./handler";

export type fdbWeb = fdb & {
	mount: (
		request: Request,
		// biome-ignore lint/suspicious/noExplicitAny: generic
		...args: any
	) => Response | Promise<Response>;
};

export function getHandler(fdb: fdb): fdbWeb {
	return (fdb && {
		// biome-ignore lint/suspicious/noExplicitAny: generic
		mount: (request: Request, ...args: any) => {
			return app.fetch(request, args);
		},
	}) as fdbWeb;
}
