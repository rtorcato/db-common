/** A single UPDATE assignment: one column, one value. */
export interface Assignment {
	col: string
	val: unknown
}

/**
 * Normalize an object into a flat list of `{ col, val }` for an UPDATE's SET,
 * skipping keys whose value is `undefined` so partial updates stay safe. Write-
 * side mirror of `where`. A `null` is kept (map it to `= NULL`); only
 * `undefined` — a field the caller didn't touch — is dropped.
 *
 *   setClause({ name: 'Ada', bio: undefined, active: null })
 *   // → [{ col: 'name', val: 'Ada' }, { col: 'active', val: null }]
 */
export function setClause(obj: Record<string, unknown>): Assignment[] {
	const out: Assignment[] = []
	for (const [col, val] of Object.entries(obj)) {
		if (val === undefined) continue
		out.push({ col, val })
	}
	return out
}
