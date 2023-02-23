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
		"@rollup/plugin-alias": "^4.0.3",
		"@rollup/plugin-commonjs": "^24.0.1",
		"@rollup/plugin-multi-entry": "^6.0.0",
		"@rollup/plugin-node-resolve": "^15.0.1",
		"@rollup/plugin-terser": "^0.4.0",
		"@rollup/plugin-typescript": "^11.0.0",
		"@testing-library/react": "13.3.0",
		"@tsconfig/recommended": "^1.0.2",
		"@types/jest": "^27.0.3",
		"@types/react": "^18.0.27",
		"@types/styled-components": "^5.1.26",
		"jest": "^27.4.3",
		"lerna": "^6.0.1",
		"nx": "15.6.3",
		"react": "18.1.0",
		"react-dom": "18.1.0",
		"rollup": "2.79.0",
		"rollup-plugin-dts": "^4.0.1",
		"rollup-plugin-peer-deps-external": "^2.2.4",
		"rollup-plugin-typescript2": "^0.34.1",
		"ts-jest": "^27.1.1",
		"tslib": "^2.5.0",
		"typescript": "^4.9.5",
		"typescript-plugin-styled-components": "^2.0.0",
		"rimraf": "^3.0.2"
	},
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
