---
title: Installation
description: Install @rtorcato/db-common and import your first helper.
---

## Install

```bash
pnpm add @rtorcato/db-common
# or
npm install @rtorcato/db-common
# or
yarn add @rtorcato/db-common
```

The package is ESM-only. Your project's `tsconfig.json` should use
`"module": "esnext"` (or `"nodenext"`) and your `package.json` should have
`"type": "module"`.

## Requirements

- **Node.js**: ≥22 for local development. The published package targets ES2022.
- **Bundler**: Vite, Webpack 5+, Rollup, or esbuild — anything that respects
  `package.json` `"exports"` and `"sideEffects": false` will tree-shake correctly.

## Import what you need

```ts
import { paginate } from '@rtorcato/db-common'
```

Next, see the [Usage guide](./usage.md).
