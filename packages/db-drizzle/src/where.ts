import type { Condition, Operator } from '@rtorcato/db-common'
import {
	type Column,
	type SQL,
	and,
	between,
	eq,
	gt,
	gte,
	ilike,
	inArray,
	isNotNull,
	isNull,
	like,
	lt,
	lte,
	ne,
	notInArray,
} from 'drizzle-orm'
import { type ColumnMap, resolveColumn } from './columns.js'

function assertArray(op: 'in' | 'notIn', val: unknown): unknown[] {
	if (!Array.isArray(val)) {
		throw new Error(`db-drizzle: "${op}" needs an array of values`)
	}
	return val
}

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
		// Drizzle renders an empty list as a constant: `in []` matches nothing and
		// `notIn []` matches everything. A scalar (e.g. `?id[in]=5`) would emit
		// invalid SQL, so reject it here with a clear error instead.
		case 'in':
			return inArray(column, assertArray(op, val))
		case 'notIn':
			return notInArray(column, assertArray(op, val))
		case 'like':
			return like(column, val as string)
		case 'ilike':
			return ilike(column, val as string)
		// A boolean flag: `{ isNull: false }` means IS NOT NULL (and vice versa).
		case 'isNull':
			return val === false ? isNotNull(column) : isNull(column)
		case 'isNotNull':
			return val === false ? isNull(column) : isNotNull(column)
		case 'between': {
			if (!Array.isArray(val) || val.length !== 2) {
				throw new Error('db-drizzle: "between" needs a [min, max] pair')
			}
			return between(column, val[0] as never, val[1] as never)
		}
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
 * `IS NOT NULL`; `ilike` is Postgres-only (use `like` on MySQL/SQLite).
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
