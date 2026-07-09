# db-drizzle

> Drizzle ORM adapters for [`db-common`](../../README.md) shapes — Postgres.

Maps db-common's plain shapes (`where`, `orderBy`, `paginate`, `cursorPaginate`)
into Drizzle query fragments. `db-common` stays driver-agnostic; this package is
where Drizzle lives.

```bash
pnpm add @rtorcato/db-drizzle drizzle-orm  # + pg for ./connection, drizzle-kit for ./config
```

## Adapters

```ts
import { allow, orderBy, paginate, where } from '@rtorcato/db-common'
import { toDrizzleOrderBy, toDrizzleWhere, withPage } from '@rtorcato/db-drizzle'

const cols = { status: users.status, age: users.age, name: users.name }

let conds = where({ status: 'active', age: { gte: 18 } })
conds = allow(conds, ['status', 'age']) // allowlist query-string columns first

const rows = await withPage(
  db
    .select()
    .from(users)
    .where(toDrizzleWhere(conds, cols))
    .orderBy(...toDrizzleOrderBy(orderBy('name'), cols)),
  paginate({ page: 2, size: 25 })
)
```

- `toDrizzleWhere(Condition[], cols)` → `SQL | undefined` (`eq`/`ne` on `null`
  become `IS NULL`/`IS NOT NULL`; `in` → `inArray`).
- `toDrizzleOrderBy(Sort[], cols)` → `SQL[]` for `.orderBy(...)`.
- `withPage(qb, Page)` → `qb.limit().offset()`.
- `toDrizzleCursor(CursorQuery, cols)` → `{ limit, where, orderBy }`.

A `cols` map resolves db-common's string column names to real Drizzle columns;
unknown names throw. Allowlist with db-common's `allow()` first.

## Postgres helpers (subpath exports)

```ts
import { createDb } from '@rtorcato/db-drizzle/connection' // needs `pg`
import { pgConfig } from '@rtorcato/db-drizzle/config'      // needs `drizzle-kit`
import { id, timestamps } from '@rtorcato/db-drizzle'       // column conventions
```

- `createDb(url | PoolConfig, schema?)` → `{ db, pool }` (node-postgres).
- `pgConfig({ schema, url, out? })` → a `drizzle.config.ts` default.
- `id()`, `timestamps()` → reusable `pgTable` column conventions.
