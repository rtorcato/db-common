import type { CursorQuery } from '@rtorcato/db-common'
import { type SQL, and, eq, gt, lt, or } from 'drizzle-orm'
import { type ColumnMap, resolveColumn } from './columns.js'
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
 * `after` (db-common owns the encode/decode). A composite cursor (`column` as an
 * array) maps its `keyset` tuple predicate into the same `where`.
 *
 *   const { limit, where, orderBy } = toDrizzleCursor(cursorPaginate({ size: 20, column: 'id', after }), cols)
 *   db.select().from(users).where(where).orderBy(...orderBy).limit(limit + 1)
 */
export function toDrizzleCursor(query: CursorQuery, columns: ColumnMap): DrizzleCursor {
	const flat = toDrizzleWhere(query.where, columns)
	const tuple = query.keyset && toKeysetWhere(query.keyset, columns)
	return {
		limit: query.limit,
		where: flat && tuple ? and(flat, tuple) : (flat ?? tuple),
		orderBy: toDrizzleOrderBy(query.order, columns),
	}
}

// (c1, c2) > (v1, v2) as c1 > v1 OR (c1 = v1 AND c2 > v2), so it works on every
// driver and mixes with `and()` without relying on row-value support.
function toKeysetWhere({ cols, op, vals }: NonNullable<CursorQuery['keyset']>, columns: ColumnMap) {
	const compare = op === 'gt' ? gt : lt
	const branches = cols.map((col, i) =>
		and(
			...cols.slice(0, i).map((prev, j) => eq(resolveColumn(columns, prev), vals[j] as never)),
			compare(resolveColumn(columns, col), vals[i] as never)
		)
	)
	return or(...branches)
}
