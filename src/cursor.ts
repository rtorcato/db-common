import type { Direction, Sort } from './order-by.js'
import type { Condition } from './where.js'

export interface CursorInput {
	/** Rows per page. */
	size: number
	/** The column to keyset on. Must be unique-ish and match the sort. */
	column: string
	/** Sort direction. Defaults to ascending. */
	dir?: Direction
	/** Encoded cursor from a previous page; omit for the first page. */
	after?: string
}

export interface CursorQuery {
	limit: number
	/** Keyset predicate for the next page (empty on the first page). */
	where: Condition[]
	order: Sort[]
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
 * Build a driver-agnostic keyset (cursor) page: a `limit`, a `where` predicate
 * past the previous cursor, and an `order`. To detect a next page, fetch
 * `limit + 1` rows, trim the extra, and `encodeCursor` the last kept row's
 * `column` value as the next `after`.
 *
 *   cursorPaginate({ size: 20, column: 'id', after })
 *   // → { limit: 20, where: [{ col:'id', op:'gt', val:<decoded> }], order:[…] }
 *
 * ponytail: single-column keyset — ties on a non-unique column can skip/repeat
 * rows. Upgrade to a composite (sortCol, id) cursor if you paginate on a
 * non-unique column.
 */
export function cursorPaginate({ size, column, dir = 'asc', after }: CursorInput): CursorQuery {
	const limit = Math.max(1, Math.floor(size) || 1)
	const where: Condition[] =
		after === undefined
			? []
			: [{ col: column, op: dir === 'asc' ? 'gt' : 'lt', val: decodeCursor(after) }]
	return { limit, where, order: [{ col: column, dir }] }
}
