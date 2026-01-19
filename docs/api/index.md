# API Reference

This section provides detailed documentation for all HEIR API endpoints.

## Base URL

```
https://api.heir.es/api/v1/
```

## Authentication

All requests require an API key via one of these methods:

```bash
# Authorization header (recommended)
curl -H "Authorization: Bearer heir_pk_xxx..." https://api.heir.es/api/v1/...

# X-API-Key header
curl -H "X-API-Key: heir_pk_xxx..." https://api.heir.es/api/v1/...
```

See [Authentication Guide](/guide/authentication) for details.

## Response Format

All responses follow this structure:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_abc123xyz",
    "timestamp": "2024-01-15T12:00:00.000Z",
    "pagination": {  // Optional, for list endpoints
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid beneficiary address",
    "details": [
      { "field": "beneficiaries[0].address", "reason": "Invalid checksum" }
    ]
  },
  "meta": {
    "requestId": "req_abc123xyz",
    "timestamp": "2024-01-15T12:00:00.000Z"
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
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

## Rate Limits

Requests are rate limited based on your API key tier:

| Tier | Requests/15min | Contract Gen | AI Chat |
|------|----------------|--------------|---------|
| Public | 100 | 10 | 5 |
| Partner | 1,000 | 100 | 50 |
| Internal | 10,000 | 1,000 | 200 |

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2024-01-15T12:30:00.000Z
```

## Endpoints

### API Keys
- [`GET /api-keys`](/api/api-keys#list-api-keys) - List your API keys
- [`POST /api-keys`](/api/api-keys#create-api-key) - Create a new API key
- [`GET /api-keys/:id`](/api/api-keys#get-api-key) - Get API key details
- [`PATCH /api-keys/:id`](/api/api-keys#update-api-key) - Update an API key
- [`DELETE /api-keys/:id`](/api/api-keys#revoke-api-key) - Revoke an API key

### Contracts
- [`GET /contracts/templates`](/api/contracts#list-templates) - List inheritance templates
- [`POST /contracts/generate`](/api/contracts#generate-contract) - Generate a contract
- [`POST /contracts/compile`](/api/contracts#compile-contract) - Compile source code
- [`POST /contracts/estimate-gas`](/api/contracts#estimate-gas) - Estimate deployment gas

### Webhooks
- [`GET /webhooks/subscriptions`](/api/webhooks#list-subscriptions) - List webhooks
- [`POST /webhooks/subscriptions`](/api/webhooks#create-subscription) - Create webhook
- [`GET /webhooks/events`](/api/webhooks#list-events) - List available events
- [`POST /webhooks/subscriptions/:id/test`](/api/webhooks#test-webhook) - Test a webhook

### Memoir (Legacy Endpoint Paths)
- [`GET /heirloom/setup`](/api/memoir) - Get setup status
- [`POST /heirloom/setup`](/api/memoir) - Set agent name
- [`GET /heirloom/agent`](/api/memoir) - Get agent/character
- [`GET /heirloom/agent/status`](/api/memoir) - Get progress status
- [`POST /heirloom/chat`](/api/memoir) - Chat with agent
- [`POST /heirloom/media/upload`](/api/memoir) - Upload media
- [`GET /heirloom/insights`](/api/memoir) - Get insights

### Memoir Credits
- [`GET /heirloom/credits/packs`](/api/memoir-credits) - List credit packs
- [`GET /heirloom/credits/wallet`](/api/memoir-credits) - Get wallet status
- [`POST /heirloom/credits/purchase`](/api/memoir-credits) - Purchase credits
- [`PUT /heirloom/credits/auto-reload`](/api/memoir-credits) - Configure auto-reload
- [`GET /heirloom/credits/history`](/api/memoir-credits) - Credit history

### Embed
- [`GET /embed/wizard`](/api/embed#wizard) - Embeddable wizard iframe
- [`GET /embed/sdk.js`](/api/embed#sdk) - JavaScript SDK

## OpenAPI Specification

Download the complete OpenAPI 3.0 specification:

- [openapi.json](https://api.heir.es/api/docs/openapi.json)
- [Interactive Docs](https://api.heir.es/api/docs)

## SDKs

Official SDKs are available for:

- [JavaScript/TypeScript](/sdks/javascript)
- [Python](/sdks/python)
- [Go](/sdks/go)

Or generate a client from the OpenAPI spec using [OpenAPI Generator](https://openapi-generator.tech/).

