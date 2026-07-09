export interface PageMetaInput {
	/** Total matching rows (a `COUNT(*)` the caller runs). */
	total: number
	/** 1-based page number. */
	page: number
	/** Rows per page. */
	size: number
}

export interface PageMeta {
	page: number
	size: number
	total: number
	totalPages: number
	hasNext: boolean
	hasPrev: boolean
}

/**
 * Offset pagination's other half: derive navigation metadata from a row count.
 * Clamps `page`/`size` the same way `paginate` does, so feed it the same input.
 *
 *   pageMeta({ total: 95, page: 2, size: 25 })
 *   // → { page: 2, size: 25, total: 95, totalPages: 4, hasNext: true, hasPrev: true }
 */
export function pageMeta({ total, page, size }: PageMetaInput): PageMeta {
	const safeSize = Math.max(1, Math.floor(size) || 1)
	const safeTotal = Math.max(0, Math.floor(total) || 0)
	const safePage = Math.max(1, Math.floor(page) || 1)
	const totalPages = Math.ceil(safeTotal / safeSize)
	return {
		page: safePage,
		size: safeSize,
		total: safeTotal,
		totalPages,
		hasNext: safePage < totalPages,
		hasPrev: safePage > 1,
	}
}
