---
title: Allowlisting fields with allow()
description: Keep client-supplied filter and sort columns to a fixed list before they reach SQL.
---

# Allowlisting fields with `allow()`

Values in a SQL query are bound as parameters, so a hostile value stays a
value. Column names can't be bound. They become part of the SQL text. When
filter or sort columns come from a client, something has to decide which
names are allowed. In db-common, that's `allow()`.

## What it does

`allow(items, cols)` keeps the items whose `col` is in `cols` and drops the
rest. It works on the output of `where()` and `orderBy()` alike, since both
have a `col`.

```ts
import { allow, orderBy, where } from '@rtorcato/db-common'

allow(where({ status: 'active', evil: 1 }), ['status'])
// → [{ col: 'status', op: 'eq', val: 'active' }]

allow(orderBy('name,-password'), ['name', 'createdAt'])
// → [{ col: 'name', dir: 'asc' }]
```

It never throws. An unknown column is dropped, so a typo or a probing client
gets an unfiltered (or unsorted) result rather than an error. If you'd rather
reject the request, compare lengths:

```ts
const conds = where(input)
const safe = allow(conds, FILTERABLE)
if (safe.length !== conds.length) throw new Error('Unknown filter field') // respond 400
```

## Where it goes

Call it once, right after parsing and before any driver mapping:

```ts
const FILTERABLE = ['status', 'age'] as const
const SORTABLE = ['name', 'age', 'createdAt'] as const

const conds = allow(where(filterInput), FILTERABLE)
const sorts = allow(orderBy(sortInput), SORTABLE)
```

Keep separate lists for filtering and sorting. A column can be fine to sort by
but too costly to filter on, or the other way round.

## Allowlist names, not columns

The list holds the names clients may use, not every column on the table. Leave
out anything private (`passwordHash`, `deletedAt`) and anything unindexed you
don't want clients scanning.

## The Drizzle adapter is a backstop

The [Drizzle adapters](./drizzle.md) take a `cols` map and throw on a name
that isn't in it. That stops an unknown column from reaching SQL, but as an
error from deep inside your query code. `allow()` is the check you choose: it
runs first, it decides what clients may touch, and the adapter's throw stays a
last line of defence.

Both lists can come from one place:

```ts
const cols = { status: users.status, age: users.age }

const conds = allow(where(filterInput), Object.keys(cols))
const rows = await db.select().from(users).where(toDrizzleWhere(conds, cols))
```

## What it doesn't check

`allow()` looks at `col` only. It doesn't limit operators or values. See
[Filters from query strings](./filters-from-query-strings.md#things-to-watch)
for those.
