# WebhookEvent Model

The webhook event object is the payload delivered to your webhook endpoint.

## Object Structure

```json
{
  "event": "contract.deployed",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_65abc123def456",
  "data": {
    // Event-specific data
  }
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `event` | string | Event type identifier |
| `timestamp` | string | ISO 8601 timestamp of event |
| `webhookId` | string | ID of the webhook subscription |
| `data` | object | Event-specific payload |

## HTTP Headers

Each webhook delivery includes these headers:

| Header | Description |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-Webhook-Event` | Event type |
| `X-Webhook-Attempt` | Delivery attempt number (1-6) |
| `X-Webhook-Signature` | HMAC SHA-256 signature |

## Event Payloads

### contract.generated

```json
{
  "event": "contract.generated",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    "requestId": "req_xyz789",
    "blockchain": "evm",
    "template": "common-law",
    "beneficiaryCount": 2,
    "ownerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e"
  }
}
```

### contract.deployed

```json
{
  "event": "contract.deployed",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    "contractAddress": "0x1234567890abcdef...",
    "transactionHash": "0xabcdef123456...",
    "blockchain": "ethereum",
    "chainId": 1,
    "ownerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e",
    "beneficiaryCount": 2,
    "gasUsed": "2450000"
  }
}
```

### deadman.warning

```json
{
  "event": "deadman.warning",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    "contractAddress": "0x1234...",
    "ownerAddress": "0x742d35...",
    "lastCheckIn": "2023-06-15T12:00:00.000Z",
    "triggerDate": "2024-01-22T12:00:00.000Z",
    "daysRemaining": 7
  }
}
```

### deadman.triggered

```json
{
  "event": "deadman.triggered",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    "contractAddress": "0x1234...",
    "ownerAddress": "0x742d35...",
    "lastCheckIn": "2023-01-15T12:00:00.000Z",
    "beneficiaries": [
      {
        "address": "0xabc...",
        "percentage": 60,
        "name": "Alice"
      },
      {
        "address": "0xdef...",
        "percentage": 40,
        "name": "Bob"
      }
    ],
    "transactionHash": "0xabc123..."
  }
}
```

### verification.complete

```json
{
  "event": "verification.complete",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    "userId": "user_123",
    "verificationId": "ver_456",
    "status": "approved",
    "verificationType": "kyc",
    "provider": "onfido"
  }
}
```

### payment.completed

```json
{
  "event": "payment.completed",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    "paymentId": "pay_xyz789",
    "userId": "user_123",
    "amount": 9900,
    "currency": "usd",
    "status": "succeeded",
    "description": "Partner API subscription"
  }
}
```

## Signature Verification

Verify the `X-Webhook-Signature` header:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

## Idempotency

Use `webhookId` + `timestamp` as an idempotency key to handle duplicate deliveries:

```javascript
const key = `${event.webhookId}:${event.timestamp}`;
if (await cache.has(key)) {
  return; // Already processed
}
await cache.set(key, true, 24 * 60 * 60); // 24h TTL
// Process event...
```

