# OpenAPI

## Live (source of truth)

| | |
|--|--|
| JSON | https://api.heir.es/api/docs/openapi.json |
| UI | https://api.heir.es/api/docs |

## Local snapshot

```bash
npm run openapi:fetch
# → openapi/openapi.json
```

The snapshot is **optional** and may be gitignored if large; regenerate anytime.
Do not hand-edit the snapshot to invent endpoints — fix production or docs instead.

## Generate a client

```bash
npm run openapi:fetch
npx openapi-typescript openapi/openapi.json -o ./heir-api.d.ts
```
