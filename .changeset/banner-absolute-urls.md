---
"@rtorcato/db-common": patch
---

Fix the README banner on npmjs.com. The shipped README used relative `./brand/` URLs, which npm resolves against `repository.directory` and so 404. It now uses absolute `raw.githubusercontent.com` URLs.
