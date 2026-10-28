---
title: Drizzle adapters
description: Use @rtorcato/db-drizzle to turn db-common shapes into Drizzle ORM queries on Postgres.
---

# Drizzle adapters

`@rtorcato/db-drizzle` maps the plain shapes from `@rtorcato/db-common`
(`where`, `orderBy`, `paginate`, `cursorPaginate`) into Drizzle query
fragments. `db-common` stays driver-agnostic; this package is where Drizzle
lives.

## Install

```bash
pnpm add @rtorcato/db-drizzle drizzle-orm
# or
npm install @rtorcato/db-drizzle drizzle-orm
```

It depends on `@rtorcato/db-common`, which installs with it. Import the
`where`/`orderBy`/`paginate` helpers from `@rtorcato/db-common`.

| Peer dependency | Version    | Needed for                                    |
| --------------- | ---------- | --------------------------------------------- |
| `drizzle-orm`   | `^0.45.2`  | everything (required)                         |
| `pg`            | `^8.13.0`  | `createDb` from `@rtorcato/db-drizzle/connection` (optional) |
| `drizzle-kit`   | `^0.31.10` | `pgConfig` from `@rtorcato/db-drizzle/config` (optional)     |

## Column maps

db-common deals in column _names_ (`{ col: 'status' }`); Drizzle operators need
the real column objects. Every adapter takes a `cols` map that resolves one to
the other, and throws on a name that isn't in it.

```ts
import { users } from './schema'

const cols = { status: users.status, age: users.age, name: users.name }
```

When the input comes from a query string, filter it through db-common's
`allow()` first. The throw on unknown names is the last line of defence, not
the first.

## Filters: `toDrizzleWhere`

Turns a `Condition[]` from `where()` into one `SQL` predicate with the parts
ANDed. An empty list returns `undefined`, so you can pass it straight to
`.where()`. `eq` and `ne` against `null` become `IS NULL` and `IS NOT NULL`;
`in` and `notIn` become `inArray` and `notInArray`; `isNull` / `isNotNull` take a
boolean (`false` inverts); `between` takes a `[min, max]` pair and throws on
anything else. `ilike` is Postgres-only, so use `like` on MySQL and SQLite.

```ts
import { allow, where } from '@rtorcato/db-common'
import { toDrizzleWhere } from '@rtorcato/db-drizzle'

const conds = allow(where({ status: 'active', age: { gte: 18 } }), ['status', 'age'])

const rows = await db.select().from(users).where(toDrizzleWhere(conds, cols))
// where "status" = 'active' and "age" >= 18
```

## Bulk insert and upsert: `toDrizzleValues`, `toDrizzleOnConflict`

`pickMany()` shapes many rows for one INSERT and `onConflict()` shapes the
upsert clause. The adapters resolve column names against your column map, so its
keys must be the table's property names. A cell left `undefined` falls back to
the column default. `toDrizzleOnConflict` throws on an empty update set; use
`.onConflictDoNothing({ target })` for that case. Both take their types from the
column map, so leave it unannotated (not `: ColumnMap`) and the result fits
`.values()` and `.onConflictDoUpdate()` with no cast.

```ts
import { onConflict, pickMany } from '@rtorcato/db-common'
import { toDrizzleOnConflict, toDrizzleValues } from '@rtorcato/db-drizzle'

await db
  .insert(users)
  .values(toDrizzleValues(pickMany(rows, ['email', 'name']), cols))
  .onConflictDoUpdate(toDrizzleOnConflict(onConflict(['email'], { name: 'Ada' }), cols))
```

## Sorting: `toDrizzleOrderBy`

Turns a `Sort[]` from `orderBy()` into an array of `asc()`/`desc()`
expressions to spread into `.orderBy()`.

```ts
import { orderBy } from '@rtorcato/db-common'
import { toDrizzleOrderBy } from '@rtorcato/db-drizzle'

const rows = await db
  .select()
  .from(users)
  .orderBy(...toDrizzleOrderBy(orderBy('name,-age'), cols))
// order by "name" asc, "age" desc
```

## Offset pagination: `withPage`

Applies the `{ limit, offset }` from `paginate()` to a query builder.

```ts
import { paginate } from '@rtorcato/db-common'
import { withPage } from '@rtorcato/db-drizzle'

const rows = await withPage(db.select().from(users), paginate({ page: 2, size: 25 }))
// limit 25 offset 25
```

## Keyset pagination: `toDrizzleCursor`

Turns the query from `cursorPaginate()` into `{ limit, where, orderBy }`.
Fetch `limit + 1` rows to see whether there is a next page, then
`encodeCursor` the last row you keep (db-common owns encode and decode).

```ts
import { cursorPaginate } from '@rtorcato/db-common'
import { toDrizzleCursor } from '@rtorcato/db-drizzle'

const { limit, where, orderBy } = toDrizzleCursor(
  cursorPaginate({ size: 20, column: 'id', after }),
  { id: users.id }
)

const rows = await db
  .select()
  .from(users)
  .where(where)
  .orderBy(...orderBy)
  .limit(limit + 1)
```

## Column conventions: `id` and `timestamps`

Reusable `pgTable` columns: `id()` is a UUID primary key defaulting to a random
value, `timestamps()` adds non-null `created_at` and `updated_at` timestamptz
columns defaulting to now. Drizzle has no on-update trigger, so bump
`updatedAt` in your write path or a database trigger.

```ts
import { id, timestamps } from '@rtorcato/db-drizzle'
import { pgTable, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: id(),
  name: text('name').notNull(),
  ...timestamps(),
})
```

## Connection: `createDb`

A node-postgres pool plus a Drizzle instance over it, from a connection string
or a `pg` `PoolConfig`. It lives on its own subpath so apps that don't use it
don't need `pg`. It returns both so you can `pool.end()` on shutdown.

```ts
import { createDb } from '@rtorcato/db-drizzle/connection'
import * as schema from './schema'

const { db, pool } = createDb(process.env.DATABASE_URL!, schema)

// on shutdown
await pool.end()
```

## Migrations config: `pgConfig`

A shared `drizzle.config.ts` for a Postgres app. It fills in the dialect, so
each app only states its schema path and URL (and optionally `out`, default
`./drizzle`). It needs `drizzle-kit`.

```ts
// drizzle.config.ts
import { pgConfig } from '@rtorcato/db-drizzle/config'

export default pgConfig({ schema: './src/schema.ts', url: process.env.DATABASE_URL! })
```
