---
layout: home

hero:
  name: HEIR
  text: Self-custody that can be inherited
  tagline: Platform docs for the inheritance spine (Estate Home, health check, soft legacy, executor) plus the headless contract API for integrators.
  image:
    src: /hero-image.png
    alt: HEIR
  actions:
    - theme: brand
      text: Inheritance Platform
      link: /platform/
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: Quick Start
      link: /guide/quickstart

features:
  - icon: 🏠
    title: Estate Home spine
    details: Weighted readiness, gaps, CTAs, and ops honesty so setup score is never confused with live death clearance or oracle claims.
  - icon: 📋
    title: Crypto Estate Health Check
    details: Public multi-step quiz aligned to Estate Home weights, with a real PDF one-pager for conversion and meetings.
  - icon: 📝
    title: Smart contract generation
    details: Headless generate/compile for EVM, Solana, TON and related paths — multi-chain maturity is uneven and documented honestly.
  - icon: 🔐
    title: Soft legacy on death clearance
    details: Vault items and death-triggered capsules release on the same death signal as claims — fail-closed when ops gates are off.
  - icon: 🪝
    title: Executor & heir package
    details: Heir aggregation, claim entry, executor checklist, and offline asset inventory without fake bank rails.
  - icon: 📚
    title: HTTP-first integration
    details: Use API keys + OpenAPI/curl today. Published multi-language SDKs are not shipping packages as of 2026-07 — we do not pretend otherwise.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --vp-home-hero-image-background-image: linear-gradient(135deg, #6366f1 20%, #8b5cf6 80%);
  --vp-home-hero-image-filter: blur(44px);
}

.VPHero .image-bg {
  opacity: 0.8;
}
</style>

## Quick example — headless contract

```bash
# Generate an inheritance contract (API key)
curl -X POST https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "blockchain": "evm",
    "ownerAddress": "0x1234...",
    "beneficiaries": [
      { "name": "Alice", "address": "0xabc...", "percentage": 60 },
      { "name": "Bob", "address": "0xdef...", "percentage": 40 }
    ],
    "inheritanceTemplate": "common-law",
    "deadMansSwitch": { "enabled": true, "intervalDays": 365 }
  }'
```

## Quick example — public health check

```bash
curl -sS https://dev.heir.es/api/estate-health-check/schema
```

Spine routes above are documented for **`origin/devv`** (dev.heir.es) as of 2026-07-30. See [Platform](/platform/) and [Changelog](/changelog).

## API access

Subscriptions include API access for headless routes. Confirm current plan limits on [heir.es/pricing](https://heir.es/pricing).

| Tier | Rate Limit | Webhooks | Embedding | Included With |
|------|------------|----------|-----------|---------------|
| **Free** | 100 req/day | ❌ | ❌ | Everyone |
| **Starter** | 1,000 req/day | ❌ | ❌ | $49/mo subscription |
| **Professional** | 10,000 req/day | ✅ | ✅ | $149/mo subscription |
| **Enterprise** | Custom | ✅ | ✅ | Custom subscription |

::: tip Drafts
Create estate plan drafts on [heir.es](https://heir.es). Deploy and paid features follow product billing — not every surface is free.
:::

[Platform overview →](/platform/) · [Full pricing →](https://heir.es/pricing)

*Not legal or financial advice.*
