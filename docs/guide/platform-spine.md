# Platform spine (product APIs)

The inheritance product spine lives primarily as **session-authenticated** routes
on `api.heir.es` (and the heir.es SPA). These are **not** fully mirrored in the
headless OpenAPI partner subset. This page is the honesty map for integrators
and operators.

Maturity labels:

| Label | Meaning |
|-------|---------|
| **Live** | Mounted on production monorepo; expect 401 without auth, not 404 |
| **Dark** | Code present; env flag required for full behavior |
| **Session** | Requires logged-in user (JWT cookie/session) |
| **Hybrid** | Also available under `/api/v1` with API key scopes when mounted |

## Product SPA paths

SPA URLs on `https://heir.es` (session cookie `heir_auth`). Full funnel: [Product paths](/guide/product-paths).

| Product | SPA | API mounts |
|---------|-----|------------|
| Health check UI | heir.es (public quiz) | `/api/estate-health-check/*` |
| Interview | `https://heir.es/interview` | `/api/legacy-interview/*` |
| After complete | `/legacy` | `/api/legacy/*`, `/api/verify/legacy` |
| Desk shell | `https://heir.es/desk` | `/api/desk-agent/*`, `/api/desk-access/*` |
| Developers | `https://heir.es/developers` | keys + billing UI |
| Memoir | `https://heir.es/myheir` | `/api/memoir/*` |

Paid cinematic / purchase / redeem home is `/interview`, never `/swarm`. Unpaid `/desk` is blocked → `/dashboard`.

## Core journey

This is the **paid product spine**, not the public funnel.
Cold / unpaid path is `/login` → `/welcome` → `/dashboard` → pay.
Paid cinematic home is `/interview`. Estate Home is not the public homepage
and is not “Estate Dashboard.”

```
Health Check → Estate Home readiness → Interview / plan → Deploy contracts
→ Proof-of-life → Soft vault / offline assets → Heir package / claim
→ Executor (after death)
```

### Estate Health Check — **Live · public + optional session**

| | |
|--|--|
| Mount | `/api/estate-health-check/*` |
| Auth | Public quiz/evaluate; optional session merge |
| Notes | PDF generation available; not a substitute for legal advice |

### Estate Home — **Live · Session**

| | |
|--|--|
| Mount | `/api/estate-home/*` |
| Auth | Session |
| Notes | Readiness, summary, metrics, heir package spine, ops honesty payloads |

### Legacy Interview / Living Legacy — **Live · Session (+ webhooks)**

| | |
|--|--|
| Mount | `/api/legacy-interview/*`, `/api/legacy/*`, `/api/verify/legacy` |
| Auth | Session; Stripe webhooks separate |
| Notes | Checkout, order status, case file registry, plan verification |

### Legal formalities — **Live · Session**

| | |
|--|--|
| Mount | `/api/legal/formalities/*` (registered **before** `/api/legal`) |
| Auth | Session |
| Notes | Lawyer-ready formality workflows; not automatic court validity |

### Legal documents generate — **Live · Session / Hybrid**

| | |
|--|--|
| Mount | `/api/legal/*`, `/api/v1/legal/*` |
| Auth | Session on `/api/legal`; hybrid scopes `legal` on v1 |
| Docs | [Legal API](/api/legal) |

### Contracts — **Live · Hybrid**

| | |
|--|--|
| Mount | `/api/contracts/*`, `/api/v1/contracts/*` |
| Auth | Hybrid scopes `contracts` |
| Docs | [Contracts](/api/contracts) |

### Executor cockpit — **Live · Session**

| | |
|--|--|
| Mount | `/api/executor/*` |
| Auth | Session |
| Notes | After-death admin checklist |

### Offline assets — **Live · Session**

| | |
|--|--|
| Mount | `/api/offline-assets/*` |
| Auth | Session |
| Notes | Non-on-chain inventory only |

### Oracle email claim — **Live · fail-closed**

| | |
|--|--|
| Mount | `/api/oracle/email/*` (and legacy `/api/oracle`) |
| Auth | Product-specific; internal key scopes on some v1 mounts |
| Notes | Fail-closed without oracle key configuration |

### Data Passport — **Live · Session**

| | |
|--|--|
| Mount | `/api/data-passport/*` |
| Auth | Session |
| Notes | Insurance-oriented selective disclosure; not full SNARK marketplace |

### Desk agent / HeirOS desk — **Live · Session**

| | |
|--|--|
| Mount | `/api/desk-agent/*`, `/api/desk-access/*` (e.g. `/status` 401 without session; bare `/api/desk-access` 404) |
| Auth | Session; Stripe webhooks exist |
| Notes | HeirOS desk subscribe after trial (`$88/yr` or `$9.40/mo`). `/api/desk-premium/*` is mounted but **not** a live SKU name. While `DESK_ACCESS_SAAS_ENABLED` is off, desk access equals interview access. Unpaid SPA `/desk` → `/dashboard`. |

### Memoir (MyHeir) — **Live · Session**

| | |
|--|--|
| Mount | `/api/memoir/*`, `/api/memoir/credits/*` |
| Auth | Session |
| Docs | [Memoir](/api/memoir) |

### Heirlooms meter — **Live · flag**

| | |
|--|--|
| Mount | `/api/heirlooms/*` |
| Auth | Catalog public; wallet session |
| Flag | `HEIRLOOMS_METERING_ENABLED=true` to charge |
| Docs | [Heirlooms](/api/heirlooms) |

## Dark / gated (document only with flags)

| Surface | Mount | Flag (typical) |
|---------|-------|----------------|
| Harness | `/api/harness/*` | `HARNESS_ENABLED` |
| Elements registry | `/api/elements/*` | `ELEMENTS_REGISTRY_ENABLED` |
| Assay | `/api/assay/*` | `ASSAY_ENABLED` |
| Wearables PoL | `/api/wearables/*` | `WEARABLE_POL_ENABLED` |
| Bitcoin vault | `/api/bitcoin/*` | `BITCOIN_ENABLED` |
| STBL | `/api/stbl/*` | `STBL_ENABLED` |
| Compute pool | `/api/compute-pool/*` | `COMPUTE_POOL_ENABLED` |

Do not market dark surfaces as always-on product.

## What headless OpenAPI covers today

Partial partner subset (keys, contracts, webhooks, embed, some BYOA/spaceid).
**Does not** replace this spine map. Prefer these markdown pages + monorepo
route files for product truth.

## MCP

npm `@morbidcorp/heir` is a **stdio client** over the HTTP API (contracts,
jurisdictions, legal generate, estates list, chat). It is not a second product
backend. See [MCP tools](/mcp/tools).

## Related

- [Product paths](/guide/product-paths)
- [Auth matrix](/guide/auth-matrix)
- [API reference](/api/)
- [Billing](/pricing/)
