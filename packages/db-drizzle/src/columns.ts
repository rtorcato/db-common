import type { Column } from 'drizzle-orm'

/**
 * Maps db-common's string column names onto real Drizzle columns. db-common
 * deals in plain `{ col: string }` shapes; Drizzle operators need the actual
 * column object, so every adapter takes one of these to resolve names against.
 *
 *   const cols = { status: users.status, age: users.age }
 */
export type ColumnMap = Record<string, Column>

/**
 * Resolve a db-common column name to its Drizzle column, throwing on unknown
 * names. Pair with db-common's `allow()` to allowlist columns from query
 * strings before they reach here — this throw is the last line of defence, not
 * the first.
 */
export function resolveColumn(columns: ColumnMap, col: string): Column {
	const column = columns[col]
	if (!column) throw new Error(`db-drizzle: unknown column "${col}"`)
	return column
}
