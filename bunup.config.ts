import { defineWorkspace } from "bunup";

export default defineWorkspace([
	{
		name: "@copperdevs/fdb",
		root: "src/packages/fdb",
		config: {
			minify: true,
			footer: "// built with love and caffeine by copper :3",
			unused: {
				level: "error",
			},
		},
	},
	{
		name: "@copperdevs/fdb-web",
		root: "src/packages/fdb-web",
		config: {
			minify: true,
			footer: "// built with love and caffeine by copper :3",
			unused: {
				level: "error",
			},
		},
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
