---
title: Usage
description: How to use @rtorcato/db-common in your project.
---

# Usage

`db-common` is a collection of small, focused database helpers. Import only the
ones you need — everything is tree-shakeable.

```ts
import { paginate } from '@rtorcato/db-common'

const { limit, offset } = paginate({ page: 3, size: 20 })
// → { limit: 20, offset: 40 }
```

:::note Growing API
The public surface is intentionally small while the library stabilises. New
helpers are documented here as they land — track progress on the
[milestones](https://github.com/rtorcato/db-common/milestones).
:::

## Conventions

Helpers in `db-common` follow the same contract as the rest of the `@rtorcato/*`
family:

- **Pure where possible** — given the same input, return the same output; no
  hidden global state.
- **Predictable shapes** — return plain objects/values you can destructure, not
  driver-specific wrappers.
- **No surprise throws** — the common path returns a value; invalid input is
  reported, not thrown from deep inside.

See the [Changelog](../changelog.md) for what's shipped in each release.
