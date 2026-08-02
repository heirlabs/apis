# API Reference

Detailed documentation for HEIR HTTP endpoints used by integrators.

## Base URL

```
https://api.heir.es/api/v1/
```

Many product routes also exist under `https://api.heir.es/api/...` with **session**
auth (browser JWT). The v1 prefix adds hybrid API-key support for partner
integrations. Always check the page for the correct base path and auth model.

## Authentication

API-key requests:

```bash
# Authorization header (recommended)
curl -H "Authorization: Bearer heir_pk_xxx..." https://api.heir.es/api/v1/...

# X-API-Key header
curl -H "X-API-Key: heir_pk_xxx..." https://api.heir.es/api/v1/...
```

Session product APIs (Memoir, much of Legal when not using hybrid keys) use the
logged-in app session. See [Authentication Guide](/guide/authentication).

Keys and developer billing: [heir.es/developers](https://heir.es/developers).

## Response format

### Success (typical envelope)

```json
{
  "success": true,
  "data": { },
  "meta": {
    "requestId": "req_abc123xyz",
    "timestamp": "2026-08-02T12:00:00.000Z"
  }
}
```

Some older routes return bare resource objects without the `success` wrapper —
match the field names in each endpoint page.

### Error (typical)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid beneficiary address"
  }
}
```

## Error codes (API-key middleware)

| Code | HTTP | Description |
|------|------|-------------|
| `API_KEY_MISSING` | 401 | No API key provided |
| `API_KEY_INVALID` | 401 | Invalid or expired API key |
| `UNAUTHORIZED` | 401 | Authentication required |
| `INSUFFICIENT_SCOPE` | 403 | API key lacks required scope |
| `TIER_NOT_ALLOWED` | 403 | Feature requires higher tier |
| `IP_NOT_ALLOWED` | 403 | IP not in whitelist |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `OPENSIGN_UNAVAILABLE` | 503 | E-sign not configured (legal/sign) |

## Rate limits

Per-key windows (API-key auth):

| Tier | Requests/15min | Contract gen | AI chat |
|------|----------------|--------------|---------|
| Public | 100 | 10 | 5 |
| Partner | 1,000 | 100 | 50 |
| Internal | 10,000 | 1,000 | 200 |

Developer **plan** daily/monthly caps are separate — see [API tiers](/pricing/api-tiers).

## Endpoints

### API Keys

- [`GET /api-keys`](/api/api-keys#list-api-keys)
- [`POST /api-keys`](/api/api-keys#create-api-key)
- [`GET /api-keys/:id`](/api/api-keys#get-api-key)
- [`PATCH /api-keys/:id`](/api/api-keys#update-api-key)
- [`DELETE /api-keys/:id`](/api/api-keys#revoke-api-key)

### Contracts

- [`GET /contracts/templates`](/api/contracts#list-templates)
- [`POST /contracts/generate`](/api/contracts#generate-contract)
- [`POST /contracts/compile`](/api/contracts#compile-contract)
- [`POST /contracts/estimate-gas`](/api/contracts#estimate-gas)

### Webhooks

- [`GET /webhooks/subscriptions`](/api/webhooks#list-subscriptions)
- [`POST /webhooks/subscriptions`](/api/webhooks#create-subscription)
- [`GET /webhooks/events`](/api/webhooks#list-events)
- [`POST /webhooks/subscriptions/:id/test`](/api/webhooks#test-webhook)

### Legal documents (live)

- [`POST /legal/generate`](/api/legal#post-apiv1legalgenerate)
- [`GET /legal/types/:jurisdiction`](/api/legal#get-apiv1legaltypesjurisdiction)
- [`GET /legal/documents`](/api/legal#document-crud)
- [`POST /legal/sign`](/api/legal#post-apiv1legalsign) — requires OpenSign env

### Memoir (session product — `/api/memoir`, not under v1 prefix)

- [`GET /api/memoir/setup`](/api/memoir)
- [`POST /api/memoir/setup`](/api/memoir)
- [`GET /api/memoir/agent`](/api/memoir)
- [`POST /api/memoir/chat`](/api/memoir)
- [`POST /api/memoir/media/upload`](/api/memoir)
- [`GET /api/memoir/insights`](/api/memoir)

### Memoir credits

- [`GET /api/memoir/credits/packs`](/api/memoir-credits)
- [`GET /api/memoir/credits/wallet`](/api/memoir-credits)
- [`POST /api/memoir/credits/purchase`](/api/memoir-credits)
- [`PUT /api/memoir/credits/auto-reload`](/api/memoir-credits)
- [`GET /api/memoir/credits/history`](/api/memoir-credits)

### Heirlooms (AI meter)

- [`GET /api/heirlooms/catalog`](/api/heirlooms) — public
- [`GET /api/heirlooms/summary`](/api/heirlooms) — authenticated

### Embed

- [`GET /embed/wizard`](/api/embed#wizard)
- [`GET /embed/sdk.js`](/api/embed#sdk)

## OpenAPI

- [OpenAPI honesty notes](/api/openapi)
- [openapi.json](https://api.heir.es/api/docs/openapi.json)
- [Interactive docs](https://api.heir.es/api/docs)

OpenAPI today is a **partial** partner subset (path prefixes are inconsistent in
places). Prefer these markdown pages for memoir/legal/heirlooms until the spec
is regenerated from the monorepo routers.

## Clients

There is **no** published official REST SDK for JavaScript, Python, or Go.

- [cURL examples](/sdks/curl)
- [SDK overview](/sdks/) — Elements packages + OpenAPI codegen
- [MCP tools](/mcp/tools) — `@morbidcorp/heir`
