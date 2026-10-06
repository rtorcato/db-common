import { getConfig } from '@rtorcato/repo-tooling/tsup'

export default getConfig(
	{
		entry: ['src/index.ts'],
		format: ['cjs', 'esm'],
		// tsup's dts build (typescript6, see .pnpmfile.cjs) injects the deprecated `baseUrl`.
		dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
		clean: true,
		splitting: false,
		sourcemap: true,
	},
	process.env.NODE_ENV || 'development'
)
