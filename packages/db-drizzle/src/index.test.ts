import { cursorPaginate, orderBy, paginate, where } from '@rtorcato/db-common'
import type { SQL } from 'drizzle-orm'
import { PgDialect, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'
import type { ColumnMap } from './columns.js'
import { toDrizzleCursor } from './cursor.js'
import { toDrizzleOrderBy } from './order-by.js'
import { withPage } from './paginate.js'
import { toDrizzleWhere } from './where.js'

const users = pgTable('users', {
	id: uuid('id'),
	status: text('status'),
	age: integer('age'),
	name: text('name'),
	createdAt: timestamp('created_at'),
})

const cols: ColumnMap = {
	id: users.id,
	status: users.status,
	age: users.age,
	name: users.name,
	createdAt: users.createdAt,
}

const dialect = new PgDialect()
const render = (sql: SQL | undefined) => {
	if (!sql) throw new Error('expected an SQL fragment, got undefined')
	return dialect.sqlToQuery(sql)
}

describe('toDrizzleWhere', () => {
	it('maps eq + operator objects, ANDed', () => {
		const sql = toDrizzleWhere(where({ status: 'active', age: { gte: 18 } }), cols)
		const { sql: text, params } = render(sql)
		expect(text).toContain('"users"."status" = $1')
		expect(text).toContain('"users"."age" >= $2')
		expect(text).toContain(' and ')
		expect(params).toEqual(['active', 18])
	})

	it('maps null to IS NULL / IS NOT NULL', () => {
		expect(render(toDrizzleWhere(where({ status: null }), cols)).sql).toContain('is null')
		expect(render(toDrizzleWhere(where({ status: { ne: null } }), cols)).sql).toContain(
			'is not null'
		)
	})

	it('maps in to an array binding and like passthrough', () => {
		const inSql = render(toDrizzleWhere(where({ status: { in: ['a', 'b'] } }), cols))
		expect(inSql.sql).toContain('in (')
		expect(inSql.params).toEqual(['a', 'b'])
		expect(render(toDrizzleWhere(where({ name: { like: '%x%' } }), cols)).sql).toContain('like')
	})

	it('maps ilike, notIn and between', () => {
		const ilikeSql = render(toDrizzleWhere(where({ name: { ilike: '%x%' } }), cols))
		expect(ilikeSql.sql).toContain('ilike')
		expect(ilikeSql.params).toEqual(['%x%'])
		const notIn = render(toDrizzleWhere(where({ status: { notIn: ['a', 'b'] } }), cols))
		expect(notIn.sql).toContain('not in (')
		expect(notIn.params).toEqual(['a', 'b'])
		const range = render(toDrizzleWhere(where({ age: { between: [18, 65] } }), cols))
		expect(range.sql).toContain('between $1 and $2')
		expect(range.params).toEqual([18, 65])
	})

	it('maps isNull / isNotNull, with false inverting', () => {
		const sqlOf = (f: Parameters<typeof where>[0]) => render(toDrizzleWhere(where(f), cols)).sql
		expect(sqlOf({ status: { isNull: true } })).toContain('is null')
		expect(sqlOf({ status: { isNull: false } })).toContain('is not null')
		expect(sqlOf({ status: { isNotNull: true } })).toContain('is not null')
		expect(sqlOf({ status: { isNotNull: false } })).toContain('is null')
	})

	it('rejects a malformed between', () => {
		expect(() => toDrizzleWhere(where({ age: { between: [1] } }), cols)).toThrow(/\[min, max\]/)
		expect(() => toDrizzleWhere(where({ age: { between: 5 } }), cols)).toThrow(/\[min, max\]/)
	})

	it('returns undefined for an empty filter', () => {
		expect(toDrizzleWhere(where({}), cols)).toBeUndefined()
	})

	it('throws on an unknown column', () => {
		expect(() => toDrizzleWhere(where({ evil: 1 }), cols)).toThrow(/unknown column "evil"/)
	})
})

describe('toDrizzleOrderBy', () => {
	it('maps asc/desc in order', () => {
		const [first, second] = toDrizzleOrderBy(orderBy('name,-createdAt'), cols)
		expect(render(first).sql).toMatch(/"users"."name" asc/)
		expect(render(second).sql).toMatch(/"users"."created_at" desc/)
	})
})

describe('toDrizzleCursor', () => {
	it('produces limit, keyset where, and order', () => {
		const after = cursorPaginate({ size: 20, column: 'id' }) // first page → no after
		const { limit, where: w, orderBy: ob } = toDrizzleCursor(after, cols)
		expect(limit).toBe(20)
		expect(w).toBeUndefined() // no cursor on first page
		expect(render(ob[0]).sql).toMatch(/"users"."id" asc/)
	})
})

describe('withPage', () => {
	it('chains limit + offset from a Page', () => {
		const calls: { limit?: number; offset?: number } = {}
		const qb = {
			limit(n: number) {
				calls.limit = n
				return this
			},
			offset(n: number) {
				calls.offset = n
				return this
			},
		}
		withPage(qb, paginate({ page: 2, size: 25 }))
		expect(calls).toEqual({ limit: 25, offset: 25 })
	})
})
