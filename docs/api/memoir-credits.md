# Memoir / MyHeir credits API

Wallet for memoir media, inference, voice, and chat units.

**Base path:** `/api/memoir/credits`  
Host: `https://api.heir.es`

> Path note: older drafts said `/api/heirloom/credits/*`. That path is **wrong**.
> Heirlooms (AI meter) live under `/api/heirlooms/*`. Memoir packs live here.

## GET /api/memoir/credits/packs

List pack definitions (public).

**Response (shape):** `{ success: true, packs: [...] }` with ids `STARTER`, `STANDARD`, `PREMIUM`, `PRO`.

## GET /api/memoir/credits/wallet

Authenticated. Returns wallet balance and status.

## POST /api/memoir/credits/purchase

Authenticated. Creates a Stripe checkout session for a pack.

**Body:**

```json
{
  "packType": "STARTER",
  "successUrl": "https://heir.es/myheir?credits=success",
  "cancelUrl": "https://heir.es/myheir?credits=cancelled"
}
```

`packType` must be a key from the packs catalog (`STARTER` | `STANDARD` | `PREMIUM` | `PRO`).

## PUT /api/memoir/credits/auto-reload

Authenticated. Enable or update auto-reload settings.

**Body:**

```json
{
  "enabled": true,
  "packType": "STARTER",
  "thresholds": [5, 2],
  "maxMonthlySpend": 50
}
```

## GET /api/memoir/credits/history

Authenticated. Transaction history for the memoir wallet.

## Related

- [Heirlooms API](/api/heirlooms) — separate AI/API meter
- [Pricing](/pricing/) — all product money systems
