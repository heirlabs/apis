---
layout: home

hero:
  name: HEIR API
  text: Build Digital Inheritance Solutions
  tagline: Programmatic access to smart contract generation, legal documents, webhooks, and estate tooling
  image:
    src: /hero-keys.webp
    alt: Three brass keys resting on dark linen in warm lamplight
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quickstart
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: MCP
      link: /mcp/

features:
  - icon: 📝
    title: Smart Contract Generation
    details: Generate inheritance smart contracts for EVM chains, Solana, and TON with legal-framework templates and dead-man's-switch options.
  - icon: 🔐
    title: Secure by Design
    details: API key authentication with tiered access, rate limiting, IP whitelisting, and webhook signature verification.
  - icon: 🪝
    title: Real-time Webhooks
    details: Subscribe to events such as contract deployments, verifications, and dead-man's-switch triggers with HMAC verification.
  - icon: 📜
    title: Legal Documents
    details: Live generate/store/encrypt for wills, trusts, POA, and related drafts via /api/v1/legal — not a future placeholder.
  - icon: ⚡
    title: Metered Access
    details: Developer plans for HTTP quotas plus optional Heirlooms metering for AI-heavy actions when enabled on the server.
  - icon: 🔌
    title: MCP + OpenAPI
    details: Use @morbidcorp/heir dist/cli.js (18 MCP tools) or REST with curl / OpenAPI clients. No unpublished language REST SDKs.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #d4af37 0%, #f0d495 100%);
  --vp-home-hero-image-background-image: none;
  --vp-home-hero-image-filter: none;
}

.VPHero .image-bg {
  opacity: 0.8;
}
</style>

## Quick example

```bash
# Generate an inheritance contract
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

## Developer plans

List prices and limits (source of truth: [API tiers](/pricing/api-tiers) and
`GET /api/v1/billing/plans`):

| Plan | List price | Requests / day | Requests / month | API keys |
|------|-----------:|---------------:|-----------------:|---------:|
| **free** | $0 | 100 | 3,000 | 1 |
| **developer** | $29/mo | 500 | 10,000 | 5 |
| **partner** | $199/mo | 5,000 | 100,000 | unlimited |
| **enterprise** | Custom | Unlimited | Unlimited | Custom |

Per-key rate windows (Public / Partner / Internal) are separate from plan caps —
see [API tiers](/pricing/api-tiers).

Manage billing at [heir.es/developers/billing](https://heir.es/developers/billing).

::: tip Drafts on the product app
Create estate plan drafts on [heir.es](https://heir.es). Product billing
(Weekly Protection, Memoir packs, Heirlooms) is documented under
[Billing & credits](/pricing/).
:::

## Clients

| Approach | Status |
|----------|--------|
| HTTP + [cURL examples](/sdks/curl) | **Supported** |
| [OpenAPI](https://api.heir.es/api/docs/openapi.json) codegen | **Supported** (coverage is a partner subset — expand carefully) |
| MCP [`@morbidcorp/heir`](https://www.npmjs.com/package/@morbidcorp/heir) | **Supported** (18 tools) |
| Desk Elements [`@morbidcorp/element-sdk`](https://www.npmjs.com/package/@morbidcorp/element-sdk) | **Supported** (local desk apps; public registry not open) |
| Official REST SDKs (JS / Python / Go packages) | **Not published** — do not install fictional `@heirlabs/sdk` names |

[API Reference →](/api/) · [MCP →](/mcp/) · [Pricing →](/pricing/)
