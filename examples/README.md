# Examples

Runnable scripts against **production** (`https://api.heir.es`).

## Prerequisites

- `bash`, `curl`
- Optional: `jq` (pretty JSON)
- API key from [heir.es/developers](https://heir.es/developers) for authenticated calls

```bash
export HEIR_API_KEY="heir_pk_xxxxxxxx"   # never commit real keys
export HEIR_API_BASE="https://api.heir.es"  # override for staging if you have one
```

## Scripts

| Script | Auth | What it does |
|--------|------|----------------|
| [`01-health.sh`](./01-health.sh) | Public | `GET /api/health` |
| [`02-list-templates.sh`](./02-list-templates.sh) | API key | `GET /api/v1/contracts/templates` |
| [`03-generate-contract.sh`](./03-generate-contract.sh) | API key | `POST /api/v1/contracts/generate` (sample EVM payload) |
| [`04-list-plans.sh`](./04-list-plans.sh) | Public | `GET /api/v1/billing/plans` |

```bash
chmod +x examples/*.sh
./examples/01-health.sh
HEIR_API_KEY=heir_pk_… ./examples/02-list-templates.sh
```

## More in the docs site

Narrative tutorials live under [`docs/examples/`](../docs/examples/) and are published at
[docs.heir.es/examples](https://docs.heir.es/examples/).

## OpenAPI client generation

```bash
npm run openapi:fetch
# then e.g.
npx openapi-typescript openapi/openapi.json -o ./heir-api.d.ts
```
