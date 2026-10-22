/**
 * Per-column mapping rule: rename only (`'createdAt'`) or rename + coerce
 * (`['active', Boolean]`). Drivers hand back what they store — SQLite returns
 * `0`/`1` for booleans, dates as strings — so coercion lives next to the rename.
 */
export type FieldSpec<T> = keyof T | [keyof T, (val: unknown) => unknown]

export type RowSpec<T> = Record<string, FieldSpec<T>>

/**
 * Map a driver row (`{ snake_col: value }`) into a typed object, renaming the
 * columns named in `spec` and coercing where a function is given. Columns not
 * in `spec` are dropped — the spec is the allowlist of fields you expose.
 *
 *   mapRow({ user_id: 1, is_active: 1 }, { user_id: 'id', is_active: ['active', Boolean] })
 *   // → { id: 1, active: true }
 */
export function mapRow<T>(row: Record<string, unknown>, spec: RowSpec<T>): T {
	const out = {} as Record<keyof T, unknown>
	for (const [col, rule] of Object.entries(spec) as [string, FieldSpec<T>][]) {
		if (Array.isArray(rule)) {
			const [key, cast] = rule
			out[key] = cast(row[col])
		} else {
			out[rule] = row[col]
		}
	}
	return out as T
}

/** `mapRow` over a result set. */
export function mapRows<T>(rows: Record<string, unknown>[], spec: RowSpec<T>): T[] {
	return rows.map((row) => mapRow(row, spec))
}
