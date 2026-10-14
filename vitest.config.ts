import base from '@rtorcato/repo-tooling/vitest/config'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
	base,
	defineConfig({
		test: {
			// Only src — don't scan compiled tests in any dist/ (incl. workspace packages).
			include: ['src/**/*.test.ts'],
			setupFiles: ['./vitest.setup.ts'],
		},
	})
)
