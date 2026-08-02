---
layout: home

hero:
  name: HEIR API
  text: Build Digital Inheritance Solutions
  tagline: Programmatic access to smart contract generation, vault management, and estate planning tools
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
      text: View on GitHub
      link: https://github.com/heirlabs/apis

features:
  - icon: 📝
    title: Smart Contract Generation
    details: Generate inheritance smart contracts for Ethereum, Solana, and TON with a single API call. Support for multiple legal frameworks.
  - icon: 🔐
    title: Secure by Design
    details: API key authentication with tiered access, rate limiting, IP whitelisting, and webhook signature verification.
  - icon: 🪝
    title: Real-time Webhooks
    details: Subscribe to events like contract deployments, verifications, and dead man's switch triggers with automatic retries.
  - icon: 🎨
    title: Embeddable Wizard
    details: White-label the contract builder wizard in your application with custom branding and theming.
  - icon: ⚡
    title: High Performance
    details: Built for scale with tiered rate limits up to 10,000 requests per 15 minutes for enterprise customers.
  - icon: 📚
    title: Comprehensive SDKs
    details: Official SDKs for JavaScript, Python, and Go. OpenAPI spec for generating clients in any language.
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

## Quick Example

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

## API Access

**All subscriptions include API access.** Start with our free tier, then upgrade as you grow.

| Tier | Rate limit | Monthly cap | Webhooks | Embedding | Price |
|------|-----------|-------------|----------|-----------|-------|
| **Free** | 100 req/day | 3,000 | 1 endpoint | ❌ | $0 |
| **Developer** | 1,000 req/day | 25,000 | 5 endpoints | ❌ | $29/mo |
| **Partner** | 10,000 req/day | 250,000 | Unlimited | ✅ | $99/mo |
| **Enterprise** | Unlimited | Unlimited | Unlimited | ✅ | Custom |

::: tip Drafts Are Free
Create unlimited estate plan drafts at no cost on [heir.es](https://heir.es). You only pay when you deploy.
:::

[View Full Pricing →](https://heir.es/pricing)

