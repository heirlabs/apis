# cURL Examples

Direct HTTP examples using cURL for any language or platform.

## Authentication

All requests require an API key in the header:

```bash
# Using Authorization header (recommended)
curl -H "Authorization: Bearer heir_pk_xxx..." https://api.heir.es/api/v1/...

# Using X-API-Key header
curl -H "X-API-Key: heir_pk_xxx..." https://api.heir.es/api/v1/...
```

## Contracts

### Generate a Contract

```bash
curl -X POST https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "blockchain": "evm",
    "ownerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e",
    "beneficiaries": [
      {
        "name": "Alice",
        "address": "0xabc123def456...",
        "percentage": 60,
        "relationship": "spouse"
      },
      {
        "name": "Bob",
        "address": "0xdef789ghi012...",
        "percentage": 40,
        "relationship": "child"
      }
    ],
    "inheritanceTemplate": "common-law",
    "deadMansSwitch": {
      "enabled": true,
      "interval": 31536000,
      "checkInMethod": "manual"
    }
  }'
```

### List Templates

```bash
curl https://api.heir.es/api/v1/contracts/templates \
  -H "Authorization: Bearer heir_pk_xxx..."
```

### Compile Contract

```bash
curl -X POST https://api.heir.es/api/v1/contracts/compile \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "sourceCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n...",
    "compiler": "0.8.19"
  }'
```

### Estimate Gas

```bash
curl -X POST https://api.heir.es/api/v1/contracts/estimate-gas \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "bytecode": "0x608060405234801561001057600080fd5b50...",
    "chain": "ethereum",
    "constructorArgs": ["0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e", []]
  }'
```

## API Keys

### List API Keys

```bash
curl https://api.heir.es/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create API Key

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

### Revoke API Key

```bash
curl -X DELETE https://api.heir.es/api/v1/api-keys/KEY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Webhooks

### List Webhook Subscriptions

```bash
curl https://api.heir.es/api/v1/webhooks/subscriptions \
  -H "Authorization: Bearer heir_pt_xxx..."
```

### Create Webhook Subscription

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions \
  -H "Authorization: Bearer heir_pt_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "event": "contract.deployed",
    "url": "https://your-app.com/webhooks/heir",
    "secret": "your_webhook_secret"
  }'
```

### Test Webhook

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions/WEBHOOK_ID/test \
  -H "Authorization: Bearer heir_pt_xxx..."
```

### Delete Webhook

```bash
curl -X DELETE https://api.heir.es/api/v1/webhooks/subscriptions/WEBHOOK_ID \
  -H "Authorization: Bearer heir_pt_xxx..."
```

## Response Examples

### Success Response

```json
{
  "success": true,
  "data": {
    "contractCode": "// SPDX-License-Identifier...",
    "compiled": {
      "abi": [...],
      "bytecode": "0x608060405..."
    },
    "contractInfo": {
      "name": "InheritanceVault",
      "beneficiaryCount": 2
    }
  },
  "meta": {
    "requestId": "req_abc123xyz",
    "timestamp": "2024-01-15T12:00:00.000Z"
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
      {
        "field": "beneficiaries[0].address",
        "reason": "Invalid Ethereum address checksum"
      }
    ]
  },
  "meta": {
    "requestId": "req_def456uvw",
    "timestamp": "2024-01-15T12:01:00.000Z"
  }
}
```

## Tips

### Pretty Print JSON

```bash
curl ... | jq .
```

### Save Response to File

```bash
curl ... -o response.json
```

### Include Response Headers

```bash
curl -i ...
```

### Verbose Mode (debugging)

```bash
curl -v ...
```

### Using Environment Variables

```bash
export HEIR_API_KEY="heir_pk_xxx..."

curl -H "Authorization: Bearer $HEIR_API_KEY" \
  https://api.heir.es/api/v1/contracts/templates
```

### Handling Rate Limits

Check the rate limit headers in the response:

```bash
curl -i https://api.heir.es/api/v1/contracts/templates \
  -H "Authorization: Bearer $HEIR_API_KEY" 2>&1 | grep -i x-ratelimit
```

Output:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2024-01-15T12:30:00.000Z
```

