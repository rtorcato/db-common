---
title: Cursor pagination
description: Build a keyset-paginated list endpoint with cursorPaginate and buildCursor.
---

# Cursor pagination

Keyset (cursor) pagination asks for "the rows after this one" instead of "skip
N rows". It stays fast on large tables and doesn't skip or repeat rows when
someone inserts while a client is paging. This guide builds a list endpoint
that returns a page of rows plus a `nextCursor` the client sends back.

## The loop

1. Read `size` and the `after` cursor from the request.
2. `cursorPaginate()` turns them into a `limit`, a `where` and an `order`.
3. Run the query for `limit + 1` rows. The extra row tells you whether there
   is a next page.
4. Keep the first `limit` rows and `buildCursor()` the last one you keep.
5. Return the rows and the cursor. The client passes it back as `after`.

## Build the query

```ts
import { cursorPaginate } from '@rtorcato/db-common'

const query = cursorPaginate({ size: 20, column: 'id', after: params.get('after') ?? undefined })
// first page:  { limit: 20, where: [], order: [{ col: 'id', dir: 'asc' }] }
// later pages: { limit: 20, where: [{ col: 'id', op: 'gt', val: 42 }], order: [...] }
```

`after` comes straight from the query string, so `cursorPaginate()` never
throws on it. A cursor that doesn't decode, or that decodes to anything but a
string, number or boolean, counts as no cursor and you get the first page.

`size` is clamped to at least 1 and floored. It is not capped, so put your own
ceiling on it before you pass it in:

```ts
const size = Math.min(Number(params.get('size')) || 20, 100)
```

## Run it and build the next cursor

With [Drizzle](./drizzle.md), `toDrizzleCursor()` maps the query for you:

```ts
import { buildCursor, cursorPaginate } from '@rtorcato/db-common'
import { toDrizzleCursor } from '@rtorcato/db-drizzle'
import { users } from './schema'

export async function listUsers(params: URLSearchParams) {
  const size = Math.min(Number(params.get('size')) || 20, 100)
  const query = cursorPaginate({ size, column: 'id', after: params.get('after') ?? undefined })
  const { limit, where, orderBy } = toDrizzleCursor(query, { id: users.id })

  const rows = await db
    .select()
    .from(users)
    .where(where)
    .orderBy(...orderBy)
    .limit(limit + 1)

  const hasNext = rows.length > limit
  const data = hasNext ? rows.slice(0, limit) : rows
  const nextCursor = hasNext ? buildCursor(data[data.length - 1], 'id') : null

  return { data, nextCursor }
}
```

On another driver, map `query.where` and `query.order` yourself. Each
condition is a plain `{ col, op, val }` and each sort is `{ col, dir }`.

## Pick the right column

- **Unique.** The cursor is the last row's value in one column. If two rows
  share that value, the page boundary can skip or repeat one of them. `id` is
  the safe default.
- **It is the sort.** `cursorPaginate()` sets the `order` itself, by that
  column. Don't sort by something else and keyset on `id`.
- **Direction.** Pass `dir: 'desc'` for newest-first. The predicate flips to
  `lt` to match.

```ts
cursorPaginate({ size: 20, column: 'id', dir: 'desc', after })
// later pages: where: [{ col: 'id', op: 'lt', val: 42 }]
```

:::note Non-unique columns
`buildCursor(row, ['createdAt', 'id'])` already encodes a composite cursor, but
`cursorPaginate()` only reads a single value today. Paging on a non-unique
column such as `createdAt` needs that support first. Until then, keyset on a
unique column.
:::

## Combine with filters

The keyset predicate is a `Condition[]`, the same shape `where()` returns. To
page through a filtered list, concatenate the two before you map them:

```ts
import { toDrizzleOrderBy, toDrizzleWhere } from '@rtorcato/db-drizzle'

const filters = allow(where(filterInput), ['status'])
const query = cursorPaginate({ size, column: 'id', after })
const cols = { id: users.id, status: users.status }

const rows = await db
  .select()
  .from(users)
  .where(toDrizzleWhere([...filters, ...query.where], cols))
  .orderBy(...toDrizzleOrderBy(query.order, cols))
  .limit(query.limit + 1)
```

Keep the filters the same on every page. A cursor from one filter set means
nothing under another. See [Filters from query strings](./filters-from-query-strings.md)
for building `filterInput`.
