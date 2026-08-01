# Authentication

How to authenticate with the HEIR API.

## Overview

The HEIR API uses API keys for authentication. Include your key in every request.

## Authentication Methods

### Authorization Header (Recommended)

```bash
curl -H "Authorization: Bearer heir_pk_xxx..." \
  https://api.heir.es/api/v1/contracts/templates
```

### X-API-Key Header

```bash
curl -H "X-API-Key: heir_pk_xxx..." \
  https://api.heir.es/api/v1/contracts/templates
```

### Query Parameter

::: warning
Only use for testing. Not recommended for production.
:::

```bash
curl "https://api.heir.es/api/v1/contracts/templates?api_key=heir_pk_xxx..."
```

## API Key Tiers

| Tier | Prefix | Description |
|------|--------|-------------|
| Public | `heir_pk_` | Standard access |
| Partner | `heir_pt_` | Extended features + embedding |
| Internal | `heir_in_` | Full access |

## Obtaining API Keys

1. Create an account at [heir.es](https://heir.es)
2. Navigate to Developer Settings
3. Click "Create API Key"
4. Store the key securely (shown only once)

Or via API with existing JWT authentication:

```bash
curl -X POST https://api.heir.es/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My API Key", "tier": "public"}'
```

## Authentication Errors

### Missing API Key

```json
{
  "success": false,
  "error": {
    "code": "API_KEY_MISSING",
    "message": "API Key missing. Include in Authorization header or X-API-Key header."
  }
}
```

### Invalid API Key

```json
{
  "success": false,
  "error": {
    "code": "API_KEY_INVALID",
    "message": "The provided API key is invalid or expired."
  }
}
```

### Insufficient Permissions

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_SCOPE",
    "message": "This API key does not have the required 'embed' scope."
  }
}
```

## Client authentication

There is no published headless REST SDK. Pass the API key on every request:

### JavaScript / fetch

```javascript
const res = await fetch('https://api.heir.es/api/v1/...', {
  headers: {
    Authorization: `Bearer ${process.env.HEIR_API_KEY}`,
    'Content-Type': 'application/json',
  },
});
```

### Python

```python
import requests, os
requests.get(
    'https://api.heir.es/api/v1/...',
    headers={'Authorization': f"Bearer {os.environ['HEIR_API_KEY']}"},
)
```

### Go

```go
req.Header.Set("Authorization", "Bearer "+os.Getenv("HEIR_API_KEY"))
```

## Security Recommendations

1. **Use environment variables** - Never hardcode keys
2. **Rotate regularly** - Quarterly is recommended
3. **Limit scopes** - Only request what you need
4. **Use IP whitelisting** - For production keys
5. **Monitor usage** - Check for anomalies

See [Security Best Practices](/guide/security) for more.

