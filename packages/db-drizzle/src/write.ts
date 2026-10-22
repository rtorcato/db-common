import type { BulkInsertShape, OnConflict } from '@rtorcato/db-common'
import type { Column } from 'drizzle-orm'
import { type ColumnMap, resolveColumn } from './columns.js'

/**
 * Turn a db-common `BulkInsertShape` (from `pickMany()`) into the row objects
 * Drizzle's `.values()` takes. Column names are validated against `columns` and
 * used as the row keys, so the `ColumnMap` keys must be the table's property
 * names. A cell left `undefined` falls back to the column default.
 *
 *   db.insert(users).values(toDrizzleValues(pickMany(rows, ['name', 'email']), cols))
 */
export function toDrizzleValues(
	{ columns, rows }: BulkInsertShape,
	map: ColumnMap
): Record<string, unknown>[] {
	for (const col of columns) resolveColumn(map, col)
	return rows.map((row) => Object.fromEntries(columns.map((col, i) => [col, row[i]])))
}

/**
 * Turn a db-common `OnConflict` (from `onConflict()`) into the `{ target, set }`
 * Drizzle's `.onConflictDoUpdate()` takes. Throws when there is nothing to
 * update, since Drizzle would emit an empty SET; use
 * `.onConflictDoNothing({ target })` for that case.
 *
 *   db.insert(users).values(vals).onConflictDoUpdate(
 *     toDrizzleOnConflict(onConflict(['email'], { name: 'Ada' }), cols)
 *   )
 */
export function toDrizzleOnConflict(
	{ target, set }: OnConflict,
	map: ColumnMap
): { target: Column[]; set: Record<string, unknown> } {
	if (set.length === 0) {
		throw new Error('db-drizzle: onConflict has no update values; use onConflictDoNothing()')
	}
	for (const { col } of set) resolveColumn(map, col)
	return {
		target: target.map((col) => resolveColumn(map, col)),
		set: Object.fromEntries(set.map(({ col, val }) => [col, val])),
	}
}
