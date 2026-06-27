export interface PaginateInput {
	/** 1-based page number. */
	page: number
	/** Rows per page. */
	size: number
}

export interface Page {
	limit: number
	offset: number
}

/**
 * Convert a 1-based page/size into a driver-agnostic `{ limit, offset }`.
 * Clamps both to a minimum of 1 and floors non-integers, since these values
 * usually arrive from query strings.
 *
 *   paginate({ page: 2, size: 25 }) // → { limit: 25, offset: 25 }
 */
export function paginate({ page, size }: PaginateInput): Page {
	const limit = Math.max(1, Math.floor(size) || 1)
	const safePage = Math.max(1, Math.floor(page) || 1)
	return { limit, offset: (safePage - 1) * limit }
}
