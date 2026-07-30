# Estate Home API

Session-authenticated inheritance readiness spine.

::: warning Environment
Shipped on `heirlabs/web` **`origin/devv`** (dev.heir.es) as of **2026-07-30**. Confirm presence on production `main` before hardcoding against heir.es.
:::

**Base path:** `/api/estate-home`  
**Auth:** Session (`Cookie: heir_auth=…` or Bearer JWT as product implements)

## GET `/api/estate-home/readiness`

Full weighted readiness, gaps, CTA routes, and `ops` honesty.

**Response (shape):** `{ success, readiness }` where `readiness` includes percent, dimensions, gaps, `ops`.

## GET `/api/estate-home/summary`

Compact dashboard payload:

| Field | Description |
|-------|-------------|
| `percent` | Weighted setup score |
| `gaps` | Top gaps (API returns up to 3) |
| `publicPromise` | Product promise string |
| `summary` | Short summary text |
| `ops` | Ops honesty object |

## GET `/api/estate-home/heir-package`

Heir aggregation: named estates, soft legacy slice when death-gated open, next steps, `ops`.

## GET `/api/estate-home/metrics`

Process-local counters for spine views (last hour). Operational telemetry, not billing.

## Errors

| Status | When |
|--------|------|
| `401` | No valid session |
| `500` | Compute/storage failure |

## See also

- [Platform: Estate Home](/platform/estate-home)  
- [Platform: Ops gates](/platform/ops-gates)  
- [Heir package](/platform/heir-package)
