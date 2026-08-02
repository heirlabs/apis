# MCP-related API reference

Use this page as a map. Prefer the dedicated REST and tool pages for full detail.

## Authentication

API keys use the `heir_pk_…` prefix (product developer keys).

```http
Authorization: Bearer heir_pk_...
# or
X-API-Key: heir_pk_...
```

Create keys at [heir.es/developers](https://heir.es/developers).

There is no separate `heir_sk_…` MCP-only key format in the published package docs.

## REST (product API)

| Concern | Path | Page |
|---------|------|------|
| Base | `https://api.heir.es/api/v1/` | [API index](/api/) |
| Contracts | `/api/v1/contracts/*` | [Contracts](/api/contracts) |
| Legal | `/api/v1/legal/*` | [Legal](/api/legal) |
| Jurisdictions | `/api/v1/jurisdictions` | Live public list (markdown jurisdiction SEO is separate) |
| Webhooks | `/api/v1/webhooks/*` or `/api/webhooks/*` | [Webhooks](/api/webhooks) |
| OpenAPI | `/api/docs/openapi.json` | Partial partner subset |

## MCP package tools

All **18** tool names and parameters: [MCP tools](/mcp/tools).

Install:

```bash
npx -y @morbidcorp/heir@2.0.3
```

## Monorepo HTTP MCP helpers

`https://api.heir.es/mcp` exposes lightweight HTTP helpers (health, jurisdictions)
with API-key auth on data routes. This is **not** a full replacement for the
stdio MCP package and is not OpenAPI-complete.

## Errors and rate limits

Same classes as the REST API: 401 missing/invalid key, 403 scope/tier, 429 plan
or key window, 5xx upstream. See [API tiers](/pricing/api-tiers).

## Changelog

See [Changelog](/changelog).
