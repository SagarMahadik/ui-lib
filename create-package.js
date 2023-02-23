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
	{
		name: `${packageName}.tsx`,
		content: `import styled from 'styled-components';

const My${packageName} = styled.div\`
  /* styles go here */
\`;

export default My${packageName};
`,
	},
	{
		name: `package.json`,
		content: `{
  "name": "@my-library/${packageName}",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "private": true
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
		content: `import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
  external: Object.keys(pkg.dependencies || {})
}`,
	},
];

fs.mkdirSync(packagePath, { recursive: true });

files.forEach((file) => {
	fs.writeFileSync(`${packagePath}/${file.name}`, file.content);
});
