import { type Assignment, setClause } from './set-clause.js'

/** A bulk INSERT's shared column list and one value row per input object. */
export interface BulkInsertShape {
	columns: string[]
	rows: unknown[][]
}

/**
 * Pick `keys` off many objects into one shared `columns` list and a parallel
 * `rows` matrix for a multi-row INSERT. Write-side sibling of `pick`. A key is
 * dropped only when it is `undefined` in *every* row; if some rows set it, the
 * column stays and the rows that left it unset carry `undefined` (map it to
 * DEFAULT). A `null` is kept as a NULL write.
 *
 *   pickMany([{ name: 'Ada', bio: undefined }, { name: 'Bo', bio: null }], ['name', 'bio'])
 *   // → { columns: ['name', 'bio'], rows: [['Ada', undefined], ['Bo', null]] }
 */
export function pickMany(rows: Record<string, unknown>[], keys: string[]): BulkInsertShape {
	const columns = keys.filter((key) => rows.some((row) => row[key] !== undefined))
	return { columns, rows: rows.map((row) => columns.map((col) => row[col])) }
}

/** An upsert's conflict `target` columns and the assignments to apply on conflict. */
export interface OnConflict {
	target: string[]
	set: Assignment[]
}

/**
 * Shape an upsert's ON CONFLICT clause: the `target` (unique) columns plus the
 * `update` values to write when that key already exists, run through
 * `setClause` so `undefined` is skipped and `null` is kept. An empty `set`
 * means "do nothing on conflict".
 *
 *   onConflict(['email'], { name: 'Ada', bio: undefined })
 *   // → { target: ['email'], set: [{ col: 'name', val: 'Ada' }] }
 */
export function onConflict(target: string[], update: Record<string, unknown> = {}): OnConflict {
	if (target.length === 0) throw new Error('onConflict: target needs at least one column')
	return { target, set: setClause(update) }
}
