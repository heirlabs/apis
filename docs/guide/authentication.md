# Authentication

All HEIR API requests require authentication using an API key. This guide covers how to obtain, manage, and use API keys.

## Obtaining an API Key

1. Sign in to [heir.es](https://heir.es)
2. Navigate to the [Developer Portal](https://api.heir.es/api/developer)
3. Click **Create API Key**
4. Name your key and select scopes
5. **Save your key immediately** - it won't be shown again!

## API Key Tiers

Your API key tier determines your rate limits and available features:

| Feature | Public | Partner | Internal |
|---------|--------|---------|----------|
| Rate Limit | 100/15min | 1,000/15min | 10,000/15min |
| Contract Generation | 10/15min | 100/15min | 1,000/15min |
| AI Chat | 5/15min | 50/15min | 200/15min |
| Webhooks | ❌ | ✅ | ✅ |
| Embedding | ❌ | ✅ | ✅ |
| White-labeling | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

### Key Prefixes

API keys are prefixed to indicate their tier:

- `heir_pk_` - **P**ublic tier (free)
- `heir_pt_` - **P**ar**t**ner tier
- `heir_sk_` - Internal/**S**ecret tier

## Using Your API Key

### Authorization Header (Recommended)

```bash
curl https://api.heir.es/api/v1/contracts/templates \
  -H "Authorization: Bearer heir_pk_xxx..."
```

### X-API-Key Header

```bash
curl https://api.heir.es/api/v1/contracts/templates \
  -H "X-API-Key: heir_pk_xxx..."
```

### Query Parameter

::: warning Not Recommended for Production
Query parameters may be logged by proxies and servers. Use headers instead.
:::

```bash
curl "https://api.heir.es/api/v1/contracts/templates?api_key=heir_pk_xxx..."
```

## Scopes

API keys can be limited to specific scopes:

| Scope | Description |
|-------|-------------|
| `contracts` | Full contract generation and deployment |
| `contracts:read` | Read-only contract access |
| `vaults` | Vault management |
| `vaults:read` | Read-only vault access |
| `users` | User management |
| `users:read` | Read-only user access |
| `payments` | Payment operations |
| `webhooks` | Webhook management |
| `legal` | Legal document generation |
| `chat` | AI chat access |
| `all` | Full access (internal only) |

### Checking Scopes

Include the `:read` suffix for read-only access:

```json
{
  "name": "Production Key",
  "scopes": ["contracts", "vaults:read", "webhooks"]
}
```

The `contracts` scope includes `contracts:read` permissions automatically.

## IP Whitelisting

Restrict API key usage to specific IP addresses:

```bash
curl -X POST https://api.heir.es/api/v1/api-keys \
  -H "Authorization: Bearer heir_pt_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Server",
    "scopes": ["contracts"],
    "ipWhitelist": ["203.0.113.50", "10.0.0.0/8"]
  }'
```

## Key Rotation

Rotate API keys periodically for security:

```bash
# 1. Create a new key
curl -X POST https://api.heir.es/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"name": "Production Key v2", "scopes": ["contracts"]}'

# 2. Update your application with the new key

# 3. Revoke the old key
curl -X DELETE https://api.heir.es/api/v1/api-keys/OLD_KEY_ID \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Rate Limit Headers

Every response includes rate limit information:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2024-01-15T12:30:00.000Z
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests in window |
| `X-RateLimit-Remaining` | Requests remaining |
| `X-RateLimit-Reset` | When the window resets (ISO 8601) |

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "API_KEY_INVALID",
    "message": "Invalid or expired API key."
  }
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_SCOPE",
    "message": "This endpoint requires the 'webhooks' scope."
  }
}
```

### 429 Rate Limited

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Your tier: public, limit: 100 requests per 15 minutes.",
    "retryAfter": "2024-01-15T12:30:00.000Z"
  }
}
```

## Security Best Practices

::: danger Never Expose API Keys
- Don't commit API keys to version control
- Don't include keys in client-side JavaScript
- Use environment variables for key storage
- Rotate keys if they may have been exposed
:::

1. **Use Environment Variables**
   ```bash
   export HEIR_API_KEY=heir_pk_xxx...
   ```

2. **Restrict Scopes** - Only request scopes you need

3. **Enable IP Whitelisting** - For production servers

4. **Monitor Usage** - Check the Developer Portal for anomalies

5. **Rotate Regularly** - Create new keys periodically

6. **Revoke Compromised Keys** - Immediately if exposed

