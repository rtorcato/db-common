import { describe, expect, it } from 'vitest'
import {
	allow,
	cursorPaginate,
	decodeCursor,
	encodeCursor,
	mapRow,
	mapRows,
	orderBy,
	pageMeta,
	paginate,
	pick,
	setClause,
	where,
} from './index.js'

describe('paginate', () => {
	it('converts page/size to limit/offset', () => {
		expect(paginate({ page: 2, size: 25 })).toEqual({ limit: 25, offset: 0 + 25 })
	})

	it('clamps and floors junk input to page 1', () => {
		expect(paginate({ page: 0, size: 10 })).toEqual({ limit: 10, offset: 0 })
		expect(paginate({ page: -5, size: 0 })).toEqual({ limit: 1, offset: 0 })
		expect(paginate({ page: 3.9, size: 10.9 })).toEqual({ limit: 10, offset: 20 })
	})
})

describe('orderBy', () => {
	it('parses a comma string with -desc prefixes', () => {
		expect(orderBy('name,-createdAt')).toEqual([
			{ col: 'name', dir: 'asc' },
			{ col: 'createdAt', dir: 'desc' },
		])
	})

	it('accepts arrays and drops empty tokens', () => {
		expect(orderBy(['a', ' ', '-b'])).toEqual([
			{ col: 'a', dir: 'asc' },
			{ col: 'b', dir: 'desc' },
		])
	})
})

describe('where', () => {
	it('treats bare values as eq and objects as operators', () => {
		expect(where({ status: 'active', age: { gte: 18 } })).toEqual([
			{ col: 'status', op: 'eq', val: 'active' },
			{ col: 'age', op: 'gte', val: 18 },
		])
	})

	it('expands multiple operators on one column and keeps null', () => {
		expect(where({ age: { gte: 18, lt: 65 }, deletedAt: null })).toEqual([
			{ col: 'age', op: 'gte', val: 18 },
			{ col: 'age', op: 'lt', val: 65 },
			{ col: 'deletedAt', op: 'eq', val: null },
		])
	})
})

describe('pick', () => {
	it('builds parallel columns/values, dropping undefined and keeping null', () => {
		expect(
			pick({ name: 'Ada', email: undefined, active: null }, ['name', 'email', 'active'])
		).toEqual({ columns: ['name', 'active'], values: ['Ada', null] })
	})

	it('only picks listed keys, in the order given', () => {
		expect(pick({ a: 1, b: 2, c: 3 }, ['c', 'a'])).toEqual({ columns: ['c', 'a'], values: [3, 1] })
	})
})

describe('setClause', () => {
	it('maps an object to {col,val}, skipping undefined and keeping null', () => {
		expect(setClause({ name: 'Ada', bio: undefined, active: null })).toEqual([
			{ col: 'name', val: 'Ada' },
			{ col: 'active', val: null },
		])
	})
})

describe('cursor', () => {
	it('round-trips a cursor value', () => {
		expect(decodeCursor(encodeCursor({ id: 42 }))).toEqual({ id: 42 })
	})

	it('omits the predicate on the first page', () => {
		expect(cursorPaginate({ size: 20, column: 'id' })).toEqual({
			limit: 20,
			where: [],
			order: [{ col: 'id', dir: 'asc' }],
		})
	})

	it('builds a gt/lt keyset predicate from the cursor by direction', () => {
		expect(cursorPaginate({ size: 20, column: 'id', after: encodeCursor(99) })).toEqual({
			limit: 20,
			where: [{ col: 'id', op: 'gt', val: 99 }],
			order: [{ col: 'id', dir: 'asc' }],
		})
		expect(
			cursorPaginate({ size: 20, column: 'id', dir: 'desc', after: encodeCursor(99) }).where
		).toEqual([{ col: 'id', op: 'lt', val: 99 }])
	})
})

describe('allow', () => {
	it('drops conditions/sorts whose col is not allowlisted', () => {
		expect(allow(where({ status: 'active', evil: 1 }), ['status'])).toEqual([
			{ col: 'status', op: 'eq', val: 'active' },
		])
		expect(allow(orderBy('name,-secret'), ['name'])).toEqual([{ col: 'name', dir: 'asc' }])
	})
})

describe('pageMeta', () => {
	it('derives navigation metadata from a row count', () => {
		expect(pageMeta({ total: 95, page: 2, size: 25 })).toEqual({
			page: 2,
			size: 25,
			total: 95,
			totalPages: 4,
			hasNext: true,
			hasPrev: true,
		})
	})

	it('clamps junk and flags first/last page edges', () => {
		expect(pageMeta({ total: 0, page: 0, size: 0 })).toEqual({
			page: 1,
			size: 1,
			total: 0,
			totalPages: 0,
			hasNext: false,
			hasPrev: false,
		})
		expect(pageMeta({ total: 10, page: 1, size: 10 })).toMatchObject({
			totalPages: 1,
			hasNext: false,
			hasPrev: false,
		})
	})
})

describe('mapRow', () => {
	it('renames columns and coerces where a cast is given, dropping the rest', () => {
		expect(
			mapRow(
				{ user_id: 1, is_active: 1, secret: 'x' },
				{
					user_id: 'id',
					is_active: ['active', Boolean],
				}
			)
		).toEqual({ id: 1, active: true })
	})

	it('maps a result set', () => {
		expect(mapRows([{ n: 'a' }, { n: 'b' }], { n: 'name' })).toEqual([{ name: 'a' }, { name: 'b' }])
	})
})
