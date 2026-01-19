# Memoir Credits API

Credits endpoints are served under `/api/heirloom/credits/*` for compatibility.

Credits are required for media inference, voice cloning, and chat operations.

## GET /api/heirloom/credits/packs
List available credit packs.

## GET /api/heirloom/credits/wallet
Get wallet balance and status.

## POST /api/heirloom/credits/purchase
Create a checkout session for a credit pack.

**Body:**
```json
{ "packType": "starter", "successUrl": "...", "cancelUrl": "..." }
```

## PUT /api/heirloom/credits/auto-reload
Enable or update auto-reload settings.

**Body:**
```json
{ "enabled": true, "packType": "starter", "thresholds": [5, 2], "maxMonthlySpend": 50 }
```

## GET /api/heirloom/credits/history
Get credit transaction history.
