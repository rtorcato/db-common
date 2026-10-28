import type { BulkInsertShape, OnConflict } from '@rtorcato/db-common'
import type { GetColumnData } from 'drizzle-orm'
import { type ColumnMap, resolveColumn } from './columns.js'

/** A row keyed by the `ColumnMap`'s keys, typed from its columns. */
export type ColumnMapRow<Map extends ColumnMap> = { [K in keyof Map]: GetColumnData<Map[K]> }

/**
 * Turn a db-common `BulkInsertShape` (from `pickMany()`) into the row objects
 * Drizzle's `.values()` takes. Column names are validated against `columns` and
 * used as the row keys, so the `ColumnMap` keys must be the table's property
 * names. A cell left `undefined` falls back to the column default.
 *
 * Rows are typed from `map`, so pass an unannotated map of the table's columns
 * (not one typed as `ColumnMap`) and the result drops into `.values()` as is.
 *
 *   db.insert(users).values(toDrizzleValues(pickMany(rows, ['name', 'email']), cols))
 */
export function toDrizzleValues<Map extends ColumnMap>(
	{ columns, rows }: BulkInsertShape,
	map: Map
): ColumnMapRow<Map>[] {
	for (const col of columns) resolveColumn(map, col)
	// ponytail: db-common cells are `unknown`, so the row type is taken from the
	// column map on trust; only the column names are checked, at runtime above.
	return rows.map(
		(row) => Object.fromEntries(columns.map((col, i) => [col, row[i]])) as ColumnMapRow<Map>
	)
}

/**
 * Turn a db-common `OnConflict` (from `onConflict()`) into the `{ target, set }`
 * Drizzle's `.onConflictDoUpdate()` takes. Throws when there is nothing to
 * update, since Drizzle would emit an empty SET; use
 * `.onConflictDoNothing({ target })` for that case. Typed from `map` like
 * `toDrizzleValues`.
 *
 *   db.insert(users).values(vals).onConflictDoUpdate(
 *     toDrizzleOnConflict(onConflict(['email'], { name: 'Ada' }), cols)
 *   )
 */
export function toDrizzleOnConflict<Map extends ColumnMap>(
	{ target, set }: OnConflict,
	map: Map
): { target: Map[keyof Map][]; set: Partial<ColumnMapRow<Map>> } {
	if (set.length === 0) {
		throw new Error('db-drizzle: onConflict has no update values; use onConflictDoNothing()')
	}
	for (const { col } of set) resolveColumn(map, col)
	return {
		target: target.map((col) => resolveColumn(map, col) as Map[keyof Map]),
		set: Object.fromEntries(set.map(({ col, val }) => [col, val])) as Partial<ColumnMapRow<Map>>,
	}
}
