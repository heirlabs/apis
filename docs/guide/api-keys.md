# API Keys

API keys are the primary method for authenticating with the HEIR API.

## Overview

Each API key is tied to a specific tier that determines your rate limits and available features. Keys are associated with your user account and can be managed via the API or Dashboard.

## Key Tiers

| Tier | Prefix | Rate Limit | Features |
|------|--------|------------|----------|
| **Public** | `heir_pk_` | 100 req/15min | Basic contract generation |
| **Partner** | `heir_pt_` | 1,000 req/15min | + Embedding, webhooks |
| **Internal** | `heir_sk_` | 10,000 req/15min | + Admin features |

## Creating API Keys

### Via API

```bash
curl -X POST https://api.heir.es/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Key",
    "tier": "partner",
    "scopes": ["contracts", "webhooks"]
  }'
```

### Via Dashboard

1. Navigate to [Developer Portal](https://heir.es/developers) → [API keys](https://heir.es/developers/keys)
2. Click "Create API Key"
3. Select your desired tier and scopes
4. Copy and securely store the generated key

::: danger Important
The full API key is only shown once when created. Store it securely!
:::

## Scopes

Scopes limit what an API key can do:

| Scope | Description |
|-------|-------------|
| `contracts` | Generate and manage contracts |
| `vaults` | Access vault information |
| `webhooks` | Manage webhook subscriptions |
| `embed` | Use the embeddable wizard |
| `admin` | Administrative operations |

## Security Best Practices

1. **Never expose keys in client-side code**
2. **Use environment variables** for key storage
3. **Rotate keys regularly** (quarterly recommended)
4. **Use IP whitelisting** for production keys
5. **Limit scopes** to only what's needed
6. **Monitor usage** for anomalies

## IP Whitelisting

Restrict API key usage to specific IP addresses:

```bash
curl -X PUT https://api.heir.es/api/v1/api-keys/KEY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ip_whitelist": ["203.0.113.10", "203.0.113.11"]
  }'
```

## Key Rotation

1. Create a new key with the same permissions
2. Update your application to use the new key
3. Verify the new key works correctly
4. Revoke the old key

## Related

- [API Reference: API Keys](/api/api-keys)
- [Authentication](/guide/authentication)
- [Rate Limits](/guide/rate-limits)

