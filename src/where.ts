export type Operator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like'

export interface Condition {
	col: string
	op: Operator
	val: unknown
}

/** A filter value: a bare value (→ `eq`) or an object of operator → value. */
export type FilterValue = unknown | Partial<Record<Operator, unknown>>
export type Filter = Record<string, FilterValue>

const OPERATORS: ReadonlySet<string> = new Set<Operator>([
	'eq',
	'ne',
	'gt',
	'gte',
	'lt',
	'lte',
	'in',
	'like',
])

// ponytail: treats any object whose keys are ALL operator names as an operator
// map. A data object that happens to use only those keys would be misread —
// pass it under an explicit { eq: obj } if that ever bites.
function isOperatorObject(val: unknown): val is Record<Operator, unknown> {
	if (typeof val !== 'object' || val === null || Array.isArray(val)) return false
	const keys = Object.keys(val)
	return keys.length > 0 && keys.every((k) => OPERATORS.has(k))
}

/**
 * Normalize a filter object into a flat list of `{ col, op, val }`. Bare values
 * become `eq`; nested objects use operator keys. The caller maps these to its
 * driver's placeholders — a `val` of `null` is left as-is (map to IS NULL).
 *
 *   where({ status: 'active', age: { gte: 18 } })
 *   // → [{ col: 'status', op: 'eq', val: 'active' },
 *   //    { col: 'age', op: 'gte', val: 18 }]
 */
export function where(filter: Filter): Condition[] {
	const out: Condition[] = []
	for (const [col, value] of Object.entries(filter)) {
		if (isOperatorObject(value)) {
			for (const [op, val] of Object.entries(value)) {
				out.push({ col, op: op as Operator, val })
			}
		} else {
			out.push({ col, op: 'eq', val: value })
		}
	}
	return out
}
