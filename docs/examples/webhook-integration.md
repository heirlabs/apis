# Webhook Integration

Set up real-time notifications for HEIR events.

## Overview

Webhooks enable your application to receive instant notifications when events occur in the HEIR platform, eliminating the need to poll for updates.

## Prerequisites

- An HEIR API key
- A publicly accessible HTTPS endpoint
- Basic understanding of HTTP webhooks

## Step 1: Create a Webhook Endpoint

First, create an endpoint in your application to receive webhooks:

### Express.js

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.HEIR_WEBHOOK_SECRET;

app.post('/webhooks/heir', (req, res) => {
  // 1. Verify the signature
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expected) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Invalid signature');
  }
  
  // 2. Process the event
  const { event, data, timestamp } = req.body;
  
  console.log(`Received ${event} at ${timestamp}`);
  
  switch (event) {
    case 'contract.deployed':
      handleContractDeployed(data);
      break;
    case 'deadman.triggered':
      handleDeadManTriggered(data);
      break;
    default:
      console.log('Unknown event:', event);
  }
  
  // 3. Respond quickly
  res.status(200).send('OK');
});

app.listen(3000);
```

### Flask (Python)

```python
from flask import Flask, request
import hmac
import hashlib
import os

app = Flask(__name__)
WEBHOOK_SECRET = os.environ['HEIR_WEBHOOK_SECRET']

@app.route('/webhooks/heir', methods=['POST'])
def webhook_handler():
    # 1. Verify signature
    signature = request.headers.get('X-Webhook-Signature')
    payload = request.get_data(as_text=True)
    
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if signature != expected:
        return 'Invalid signature', 401
    
    # 2. Process event
    data = request.json
    event = data['event']
    
    if event == 'contract.deployed':
        handle_contract_deployed(data['data'])
    elif event == 'deadman.triggered':
        handle_deadman_triggered(data['data'])
    
    return 'OK', 200
```

## Step 2: Register the Webhook

Subscribe to events via the API:

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions \
  -H "Authorization: Bearer heir_pt_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "event": "contract.deployed",
    "url": "https://your-app.com/webhooks/heir",
    "secret": "your_webhook_secret_here"
  }'
```

::: warning
Store the secret securely - you'll need it to verify incoming webhooks.
:::

## Step 3: Test Your Webhook

Use the test endpoint to verify your setup:

```bash
curl -X POST https://api.heir.es/api/v1/webhooks/subscriptions/WEBHOOK_ID/test \
  -H "Authorization: Bearer heir_pt_xxx..."
```

You should receive a test payload at your endpoint:

```json
{
  "event": "test",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "webhookId": "wh_abc123",
  "data": {
    "message": "This is a test webhook"
  }
}
```

## Available Events

### Contract Events

| Event | Description |
|-------|-------------|
| `contract.generated` | Contract code generated |
| `contract.deployed` | Contract deployed to blockchain |

**Payload Example:**

```json
{
  "event": "contract.deployed",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "data": {
    "contractAddress": "0x1234...",
    "transactionHash": "0xabcd...",
    "blockchain": "ethereum",
    "ownerAddress": "0x5678...",
    "beneficiaryCount": 2
  }
}
```

### Dead Man's Switch Events

| Event | Description |
|-------|-------------|
| `deadman.warning` | Owner hasn't checked in, warning sent |
| `deadman.triggered` | Switch activated, inheritance started |

**Payload Example:**

```json
{
  "event": "deadman.triggered",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "data": {
    "contractAddress": "0x1234...",
    "ownerAddress": "0x5678...",
    "lastCheckIn": "2023-01-15T12:00:00.000Z",
    "beneficiaries": [
      { "address": "0xabc...", "percentage": 100 }
    ]
  }
}
```

### Verification Events

| Event | Description |
|-------|-------------|
| `verification.complete` | Identity verification finished |

### Payment Events

| Event | Description |
|-------|-------------|
| `payment.completed` | Payment processed successfully |

## Best Practices

### 1. Respond Quickly

Return a 2xx status within 5 seconds. Process the payload asynchronously:

```javascript
app.post('/webhooks/heir', async (req, res) => {
  // Verify signature first
  if (!verifySignature(req)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Queue for async processing
  await queue.add('process-webhook', req.body);
  
  // Respond immediately
  res.status(200).send('OK');
});
```

### 2. Handle Duplicates

Webhooks may be delivered more than once. Use idempotency:

```javascript
async function handleContractDeployed(data) {
  const { contractAddress } = data;
  
  // Check if we've already processed this
  const existing = await db.contracts.findOne({ address: contractAddress });
  if (existing) {
    console.log('Already processed, skipping');
    return;
  }
  
  // Process the webhook
  await db.contracts.create({
    address: contractAddress,
    ...data
  });
}
```

### 3. Log Everything

```javascript
app.post('/webhooks/heir', (req, res) => {
  console.log('Webhook received:', {
    event: req.body.event,
    webhookId: req.body.webhookId,
    timestamp: req.body.timestamp,
    headers: {
      'x-webhook-attempt': req.headers['x-webhook-attempt'],
      'x-webhook-event': req.headers['x-webhook-event']
    }
  });
  
  // Process...
});
```

### 4. Implement Retry Handling

If your endpoint fails, HEIR will retry with exponential backoff. The `X-Webhook-Attempt` header tells you which attempt this is:

```javascript
app.post('/webhooks/heir', (req, res) => {
  const attempt = parseInt(req.headers['x-webhook-attempt']);
  
  if (attempt > 3) {
    // This is a retry - maybe check for duplicates more carefully
    console.log(`Retry attempt ${attempt}`);
  }
  
  // Process...
});
```

## Troubleshooting

### Webhook Not Received

1. Check the webhook status in the API
2. Verify your endpoint is publicly accessible
3. Check firewall/security group rules
4. Review server logs for incoming requests

### Signature Verification Fails

1. Ensure you're using the correct secret
2. Verify you're hashing the raw request body (not parsed JSON)
3. Check for any proxy/middleware modifying the payload

### Multiple Deliveries

This is normal behavior for reliability. Implement idempotent processing as shown above.

## Next Steps

- Review all [available events](/api/webhooks#list-events)
- Learn about [error handling](/guide/errors)
- See [full application example](/examples/full-application)

