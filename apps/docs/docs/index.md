---
title: db-common
description: Shared, tree-shakeable TypeScript database utilities for the @rtorcato/* family.
sidebar_position: 0
---

# db-common

Shared, tree-shakeable TypeScript database utilities for the `@rtorcato/*` family.

- **TypeScript-first** — strict types, generics preserved, JSDoc-rich in your IDE.
- **Tree-shakeable** — ESM-only with `sideEffects: false`; bundlers keep only what you import.
- **Database-agnostic** — small primitives (pagination, query shaping, result mapping) that don't lock you to a single driver.
- **Zero runtime dependencies** — nothing to install but the package itself.

:::note Early days
`db-common` is in active development — the public API is still small and may change
before `1.0`. See the [roadmap](https://github.com/rtorcato/db-common/blob/main/ROADMAP.md)
for what's planned.
:::

## Quick example

```ts
import { paginate } from '@rtorcato/db-common'

const { limit, offset } = paginate({ page: 2, size: 25 })
// → { limit: 25, offset: 25 }
```

Start with [Installation](./guides/installation.md), then read the [Usage guide](./guides/usage.md).
