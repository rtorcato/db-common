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
- [ ] Result mapping: row → typed object helpers
- [x] Full test coverage for each helper as it lands

## v1.0 — stable API

- [ ] Stable, documented public API surface
- [ ] Per-helper guides in the docs site
- [ ] Published to npm as `@rtorcato/db-common`
- [ ] Bundle-size budget enforced in CI

## Ideas / maybe

- Lightweight migration-ordering utilities
- Connection-pool config helpers (driver-agnostic shapes)

Have a use case? Open an issue: https://github.com/rtorcato/db-common/issues
