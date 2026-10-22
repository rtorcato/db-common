export type Direction = 'asc' | 'desc'

export interface Sort {
	col: string
	dir: Direction
}

/**
 * Normalize sort input into a list of `{ col, dir }`. Accepts a comma-separated
 * string or an array of tokens; a leading `-` marks a column descending.
 * Empty tokens are dropped.
 *
 *   orderBy('name,-createdAt')
 *   // → [{ col: 'name', dir: 'asc' }, { col: 'createdAt', dir: 'desc' }]
 */
export function orderBy(input: string | string[]): Sort[] {
	const tokens = Array.isArray(input) ? input : input.split(',')
	const out: Sort[] = []
	for (const raw of tokens) {
		const token = raw.trim()
		if (!token) continue
		const desc = token.startsWith('-')
		const col = (desc ? token.slice(1) : token).trim()
		if (!col) continue
		out.push({ col, dir: desc ? 'desc' : 'asc' })
	}
	return out
}
