import type { Page } from '@rtorcato/db-common'

/** Anything with Drizzle's chainable `.limit()`/`.offset()`. */
interface Limitable {
	limit(n: number): this
	offset(n: number): this
}

/**
 * Apply a db-common `Page` (`{ limit, offset }` from `paginate()`) to a Drizzle
 * query builder. `paginate()` already returns the exact shape Drizzle wants, so
 * this is just the chaining sugar.
 *
 *   withPage(db.select().from(users), paginate({ page: 2, size: 25 }))
 *   // → db.select().from(users).limit(25).offset(25)
 */
export function withPage<T extends Limitable>(qb: T, { limit, offset }: Page): T {
	return qb.limit(limit).offset(offset)
}
