# db-common docs

[Docusaurus](https://docusaurus.io/) site for [@rtorcato/db-common](https://www.npmjs.com/package/@rtorcato/db-common). Deployed to GitHub Pages at https://rtorcato.github.io/db-common via `.github/workflows/docs.yml`.

## Develop

```bash
# from repo root
pnpm install
pnpm --filter @rtorcato/db-common-docs dev
```

Open http://localhost:3000/db-common/.

## Build locally

```bash
pnpm --filter @rtorcato/db-common-docs build
pnpm --filter @rtorcato/db-common-docs serve
```

## Structure

- `docs/index.md` — overview page
- `docs/guides/` — installation, usage
- `docs/changelog.md` — **synced** from the root `CHANGELOG.md` by `scripts/sync-changelog.mjs` (gitignored, runs as `prebuild`/`predev`/`prestart`)
- `docusaurus.config.ts` — site config + local-search plugin
- `sidebars.ts` — sidebar layout (Start here / Releases)
- `src/css/custom.css` — purple theme on navy surfaces
- `src/pages/index.tsx` — marketing landing page

Local full-text search is provided by `@easyops-cn/docusaurus-search-local`.
