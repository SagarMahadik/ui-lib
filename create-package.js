const fs = require("fs");

const packageName = process.argv[2];

if (!packageName) {
	console.log("Please provide a package name");
	process.exit(1);
}

const packagePath = ".";

const files = [
	{
		name: "index.ts",
		content: `export { default as My${packageName} } from './My${packageName}';\n`,
	},
	// 	{
	// 		name: `${packageName}.tsx`,
	// 		content: `import styled from 'styled-components';

	// const My${packageName} = styled.div\`
	//   /* styles go here */
	// \`;

	// export default My${packageName};
	// `,
	// 	},
	{
		name: `package.json`,
		content: `{
	"name": "@bennytest/${packageName}",
	"version": "0.0.0",
	"main": "dist/index.cjs.js",
	"module": "dist/index.esm.js",
	"type": "module",
	"files": [
		"dist"
	],
	"types": "dist/index.d.ts",
	"scripts": {
		"build": "rimraf dist && rollup --config --bundleConfigAsCjs",
		"test": "jest"
	},
	"devDependencies": {
		"@rollup/plugin-alias": "workspace:^",
		"@rollup/plugin-commonjs": "workspace:^",
		"@rollup/plugin-multi-entry": "workspace:^",
		"@rollup/plugin-node-resolve": "workspace:^",
		"@rollup/plugin-terser": "workspace:^",
		"@rollup/plugin-typescript": "workspace:^",
		"@testing-library/react": "workspace:^",
		"@tsconfig/recommended": "workspace:^",
		"@types/jest": "workspace:^",
		"@types/react": "workspace:^",
		"@types/styled-components": "workspace:^",
		"jest": "workspace:^",
		"lerna": "workspace:^",
		"nx": "workspace:^",
		"react": "workspace:^",
		"react-dom": "workspace:^",
		"rollup": "workspace:^",
		"rollup-plugin-dts": "workspace:^",
		"rollup-plugin-peer-deps-external": "workspace:^",
		"rollup-plugin-typescript2": "workspace:^",
		"ts-jest": "workspace:^",
		"tslib": "workspace:^",
		"typescript": "^4.9.5",
		"typescript-plugin-styled-components": "workspace:^",
		"rimraf": "workspace:^"
	},
	"publishConfig": {
		"access": "public"
	},
	"private": "false"
}`,
	},
	{
		name: "tsconfig.json",
		content: `{
	"compilerOptions": {
		"declaration": true,
		"declarationDir": "./dist",
		"strict": true,
		"allowSyntheticDefaultImports": true,
		"sourceMap": true,
		"noUnusedParameters": true,
		"strictNullChecks": true,
		"moduleResolution": "node",
		"noImplicitAny": true,
		"outDir": "./dist",
		"target": "es5",
		"jsx": "react"
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules"]
}`,
	},
	{
		name: "rollup.config.js",
		content: `import commonjs from "@rollup/plugin-commonjs";
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
};`,
	},
];

fs.mkdirSync(packagePath, { recursive: true });

// Create src directory
fs.mkdirSync(`${packagePath}/src`, { recursive: true });

// Add index.ts file to src directory
fs.writeFileSync(`${packagePath}/src/index.ts`, "");

files.forEach((file) => {
	fs.writeFileSync(`${packagePath}/${file.name}`, file.content);
});
