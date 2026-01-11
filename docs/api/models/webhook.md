# Webhook Model

The webhook object represents a subscription to API events.

## Object Structure

```json
{
  "_id": "wh_65abc123def456",
  "owner": "user_123abc",
  "event": "contract.deployed",
  "url": "https://your-app.com/webhooks/heir",
  "status": "active",
  "failures": 0,
  "lastDeliveryAttempt": "2024-01-15T10:30:00.000Z",
  "lastDeliveryStatus": 200,
  "metadata": {},
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `_id` | string | Unique identifier |
| `owner` | string | User ID who owns this webhook |
| `event` | string | Event type subscribed to |
| `url` | string | HTTPS URL for delivery |
| `secret` | string | Secret for signing (hashed, not returned) |
| `status` | string | `active`, `paused`, or `disabled` |
| `failures` | number | Consecutive delivery failures |
| `lastDeliveryAttempt` | string | ISO 8601 timestamp |
| `lastDeliveryStatus` | number | HTTP status of last attempt |
| `metadata` | object | Custom metadata |
| `createdAt` | string | ISO 8601 creation date |
| `updatedAt` | string | ISO 8601 last update |

## Status Values

| Status | Description |
|--------|-------------|
| `active` | Webhook is receiving events |
| `paused` | Temporarily disabled (auto or manual) |
| `disabled` | Permanently disabled |

## Automatic Pausing

Webhooks are automatically paused after 5 consecutive delivery failures. The `failures` counter resets to 0 on successful delivery.

## Event Types

### Contract Events

| Event | Description |
|-------|-------------|
| `contract.generated` | Contract code generated |
| `contract.deployed` | Contract deployed to blockchain |

### Dead Man's Switch Events

| Event | Description |
|-------|-------------|
| `deadman.warning` | Check-in overdue, warning sent |
| `deadman.triggered` | Switch activated |

### Verification Events

| Event | Description |
|-------|-------------|
| `verification.complete` | Identity verification finished |

### Payment Events

| Event | Description |
|-------|-------------|
| `payment.completed` | Payment processed |

### User Events

| Event | Description |
|-------|-------------|
| `user.created` | New user account created |
| `user.updated` | User profile updated |

### API Key Events

| Event | Description |
|-------|-------------|
| `api_key.created` | New API key created |
| `api_key.revoked` | API key revoked |

## Webhook Secret

When creating a webhook, you can optionally provide a secret:

```json
{
  "event": "contract.deployed",
  "url": "https://your-app.com/webhooks",
  "secret": "your_secret_here"
}
```

The secret is used to sign webhook payloads. The signature is included in the `X-Webhook-Signature` header for verification.

::: warning
The secret is only shown once when creating the webhook. Store it securely!
:::

## Retry Policy

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 second |
| 3 | 5 seconds |
| 4 | 10 seconds |
| 5 | 30 seconds |
| 6 | 60 seconds |

