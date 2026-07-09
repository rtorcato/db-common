/** An INSERT's column list and its parallel value list. */
export interface InsertShape {
	columns: string[]
	values: unknown[]
}

/**
 * Pick `keys` off an object into parallel `columns`/`values` arrays for an
 * INSERT, dropping keys whose value is `undefined`. Write-side companion to
 * `where`. A `null` is kept (map it to a NULL column); only `undefined` — a
 * key the caller left unset — is skipped.
 *
 *   pick({ name: 'Ada', email: undefined, active: null }, ['name', 'email', 'active'])
 *   // → { columns: ['name', 'active'], values: ['Ada', null] }
 */
export function pick(obj: Record<string, unknown>, keys: string[]): InsertShape {
	const columns: string[] = []
	const values: unknown[] = []
	for (const key of keys) {
		const val = obj[key]
		if (val === undefined) continue
		columns.push(key)
		values.push(val)
	}
	return { columns, values }
}
