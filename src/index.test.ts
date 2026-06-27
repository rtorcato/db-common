import { describe, expect, it } from 'vitest'
import { cursorPaginate, decodeCursor, encodeCursor, orderBy, paginate, where } from './index.js'

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
