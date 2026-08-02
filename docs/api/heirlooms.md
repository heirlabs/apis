# Heirlooms API

Heirlooms are the **metered unit** for AI and related expensive actions on heir.es.

**Base path:** `/api/heirlooms`  
Host: `https://api.heir.es`

**Metering flag:** `HEIRLOOMS_METERING_ENABLED` must be the string `true` for
`meterAction()` middleware to charge. Catalog and account routes still respond when the flag is off.

## GET /api/heirlooms/catalog

**Auth:** none  

Returns action costs, unmetered actions, and top-up packs.

```bash
curl -sS https://api.heir.es/api/heirlooms/catalog
```

## GET /api/heirlooms/summary

**Auth:** session JWT  

Current cycle balance, allowance, pack balance, plan.

## GET /api/heirlooms/statement

**Auth:** session JWT  

Billing statement for a cycle (optional `?cycleId=`).

## GET /api/heirlooms/ledger

**Auth:** session JWT  

Recent ledger entries.

## POST /api/heirlooms/packs/stripe/checkout

**Auth:** session JWT  

Start Stripe Checkout for a pack (`pack_100` | `pack_500` | `pack_2000`).

## POST /api/heirlooms/auto-topup

**Auth:** session JWT  

Configure auto top-up when balance drops below a threshold.

## Death floor

Deploy / heir-delivery actions and death-critical route prefixes are never charged
or rate-limited by Heirloom metering.

## Related

- [Product packs](/pricing/plans#2-heirlooms-ai--api-meter)
- [Developer plans](/pricing/api-tiers) — separate request quotas
