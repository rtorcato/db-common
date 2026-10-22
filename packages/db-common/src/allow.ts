/**
 * Keep only the items whose `col` is in the allowlist. Column identifiers can't
 * be parameterized, so when `where`/`orderBy` input comes from a query string
 * the caller must allowlist columns before mapping them into SQL — otherwise a
 * junk `?sort=name;DROP…` rides through. Works on `Condition[]` and `Sort[]`
 * alike (both have a `col`).
 *
 *   allow(where({ status: 'active', evil: 1 }), ['status'])
 *   // → [{ col: 'status', op: 'eq', val: 'active' }]
 */
export function allow<T extends { col: string }>(items: T[], cols: readonly string[]): T[] {
	const ok = new Set(cols)
	return items.filter((item) => ok.has(item.col))
}
