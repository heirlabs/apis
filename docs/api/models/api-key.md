# ApiKey Model

The API key object represents credentials for authenticating with the HEIR API.

## Object Structure

```json
{
  "_id": "65abc123def456ghi789",
  "name": "Production Key",
  "tier": "partner",
  "scopes": ["contracts", "webhooks", "embed"],
  "owner": "user_123abc",
  "status": "active",
  "usage": {
    "totalRequests": 15420,
    "lastUsed": "2024-01-15T10:30:00.000Z"
  },
  "metadata": {
    "ip_whitelist": ["203.0.113.10"],
    "webhook_url": "https://your-app.com/webhooks"
  },
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `_id` | string | Unique identifier |
| `name` | string | Human-readable name |
| `tier` | string | `public`, `partner`, or `internal` |
| `scopes` | array | Permissions granted to this key |
| `owner` | string | User ID who owns this key |
| `status` | string | `active`, `revoked`, or `expired` |
| `usage` | object | Usage statistics |
| `usage.totalRequests` | number | Total API calls made |
| `usage.lastUsed` | string | ISO 8601 timestamp |
| `metadata` | object | Additional configuration |
| `metadata.ip_whitelist` | array | Allowed IP addresses |
| `metadata.webhook_url` | string | Default webhook URL |
| `expiresAt` | string | ISO 8601 expiration date |
| `createdAt` | string | ISO 8601 creation date |
| `updatedAt` | string | ISO 8601 last update date |

## Tiers

| Tier | Prefix | Rate Limit | Features |
|------|--------|------------|----------|
| `public` | `heir_pk_` | 100/15min | Basic API access |
| `partner` | `heir_pt_` | 1,000/15min | + Embedding, webhooks |
| `internal` | `heir_in_` | 10,000/15min | + Admin features |

## Scopes

| Scope | Description |
|-------|-------------|
| `contracts` | Generate and manage contracts |
| `vaults` | Access vault information |
| `users` | User management (admin only) |
| `payments` | Payment processing |
| `webhooks` | Webhook management |
| `admin` | Administrative operations |
| `embed` | Embeddable wizard access |

## Status Values

| Status | Description |
|--------|-------------|
| `active` | Key is valid and usable |
| `revoked` | Key has been manually revoked |
| `expired` | Key has passed its expiration date |

## Notes

- The actual API key value (with prefix like `heir_pk_xxx...`) is only returned once when the key is created
- Keys are stored as SHA-256 hashes internally
- Revoked keys cannot be reactivated

