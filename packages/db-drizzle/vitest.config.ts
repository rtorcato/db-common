import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		// Only src — don't pick up compiled tests in dist/.
		include: ['src/**/*.test.ts'],
	},
})
