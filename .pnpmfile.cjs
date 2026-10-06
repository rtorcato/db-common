// ponytail: TypeScript 7 ships only the native `tsc`, with no JS compiler API, and
// tsup's dts build imports that API. Give tsup its own typescript6 copy instead of
// the workspace's TS 7 peer. Delete this file once tsup supports TypeScript 7.
module.exports = {
	hooks: {
		readPackage(pkg) {
			if (pkg.name === 'tsup') {
				delete pkg.peerDependencies?.typescript
				pkg.dependencies = { ...pkg.dependencies, typescript: 'npm:@typescript/typescript6@^6.0.2' }
			}
			return pkg
		},
	},
}
