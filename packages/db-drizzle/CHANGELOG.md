# @rtorcato/db-drizzle

## 0.2.0

### Minor Changes

- 48e4570: `cursorPaginate` now accepts `column: string | string[]` and consumes the composite cursor `buildCursor(row, [...])` produces, returning a plain `keyset` tuple predicate. Before, a composite cursor was treated as junk and silently returned page 1. `toDrizzleCursor` maps `keyset` into the `where`.

### Patch Changes

- 5e79210: Validate that `in` / `notIn` values are arrays. A scalar now throws a clear error at build time instead of emitting invalid SQL.
- d268c2f: Fix the Drizzle adapters guide link (it returned 404) and the `AGENTS.md` link in the READMEs shown on npm.
- Updated dependencies [48e4570]
- Updated dependencies [d268c2f]
  - @rtorcato/db-common@1.7.0

## 0.1.1

### Patch Changes

- 3762e64: Depend on `@rtorcato/db-common` with a `^1.x` range instead of an exact pin (#142). This 0.1.1 change was versioned by hand but never reached npm.
- Updated dependencies [3762e64]
  - @rtorcato/db-common@1.6.0
