import { $ } from "bun";
import { build } from "tsup";

import pack from "./package.json";

if ("@copperdevs/fdb" in pack.dependencies)
	throw new Error("Error can't be a dependency of itself");

await $`rm -rf dist`;

await build({
	entry: ["src/**/*.ts"],
	outDir: "dist",
	format: ["esm", "cjs"],
	target: "node20",
	minifySyntax: true,
	minifyWhitespace: false,
	minifyIdentifiers: false,
	splitting: false,
	sourcemap: false,
	cjsInterop: false,
	clean: true,
	bundle: false,
});

await $`tsc --project tsconfig.dts.json`;

await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist/bun",
	minify: {
		whitespace: true,
		syntax: true,
		identifiers: false,
	},
	target: "bun",
	sourcemap: "linked",
});

process.exit();
