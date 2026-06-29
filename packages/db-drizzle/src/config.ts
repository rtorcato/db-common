import { type Config, defineConfig } from 'drizzle-kit'

export interface PgConfigInput {
	/** Path(s) to your schema file(s). */
	schema: string | string[]
	/** Postgres connection string. */
	url: string
	/** Migrations output dir. Defaults to `./drizzle`. */
	out?: string
}

/**
 * Shared `drizzle.config.ts` for a Postgres app — fills in the dialect and the
 * boilerplate so each app only states its schema path and URL. Import and
 * re-export from the app's `drizzle.config.ts`.
 *
 *   // drizzle.config.ts
 *   import { pgConfig } from '@rtorcato/db-drizzle/config'
 *   export default pgConfig({ schema: './src/schema.ts', url: process.env.DATABASE_URL! })
 */
export function pgConfig({ schema, url, out = './drizzle' }: PgConfigInput): Config {
	return defineConfig({
		dialect: 'postgresql',
		schema,
		out,
		dbCredentials: { url },
	})
}
