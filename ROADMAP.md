# Roadmap

`db-common` is early. This is a rough plan, not a commitment — order and scope
will shift as real usage informs the API.

Work is tracked in two GitHub milestones: **v0.2 — First helpers** and
**v1.0 — Stable API**.

## v0.2 — first helpers

- [x] Project scaffold (TypeScript, tsup, Vitest, Biome, Husky, semantic-release)
- [x] Documentation site (`apps/docs`, Docusaurus) + GitHub Pages deploy
- [x] `paginate` — page/offset helper (the one the README advertises)
- [x] Cursor-based pagination helper
- [x] `orderBy` builder (driver-agnostic)
- [x] `where`-clause builder (driver-agnostic)
- [x] Result mapping: `mapRow`/`mapRows` (row → typed object, rename + coerce)
- [x] `allow` — column allowlist for `where`/`orderBy` (identifier-injection guard)
- [x] `pageMeta` — page-count metadata for offset pagination
- [x] Full test coverage for each helper as it lands

## v1.0 — stable API

- [ ] Stable, documented public API surface
- [ ] Per-helper guides in the docs site
- [ ] Published to npm as `@rtorcato/db-common`
- [ ] Bundle-size budget enforced in CI

## Ideas / maybe

- Lightweight migration-ordering utilities
- Connection-pool config helpers (driver-agnostic shapes)

### Driver-specific code lives in sibling packages, not here

`db-common` stays driver-agnostic, SQL-free, and zero-dependency. Anything tied
to a specific ORM/driver — Drizzle setup, SQL snippets, connection handling —
belongs in a package that *depends on* `db-common`, e.g.:

- `db-drizzle` — adapters that map db-common shapes (`where`, `orderBy`,
  `paginate`) into Drizzle query fragments; Drizzle as a peer dep.
- per-driver packages (`db-pg`, `db-sqlite`, …) for the same role.

Build these only when a real app needs one — not speculatively.

#### `db-drizzle` — when and what (intent captured, not yet built)

No app uses Drizzle yet, so there is nothing to deduplicate — DRY removes
repetition that *exists*, it isn't build-ahead. Recording the target shape here so
the first real app gets harvested instead of reinvented.

- **Trigger:** spin up `rtorcato/db-drizzle` when a *second* app would copy-paste
  the same Drizzle setup (rule of three / extract-on-second-use). Not before — the
  first app builds its Drizzle setup in-app.
- **Layout:** standalone repo, same shape as the other `*-common` packages,
  scaffolded from `@rtorcato/js-tooling`, Drizzle as a **peer** dep.
- **Intended contents** (target scope, not a commitment), in extraction order:
  1. **Adapters** — map db-common shapes (`where`, `orderBy`, `paginate`,
     `cursorPaginate`) into Drizzle query fragments. Pure functions, no connection.
     This is the core value; extract first.
  2. **`drizzle.config` / drizzle-kit + migration tooling glue.**
  3. **Schema/column conventions** — id/timestamp/naming helpers.
  4. **Connection/pool helpers** — most env-specific and likeliest to leak per-app
     differences; extract last, and only what genuinely repeats.

Have a use case? Open an issue: https://github.com/rtorcato/db-common/issues
