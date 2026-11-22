---
"@rtorcato/db-common": minor
"@rtorcato/db-drizzle": minor
---

`cursorPaginate` now accepts `column: string | string[]` and consumes the composite cursor `buildCursor(row, [...])` produces, returning a plain `keyset` tuple predicate. Before, a composite cursor was treated as junk and silently returned page 1. `toDrizzleCursor` maps `keyset` into the `where`.
