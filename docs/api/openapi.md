# OpenAPI specification

## Live endpoints

| URL | Purpose |
|-----|---------|
| [openapi.json](https://api.heir.es/api/docs/openapi.json) | Machine-readable OpenAPI 3 document |
| [Swagger UI](https://api.heir.es/api/docs) | Interactive explorer |

## Honesty limits (as of 2026-09-16)

The published OpenAPI document is a **partial partner subset**:

- Roughly **~34** path entries (count drifts as monorepo evolves)
- Path prefixes are **inconsistent** in places (`/api/v1/...`, bare `/contracts/...`, `/webhooks/...`)
- **Missing** most product spine routes (Estate Home, Legacy Interview, Executor, Data Passport, Memoir, Heirlooms, formalities, desk, …)
- Suitable for **codegen experiments** against keys/contracts/webhooks/embed — **not** a complete product contract
- Live `info.description` on api.heir.es may still claim a 2026-07-01 `/api/*` sunset that **did not happen**, plus example curls to `https://api.heir.es/v1/contracts` (missing `/api`). That text is served by `heirlabs/web` `server/docs/openapi.js`, not this VitePress repo. Partner HTTP is `https://api.heir.es/api/v1/…`.

Prefer:

1. These VitePress API pages for documented partner surfaces  
2. [Platform spine](/guide/platform-spine) + [Auth matrix](/guide/auth-matrix) for product mounts  
3. Monorepo `server/server.js` mounts as ultimate route truth  

## Generating a client

```bash
curl -o openapi.json https://api.heir.es/api/docs/openapi.json
npx openapi-typescript openapi.json -o ./heir-api.d.ts
```

Validate generated paths against live HTTP before production use.

## Roadmap note

Regenerating OpenAPI from live routers with a single prefix convention is a
tracked docs/engineering task — not claimed done here.
