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
      "event": "contract.deployed",
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
| `event` | string | Yes | Event name to subscribe to |
| `url` | string | Yes | HTTPS URL to receive webhooks |
| `secret` | string | No | Secret for signing payloads |
| `status` | string | No | `active` or `paused` (default: `active`) |

**Example:**

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
  "event": "contract.deployed",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    // Event-specific data
  }
}
```

### Headers

| Header | Description |
|--------|-------------|
| `X-Webhook-Event` | Event name |
| `X-Webhook-Attempt` | Delivery attempt number (1-5) |
| `X-Webhook-Signature` | HMAC SHA-256 signature (if secret configured) |

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
  const { event, data } = req.body;
  // ...
  
  res.status(200).send('OK');
});
```

## Retry Policy

Failed webhook deliveries are retried with exponential backoff:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 second |
| 3 | 5 seconds |
| 4 | 10 seconds |
| 5 | 30 seconds |
| 6 | 60 seconds |

After 5 failed attempts, the webhook is paused and must be manually reactivated.

## Best Practices

1. **Respond quickly** - Return 2xx within 5 seconds
2. **Process asynchronously** - Queue webhook payloads for later processing
3. **Handle duplicates** - Webhooks may be delivered more than once
4. **Use HTTPS** - Webhook URLs must use HTTPS
5. **Verify signatures** - Always verify the `X-Webhook-Signature` header

