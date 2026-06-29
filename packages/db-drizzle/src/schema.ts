import { timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * A UUID primary key that defaults to a random value. Spread into a `pgTable`.
 *
 *   pgTable('users', { id: id(), ...timestamps() })
 */
export const id = () => uuid('id').defaultRandom().primaryKey()

/**
 * `created_at` / `updated_at` timestamptz columns, both defaulting to now and
 * non-null. Spread into a `pgTable`. (Drizzle has no onUpdate trigger — bump
 * `updatedAt` in your write path or a DB trigger.)
 *
 *   pgTable('users', { id: id(), ...timestamps() })
 */
export const timestamps = () => ({
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
