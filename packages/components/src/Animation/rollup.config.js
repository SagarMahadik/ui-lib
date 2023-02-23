import commonjs from "@rollup/plugin-commonjs";
				import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";

export default {
	input: "src/index.ts",
	output: [
		{
			dir: "dist",
			entryFileNames: "[name].js",
			format: "cjs",
			exports: "named",
		},
	],
	plugins: [
		peerDepsExternal(),
		resolve(),
		commonjs(),
		typescript({
			tsconfig: "tsconfig.json",
			transformers: [() => ({ before: [styledComponentsTransformer] })],
		}),
		terser(),
	],
	external: Object.keys(pkg.dependencies || {}),
};