# API Keys

Manage your API keys for authenticating with the HEIR API.

## Overview

API keys are used to authenticate requests to the HEIR API. Each key is tied to a specific tier that determines rate limits and available features.

## Endpoints

### List API Keys {#list-api-keys}

Retrieve all API keys for your account.

```http
GET /api/v1/api-keys
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "abc123",
      "name": "Production Key",
      "tier": "partner",
      "scopes": ["contracts", "webhooks"],
      "status": "active",
      "usage": {
        "totalRequests": 1542,
        "lastUsed": "2024-01-15T10:30:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create API Key {#create-api-key}

Create a new API key.

```http
POST /api/v1/api-keys
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Human-readable name for the key |
| `tier` | string | Yes | `public`, `partner`, or `internal` |
| `scopes` | array | No | Permissions: `contracts`, `vaults`, `webhooks`, `embed` |
| `ip_whitelist` | array | No | Allowed IP addresses |
| `expiresAt` | string | No | ISO 8601 expiration date |

**Example:**

```bash
curl -X POST https://api.heir.es/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "tier": "partner",
    "scopes": ["contracts", "webhooks"]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "def456",
    "name": "Production API Key",
    "tier": "partner",
    "scopes": ["contracts", "webhooks"],
    "rawKey": "heir_pt_abc123xyz789...",
    "status": "active",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

::: danger Important
The `rawKey` is only returned once when the key is created. Store it securely - you won't be able to retrieve it again!
:::

### Get API Key {#get-api-key}

Retrieve details for a specific API key.

```http
GET /api/v1/api-keys/:id
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The API key ID |

### Update API Key {#update-api-key}

Update an existing API key's settings.

```http
PUT /api/v1/api-keys/:id
```

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Updated name |
| `scopes` | array | Updated scopes |
| `ip_whitelist` | array | Updated IP whitelist |
| `status` | string | `active` or `revoked` |

### Revoke API Key {#revoke-api-key}

Permanently revoke an API key.

```http
DELETE /api/v1/api-keys/:id
```

**Example:**

```bash
curl -X DELETE https://api.heir.es/api/v1/api-keys/abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "API Key revoked successfully"
}
```

## Key Prefixes

API keys use prefixes to identify their tier:

| Prefix | Tier | Description |
|--------|------|-------------|
| `heir_pk_` | Public | Standard access |
| `heir_pt_` | Partner | Extended access + embedding |
| `heir_in_` | Internal | Full access |

## Best Practices

1. **Use environment variables** - Never hardcode API keys in your source code
2. **Rotate regularly** - Create new keys and revoke old ones periodically
3. **Limit scopes** - Only request the permissions you need
4. **Use IP whitelisting** - Restrict key usage to known IP addresses
5. **Monitor usage** - Check the usage stats regularly for anomalies

