# db-common

Small, focused, **database-agnostic** TypeScript helpers (pagination, query
shaping, result mapping) for the `@rtorcato/*` family. ESM-only,
tree-shakeable, zero runtime dependencies.

## Core principle

Every helper returns a **plain shape** the caller feeds to its own driver or
query builder. `db-common` never generates SQL and never touches a connection —
that's what keeps it driver-agnostic and dependency-free. When adding a helper,
return a normalized data shape (`{ limit, offset }`, `{ col, op, val }[]`); do
not interpolate values or emit query strings.

## Conventions

- **Prefer `@rtorcato/js-common`.** Before writing any generic utility (clamping,
  type guards, object/array shaping), check `@rtorcato/js-common` first — it's a
  family sibling, compose it rather than reinvent. Add it as a dependency the
  first time a helper actually needs it, not speculatively (zero runtime deps
  today).
- **One helper per file** in `src/`, re-exported from `src/index.ts` with its
  types. Match the existing style: a short JSDoc with a worked `// →` example,
  named exports only.
- **Inputs often come from query strings** — clamp/floor junk (see `paginate`),
  drop empty tokens (see `orderBy`). Be liberal in what you accept.
- **Leave `null` and edge cases to the caller** — e.g. `where` passes `val: null`
  through for the caller to map to `IS NULL`.
- Mark deliberate shortcuts with a `ponytail:` comment (see `where.ts`).

## Commands

- `pnpm verify` — typecheck + Biome check + tests (run before committing)
- `pnpm test` / `pnpm build`

Tooling (TS, tsup, Vitest, Biome, Husky, semantic-release) comes from
`@rtorcato/js-tooling`. Commits are conventional (commitlint enforced).
