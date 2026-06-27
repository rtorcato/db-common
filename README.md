# db-common

> Shared, tree-shakeable TypeScript database utilities for the `@rtorcato/*` family.

📖 **Docs:** https://rtorcato.github.io/db-common

## Description

`db-common` is a collection of small, focused, database-agnostic helpers —
pagination, query shaping, result mapping — built the same way as the rest of
the `@rtorcato/*` family: TypeScript-first, ESM-only, tree-shakeable, with zero
runtime dependencies.

> **Early days.** The public API is still small and may change before `1.0`.
> See [ROADMAP.md](./ROADMAP.md).

## Installation

```bash
pnpm add @rtorcato/db-common
# or
npm install @rtorcato/db-common
# or
yarn add @rtorcato/db-common
```

## Usage

> **Planned API (lands in `0.2`).** No helpers ship yet — see [ROADMAP.md](./ROADMAP.md).

```ts
import { paginate } from '@rtorcato/db-common'

const { limit, offset } = paginate({ page: 2, size: 25 })
// → { limit: 25, offset: 25 }
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
