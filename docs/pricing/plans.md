# Product credits & packs

Prices below match the monorepo config on `heirlabs/web` `server/config/`.  
Currency: **USD**. Not legal or financial advice.

---

## 1. Weekly Protection credits

**Purpose:** Fund the weekly protection subscription (proof-of-life cadence).  
**Ledger:** `User.billing.credits` + append-only `CreditTransaction` rows.  
**Cycle:** One debit per week, idempotent key `weekly:{cycleDueDate}` (default **12 credits/week**).  
**Grace:** 7 days after a failed debit before protection lapses.

### Packs (Stripe)

| Pack ID | Credits | Price |
|---------|--------:|------:|
| `WP_50` | 50 | $4.99 |
| `WP_100` | 100 | $9.99 |
| `WP_500` | 500 | $39.99 |

Source: `server/config/creditPacks.js`. Purchases go through settled Stripe objects only
(no free “grant” buttons).

**Product UI:** heir.es account / protection billing (not the developer portal).

---

## 2. Heirlooms (AI / API meter)

**Purpose:** Single metered unit for expensive AI and related actions.  
**Catalog (public):** `GET https://api.heir.es/api/heirlooms/catalog`  
**Cycle:** Monthly allowance by plan (free / pro / family / estate) + prepaid packs + optional overage.  
**Kill switch:** Routes call `meterAction()`; **charges only when**  
`HEIRLOOMS_METERING_ENABLED=true` on the API. When off, handlers still run (dark launch).

### Sample action costs (Heirlooms)

| Action | Cost |
|--------|-----:|
| `desk_agent_message` | 1 |
| `harness_rebuild` | 1 |
| `harness_export` | 2 |
| `assay_comp_refresh` | 3 |
| `ai_summarization` | 3 |
| `verification_check` | 4 |
| `ai_legal_query` | 5 |
| `harness_invoke` | 5 |
| `assay_photo_analyze` | 8 |
| `voice_generation_minute` | 8 |
| `memoir_book_render` | 30 |
| `video_generation` | 40 |
| `smart_contract_deploy` | **free** (death floor) |

Full live list: catalog endpoint. Unmetered: navigate, view dashboard, check-in, read balance, etc.

### Top-up packs

| Pack ID | Heirlooms | Price | App SKU |
|---------|----------:|------:|---------|
| `pack_100` | 100 | $4.99 | `es.heir.app.heirlooms.100` |
| `pack_500` | 500 | $19.99 | `es.heir.app.heirlooms.500` |
| `pack_2000` | 2000 | $59.99 | `es.heir.app.heirlooms.2000` |

**Auth routes:** `GET /api/heirlooms/summary`, `POST /api/heirlooms/packs/stripe/checkout`, ledger, auto-topup (session JWT).

---

## 3. Memoir / MyHeir credit packs

**Purpose:** Memoir product media (storage / inference / voice / chat).  
**Mount:** `/api/memoir/credits/*` (not `/api/heirloom/credits`).

| Pack | Price | Highlights |
|------|------:|------------|
| `STARTER` | $4.99 | 50 inference, 100 chat, 2 storage · 90 days |
| `STANDARD` | $14.99 | + voice · 180 days |
| `PREMIUM` | $49.99 | higher caps · 365 days |
| `PRO` | $99.99 | top tier · 365 days |

Exact unit breakdown: pack objects from `GET /api/memoir/credits/packs`.

---

## 4. What is not for sale

| Historical name | Status |
|-----------------|--------|
| Timer credits ($4.99) | **Retired** — never a complete product |
| Gas credits ($100–$5,000 “included”) | **Never built** — write stubs removed |
| Basic / Family / Estate “trust slot” SaaS ($49.99 / $149.99 / $1,999.99) | **Retired** from Stripe sale paths |

Do not code new integrations against those names.

---

## Developer API pricing

Request quotas and Stripe developer/partner plans: [API tiers & developer plans](/pricing/api-tiers).
