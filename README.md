# db-common

[![CI](https://github.com/rtorcato/db-common/actions/workflows/ci.yml/badge.svg)](https://github.com/rtorcato/db-common/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@rtorcato/db-common.svg)](https://www.npmjs.com/package/@rtorcato/db-common)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/db-common.svg)](https://www.npmjs.com/package/@rtorcato/db-common)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/db-common)](https://bundlephobia.com/package/@rtorcato/db-common)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Shared, tree-shakeable TypeScript database utilities for the `@rtorcato/*` family.

📖 **Docs:** https://rtorcato.github.io/db-common

## Description

`db-common` is a collection of small, focused, database-agnostic helpers —
pagination, query shaping, result mapping — built the same way as the rest of
the `@rtorcato/*` family: TypeScript-first, ESM-only, tree-shakeable, with zero
runtime dependencies.

> **Early days.** The public API is still small and may change before `1.0`.
> See the [milestones](https://github.com/rtorcato/db-common/milestones) for what's planned.

## Installation

```bash
pnpm add @rtorcato/db-common
# or
npm install @rtorcato/db-common
# or
yarn add @rtorcato/db-common
```

## Usage

Every helper returns a **plain shape** you feed to your own driver or query
builder — `db-common` never generates SQL, so it stays driver-agnostic and
zero-dependency.

```ts
import { paginate, orderBy, where, cursorPaginate } from '@rtorcato/db-common'

// Offset pagination — clamps junk query-string input to page/size ≥ 1.
paginate({ page: 2, size: 25 })
// → { limit: 25, offset: 25 }

// Sort parsing — leading "-" means descending; accepts a string or array.
orderBy('name,-createdAt')
// → [{ col: 'name', dir: 'asc' }, { col: 'createdAt', dir: 'desc' }]

// Filter normalization — bare values are `eq`, objects use operator keys.
where({ status: 'active', age: { gte: 18 } })
// → [{ col: 'status', op: 'eq', val: 'active' },
//    { col: 'age', op: 'gte', val: 18 }]

// Keyset (cursor) pagination — fetch limit+1 rows, then encodeCursor the last.
cursorPaginate({ size: 20, column: 'id', after })
// → { limit: 20, where: [{ col: 'id', op: 'gt', val: … }], order: [{ col: 'id', dir: 'asc' }] }
```

The package is ESM-only and targets Node.js ≥22.

## Development

```bash
pnpm install        # install dependencies
pnpm build          # build the library (tsup)
pnpm test           # run tests (vitest)
pnpm verify         # typecheck + biome check + test
```

### Scripts

- `pnpm typecheck` — type check TypeScript
- `pnpm check` / `pnpm check:fix` — lint & format with Biome
- `pnpm test` / `pnpm test:watch` — run tests
- `pnpm coverage` — generate test coverage
- `pnpm build` — build for production

## Documentation site

The docs live in [`apps/docs`](./apps/docs) (Docusaurus) and deploy to GitHub
Pages on every push to `main` that touches docs or `src/`.

```bash
pnpm --filter @rtorcato/db-common-docs dev     # local preview
pnpm --filter @rtorcato/db-common-docs build   # production build
```

## Project structure

```
db-common/
├── src/                  # library source
├── apps/docs/            # Docusaurus documentation site
├── scripts/              # build/maintenance scripts (changelog sync)
├── package.json
├── tsconfig.json
├── biome.jsonc
├── vitest.config.ts
├── tsup.config.ts
└── .husky/               # git hooks
```

## Sibling projects

- [@rtorcato/js-common](https://rtorcato.github.io/js-common/) — general TypeScript utilities
- [@rtorcato/browser-common](https://rtorcato.github.io/browser-common/) — browser Web API wrappers
- [@rtorcato/js-tooling](https://rtorcato.github.io/js-tooling/) — shared Biome/TS/Vitest/release presets

## Contributing

This project follows [Conventional Commits](https://conventionalcommits.org/):
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.

## License

MIT © Richard Torcato
