import { defineWorkspace } from "bunup";
import { copy } from "bunup/plugins";

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
			plugins: [copy(["../../../README.md", "../../../LICENSE"])],
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
			plugins: [copy(["../../../README.md", "../../../LICENSE"])],
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
