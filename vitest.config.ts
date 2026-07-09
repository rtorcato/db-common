import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		// Only src — don't scan compiled tests in any dist/ (incl. workspace packages).
		include: ['src/**/*.test.ts'],
		setupFiles: ['./vitest.setup.ts'],
		// ponytail: empty scaffold has no tests yet; don't fail the run/pre-push.
		// Remove once real test files land.
		passWithNoTests: true,
	},
})
