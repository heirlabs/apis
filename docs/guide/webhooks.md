# Webhooks

Webhooks allow you to receive real-time notifications when events occur in the HEIR system. Instead of polling for changes, HEIR will send HTTP POST requests to your specified endpoint.

::: tip Tier Requirement
Webhooks are available on **Partner** and **Internal** tiers only.
:::

## Setting Up Webhooks

### Create a Webhook Subscription

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions \
  -H "Authorization: Bearer heir_pt_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/heir",
    "name": "Production Webhook",
    "events": ["contract.deployed", "deadman.triggered", "verification.complete"]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "wh_abc123...",
    "url": "https://your-app.com/webhooks/heir",
    "events": ["contract.deployed", "deadman.triggered", "verification.complete"],
    "status": "active"
  },
  "meta": {
    "secret": "whsec_7f3b9c2e8d4a6f1e9b5c3a7d2f8e4b9c...",
    "warning": "Save this secret securely. It will not be shown again."
  }
}
```

::: danger Save Your Secret!
The webhook secret is only shown once. Store it securely - you'll need it to verify webhook signatures.
:::

## Available Events

### Contract Events

| Event | Description |
|-------|-------------|
| `contract.generated` | Smart contract code generated |
| `contract.compiled` | Contract compiled successfully |
| `contract.deployed` | Contract deployed to blockchain |
| `contract.verified` | Contract verified on block explorer |
| `contract.error` | Error during contract operation |

### Vault Events

| Event | Description |
|-------|-------------|
| `vault.created` | New vault created |
| `vault.updated` | Vault data modified |
| `vault.deleted` | Vault deleted |
| `vault.accessed` | Vault accessed by user |

### Verification Events

| Event | Description |
|-------|-------------|
| `verification.started` | Verification process initiated |
| `verification.complete` | User verified successfully |
| `verification.failed` | Verification failed |
| `verification.expired` | Verification expired |

### Payment Events

| Event | Description |
|-------|-------------|
| `payment.initiated` | Payment started |
| `payment.completed` | Payment successful |
| `payment.failed` | Payment failed |
| `payment.refunded` | Payment refunded |

### Dead Man's Switch Events

| Event | Description |
|-------|-------------|
| `deadman.warning` | Check-in deadline approaching |
| `deadman.triggered` | Switch activated, inheritance distributed |
| `deadman.reset` | Switch reset by owner check-in |

### Wildcard

| Event | Description |
|-------|-------------|
| `*` | All events (Partner/Internal only) |

## Webhook Payload

All webhook payloads follow this structure:

```json
{
  "id": "evt_1a2b3c4d5e6f...",
  "type": "contract.deployed",
  "created": 1705312800,
  "apiVersion": "v1",
  "data": {
    "contractAddress": "0x1234567890abcdef...",
    "transactionHash": "0xabcdef...",
    "network": "ethereum",
    "blockNumber": 18500000,
    "deployer": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e"
  }
}
```

## Verifying Signatures

All webhook payloads are signed using HMAC-SHA256. **Always verify signatures** to ensure webhooks are from HEIR.

### Signature Header

```http
X-Webhook-Signature: t=1705312800,v1=5d41402abc4b2a76b9719d911017c592...
X-Webhook-Timestamp: 1705312800
X-Webhook-Event: contract.deployed
X-Webhook-Delivery: evt_1a2b3c4d5e6f...
```

### Verification Code

::: code-group

```javascript [Node.js]
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  // Parse signature header
  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  const timestamp = parseInt(parts.t);
  const receivedSig = parts.v1;
  
  // Check timestamp (5 minute tolerance)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    throw new Error('Webhook timestamp too old');
  }
  
  // Compute expected signature
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  // Constant-time comparison
  if (!crypto.timingSafeEqual(
    Buffer.from(receivedSig),
    Buffer.from(expectedSig)
  )) {
    throw new Error('Invalid webhook signature');
  }
  
  return true;
}

// Express middleware
app.post('/webhooks/heir', express.json(), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  
  try {
    verifyWebhookSignature(req.body, signature, process.env.HEIR_WEBHOOK_SECRET);
    
    // Process the webhook
    const { type, data } = req.body;
    
    switch (type) {
      case 'contract.deployed':
        handleContractDeployed(data);
        break;
      case 'deadman.triggered':
        handleDeadmanTriggered(data);
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});
```

```python [Python]
import hmac
import hashlib
import time
import json

def verify_webhook_signature(payload, signature, secret):
    # Parse signature header
    parts = dict(p.split('=') for p in signature.split(','))
    timestamp = int(parts['t'])
    received_sig = parts['v1']
    
    # Check timestamp (5 minute tolerance)
    if abs(time.time() - timestamp) > 300:
        raise ValueError('Webhook timestamp too old')
    
    # Compute expected signature
    signed_payload = f"{timestamp}.{json.dumps(payload)}"
    expected_sig = hmac.new(
        secret.encode(),
        signed_payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Constant-time comparison
    if not hmac.compare_digest(received_sig, expected_sig):
        raise ValueError('Invalid webhook signature')
    
    return True
```

:::

## Retry Policy

HEIR automatically retries failed webhook deliveries:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 second |
| 3 | 2 seconds |
| 4 | 4 seconds |
| 5 | 8 seconds |

After 5 failed attempts, the delivery is marked as failed.

### Automatic Disabling

Webhooks are automatically disabled after **50 consecutive failures**. Re-enable them from the Developer Portal after fixing the issue.

## Testing Webhooks

Send a test event to verify your endpoint:

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions/wh_abc123/test \
  -H "Authorization: Bearer heir_pt_xxx..."
```

**Response:**

```json
{
  "success": true,
  "data": {
    "delivered": true,
    "statusCode": 200,
    "payload": {
      "id": "evt_test_123...",
      "type": "test.webhook",
      "data": { "message": "This is a test webhook event" }
    }
  }
}
```

## Managing Webhooks

### List Subscriptions

```bash
curl https://api.heir.es/api/v1/webhooks/subscriptions \
  -H "Authorization: Bearer heir_pt_xxx..."
```

### Update Subscription

```bash
curl -X PATCH https://api.heir.es/api/v1/webhooks/subscriptions/wh_abc123 \
  -H "Authorization: Bearer heir_pt_xxx..." \
  -d '{"events": ["contract.deployed", "contract.verified"]}'
```

### Delete Subscription

```bash
curl -X DELETE https://api.heir.es/api/v1/webhooks/subscriptions/wh_abc123 \
  -H "Authorization: Bearer heir_pt_xxx..."
```

### Regenerate Secret

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions/wh_abc123/regenerate-secret \
  -H "Authorization: Bearer heir_pt_xxx..."
```

## Best Practices

1. **Always verify signatures** - Don't process unverified webhooks
2. **Respond quickly** - Return 2xx within 30 seconds
3. **Process asynchronously** - Queue events for background processing
4. **Handle duplicates** - Use event IDs for idempotency
5. **Monitor failures** - Set up alerts for webhook errors

