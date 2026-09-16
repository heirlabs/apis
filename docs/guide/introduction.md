# Introduction

HEIR has two surfaces:

- **Product app** — [heir.es](https://heir.es) (session cookie `heir_auth`). Human funnel and paid product URLs: [Product paths](/guide/product-paths).
- **Headless API** — `https://api.heir.es/api/v1/*` (API key `heir_pk_` / `heir_pt_` / `heir_sk_`). Partner/integrator HTTP.

This site is `https://docs.heir.es`.

The HEIR API is partner HTTP for contract templates, legal drafts, webhooks, and estate tooling. It is not a court-valid instrument by itself. Not legal advice.

## What is HEIR?

HEIR is an inheritance product and partner API. The product app is [heir.es](https://heir.es). Partner HTTP is `https://api.heir.es/api/v1/*`.

- **Contract generation** — templates for EVM, Solana, and TON, including optional dead-man's-switch configuration. Generated code is not a court-valid instrument by itself.
- **Dead man's switch** — an inactivity / proof-of-life option on generated contracts. It does not automatically distribute every asset, and on-chain assets stay under each chain's own cryptography.
- **Jurisdictional templates** — Common Law, Civil Law, Islamic, and other templates. Templates are not compliance.
- **Vault / document storage** — encrypted storage for beneficiary data and drafts.

## Who is this for?

The HEIR API is designed for:

- **Fintech Companies** - Integrate inheritance planning into wealth management platforms
- **Crypto Custodians** - Offer succession planning to institutional clients
- **Estate Planning Attorneys** - Automate smart contract generation for clients
- **DeFi Protocols** - Add inheritance features to wallets and vaults
- **Insurance Companies** - Create blockchain-based beneficiary designations

## API Features

### Contract Generation

Generate smart contracts for inheritance distribution with a single API call:

```javascript
const response = await fetch('https://api.heir.es/api/v1/contracts/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pk_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blockchain: 'evm',
    ownerAddress: '0x...',
    beneficiaries: [...],
    inheritanceTemplate: 'common-law'
  })
});

const { contractCode, compiled } = await response.json();
```

### Webhook Subscriptions

Receive real-time notifications for important events:

```javascript
// Subscribe to contract deployment events
await fetch('https://api.heir.es/api/v1/webhooks/subscriptions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pt_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-app.com/webhooks/heir',
    events: ['contract.deployed', 'deadman.triggered']
  })
});
```

### Embeddable Wizard

White-label the contract builder for your customers:

```html
<iframe 
  src="https://api.heir.es/api/embed/wizard?key=heir_pt_xxx&theme=dark&logo=https://your-logo.png"
  width="100%" 
  height="800"
/>
```

## Base URL

All API requests are made to:

```
https://api.heir.es/api/v1/
```

## API Versioning

The current API version is `v1`. Partner/integrator endpoints are prefixed with `/api/v1/`.

::: info Two URL families
Partner/integrator HTTP is `/api/v1/*` with an API key.
The product SPA uses session-authenticated `/api/*` mounts (estate home, interview, memoir, desk). Those are **not** a deprecated alias of v1 and are **not** being removed.
:::

## Need Help?

- 📚 [API Reference](/api/) - Complete endpoint documentation
- 💬 [Discord Community](https://discord.gg/heir) - Get help from the community
- 📧 [api@heir.es](mailto:api@heir.es) - Enterprise support
- 🐛 [GitHub Issues](https://github.com/heirlabs/apis/issues) - Report bugs

