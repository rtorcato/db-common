# @rtorcato/db-common

## 1.7.0

### Minor Changes

- 48e4570: `cursorPaginate` now accepts `column: string | string[]` and consumes the composite cursor `buildCursor(row, [...])` produces, returning a plain `keyset` tuple predicate. Before, a composite cursor was treated as junk and silently returned page 1. `toDrizzleCursor` maps `keyset` into the `where`.

### Patch Changes

- d268c2f: Fix the Drizzle adapters guide link (it returned 404) and the `AGENTS.md` link in the READMEs shown on npm.

## 1.6.1

### Patch Changes

- 4724842: Fix the README banner on npmjs.com. The shipped README used relative `./brand/` URLs, which npm resolves against `repository.directory` and so 404. It now uses absolute `raw.githubusercontent.com` URLs.

## 1.6.0

### Minor Changes

- 3762e64: Add the `ilike`, `notIn`, `isNull`/`isNotNull` and `between` where operators (#146), and bulk-insert and upsert/on-conflict write shapes (#147). Both merged after 1.5.0 under semantic-release and had not shipped yet.

## 1.5.0

Releases up to 1.5.0 were cut by semantic-release. Their notes are in the root [CHANGELOG.md](../../CHANGELOG.md) (up to 1.4.1) and on [GitHub Releases](https://github.com/rtorcato/db-common/releases). From the next release on, Changesets writes each entry here, above this one.
