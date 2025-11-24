import { defineWorkspace } from "bunup";

export default defineWorkspace([
	{
		name: "@copperdevs/fdb",
		root: "src/packages/fdb",
	},
	{
		name: "@copperdevs/fdb-web",
		root: "src/packages/fdb-web",
	},
	{
		name: "testing",
		root: "src/apps/testing",
	},
	{
		name: "api-testing",
		root: "src/apps/api-testing",
	},
]);
