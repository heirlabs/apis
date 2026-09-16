# Webhooks

Subscribe to real-time events from the HEIR platform.

## Overview

Webhooks allow you to receive HTTP POST notifications when specific events occur in the HEIR platform. This enables you to build reactive applications without polling.

## Available Events {#list-events}

| Event | Description |
|-------|-------------|
| `contract.generated` | A new contract has been generated |
| `contract.deployed` | A contract has been deployed to the blockchain |
| `verification.complete` | User identity verification completed |
| `vault.updated` | Vault configuration or assets updated |
| `payment.completed` | A payment has been processed |
| `deadman.warning` | Dead man's switch warning triggered |
| `deadman.triggered` | Dead man's switch activated, inheritance started |
| `user.created` | A new user account created |
| `user.updated` | User profile updated |
| `api_key.created` | A new API key was created |
| `api_key.revoked` | An API key was revoked |

## Endpoints

### List Subscriptions {#list-subscriptions}

Get all webhook subscriptions for your account.

```http
GET /api/v1/webhooks/subscriptions
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "wh_abc123",
      "events": ["contract.deployed"],
      "url": "https://your-app.com/webhooks/heir",
      "status": "active",
      "failures": 0,
      "lastDeliveryAttempt": "2024-01-15T10:30:00.000Z",
      "lastDeliveryStatus": 200,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Subscription {#create-subscription}

Create a new webhook subscription.

```http
POST /api/v1/webhooks/subscriptions
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | HTTPS URL to receive webhooks |
| `events` | string[] | Yes | Event names (or `*` / `category.*`) |
| `name` | string | No | Label in the developer portal |
| `secret` | string | No | Signing secret (server may generate one) |
| `status` | string | No | `active` or `paused` (default: `active`) |

**Example:**

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions \
  -H "Authorization: Bearer heir_pt_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/heir",
    "name": "Production Webhook",
    "events": ["contract.deployed", "deadman.triggered"]
  }'
```

### Test Webhook {#test-webhook}

Send a test payload to verify your webhook endpoint.

```http
POST /api/v1/webhooks/subscriptions/:id/test
```

**Response:**

```json
{
  "success": true,
  "data": {
    "delivered": true,
    "statusCode": 200,
    "responseTime": 245
  }
}
```

## Webhook Payload

All webhook payloads follow this structure:

```json
{
  "id": "evt_…",
  "type": "contract.deployed",
  "created": 1710000000,
  "data": {},
  "apiVersion": "v1"
}
```

Do not expect `{ event, timestamp, webhookId }`. Read `type` and `id`.

### Headers

| Header | Description |
|--------|-------------|
| `X-Webhook-Signature` | HMAC SHA-256 of the body (if secret configured) |
| `X-Webhook-Timestamp` | Unix seconds used in the signed payload |
| `X-Webhook-Event` | Same as `type` |
| `X-Webhook-Delivery` | Same as payload `id` |

## Verifying Signatures

If you configured a webhook secret, verify incoming requests:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return signature === expected;
}

// In your webhook handler
app.post('/webhooks/heir', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifySignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook
  const { type, data } = req.body;
  // ...
  
  res.status(200).send('OK');
});
```

## Retry Policy

Failed deliveries retry with exponential backoff from 1s (2^(n-1), jitter, cap 5 minutes). Default `maxRetries` is **5**.

| Attempt | Delay (default) |
|---------|-----------------|
| 1 | Immediate |
| 2 | ~1 second |
| 3 | ~2 seconds |
| 4 | ~4 seconds |
| 5 | ~8 seconds |

A single delivery is marked failed after those attempts. The subscription is set `failed` after **50 consecutive** failures — not after 5. Re-enable from [heir.es/developers/webhooks](https://heir.es/developers/webhooks). See also [Webhooks guide](/guide/webhooks).

## Best Practices

1. **Respond quickly** - Return 2xx within 5 seconds
2. **Process asynchronously** - Queue webhook payloads for later processing
3. **Handle duplicates** - Webhooks may be delivered more than once
4. **Use HTTPS** - Webhook URLs must use HTTPS
5. **Verify signatures** - Always verify the `X-Webhook-Signature` header

