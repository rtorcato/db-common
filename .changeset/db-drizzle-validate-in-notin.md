---
'@rtorcato/db-drizzle': patch
---

Validate that `in` / `notIn` values are arrays. A scalar now throws a clear error at build time instead of emitting invalid SQL.
