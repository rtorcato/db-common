import type { Direction, Sort } from './order-by.js'
import type { Condition } from './where.js'

export interface CursorInput {
	/** Rows per page. */
	size: number
	/**
	 * The column to keyset on. Must be unique-ish and match the sort. Pass an
	 * array (e.g. `['createdAt', 'id']`) for a composite cursor from
	 * `buildCursor(row, [...])`; every column sorts in `dir`.
	 */
	column: string | string[]
	/** Sort direction. Defaults to ascending. */
	dir?: Direction
	/** Encoded cursor from a previous page; omit for the first page. */
	after?: string
}

export interface CursorQuery {
	limit: number
	/** Keyset predicate for the next page (empty on the first page, and for a composite cursor). */
	where: Condition[]
	order: Sort[]
	/**
	 * Composite (tuple) keyset predicate, set only for a composite cursor on a
	 * later page: rows where `(cols) op (vals)` compares as a row value, i.e.
	 * `c1 op v1 OR (c1 = v1 AND c2 op v2) OR …`. A flat `where` can't express
	 * that, so a driver mapper must apply it as well (`toDrizzleCursor` does).
	 */
	keyset?: Keyset
}

export interface Keyset {
	cols: string[]
	op: 'gt' | 'lt'
	vals: unknown[]
}

/** Encode any JSON-serializable cursor value into a URL-safe string. */
export function encodeCursor(value: unknown): string {
	return Buffer.from(JSON.stringify(value)).toString('base64url')
}

/** Decode a cursor produced by `encodeCursor`. */
export function decodeCursor(cursor: string): unknown {
	return JSON.parse(Buffer.from(cursor, 'base64url').toString())
}

/**
 * Build the next `after` cursor from the last row of a page — the encode half of
 * the keyset loop `cursorPaginate` starts. Pass a single key column for the
 * scalar cursor `cursorPaginate` decodes today, or an array of key columns for a
 * composite cursor (e.g. `[sortCol, id]`) that survives ties on a non-unique
 * column.
 *
 *   buildCursor({ id: 42, name: 'Ada' }, 'id')            // → encodeCursor(42)
 *   buildCursor({ createdAt: '2026-01-01', id: 42 }, ['createdAt', 'id'])
 *   // → encodeCursor({ createdAt: '2026-01-01', id: 42 })
 *
 * Feed the result back to `cursorPaginate` with the same columns as `column`.
 */
export function buildCursor(row: Record<string, unknown>, keys: string | string[]): string {
	const value =
		typeof keys === 'string' ? row[keys] : Object.fromEntries(keys.map((k) => [k, row[k]]))
	return encodeCursor(value)
}

/**
 * Build a driver-agnostic keyset (cursor) page: a `limit`, a `where` predicate
 * past the previous cursor, and an `order`. To detect a next page, fetch
 * `limit + 1` rows, trim the extra, and `buildCursor` the last kept row's
 * `column` as the next `after`.
 *
 *   cursorPaginate({ size: 20, column: 'id', after })
 *   // → { limit: 20, where: [{ col:'id', op:'gt', val:<decoded> }], order:[…] }
 *
 *   cursorPaginate({ size: 20, column: ['createdAt', 'id'], after })
 *   // → { limit: 20, where: [], order: [createdAt, id],
 *   //     keyset: { cols: ['createdAt','id'], op: 'gt', vals: [<createdAt>, <id>] } }
 *
 * A composite `column` array pairs with `buildCursor(row, [...])` on the same
 * columns and survives ties on a non-unique first column. The tuple predicate
 * is returned as plain `keyset` data, never SQL.
 *
 * `after` comes from the query string, so a junk cursor — one that doesn't
 * decode, or doesn't match the shape of `column` (a scalar for one column, an
 * object holding every column for an array) — is treated as no cursor and
 * returns the first page. It never throws.
 *
 * ponytail: a single-column keyset can skip/repeat rows on a non-unique
 * column; pass `[sortCol, id]` for those.
 */
export function cursorPaginate({ size, column, dir = 'asc', after }: CursorInput): CursorQuery {
	const limit = Math.max(1, Math.floor(size) || 1)
	const op = dir === 'asc' ? 'gt' : 'lt'
	if (Array.isArray(column)) {
		const order: Sort[] = column.map((col) => ({ col, dir }))
		const vals = after === undefined ? undefined : safeDecodeComposite(after, column)
		return { limit, where: [], order, ...(vals && { keyset: { cols: column, op, vals } }) }
	}
	const val = after === undefined ? undefined : safeDecode(after)
	const where: Condition[] = val === undefined ? [] : [{ col: column, op, val }]
	return { limit, where, order: [{ col: column, dir }] }
}

function isScalar(val: unknown): val is string | number | boolean {
	return ['string', 'number', 'boolean'].includes(typeof val)
}

/** Decode a scalar cursor, or `undefined` for anything junk or non-scalar. */
function safeDecode(cursor: string): string | number | boolean | undefined {
	try {
		const val = decodeCursor(cursor)
		return isScalar(val) ? val : undefined
	} catch {
		return undefined
	}
}

/** Decode a composite cursor to its values in `cols` order, or `undefined` if junk. */
function safeDecodeComposite(cursor: string, cols: string[]): unknown[] | undefined {
	if (cols.length === 0) return undefined
	try {
		const val = decodeCursor(cursor)
		if (typeof val !== 'object' || val === null || Array.isArray(val)) return undefined
		const obj = val as Record<string, unknown>
		const vals = cols.map((c) => (Object.hasOwn(obj, c) ? obj[c] : undefined))
		return vals.every(isScalar) ? vals : undefined
	} catch {
		return undefined
	}
}
