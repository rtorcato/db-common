# Roadmap

`db-common` is early. This is a rough plan, not a commitment — order and scope
will shift as real usage informs the API.

## 0.x — foundations

- [x] Project scaffold (TypeScript, tsup, Vitest, Biome, Husky, semantic-release)
- [x] Documentation site (`apps/docs`, Docusaurus) + GitHub Pages deploy
- [ ] First helpers: pagination (`paginate`, page/cursor)
- [ ] Query shaping: `orderBy`, `where`-clause builders (driver-agnostic)
- [ ] Result mapping: row → typed object helpers
- [ ] Full test coverage for each helper as it lands

## Toward 1.0

- [ ] Stable, documented public API surface
- [ ] Per-helper guides in the docs site
- [ ] Published to npm as `@rtorcato/db-common`
- [ ] Bundle-size budget enforced in CI

## Ideas / maybe

- Cursor-based pagination helpers
- Lightweight migration-ordering utilities
- Connection-pool config helpers (driver-agnostic shapes)

Have a use case? Open an issue: https://github.com/rtorcato/db-common/issues
