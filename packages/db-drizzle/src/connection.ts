import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Pool, type PoolConfig } from 'pg'

export interface DbHandle<TSchema extends Record<string, unknown>> {
	db: NodePgDatabase<TSchema>
	pool: Pool
}

/**
 * Create a node-postgres pool and a Drizzle instance over it. Accepts a
 * connection string or a `pg` `PoolConfig`. Returns both so the caller can
 * `pool.end()` on shutdown.
 *
 * ponytail: node-postgres + a single pool covers the common case. Swap drivers
 * (postgres-js, Neon serverless) or expose pool tuning here if an app needs it.
 *
 *   const { db, pool } = createDb(process.env.DATABASE_URL!, schema)
 */
export function createDb<TSchema extends Record<string, unknown> = Record<string, never>>(
	config: string | PoolConfig,
	schema?: TSchema
): DbHandle<TSchema> {
	const pool = new Pool(typeof config === 'string' ? { connectionString: config } : config)
	return { db: drizzle(pool, { schema }), pool }
}
