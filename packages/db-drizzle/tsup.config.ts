import { getConfig } from '@rtorcato/repo-tooling/tsup'

export default getConfig(
	{
		entry: ['src/index.ts', 'src/connection.ts', 'src/config.ts'],
		format: ['cjs', 'esm'],
		// tsup's dts build (typescript6, see .pnpmfile.cjs) injects the deprecated `baseUrl`.
		dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
		clean: true,
		// The preset sets bundle: false, which emits only the entry files and leaves
		// their ./x.js re-exports dangling (#83). Bundle each entry instead.
		bundle: true,
		splitting: false,
		sourcemap: true,
	},
	process.env.NODE_ENV || 'development'
)
