# Contributing to db-common

Thanks for your interest. This repo holds small, database-agnostic TypeScript helpers (`@rtorcato/db-common`) and their Drizzle adapters (`@rtorcato/db-drizzle`). Contributions of any size are welcome.

## Prerequisites

- Node.js ≥22 (a `.nvmrc` is checked in)
- pnpm (managed via Corepack or installed globally)
- git

## Setup

```bash
git clone https://github.com/rtorcato/db-common.git
cd db-common
pnpm install
```

The root package is `@rtorcato/db-common` (`src/`). The Drizzle adapters live in `packages/db-drizzle/`, and the docs site in `apps/docs/`.

## Workflow

1. **One issue, one branch, one PR.** Branch from `main` and name it after the change: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, or `chore/<topic>`. Don't bundle unrelated fixes.
2. **Make your change.** New helpers need tests next to the code (`src/index.test.ts`, `packages/db-drizzle/src/index.test.ts`).
3. **Verify locally** before pushing:
   ```bash
   pnpm verify
   ```
   That runs the AGENTS.md sync check, typecheck, Biome and the tests. The husky `pre-push` hook runs it too and blocks the push if it fails. If you touched `packages/db-drizzle`, also run `pnpm build && pnpm --filter './packages/*' verify`.
4. **Commit using Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`, etc.). The husky `commit-msg` hook validates the format.
5. **Open a PR against `main` with a Conventional Commit title.** PRs are squash-merged. If the PR changes `@rtorcato/db-common` or `@rtorcato/db-drizzle` for users, add a changeset (see Releases). CI runs Biome, typecheck, tests (Node 22 and 26), the build with a size budget, and the `db-drizzle` checks. CodeQL runs alongside.

## Style

Tabs for indentation, single quotes, no semicolons. Enforced by Biome: `pnpm check:fix` formats for you.

## Releases

Releases use [Changesets](https://github.com/changesets/changesets). Don't edit `version` in a `package.json` by hand.

1. Add a changeset for any user-facing change: `pnpm changeset`. Pick the package(s) and the bump (patch/minor/major), and commit the file under `.changeset/` with your PR.
2. Merging to `main` does not publish. Each push opens or updates a "Version Packages" PR that consumes the pending changesets and bumps the versions.
3. Merging the Version Packages PR is the release. Its `publish` job waits for one approval in the `release` environment, then publishes to npm, creates the GitHub Releases and rebuilds the docs site.

Don't tag manually or dispatch the workflow yourself. Only project maintainers publish.

## Security

Please don't report vulnerabilities in a public issue. See [SECURITY.md](SECURITY.md).

## License

By contributing, you agree your contributions are licensed under the [MIT License](LICENSE).
