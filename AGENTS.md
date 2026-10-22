<!-- Generated from skills/db-common/SKILL.md by scripts/sync-agents.mjs — do not edit by hand; run `pnpm sync:agents`. -->

# db-common

`@rtorcato/db-common` is a set of database-agnostic helpers — pagination, query
shaping, result mapping. TypeScript-first, zero runtime dependencies, ships ESM
and CJS. Single root export (no subpaths).

> Check the installed version's types before relying on exact return shapes.

## Core principle: shapes in, shapes out — never SQL

Every helper returns a plain object/array you hand to your driver. The library
never touches a database and never emits SQL, which is what keeps it
driver-agnostic:

```ts
import { paginate, orderBy, where } from "@rtorcato/db-common";

paginate({ page: 2, size: 25 });
// → { limit: 25, offset: 25 }   (junk input is clamped to page/size ≥ 1)

orderBy("name,-createdAt");
// → [{ col: "name", dir: "asc" }, { col: "createdAt", dir: "desc" }]
//   leading "-" = descending; accepts a string or string[]

where({ status: "active", age: { gte: 18 } });
// → [{ col: "status", op: "eq", val: "active" },
//    { col: "age", op: "gte", val: 18 }]
//   bare values become `eq`; objects use operator keys
//   (eq, ne, gt, gte, lt, lte, in, notIn, like, ilike, isNull, isNotNull, between).
//   A `null` val is kept — map it to IS NULL. `isNull`/`isNotNull` take a
//   boolean (`false` inverts); `between` takes a [min, max] pair.
```

## Allowlist columns from request input

Column names can't be bound as parameters. When `where`/`orderBy` input comes
from a query string, filter it through `allow` before mapping `col` into SQL:

```ts
import { allow, orderBy, where } from "@rtorcato/db-common";

const filters = allow(where(req.query.filter), ["status", "age"]);
const sort = allow(orderBy(req.query.sort ?? ""), ["name", "createdAt"]);
```

Bind every `val` through your driver's placeholders; never concatenate it.

## Offset pagination

`paginate` gives `{ limit, offset }`; `pageMeta` gives the navigation half from
a `COUNT(*)` you run. Feed both the same `page`/`size`:

```ts
pageMeta({ total: 95, page: 2, size: 25 });
// → { page: 2, size: 25, total: 95, totalPages: 4, hasNext: true, hasPrev: true }
```

## Keyset pagination

`cursorPaginate` builds a keyset query. The idiom: request `limit + 1` rows,
and if you get the extra row, drop it and build the next `after` from the last
kept row with `buildCursor` (or `encodeCursor` on the key value).

```ts
import { buildCursor, cursorPaginate } from "@rtorcato/db-common";

const q = cursorPaginate({ size: 20, column: "id", after });
// → { limit: 20,
//     where: [{ col: "id", op: "gt", val: … }],   // empty on the first page
//     order: [{ col: "id", dir: "asc" }] }

const next = rows.length > q.limit ? buildCursor(rows[q.limit - 1], "id") : undefined;
```

- A junk or non-scalar `after` is treated as no cursor (first page); it never throws.
- `dir: "desc"` flips the predicate to `lt`.
- Keyset on a unique column. `cursorPaginate` emits a single-column predicate,
  so ties on a non-unique column can skip or repeat rows.

## Write side and result mapping

```ts
import { mapRows, onConflict, pick, pickMany, setClause } from "@rtorcato/db-common";

pick({ name: "Ada", email: undefined, active: null }, ["name", "email", "active"]);
// → { columns: ["name", "active"], values: ["Ada", null] }   (INSERT)

setClause({ name: "Ada", bio: undefined, active: null });
// → [{ col: "name", val: "Ada" }, { col: "active", val: null }]   (UPDATE … SET)

pickMany([{ name: "Ada" }, { name: "Bo", bio: null }], ["name", "bio"]);
// → { columns: ["name", "bio"], rows: [["Ada", undefined], ["Bo", null]] }   (bulk INSERT)
//   a key unset in every row is dropped; unset in some rows → `undefined` (DEFAULT)

onConflict(["email"], { name: "Ada", bio: undefined });
// → { target: ["email"], set: [{ col: "name", val: "Ada" }] }   (ON CONFLICT … DO UPDATE)
//   empty `set` = do nothing; an empty `target` throws

mapRows(rows, { user_id: "id", is_active: ["active", Boolean] });
// → [{ id: 1, active: true }, …]   columns not in the spec are dropped
```

Only `undefined` is skipped by `pick`/`pickMany`/`setClause`; `null` is kept as a NULL write.

## Constraints

- Targets Node ≥22. The cursor helpers use `Buffer` (base64url), so they need
  Node or a `Buffer` global.
- Drizzle adapters for these shapes ship separately as `@rtorcato/db-drizzle`.
