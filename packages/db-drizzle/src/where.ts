import type { Condition, Operator } from '@rtorcato/db-common'
import {
	type Column,
	type SQL,
	and,
	eq,
	gt,
	gte,
	inArray,
	isNotNull,
	isNull,
	like,
	lt,
	lte,
	ne,
} from 'drizzle-orm'
import { type ColumnMap, resolveColumn } from './columns.js'

// db-common types `val` as `unknown` on purpose (it never inspects values);
// Drizzle's operators want the column's data type. The caller owns value
// correctness, so we cast at this single boundary.
function toComparison(column: Column, op: Operator, val: unknown): SQL {
	switch (op) {
		case 'eq':
			return val === null ? isNull(column) : eq(column, val as never)
		case 'ne':
			return val === null ? isNotNull(column) : ne(column, val as never)
		case 'gt':
			return gt(column, val as never)
		case 'gte':
			return gte(column, val as never)
		case 'lt':
			return lt(column, val as never)
		case 'lte':
			return lte(column, val as never)
		case 'in':
			return inArray(column, val as unknown[])
		case 'like':
			return like(column, val as string)
		default: {
			const exhaustive: never = op
			throw new Error(`db-drizzle: unsupported operator "${exhaustive}"`)
		}
	}
}

/**
 * Map a db-common `Condition[]` (from `where()`) into a single Drizzle `SQL`
 * predicate, ANDing the parts. Returns `undefined` for an empty list so you can
 * pass it straight to `.where()`. `eq`/`ne` against `null` become `IS NULL` /
 * `IS NOT NULL`.
 *
 *   toDrizzleWhere(where({ status: 'active', age: { gte: 18 } }), cols)
 *   // → and(eq(users.status, 'active'), gte(users.age, 18))
 */
export function toDrizzleWhere(conditions: Condition[], columns: ColumnMap): SQL | undefined {
	const parts = conditions.map(({ col, op, val }) =>
		toComparison(resolveColumn(columns, col), op, val)
	)
	return parts.length ? and(...parts) : undefined
}
