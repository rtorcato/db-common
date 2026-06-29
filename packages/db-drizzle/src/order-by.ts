import type { Sort } from '@rtorcato/db-common'
import { type SQL, asc, desc } from 'drizzle-orm'
import { type ColumnMap, resolveColumn } from './columns.js'

/**
 * Map a db-common `Sort[]` (from `orderBy()`) into Drizzle order expressions,
 * ready to spread into `.orderBy(...)`.
 *
 *   toDrizzleOrderBy(orderBy('name,-createdAt'), cols)
 *   // → [asc(t.name), desc(t.createdAt)]
 */
export function toDrizzleOrderBy(sorts: Sort[], columns: ColumnMap): SQL[] {
	return sorts.map(({ col, dir }) => {
		const column = resolveColumn(columns, col)
		return dir === 'desc' ? desc(column) : asc(column)
	})
}
