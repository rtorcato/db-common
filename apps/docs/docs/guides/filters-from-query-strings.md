---
title: Filters from query strings
description: Turn ?status=active&age[gte]=18 into safe, driver-ready conditions with where and allow.
---

# Filters from query strings

A list endpoint usually takes its filters from the URL:
`/users?status=active&age[gte]=18`. This guide turns that into a
`Condition[]` you can hand to your driver, with only the columns you allow.

## The filter shape

`where()` takes a plain object. A bare value means `eq`. An object of
operators applies each one to that column.

```ts
import { where } from '@rtorcato/db-common'

where({ status: 'active', age: { gte: 18, lt: 65 } })
// → [{ col: 'status', op: 'eq',  val: 'active' },
//    { col: 'age',    op: 'gte', val: 18 },
//    { col: 'age',    op: 'lt',  val: 65 }]
```

The operators are `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `like`,
`ilike`, `isNull`, `isNotNull` and `between`. `in` and `notIn` take an array,
`between` takes a `[min, max]` pair, and `isNull` / `isNotNull` take a boolean
(`false` inverts).

## Parse the query string

That object is the shape bracket-style query strings already parse to. With
[`qs`](https://www.npmjs.com/package/qs), which Express 4 uses for `req.query`:

```ts
import qs from 'qs'

qs.parse('status=active&age[gte]=18')
// → { status: 'active', age: { gte: '18' } }
```

`URLSearchParams` doesn't nest keys, so with it (or Express 5's default parser)
build the object yourself, one known column at a time.

Two things to know about parsed values:

- **They are strings.** `'18'`, not `18`. Postgres casts a bound `'18'` to the
  column's type, so comparisons usually work as-is. Coerce first if your
  driver or a type check needs a number.
- **Arrays need repeat syntax.** `status[in]=a,b` parses to the string `'a,b'`.
  Send `status[in][]=a&status[in][]=b` for an array, or split the string
  yourself.

## Allowlist, then map

Column names can't be bound as parameters, so a column a client invents ends
up in your SQL. Run the conditions through `allow()` before you map them.

```ts
import { allow, where } from '@rtorcato/db-common'
import { toDrizzleWhere } from '@rtorcato/db-drizzle'
import qs from 'qs'

const cols = { status: users.status, age: users.age }
const conds = allow(where(qs.parse(url.search, { ignoreQueryPrefix: true })), ['status', 'age'])

const rows = await db.select().from(users).where(toDrizzleWhere(conds, cols))
```

`allow()` drops anything outside the list without throwing, so `?evil=1` just
filters nothing. See [Allowlisting fields with allow()](./allowlisting-fields.md)
for more.

## Sorting from the same query string

`orderBy()` reads `?sort=name,-age` (a leading `-` means descending) and returns
`{ col, dir }` items that `allow()` also accepts:

```ts
import { orderBy } from '@rtorcato/db-common'
import { toDrizzleOrderBy } from '@rtorcato/db-drizzle'

const sorts = allow(orderBy(params.get('sort') ?? ''), ['name', 'age'])

const rows = await db
  .select()
  .from(users)
  .where(toDrizzleWhere(conds, cols))
  .orderBy(...toDrizzleOrderBy(sorts, { ...cols, name: users.name }))
```

## Things to watch

- **Operators are open.** `allow()` checks columns, not operators. If a column
  shouldn't accept `like` (a leading `%` can force a full scan) or `in` with a
  huge list, check `cond.op` and `cond.val` before mapping.
- **`ilike` is Postgres-only.** Use `like` on MySQL and SQLite.
