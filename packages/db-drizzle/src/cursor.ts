import type { CursorQuery } from 'db-common'
import type { SQL } from 'drizzle-orm'
import type { ColumnMap } from './columns.js'
import { toDrizzleOrderBy } from './order-by.js'
import { toDrizzleWhere } from './where.js'

export interface DrizzleCursor {
	limit: number
	where: SQL | undefined
	orderBy: SQL[]
}

/**
 * Map a db-common `CursorQuery` (from `cursorPaginate()`) into Drizzle parts:
 * `limit`, a keyset `where`, and `orderBy`. Fetch `limit + 1` rows to detect a
 * next page, then `encodeCursor` the last kept row's key column for the next
 * `after` (db-common owns the encode/decode).
 *
 *   const { limit, where, orderBy } = toDrizzleCursor(cursorPaginate({ size: 20, column: 'id', after }), cols)
 *   db.select().from(users).where(where).orderBy(...orderBy).limit(limit + 1)
 */
export function toDrizzleCursor(query: CursorQuery, columns: ColumnMap): DrizzleCursor {
	return {
		limit: query.limit,
		where: toDrizzleWhere(query.where, columns),
		orderBy: toDrizzleOrderBy(query.order, columns),
	}
}
